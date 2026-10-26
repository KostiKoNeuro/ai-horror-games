"""Generate the full expansion asset pack (16 high-res images, 10 voice lines, 1 chase music track, 5 SFX)."""
import json
import os
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from generate_assets import (
    IMG_DIR,
    AUD_DIR,
    COMET_KEY,
    generate_image,
    chroma_key_green,
    kie_post,
    kie_get,
    kie_credits,
    download_file,
)


def run_expansion_images():
    print("=== 1. Generating Expansion Base & Reference Images via CometAPI ===")
    # A. Independent textures & scenes
    indep = [
        (
            "tex_ceiling.png",
            "Seamless tileable texture of old cracked dirty grey plaster apartment ceiling with damp water leak rings and peeling paint, dark horror aesthetic, flat top-down lighting",
            "1:1",
            None,
        ),
        (
            "tex_rug.png",
            "Top-down orthographic texture of a worn, dirty, stained vintage Eastern European burgundy and black patterned hallway runner rug, frayed edges, dark moody horror texture",
            "3:4",
            None,
        ),
        (
            "poster_anatomy.png",
            "Grimy yellowed vintage Soviet medical neurological optical chart poster with diagrams of the human eye, brain fear center, and Cyrillic header 'ПРОТОКОЛ ВОСПРИЯТИЯ 404', dark stains, horror prop texture",
            "3:4",
            None,
        ),
        (
            "painting_2_normal.png",
            "Vintage dark oil painting portrait of a solemn Eastern European man and young girl in 19th century dark clothing, cracked varnish, antique wooden frame crop",
            "3:4",
            None,
        ),
        (
            "cctv_4_clean.png",
            "Grainy monochrome night-vision security camera photograph of a cramped old post-Soviet apartment utility alcove with a metal electrical breaker box on the left wall and an old white refrigerator on the right, empty and quiet, VHS timestamp 03:00:00 AM",
            "16:9",
            None,
        ),
        (
            "title_bg.png",
            "Cinematic dark psychological horror background of a dimly lit post-Soviet apartment study desk at 03:14 AM, glowing green CRT security monitor in foreground, dark open doorway behind leading into a pitch-black hallway, rain on window, 35mm film grain",
            "16:9",
            None,
        ),
    ]

    # B. Reference-based "Clean 03:00 AM" counterparts & character variations
    ref_cctv1 = os.path.join(IMG_DIR, "cctv_room_1.png")
    ref_cctv2 = os.path.join(IMG_DIR, "cctv_room_2.png")
    ref_cctv3 = os.path.join(IMG_DIR, "cctv_room_3.png")
    ref_peep = os.path.join(IMG_DIR, "peephole_corridor.png")
    ref_ent = os.path.join(IMG_DIR, "entity_standing_raw.png")
    ref_jump = os.path.join(IMG_DIR, "entity_jumpscare.png")
    ref_closer = os.path.join(IMG_DIR, "entity_closer_raw.png")

    ref_tasks = [
        (
            "cctv_1_clean.png",
            "The exact same grainy monochrome night-vision security camera photograph of the apartment hallway, but the mirror on the right wall is completely empty with NO ghostly face inside it, normal empty mirror reflection",
            "16:9",
            ref_cctv1,
        ),
        (
            "cctv_2_clean.png",
            "The exact same grainy night-vision security camera photograph of the hallway doorway, but the pale hand is gone and the doorway is empty, normal quiet hallway",
            "16:9",
            ref_cctv2,
        ),
        (
            "cctv_3_clean.png",
            "The exact same grainy night-vision security camera photograph of the man in headphones sitting in the office chair in front of the glowing CRT monitor, but the tall shadowy figure behind his chair is completely gone, he is sitting alone in the room",
            "16:9",
            ref_cctv3,
        ),
        (
            "peephole_entity.png",
            "The exact same fisheye peephole lens view of the concrete stairwell landing, but now a terrifying gaunt pale woman with hollow black eyes and wet black hair is standing inches from the door staring directly into the peephole lens",
            "1:1",
            ref_peep,
        ),
        (
            "mirror_scare_bathroom.png",
            "First-person view looking into a dirty cracked bathroom mirror at night, blood red condensation letters written on the glass read 'НЕ СМОТРИ НАЗАД', and standing directly behind the viewer's dark silhouette in the mirror reflection is this exact terrifying gaunt pale woman with unhinged screaming mouth and hollow eyes",
            "4:3",
            ref_closer,
        ),
        (
            "entity_peeking_raw.png",
            "The exact same tall gaunt pale woman ghost in the decayed black dress, now leaning her upper body and tilted head sideways at a 45-degree angle as if peeking around a doorframe, long pale fingers gripping forward, isolated on a completely flat solid pure bright green #00FF00 background with no shadow",
            "3:4",
            ref_ent,
        ),
        (
            "entity_crawling_raw.png",
            "The exact same gaunt pale woman ghost in the decayed black dress, now crouched low in a terrifying contorted spider-like lunge with head twisted and both clawed hands reaching directly at the camera, isolated on a completely flat solid pure bright green #00FF00 background with no shadow",
            "3:4",
            ref_ent,
        ),
        (
            "entity_jumpscare_2.png",
            "The exact same gaunt pale woman ghost lunging even closer into the camera lens, extreme macro close-up of her unhinged screaming jaws and dead wide eyes filling the frame, blood-red emergency hallway lighting, visceral nightmare horror",
            "16:9",
            ref_jump,
        ),
    ]

    all_first_wave = indep + ref_tasks
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = [
            ex.submit(generate_image, name, prompt, ar, "1K", ref)
            for name, prompt, ar, ref in all_first_wave
        ]
        for f in as_completed(futs):
            f.result()

    # Dependent second wave (cursed painting 2, cctv 4 anomaly, chroma keying new sprites)
    p2_ref = os.path.join(IMG_DIR, "painting_2_normal.png")
    if os.path.exists(p2_ref):
        generate_image(
            "painting_2_cursed.png",
            "The exact same oil painting of the man and young girl, but now their faces are pale decaying skulls with bleeding black eye sockets and horrifying stretched grins, horror painting",
            "3:4",
            "1K",
            ref_image_path=p2_ref,
        )

    c4_ref = os.path.join(IMG_DIR, "cctv_4_clean.png")
    if os.path.exists(c4_ref):
        generate_image(
            "cctv_4_anomaly.png",
            "The exact same grainy night-vision security camera photograph of the utility alcove with the breaker box and refrigerator, but now the refrigerator door is covered in dark bloody handprints and a tall gaunt pale figure is standing hunched in the corner by the breaker box",
            "16:9",
            "1K",
            ref_image_path=c4_ref,
        )

    peek_raw = os.path.join(IMG_DIR, "entity_peeking_raw.png")
    if os.path.exists(peek_raw):
        chroma_key_green(peek_raw, os.path.join(IMG_DIR, "entity_peeking.png"))

    crawl_raw = os.path.join(IMG_DIR, "entity_crawling_raw.png")
    if os.path.exists(crawl_raw):
        chroma_key_green(crawl_raw, os.path.join(IMG_DIR, "entity_crawling.png"))


