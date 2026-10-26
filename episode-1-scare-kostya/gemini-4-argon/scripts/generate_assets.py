"""Generate images via CometAPI (Nano Banana 2.1) and audio via kie.ai, with chroma-keying for sprites."""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "game", "assets", "images")
AUD_DIR = os.path.join(ROOT, "game", "assets", "audio")
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(AUD_DIR, exist_ok=True)


def load_env():
    env = {}
    env_path = os.path.join(ROOT, ".env")
    for line in open(env_path, encoding="utf-8"):
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


ENV = load_env()
COMET_KEY = ENV["COMETAPI_KEY"]
KIE_KEY = ENV["KIE_API_KEY"]


def generate_image(name, prompt, aspect_ratio="16:9", image_size="1K", ref_image_path=None):
    out_path = os.path.join(IMG_DIR, name)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        print(f"[IMG SKIP] {name} already exists")
        return out_path

    url = "https://api.cometapi.com/v1beta/models/gemini-nano-banana-2.1:generateContent"
    parts = []
    if ref_image_path and os.path.exists(ref_image_path):
        with open(ref_image_path, "rb") as f:
            b64_ref = base64.b64encode(f.read()).decode("ascii")
        parts.append({"inline_data": {"mime_type": "image/png", "data": b64_ref}})
    parts.append({"text": prompt})

    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {"aspectRatio": aspect_ratio, "imageSize": image_size},
        },
    }
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "x-goog-api-key": COMET_KEY,
        "Authorization": f"Bearer {COMET_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "scare-kostya-gen/1.0",
    }
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=120) as resp:
                res = json.loads(resp.read().decode("utf-8"))
            cand_parts = res.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            img_b64 = None
            for p in cand_parts:
                if p.get("thought"):
                    continue
                inline = p.get("inlineData") or p.get("inline_data")
                if inline and inline.get("data"):
                    img_b64 = inline["data"]
            if not img_b64:
                # fallback if all had thought or different structure
                for p in cand_parts:
                    inline = p.get("inlineData") or p.get("inline_data")
                    if inline and inline.get("data"):
                        img_b64 = inline["data"]
            if img_b64:
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(img_b64))
                print(f"[IMG OK] {name} ({os.path.getsize(out_path)//1024} KB)")
                return out_path
            else:
                print(f"[IMG WARN] No inlineData in response for {name}: {str(res)[:300]}")
        except Exception as e:
            print(f"[IMG ERR] {name} attempt {attempt+1}: {e}")
            time.sleep(3)
    return None


def chroma_key_green(in_path, out_path):
    """Remove solid green (#00FF00) background and clean green spill on edges."""
    from PIL import Image
    img = Image.open(in_path).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # Calculate greenness excess over max(r, b)
            max_rb = max(r, b)
            excess = g - max_rb
            if g > 100 and excess > 45:
                # Fully transparent if strongly green
                if excess > 85:
                    px[x, y] = (r, max_rb, b, 0)
                else:
                    # Smooth alpha feathering at edge + despill green
                    alpha = int(255 * (1.0 - (excess - 45) / 40.0))
                    px[x, y] = (r, max_rb, b, max(0, min(255, alpha)))
            elif excess > 15:
                # Despill slight green fringe
                px[x, y] = (r, int((g + max_rb) * 0.5), b, a)
    img.save(out_path, "PNG")
    print(f"[CHROMA OK] {os.path.basename(out_path)}")


def kie_post(path, payload):
    url = f"https://api.kie.ai{path}"
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {KIE_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "scare-kostya-kie/1.0",
    }
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def kie_get(path):
    url = f"https://api.kie.ai{path}"
    headers = {
        "Authorization": f"Bearer {KIE_KEY}",
        "User-Agent": "scare-kostya-kie/1.0",
    }
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def kie_credits():
    try:
        res = kie_get("/api/v1/chat/credit")
        return res.get("data", 0)
    except Exception as e:
        print("kie_credits err:", e)
        return -1


def download_file(url, out_path):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        with open(out_path, "wb") as f:
            f.write(resp.read())


if __name__ == "__main__":
    print("Asset helper loaded. Credits:", kie_credits())
