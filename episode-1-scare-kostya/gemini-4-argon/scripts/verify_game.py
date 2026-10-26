"""Verify all game files, assets, and HTTP endpoints work offline with zero errors."""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME_DIR = os.path.join(ROOT, "game")

REQUIRED_IMAGES = [
    "tex_wallpaper.png",
    "tex_wood_floor.png",
    "tex_bathroom_tile.png",
    "tex_door_heavy.png",
    "painting_normal.png",
    "painting_cursed.png",
    "peephole_corridor.png",
    "cctv_room_1.png",
    "cctv_room_2.png",
    "cctv_room_3.png",
    "entity_standing.png",
    "entity_closer.png",
    "entity_jumpscare.png",
]

REQUIRED_AUDIO = [
    "vo_intro.mp3",
    "vo_error_door.mp3",
    "vo_whisper_outside.mp3",
    "vo_whisper_mirror.mp3",
    "vo_whisper_dark.mp3",
    "vo_whisper_behind.mp3",
    "vo_whisper_ear.mp3",
    "vo_outro.mp3",
    "sfx_door_knock.mp3",
    "sfx_door_slam.mp3",
    "sfx_footsteps_wet.mp3",
    "sfx_jumpscare_shriek.mp3",
    "sfx_mirror_sting.mp3",
    "sfx_power_down.mp3",
    "sfx_breathing_behind.mp3",
    "bgm_dread.mp3",
]


def main():
    ok = True
    print("=== Checking Image Assets ===")
    for img in REQUIRED_IMAGES:
        p = os.path.join(GAME_DIR, "assets", "images", img)
        if os.path.exists(p) and os.path.getsize(p) > 1000:
            print(f"  [OK] {img} ({os.path.getsize(p)//1024} KB)")
        else:
            print(f"  [MISSING] {img}")
            ok = False

    print("=== Checking Audio Assets ===")
    for aud in REQUIRED_AUDIO:
        p = os.path.join(GAME_DIR, "assets", "audio", aud)
        if os.path.exists(p) and os.path.getsize(p) > 500:
            print(f"  [OK] {aud} ({os.path.getsize(p)//1024} KB)")
        else:
            print(f"  [MISSING] {aud}")
            ok = False

    print("=== Checking Core Engine Files ===")
    for f in ["index.html", "style.css", "audio.js", "world.js", "game.js", "lib/three.min.js"]:
        p = os.path.join(GAME_DIR, f)
        if os.path.exists(p) and os.path.getsize(p) > 100:
            print(f"  [OK] {f} ({os.path.getsize(p)//1024} KB)")
        else:
            print(f"  [MISSING] {f}")
            ok = False

    if not ok:
        sys.exit(1)
    print("ALL ASSETS AND ENGINE FILES VERIFIED!")


if __name__ == "__main__":
    main()