NEW_VOICE_LINES = [
    # New Russian horror lines
    (
        "vo_phone_call.mp3",
        "onyx",
        "Speak in a distorted, urgent, terrified low male voice over a crackling telephone line.",
        "Костя... не открывай входную дверь... слышишь меня?! То, что стучит снаружи — это обман. Посмотри в глазок, но не вздумай снимать цепочку!",
    ),
    (
        "vo_whisper_neck.mp3",
        "coral",
        "Speak in an ice-cold, intimate, bone-chilling female whisper right against someone's neck.",
        "Я чувствую, как дрожит твоя рука на мышке, Костя... не смей убирать курсор...",
    ),
    (
        "vo_breaker_whisper.mp3",
        "shimmer",
        "Speak in a mocking, sinister, breathless ghostly female whisper in a dark room.",
        "Думаешь, электричество спасёт тебя, Костя? Я уже совсем рядом...",
    ),
    (
        "vo_whisper_climax.mp3",
        "coral",
        "Speak in a terrifying, sinister, whispered taunt right before a sudden attack.",
        "Куда же ты бежишь, Костя? Тест ещё не окончен...",
    ),
    # English voiceover pack for [EN] mode!
    (
        "vo_intro_en.mp3",
        "onyx",
        "Speak in a cold, clinical, slightly ominous monotone male voice over a facility intercom.",
        "Recording initiated. Subject: Kostya. Your task is to inspect the four surveillance cameras on the terminal, compare them with the 3 AM baseline, and tag all anomalies. Do not leave your workstation.",
    ),
    (
        "vo_error_door_en.mp3",
        "onyx",
        "Speak in an urgent, unsettling clinical male intercom voice.",
        "Alert. Unauthorized biological signal detected inside Apartment 404. Kostya, answer the hallway intercom and check the front door peephole immediately.",
    ),
    (
        "vo_phone_call_en.mp3",
        "onyx",
        "Speak in a distorted, terrified low whisper over a crackling telephone line.",
        "Kostya... do not unlatch the front door... what is knocking outside is a trap. Check the peephole, she is already inside the apartment!",
    ),
    (
        "vo_whisper_outside_en.mp3",
        "coral",
        "Speak in a slow, bone-chilling, breathless ghostly female whisper.",
        "Kostya... why are you looking outside... I am no longer behind the door... I am inside with you...",
    ),
    (
        "vo_whisper_behind_en.mp3",
        "coral",
        "Speak in an intimate, terrifying female whisper right behind the listener's left ear.",
        "Kostya... do not turn around... I am standing right behind your chair... I can see your face in the monitor...",
    ),
    (
        "vo_whisper_neck_en.mp3",
        "shimmer",
        "Speak in a sinister, bone-chilling female whisper right into the listener's right ear.",
        "I can feel your hand trembling on the mouse, Kostya... look at me...",
    ),
    (
        "vo_outro_en.mp3",
        "onyx",
        "Speak in a calm, cold, clinical male voice.",
        "Fear response calibration complete. Your biometric reaction has been archived. Thank you for participating in the test, Kostya.",
    ),
]


