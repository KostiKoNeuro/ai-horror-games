import os
import json
import time
import base64
import concurrent.futures
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv()

COMET_KEY = os.environ.get("COMETAPI_KEY", "").strip()
KIE_KEY = os.environ.get("KIE_API_KEY", "").strip()

IMG_DIR = os.path.join("game", "assets", "images")
AUD_DIR = os.path.join("game", "assets", "audio")
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(AUD_DIR, exist_ok=True)


def generate_gemini_image_2k(filename, prompt, aspect_ratio="16:9", image_size="2K"):
    out_path = os.path.join(IMG_DIR, filename)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"[IMG SKIP] {filename} already exists")
        return True

    url = "https://api.cometapi.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {
                "aspectRatio": aspect_ratio,
                "imageSize": image_size
            }
        }
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {COMET_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        },
        method="POST"
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=150) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                candidates = body.get("candidates", [])
                for c in candidates:
                    parts = c.get("content", {}).get("parts", [])
                    for p in parts:
                        inline = p.get("inlineData") or p.get("inline_data")
                        if inline and "data" in inline:
                            raw = base64.b64decode(inline["data"])
                            with open(out_path, "wb") as f:
                                f.write(raw)
                            print(f"[IMG 2K OK] {filename} ({len(raw)//1024} KB)")
                            return True
        except Exception as e:
            print(f"[IMG ERR] {filename} attempt {attempt+1}: {e}")
            time.sleep(2)
    return False


def generate_tts(filename, text, voice="onyx", instructions=""):
    out_path = os.path.join(AUD_DIR, filename)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 2000:
        print(f"[TTS SKIP] {filename} already exists")
        return True

    url = "https://api.cometapi.com/v1/audio/speech"
    payload = {
        "model": "gpt-4o-mini-tts",
        "input": text,
        "voice": voice,
        "response_format": "mp3"
    }
    if instructions:
        payload["instructions"] = instructions

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {COMET_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        },
        method="POST"
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                raw = resp.read()
                if len(raw) > 1000:
                    with open(out_path, "wb") as f:
                        f.write(raw)
                    print(f"[TTS OK] {filename} ({len(raw)//1024} KB)")
                    return True
        except Exception as e:
            print(f"[TTS ERR] {filename} attempt {attempt+1}: {e}")
            time.sleep(2)
    return False


