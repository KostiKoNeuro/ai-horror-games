"""Batch voice lines through CometAPI (ElevenLabs). usage: python comet_voices.py voices.json"""
import json, os, sys, time, urllib.request, urllib.error, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = next(l.split("=", 1)[1].strip() for l in open(os.path.join(ROOT, ".env"), encoding="utf-8") if l.startswith("COMETAPI_KEY="))
H = {"Authorization": "Bearer " + KEY, "Content-Type": "application/json", "X-Runway-Version": "2024-11-06"}


def call(path, body=None):
    req = urllib.request.Request("https://api.cometapi.com" + path, data=json.dumps(body).encode() if body else None, headers=H)
    return json.load(urllib.request.urlopen(req, timeout=90))


def run(s):
    out = os.path.join(ROOT, "raw", "audio", s["name"] + ".mp3")
    if os.path.exists(out):
        return s["name"], "exists"
    try:
        r = call("/runwayml/v1/text_to_speech", {"model": s.get("model", "eleven_v3"), "promptText": s["text"],
                                                  "voice": {"type": "runway-preset", "presetId": s["voice"]}})
        tid = r["id"]
        for i in range(75):
            time.sleep(4)
            t = call("/runwayml/v1/tasks/" + tid)
            if t.get("status") == "SUCCEEDED":
                open(out, "wb").write(urllib.request.urlopen(t["output"][0], timeout=120).read())
                return s["name"], "ok"
            if t.get("status") == "FAILED":
                return s["name"], "FAILED %s %s" % (t.get("failure"), t.get("failureCode"))
        return s["name"], "timeout"
    except urllib.error.HTTPError as e:
        return s["name"], "HTTP %d %s" % (e.code, e.read().decode()[:300])
    except Exception as e:
        return s["name"], "ERR " + str(e)[:300]


specs = json.load(open(sys.argv[1], encoding="utf-8"))
only = set(sys.argv[2:])
specs = [s for s in specs if not only or s["name"] in only]
with cf.ThreadPoolExecutor(5) as ex:
    for n, st in ex.map(run, specs):
        print(n, st, flush=True)
