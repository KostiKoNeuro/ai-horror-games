"""Batch asset generator for PROTOCOL: DO NOT LOOK (Scare Kostya)."""
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from generate_assets import (
    IMG_DIR,
    AUD_DIR,
    generate_image,
    chroma_key_green,
    kie_post,
    kie_get,
    kie_credits,
    download_file,
)

# 1. Base independent images (textures, scenes, base entity)
BASE_IMAGES = [
    (
        "tex_wallpaper.png",
        "Seamless tileable texture of old peeling faded floral apartment wallpaper, damp water stains, grime, dark moody psychological horror aesthetic, flat even lighting, top-down texture map",
        "1:1",
    ),
    (
        "tex_wood_floor.png",
        "Seamless tileable texture of worn dark oak parquet floorboards, scratches, aged varnish, dust in crevices, dark horror apartment floor texture, flat top-down lighting",
        "1:1",
    ),
    (
        "tex_bathroom_tile.png",
        "Seamless tileable texture of dirty cracked vintage white and greenish ceramic bathroom wall tiles with dark mold in grout lines, grimy horror texture, flat lighting",
        "1:1",
    ),
    (
        "tex_door_heavy.png",
        "Front view texture of a heavy old padded dark brown leatherette Soviet apartment front door with brass peephole, scratched metal lock plate and chain latch, dim moody lighting, orthographic front texture",
        "3:4",
    ),
    (
        "painting_normal.png",
        "Vintage oil painting portrait of a stern elderly Eastern European woman in dark 19th century dress, dark background, cracked varnish, solemn expression, museum frame crop",
        "3:4",
    ),
    (
        "peephole_corridor.png",
        "Extreme fisheye peephole lens view looking out into a dimly lit concrete post-Soviet apartment stairwell landing at night, flickering yellow bulb, peeling green paint on walls, empty concrete floor with a small cassette recorder on the doormat, photorealistic horror",
        "1:1",
    ),
    (
        "cctv_room_1.png",
        "Grainy monochrome night-vision security camera photograph of a narrow dark apartment hallway with a mirror on the right wall, inside the mirror reflection a faint pale ghostly face is barely visible staring back, VHS surveillance footage aesthetic",
        "16:9",
    ),
    (
        "cctv_room_2.png",
        "Grainy night-vision security camera photograph of a half-open bathroom doorway at the end of a dark corridor, long pale spindly fingers are curled around the edge of the door frame from the darkness inside, VHS surveillance aesthetic",
        "16:9",
    ),
    (
        "cctv_room_3.png",
        "Grainy night-vision security camera photograph taken from an apartment hallway doorway looking at the back of a man in headphones sitting in a desk chair in front of a glowing CRT monitor in a dark study room, right behind his left shoulder stands a tall shadowy pale figure in the darkness",
        "16:9",
    ),
    (
        "entity_standing_raw.png",
        "Full body front view of a terrifying tall gaunt pale woman ghost in a decayed damp black dress, head tilted unnaturally to the side, long wet black hair partially covering sunken hollow dark eyes, long pale hands hanging down, isolated on a completely flat solid pure bright green #00FF00 background with no floor shadow, horror game character sprite",
        "3:4",
    ),
]


def run_images():
    print("--- Generating Base Images via CometAPI Nano Banana 2.1 ---")
    with ThreadPoolExecutor(max_workers=4) as ex:
        futures = {
            ex.submit(generate_image, name, prompt, ar, "1K", None): name
            for name, prompt, ar in BASE_IMAGES
        }
        for fut in as_completed(futures):
            fut.result()

    # Dependent images using reference images for strict character/art consistency!
    painting_ref = os.path.join(IMG_DIR, "painting_normal.png")
    if os.path.exists(painting_ref):
        generate_image(
            "painting_cursed.png",
            "The exact same oil painting portrait of the elderly woman, but now her eyes are hollow bleeding black voids and her mouth is stretched open in a silent anatomical scream, decaying flesh, horror painting",
            "3:4",
            "1K",
            ref_image_path=painting_ref,
        )

    entity_ref = os.path.join(IMG_DIR, "entity_standing_raw.png")
    if os.path.exists(entity_ref):
        # Chroma key the standing sprite
        chroma_key_green(entity_ref, os.path.join(IMG_DIR, "entity_standing.png"))

        # Generate closer reaching state with same character reference
        closer_raw = generate_image(
            "entity_closer_raw.png",
            "The exact same tall gaunt pale woman ghost in the decayed black dress, now leaning forward aggressively with both pale clawed hands reaching toward the viewer and jaw unhinged in a terrifying silent scream, isolated on a completely flat solid pure bright green #00FF00 background with no shadow",
            "3:4",
            "1K",
            ref_image_path=entity_ref,
        )
        if closer_raw and os.path.exists(closer_raw):
            chroma_key_green(closer_raw, os.path.join(IMG_DIR, "entity_closer.png"))

        # Generate extreme close-up climax frame with same character reference
        generate_image(
            "entity_jumpscare.png",
            "Extreme close-up terrifying horror shot of the exact same gaunt pale woman ghost lunging inches from the camera lens in a dark apartment hallway, sunken dead eyes staring directly into the viewer's soul, unhinged screaming mouth, wet black hair, dramatic red and cold flashlight rim lighting, photorealistic nightmare",
            "16:9",
            "1K",
            ref_image_path=entity_ref,
        )


