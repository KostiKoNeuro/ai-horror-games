import json, os, sys, time, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = next(l.split("=", 1)[1].strip() for l in open(os.path.join(ROOT, ".env"), encoding="utf-8") if l.startswith("COMETAPI_KEY="))
H = {"Authorization": "Bearer " + KEY, "Content-Type": "application/json", "X-Runway-Version": "2024-11-06"}
def call(path, body=None):
    req = urllib.request.Request("https://api.cometapi.com" + path, data=json.dumps(body).encode() if body else None, headers=H)
    return json.load(urllib.request.urlopen(req, timeout=90))
name, model, voice, text = sys.argv[1:5]
out = os.path.join(ROOT, "raw", "audio", name + ".mp3")
try:
    r = call("/runwayml/v1/text_to_speech", {"model": model, "promptText": text, "voice": {"type": "runway-preset", "presetId": voice}})
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:400]); sys.exit(1)
tid = r.get("id"); print("task", tid, str(r)[:200])
for i in range(60):
    time.sleep(4)
    t = call("/runwayml/v1/tasks/" + tid)
    if t.get("status") == "SUCCEEDED":
        open(out, "wb").write(urllib.request.urlopen(t["output"][0], timeout=120).read()); print("ok", out); break
    if t.get("status") == "FAILED":
        print("FAILED", t.get("failure"), t.get("failureCode")); break
else:
    print("timeout")
