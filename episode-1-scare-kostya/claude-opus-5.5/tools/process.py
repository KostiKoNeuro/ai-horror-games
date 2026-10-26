"""Process raw assets into game-ready form: chroma-key green, resize, convert, trim audio."""
import os, json
from PIL import Image, ImageFilter
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_I = os.path.join(ROOT, "raw", "img")
RAW_A = os.path.join(ROOT, "raw", "audio")
OUT_I = os.path.join(ROOT, "game", "assets", "img")
OUT_A = os.path.join(ROOT, "game", "assets", "audio")
os.makedirs(OUT_I, exist_ok=True)
os.makedirs(OUT_A, exist_ok=True)

MAX_BG = 1600  # max long edge for backgrounds


def chroma_key(img, green_thresh=90, edge=2):
    """Turn near-pure-green pixels transparent. green = #00FF00."""
    g = img.convert("RGBA")
    px = g.load()
    w, h = g.size
    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            r, gg, b, a = px[x, y]
            if gg > 120 and r < green_thresh and b < green_thresh:
                mpx[x, y] = 255
            elif gg > 140 and r < 140 and b < 140 and gg > r + 40 and gg > b + 40:
                mpx[x, y] = 200
    # erode mask a bit to remove green halo
    mask = mask.filter(ImageFilter.MinFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(1))
    g.putalpha(mask)
    return g


def fit(img, max_edge):
    w, h = img.size
    if max(w, h) > max_edge:
        s = max_edge / max(w, h)
        img = img.resize((int(w * s), int(h * s)), Image.LANCZOS)
    return img


def bg(name, fmt="jpg", max_edge=MAX_BG):
    src = os.path.join(RAW_I, name + ".png")
    if not os.path.exists(src):
        print("missing", name); return
    img = Image.open(src).convert("RGB")
    img = fit(img, max_edge)
    out = os.path.join(OUT_I, name + "." + fmt)
    img.save(out, quality=82 if fmt == "jpg" else None, optimize=True)
    print(name, fmt, img.size)


def cutout(name, max_edge=900):
    src = os.path.join(RAW_I, name + ".png")
    if not os.path.exists(src):
        print("missing cutout", name); return
    img = Image.open(src)
    img = fit(img, max_edge)
    img = chroma_key(img)
    img.save(os.path.join(OUT_I, name + ".png"))
    print(name, "cutout", img.size)


def mirror(name):
    """mirror_frame: keep frame, key green glass to alpha."""
    cutout(name, max_edge=1600)


# backgrounds
for n in ["ext_building", "stair_door", "hall", "living", "kitchen", "bedroom",
          "wardrobe_view", "wardrobe_gran", "wardrobe_face", "peephole_gran",
          "peephole_empty", "portrait", "portrait_dead", "paper", "docs_box",
          "hall_open", "living_feet", "end_frame", "jumpscare_face"]:
    bg(n)

# cutouts (transparent)
for n in ["gran_cutout", "mirror_frame"]:
    cutout(n, 900 if n == "gran_cutout" else 1600)

print("--- images done ---")

# audio: copy mp3s as-is (already reasonable size)
LOOPS = {"amb_apartment.mp3", "drone.mp3", "stairwell.mp3", "clock.mp3", "music_box.mp3", "tension.mp3"}
for f in os.listdir(RAW_A):
    if f.endswith(".mp3") and not f.startswith(("c_", "t_")):
        af = "anull" if f in LOOPS else "silenceremove=start_periods=1:start_threshold=-50dB:start_duration=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_duration=0.05,areverse"
        subprocess.run(["ffmpeg", "-y", "-i", os.path.join(RAW_A, f), "-af", af, "-b:a", "128k",
                        os.path.join(OUT_A, f)], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f, "->", os.path.getsize(os.path.join(OUT_A, f)))
print("--- audio done ---")