def generate_kie_sfx(filename, text, duration_seconds=5.0):
    out_path = os.path.join(AUD_DIR, filename)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 2000:
        print(f"[SFX SKIP] {filename} already exists")
        return True

    create_url = "https://api.kie.ai/api/v1/jobs/createTask"
    payload = {
        "model": "elevenlabs/sound-effect-v2",
        "input": {
            "text": text,
            "duration_seconds": duration_seconds,
            "prompt_influence": 0.75,
            "loop": False,
            "output_format": "mp3_44100_128"
        }
    }
    req = urllib.request.Request(
        create_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {KIE_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode("utf-8"))
        task_id = (res.get("data") or {}).get("taskId")
        if not task_id:
            print(f"[SFX ERR] No taskId for {filename}: {res}")
            return False
    except Exception as e:
        print(f"[SFX CREATE ERR] {filename}: {e}")
        return False

    poll_url = f"https://api.kie.ai/api/v1/jobs/recordInfo?taskId={task_id}"
    for _ in range(45):
        time.sleep(3)
        try:
            preq = urllib.request.Request(
                poll_url,
                headers={"Authorization": f"Bearer {KIE_KEY}", "User-Agent": "Mozilla/5.0"}
            )
            with urllib.request.urlopen(preq, timeout=20) as presp:
                pdata = json.loads(presp.read().decode("utf-8")).get("data") or {}
            state = pdata.get("state", "")
            if state == "success":
                rjson = json.loads(pdata.get("resultJson", "{}"))
                urls = rjson.get("resultUrls", [])
                if urls:
                    dl_req = urllib.request.Request(urls[0], headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(dl_req, timeout=30) as dresp:
                        raw = dresp.read()
                    with open(out_path, "wb") as f:
                        f.write(raw)
                    print(f"[SFX OK] {filename} ({len(raw)//1024} KB)")
                    return True
            elif state in ("fail", "failed", "error"):
                print(f"[SFX FAIL] {filename}: {pdata}")
                return False
        except Exception as e:
            print(f"[SFX POLL ERR] {filename}: {e}")
    return False


IMAGE_TASKS = [
    (
        "cctv_5_clean.png",
        "Grainy monochrome black-and-white security camera night-vision footage of an old dilapidated post-Soviet bathroom at 03:00 AM. High corner angle. On the right is an old cast-iron bathtub that is completely empty. On the left is a cracked porcelain sink and mirror. Dirty tiled walls, VHS scanlines. Completely empty room, no people, no ghosts.",
        "16:9",
        "2K"
    ),
    (
        "cctv_5_anomaly.png",
        "Grainy monochrome black-and-white security camera night-vision footage of an old dilapidated post-Soviet bathroom at 03:14 AM. High corner angle. Inside the cast-iron bathtub on the right side of the frame, a terrifying pale gaunt woman with soaked black hair is emerging out of pitch-black water, staring straight up into the security camera with glowing hollow eyes. VHS scanlines, photorealistic horror.",
        "16:9",
        "2K"
    ),
    (
        "dossier_scan.png",
        "Top-down macro photograph of an open classified Soviet psychiatric and AI experiment dossier folder lying on a dark scratched wooden desk. Stamped in bold red Cyrillic letters 'ЛИЧНОЕ ДЕЛО №404: КОСТЯ'. Inside the folder are EEG brainwave spikes printed on graph paper, a dark thermal scan of a human head, redacted typewriter text with black marker bars, and a frantic red handwritten warning 'НЕ СМОТРИ В ЗЕРКАЛО'. Moody desk lamp lighting, photorealistic 8k.",
        "16:9",
        "2K"
    ),
    (
        "closet_scare_closeup.png",
        "First-person camera flash photograph looking directly inside a narrow dark wooden hallway closet between hanging old winter coats: a terrifying pale gaunt entity with sunken glowing eyes, cracked grey skin, and long bony fingers is crouched right inside the closet lunging forward between the coats straight at the camera lens. Harsh claustrophobic flash lighting, photorealistic horror.",
        "16:9",
        "2K"
    ),
    (
        "entity_jumpscare_2k.png",
        "Extreme close-up macro horror photograph of a terrifying pale gaunt entity lunging directly into the camera lens inside a dark apartment hallway, unhinged screaming jaw with dark teeth, wide bloodshot hollow eyes staring into the viewer's soul, wet tangled black hair, bony clawed hands reaching at the edges of the frame, harsh crimson and cold flash rim lighting, 8k photorealistic.",
        "16:9",
        "2K"
    )
]

TTS_TASKS = [
    (
        "vo_tape_log.mp3",
        "Запись ноль-три... Костя, если ты включил этот магнитофон — слушай внимательно. Я тоже думал, что это просто тест алгоритма. Но камеры на мониторе показывают не запись... они открывают ей проход в квартиру четыреста четыре. Не верь таймеру и не открывай шкаф в коридоре!",
        "echo",
        "Speak as a terrified, exhausted man whispering urgently into an old analog tape recorder late at night, trembling voice."
    ),
    (
        "vo_tape_log_en.mp3",
        "Recording zero-three... Kostya, if you turned on this tape deck, listen carefully. I also thought this was just an algorithm test. But the cameras on that monitor aren't playing recordings... they let her inside Apartment 404. Don't trust the timer, and do not open the hallway closet!",
        "echo",
        "Speak as a terrified, exhausted man whispering urgently into an old analog tape recorder late at night, trembling voice."
    ),
    (
        "vo_closet_scare.mp3",
        "Зачем ты заглянул в шкаф, Костя?.. Я уже вышла оттуда.",
        "shimmer",
        "Speak in a chilling, raspy, sinister ghostly whisper right into the listener's ear, slow and terrifying."
    ),
    (
        "vo_closet_scare_en.mp3",
        "Why did you look inside the closet, Kostya?.. I already stepped out.",
        "shimmer",
        "Speak in a chilling, raspy, sinister ghostly whisper right into the listener's ear, slow and terrifying."
    ),
    (
        "vo_cam5_bath.mp3",
        "Камера четыре: санузел. Зафиксирован подъём уровня чёрной воды в ванне при перекрытых трубах. Переключаю на последнюю камеру — твой рабочий кабинет, Костя.",
        "onyx",
        "Speak in a cold, clinical, ominous late-Soviet automated telemetry voice."
    ),
    (
        "vo_cam5_bath_en.mp3",
        "Camera four: bathroom. Rising black water detected inside bathtub with main valves shut. Switching to the final camera — your study, Kostya.",
        "onyx",
        "Speak in a cold, clinical, ominous automated telemetry voice."
    )
]

SFX_TASKS = [
    (
        "sfx_cassette_click.mp3",
        "Heavy vintage analog reel-to-reel tape recorder button click clunk followed by magnetic tape hiss and spinning motor startup",
        4.0
    ),
    (
        "sfx_paper_dossier.mp3",
        "Crisp unsettling sound of opening a heavy classified cardboard dossier folder and turning thick paper pages in a dead silent room",
        3.5
    )
]


def main():
    print("=== Launching v3.0 High-Res 2K Asset & Audio Batch ===")
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
        futs = []
        for fn, prompt, ar, sz in IMAGE_TASKS:
            futs.append(ex.submit(generate_gemini_image_2k, fn, prompt, ar, sz))
        for fn, txt, voice, instr in TTS_TASKS:
            futs.append(ex.submit(generate_tts, fn, txt, voice, instr))
        for fn, txt, dur in SFX_TASKS:
            futs.append(ex.submit(generate_kie_sfx, fn, txt, dur))
        concurrent.futures.wait(futs)
    print("=== v3.0 Batch Complete ===")


if __name__ == "__main__":
    main()
