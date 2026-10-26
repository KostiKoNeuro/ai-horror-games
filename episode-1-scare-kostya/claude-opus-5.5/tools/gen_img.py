"""Generate images via CometAPI Nano Banana 2.1. usage: python gen_img.py specs.json [name ...]
spec: {name, prompt, aspect, size, ref (optional name of an already generated image)}"""
import base64, json, os, sys, time, urllib.request, concurrent.futures as cf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "raw", "img")
KEY = next(l.split("=", 1)[1].strip() for l in open(os.path.join(ROOT, ".env"), encoding="utf-8") if l.startswith("COMETAPI_KEY="))
URL = "https://api.cometapi.com/v1beta/models/gemini-nano-banana-2.1:generateContent"
LOG = os.path.join(ROOT, "raw", "img_log.jsonl")


def gen(spec):
    path = os.path.join(OUT, spec["name"] + ".png")
    if os.path.exists(path):
        return spec["name"], "exists"
    parts = [{"text": spec["prompt"]}]
    for r in ([spec["ref"]] if isinstance(spec.get("ref"), str) else spec.get("ref", [])):
        data = base64.b64encode(open(os.path.join(OUT, r + ".png"), "rb").read()).decode()
        parts.append({"inline_data": {"mime_type": "image/png", "data": data}})
    body = {"contents": [{"role": "user", "parts": parts}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"],
                                 "imageConfig": {"aspectRatio": spec.get("aspect", "16:9"), "imageSize": spec.get("size", "1K")}}}
    for attempt in range(3):
        try:
            req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={
                "Authorization": "Bearer " + KEY, "x-goog-api-key": KEY, "Content-Type": "application/json"})
            resp = json.load(urllib.request.urlopen(req, timeout=240))
            img = None
            for p in resp["candidates"][0]["content"]["parts"]:
                d = p.get("inlineData") or p.get("inline_data")
                if d and not p.get("thought"):
                    img = d["data"]
            if not img:
                raise RuntimeError("no image: " + json.dumps(resp)[:300])
            open(path, "wb").write(base64.b64decode(img))
            with open(LOG, "a", encoding="utf-8") as f:
                f.write(json.dumps({"name": spec["name"], "size": spec.get("size", "1K"), "t": time.time()}) + "\n")
            return spec["name"], "ok"
        except Exception as e:
            err = str(e)
            if hasattr(e, "read"):
                err += " " + e.read().decode(errors="replace")[:300]
            time.sleep(5)
    return spec["name"], "FAIL " + err[:300]


def main():
    specs = json.load(open(sys.argv[1], encoding="utf-8"))
    only = set(sys.argv[2:])
    specs = [s for s in specs if not only or s["name"] in only]
    os.makedirs(OUT, exist_ok=True)
    # base images first, then those that reference others
    base = [s for s in specs if not s.get("ref")]
    deps = [s for s in specs if s.get("ref")]
    for group in (base, deps):
        with cf.ThreadPoolExecutor(6) as ex:
            for name, st in ex.map(gen, group):
                print(name, st, flush=True)


if __name__ == "__main__":
    main()