def run_expansion_tts():
    print("=== 2. Generating Expansion Voice Lines via CometAPI gpt-4o-mini-tts ===")
    url = "https://api.cometapi.com/v1/audio/speech"
    for filename, voice, instructions, text in NEW_VOICE_LINES:
        out_path = os.path.join(AUD_DIR, filename)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"[TTS SKIP] {filename}")
            continue
        payload = {
            "model": "gpt-4o-mini-tts",
            "voice": voice,
            "input": text,
            "instructions": instructions,
            "response_format": "mp3",
        }
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {COMET_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": "scare-kostya-tts/2.0",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=45) as resp:
                audio_bytes = resp.read()
            with open(out_path, "wb") as f:
                f.write(audio_bytes)
            print(f"[TTS OK] {filename} ({len(audio_bytes)//1024} KB)")
        except Exception as e:
            print(f"[TTS ERR] {filename}: {e}")


EXPANSION_SFX = [
    (
        "sfx_phone_ring.mp3",
        "Old vintage Soviet rotary telephone ringing shrily in a dark empty apartment corridor, eerie metallic bell reverb",
        False,
    ),
    (
        "sfx_closet_creak.mp3",
        "Slow creepy wooden louvered closet door creaking open in the dark followed by a faint ghostly female gasp",
        False,
    ),
    (
        "sfx_camera_shutter.mp3",
        "Vintage Polaroid camera xenon flash pop and mechanical shutter click followed by motorized instant film eject whir",
        False,
    ),
    (
        "sfx_alarm_pulse.mp3",
        "Ominous low-frequency emergency security buzzer alarm pulsing in a dark claustrophobic corridor",
        False,
    ),
    (
        "sfx_tape_stop.mp3",
        "Heavy analog reel-to-reel cassette recorder mechanical button clunk and tape motor stopping",
        False,
    ),
]


def run_expansion_kie_audio():
    c0 = kie_credits()
    print(f"=== 3. Generating Expansion SFX & Chase Music via kie.ai (Credits: {c0}) ===")
    pending = []

    for filename, prompt, loop in EXPANSION_SFX:
        out_path = os.path.join(AUD_DIR, filename)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            continue
        try:
            res = kie_post(
                "/api/v1/jobs/createTask",
                {
                    "model": "ai-music-api/sounds",
                    "input": {"prompt": prompt, "model": "V6", "sound_loop": loop},
                },
            )
            if res.get("code") == 200 and res.get("data", {}).get("taskId"):
                tid = res["data"]["taskId"]
                print(f"[SFX TASK] {filename} -> {tid}")
                pending.append((filename, tid))
        except Exception as e:
            print(f"[SFX ERR] {filename}: {e}")

    # Chase / Climax Music track
    chase_path = os.path.join(AUD_DIR, "bgm_chase.mp3")
    if not (os.path.exists(chase_path) and os.path.getsize(chase_path) > 1000):
        try:
            res = kie_post(
                "/api/v1/jobs/createTask",
                {
                    "model": "ai-music-api/generate",
                    "input": {
                        "custom_mode": False,
                        "instrumental": True,
                        "model": "V6",
                        "prompt": "Intense terrifying industrial dark ambient horror chase music, pounding heart-rate sub-bass pulse, shrieking dissonant strings, metallic hits, panic and dread",
                    },
                },
            )
            if res.get("code") == 200 and res.get("data", {}).get("taskId"):
                tid = res["data"]["taskId"]
                print(f"[BGM TASK] bgm_chase.mp3 -> {tid}")
                pending.append(("bgm_chase.mp3", tid))
        except Exception as e:
            print(f"[BGM ERR] bgm_chase.mp3: {e}")

    deadline = time.time() + 180
    while pending and time.time() < deadline:
        time.sleep(5)
        still = []
        for filename, tid in pending:
            try:
                info = kie_get(f"/api/v1/jobs/recordInfo?taskId={tid}")
                d = info.get("data") or {}
                st = d.get("state", "")
                if st == "success":
                    resp_data = (d.get("response") or {}).get("data") or []
                    if resp_data:
                        u = resp_data[0].get("audio_url") or resp_data[0].get("stream_audio_url")
                        if u:
                            out_path = os.path.join(AUD_DIR, filename)
                            download_file(u, out_path)
                            print(f"[KIE OK] {filename} ({os.path.getsize(out_path)//1024} KB)")
                elif st == "fail":
                    print(f"[KIE FAIL] {filename}: {d.get('failMsg')}")
                else:
                    still.append((filename, tid))
            except Exception:
                still.append((filename, tid))
        pending = still
    print(f"=== Expansion Audio Done. Remaining kie.ai credits: {kie_credits()} ===")


if __name__ == "__main__":
    run_expansion_images()
    run_expansion_tts()
    run_expansion_kie_audio()
