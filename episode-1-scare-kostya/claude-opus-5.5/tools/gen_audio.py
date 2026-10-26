"""Generate audio via kie.ai. usage: python gen_audio.py specs.json [name ...]
spec: {name, kind: "sfx"|"music"|"voice", prompt, loop(bool), voice(id), text}"""
import json, os, sys, time, urllib.request, concurrent.futures as cf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "raw", "audio")
ENV = dict(l.strip().split("=", 1) for l in open(os.path.join(ROOT, ".env"), encoding="utf-8") if "=" in l)
KEY = ENV["KIE_API_KEY"]
BASE = "https://api.kie.ai"
LOG = os.path.join(ROOT, "raw", "audio_log.jsonl")
CRED0 = os.path.join(ROOT, "raw", "credits_start.txt")


def api(path, body=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=90))


def create(spec):
    k = spec["kind"]
    if k == "sfx":
        model = "ai-music-api/sounds"
        inp = {"prompt": spec["prompt"][:500], "model": spec.get("v6", "V6"), "sound_loop": bool(spec.get("loop"))}
    elif k == "music":
        model = "ai-music-api/generate"
        inp = {"custom_mode": False, "instrumental": True, "model": "V6", "prompt": spec["prompt"]}
    else:
        model = "elevenlabs/text-to-speech-multilingual-v2"
        inp = {"text": spec["text"], "voice": spec.get("voice", "EkK5I93UQWFDigLMpZcX"),
               "stability": spec.get("stability", 0.4), "similarity_boost": 0.75, "speed": spec.get("speed", 1)}
    r = api("/api/v1/jobs/createTask", {"model": model, "input": inp})
    if r.get("code") != 200:
        raise RuntimeError("create failed " + json.dumps(r)[:300])
    return r["data"]["taskId"]


def urls_of(spec, d):
    k = spec["kind"]
    out = []
    if k in ("sfx", "music"):
        resp = d.get("response") or {}
        if isinstance(resp, str):
            resp = json.loads(resp)
        for item in (resp.get("data") or []):
            u = item.get("audio_url") or item.get("stream_audio_url") or item.get("url")
            if u:
                out.append(u)
        if not out:
            for item in (d.get("response", {}).get("data") or []):
                pass
        if not out:
            print("SHAPE", json.dumps(d)[:800], flush=True)
    else:
        rj = d.get("resultJson") or "{}"
        if isinstance(rj, str):
            rj = json.loads(rj)
        out = rj.get("resultUrls") or []
    return out


def run(spec):
    ext = ".mp3"
    path = os.path.join(OUT, spec["name"] + ext)
    if os.path.exists(path):
        return spec["name"], "exists"
    try:
        tid = create(spec)
        for i in range(100):
            time.sleep(4)
            r = api("/api/v1/jobs/recordInfo?taskId=" + tid)
            d = r.get("data") or {}
            st = d.get("state")
            if st == "success":
                us = urls_of(spec, d)
                if not us:
                    return spec["name"], "NOURL"
                data = urllib.request.urlopen(us[0], timeout=180).read()
                open(path, "wb").write(data)
                with open(LOG, "a", encoding="utf-8") as f:
                    f.write(json.dumps({"name": spec["name"], "kind": spec["kind"], "n_urls": len(us), "t": time.time()}) + "\n")
                return spec["name"], "ok %d bytes %d clips" % (len(data), len(us))
            if st == "fail":
                return spec["name"], "FAIL " + str(d.get("failMsg"))[:200]
        return spec["name"], "TIMEOUT"
    except Exception as e:
        return spec["name"], "ERR " + str(e)[:250]


def main():
    specs = json.load(open(sys.argv[1], encoding="utf-8"))
    only = set(sys.argv[2:])
    specs = [s for s in specs if not only or s["name"] in only]
    os.makedirs(OUT, exist_ok=True)
    if not os.path.exists(CRED0):
        c = api("/api/v1/chat/credit")["data"]
        open(CRED0, "w").write(str(c))
        print("credits start", c)
    with cf.ThreadPoolExecutor(6) as ex:
        for name, st in ex.map(run, specs):
            print(name, st, flush=True)
    print("credits now", api("/api/v1/chat/credit")["data"])


if __name__ == "__main__":
    main()