# 2. Audio via kie.ai (Voice + SFX + Music within $1 = 200 credits budget)
VOICE_TASKS = [
    (
        "vo_intro.mp3",
        "Запись начата. Испытуемый: Костя. Ваша задача — проверить три снимка с камер наблюдения в терминале и отметить аномалии. Не покидайте рабочее место.",
        "EkK5I93UQWFDigLMpZcX",  # James (cold clinical tone)
        0.95,
    ),
    (
        "vo_error_door.mp3",
        "Внимание. Обнаружен посторонний сигнал внутри квартиры. Костя, подойдите к входной двери и проверьте глазок.",
        "EkK5I93UQWFDigLMpZcX",
        0.95,
    ),
    (
        "vo_whisper_outside.mp3",
        "Костя... я уже не за дверью... я внутри...",
        "hpp4J3VqNfWAUOO0d1Us",  # Bella (eerie whispery female voice)
        0.82,
    ),
    (
        "vo_whisper_behind.mp3",
        "Костя... не оборачивайся... я вижу твоё лицо в мониторе... сиди тихо...",
        "hpp4J3VqNfWAUOO0d1Us",
        0.80,
    ),
    (
        "vo_whisper_ear.mp3",
        "Повернись ко мне, Костя... ну же... посмотри на меня...",
        "hpp4J3VqNfWAUOO0d1Us",
        0.78,
    ),
    (
        "vo_outro.mp3",
        "Калибровка страха завершена. Спасибо за участие в тесте, Костя.",
        "EkK5I93UQWFDigLMpZcX",
        0.92,
    ),
]

SFX_TASKS = [
    (
        "sfx_door_knock.mp3",
        "Three slow heavy ominous knocks pounding on a thick wooden apartment door in a quiet dark hallway, deep reverb",
        False,
    ),
    (
        "sfx_door_slam.mp3",
        "Violent heavy wooden door slamming shut with a loud metallic latch bang in an empty apartment corridor",
        False,
    ),
    (
        "sfx_footsteps_wet.mp3",
        "Slow creepy bare wet footsteps walking on old creaking wooden floorboards in a dark silent room",
        False,
    ),
    (
        "sfx_jumpscare_shriek.mp3",
        "Terrifying demonic female banshee shriek combined with a deep sub-bass metallic horror impact sting, loud jumpscare sound",
        False,
    ),
]

MUSIC_TASK = (
    "bgm_dread.mp3",
    "Dark psychological horror ambient drone with a slow detuned creepy music box melody, sub-bass tension, unsettling bowed metal textures, Silent Hill P.T. atmosphere",
)


def run_audio():
    start_credits = kie_credits()
    print(f"--- Starting kie.ai Audio Generation (Credits: {start_credits}) ---")
    pending = []

    # Submit voices
    for filename, text, voice_id, speed in VOICE_TASKS:
        out_path = os.path.join(AUD_DIR, filename)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"[AUD SKIP] {filename} exists")
            continue
        try:
            res = kie_post(
                "/api/v1/jobs/createTask",
                {
                    "model": "elevenlabs/text-to-speech-multilingual-v2",
                    "input": {
                        "text": text,
                        "voice": voice_id,
                        "stability": 0.45,
                        "similarity_boost": 0.8,
                        "speed": speed,
                    },
                },
            )
            if res.get("code") == 200 and res.get("data", {}).get("taskId"):
                tid = res["data"]["taskId"]
                print(f"[TASK CREATED] Voice {filename} -> {tid}")
                pending.append(("voice", filename, tid))
            else:
                print(f"[TASK WARN] Voice {filename}: {res}")
        except Exception as e:
            print(f"[TASK ERR] Voice {filename}: {e}")

    # Check credits after voice submission
    mid_credits = kie_credits()
    print(f"Credits after voice tasks: {mid_credits} (spent so far: {start_credits - mid_credits:.1f})")

    # Submit SFX if well within 200-credit budget
    for filename, prompt, loop in SFX_TASKS:
        out_path = os.path.join(AUD_DIR, filename)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"[AUD SKIP] {filename} exists")
            continue
        if start_credits - kie_credits() > 155:
            print("[BUDGET GUARD] Stopping new kie.ai submissions to stay under $1 (200 credits) limit.")
            break
        try:
            res = kie_post(
                "/api/v1/jobs/createTask",
                {
                    "model": "ai-music-api/sounds",
                    "input": {
                        "prompt": prompt,
                        "model": "V6",
                        "sound_loop": loop,
                    },
                },
            )
            if res.get("code") == 200 and res.get("data", {}).get("taskId"):
                tid = res["data"]["taskId"]
                print(f"[TASK CREATED] SFX {filename} -> {tid}")
                pending.append(("sfx", filename, tid))
            else:
                print(f"[TASK WARN] SFX {filename}: {res}")
        except Exception as e:
            print(f"[TASK ERR] SFX {filename}: {e}")

    # Submit Music if still within budget
    bgm_file, bgm_prompt = MUSIC_TASK
    bgm_path = os.path.join(AUD_DIR, bgm_file)
    if not (os.path.exists(bgm_path) and os.path.getsize(bgm_path) > 1000):
        if start_credits - kie_credits() <= 145:
            try:
                res = kie_post(
                    "/api/v1/jobs/createTask",
                    {
                        "model": "ai-music-api/generate",
                        "input": {
                            "custom_mode": False,
                            "instrumental": True,
                            "model": "V6",
                            "prompt": bgm_prompt,
                        },
                    },
                )
                if res.get("code") == 200 and res.get("data", {}).get("taskId"):
                    tid = res["data"]["taskId"]
                    print(f"[TASK CREATED] BGM {bgm_file} -> {tid}")
                    pending.append(("music", bgm_file, tid))
                else:
                    print(f"[TASK WARN] BGM {bgm_file}: {res}")
            except Exception as e:
                print(f"[TASK ERR] BGM {bgm_file}: {e}")

    # Poll pending tasks up to 180 seconds
    deadline = time.time() + 180
    while pending and time.time() < deadline:
        time.sleep(5)
        still_pending = []
        for kind, filename, tid in pending:
            try:
                info = kie_get(f"/api/v1/jobs/recordInfo?taskId={tid}")
                d = info.get("data") or {}
                state = d.get("state", "")
                if state == "success":
                    out_path = os.path.join(AUD_DIR, filename)
                    url = None
                    if d.get("resultJson"):
                        rj = json.loads(d["resultJson"]) if isinstance(d["resultJson"], str) else d["resultJson"]
                        urls = rj.get("resultUrls") or []
                        if urls:
                            url = urls[0]
                    if not url and d.get("response"):
                        resp_data = d["response"].get("data") or []
                        if resp_data and isinstance(resp_data, list):
                            url = resp_data[0].get("audio_url") or resp_data[0].get("stream_audio_url")
                    if url:
                        download_file(url, out_path)
                        print(f"[AUD OK] {filename} ({os.path.getsize(out_path)//1024} KB)")
                    else:
                        print(f"[AUD WARN] Unknown success shape for {filename}: {str(d)[:300]}")
                elif state == "fail":
                    print(f"[AUD FAIL] {filename}: {d.get('failCode')} {d.get('failMsg')}")
                else:
                    still_pending.append((kind, filename, tid))
            except Exception as e:
                print(f"[POLL ERR] {filename}: {e}")
                still_pending.append((kind, filename, tid))
        pending = still_pending
        if pending:
            print(f"Waiting on {len(pending)} audio tasks...")

    end_credits = kie_credits()
    print(f"--- kie.ai Done. Credits remaining: {end_credits} (Total used: {start_credits - end_credits:.2f}) ---")


if __name__ == "__main__":
    run_images()
    run_audio()
