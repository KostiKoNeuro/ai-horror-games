"""Generate Russian horror voice lines via CometAPI gpt-4o-mini-tts and extra SFX via kie.ai."""
import json
import os
import time
import urllib.request
from generate_assets import AUD_DIR, COMET_KEY, kie_post, kie_get, kie_credits, download_file

VOICE_LINES = [
    (
        "vo_intro.mp3",
        "onyx",
        "Speak in a cold, clinical, slightly ominous monotone male voice, like a classified late-night Soviet research facility intercom.",
        "Запись начата. Испытуемый: Костя. Ваша задача — проверить три снимка с камер наблюдения в терминале и отметить аномалии. Не покидайте рабочее место.",
    ),
    (
        "vo_error_door.mp3",
        "onyx",
        "Speak in a tense, urgent, unsettling clinical male voice over an intercom.",
        "Внимание. Обнаружен посторонний сигнал внутри квартиры. Костя, немедленно подойдите к входной двери и проверьте глазок.",
    ),
    (
        "vo_whisper_outside.mp3",
        "coral",
        "Speak in a slow, bone-chilling, raspy, breathless ghostly female whisper, terrifying horror game acting, pausing between phrases.",
        "Костя... зря ты смотришь наружу... я уже не за дверью... я внутри квартиры...",
    ),
    (
        "vo_whisper_mirror.mp3",
        "shimmer",
        "Speak in an eerie, trembling, ice-cold female whisper right next to the listener's ear.",
        "Не смотри назад, Костя... ты выключил воду... а теперь гаснет свет...",
    ),
    (
        "vo_whisper_dark.mp3",
        "coral",
        "Speak in a creepy, slow, haunting female whisper in the dark, mocking and sinister.",
        "Сфотографируй меня ещё раз, Костя... с каждой вспышкой я всё ближе...",
    ),
    (
        "vo_whisper_behind.mp3",
        "coral",
        "Speak in an intimate, terrifying, breathless female whisper right behind someone's left ear.",
        "Костя... не оборачивайся... я стою прямо за твоим креслом... я вижу твоё лицо на экране...",
    ),
    (
        "vo_whisper_ear.mp3",
        "shimmer",
        "Speak in a sinister, desperate, bone-chilling female whisper right into the listener's right ear.",
        "Ну же, Костя... повернись ко мне... посмотри мне в глаза...",
    ),
    (
        "vo_outro.mp3",
        "onyx",
        "Speak in a calm, cold, sinister clinical male voice.",
        "Калибровка страха успешно завершена. Ваша реакция сохранена в архиве. Спасибо за участие в тесте, Костя.",
    ),
]

EXTRA_SFX = [
    (
        "sfx_mirror_sting.mp3",
        "Terrifying dissonant bowed contrabass horror sting with metallic screech and deep sub bass impact, sudden ghost reveal",
        False,
    ),
    (
        "sfx_power_down.mp3",
        "Electrical fuse box loud spark pop followed by heavy power grid shutting down hum dying into darkness",
        False,
    ),
    (
        "sfx_breathing_behind.mp3",
        "Creepy close-up raspy wet female ghostly breathing in a quiet dark room, binaural horror atmosphere",
        False,
    ),
]


def generate_tts():
    print("--- Generating Voice Lines via CometAPI gpt-4o-mini-tts ---")
    url = "https://api.cometapi.com/v1/audio/speech"
    for filename, voice, instructions, text in VOICE_LINES:
        out_path = os.path.join(AUD_DIR, filename)
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
                    "User-Agent": "scare-kostya-tts/1.0",
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


def generate_extra_sfx():
    c0 = kie_credits()
    print(f"--- Generating Extra SFX via kie.ai (Credits: {c0}) ---")
    pending = []
    for filename, prompt, loop in EXTRA_SFX:
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

    deadline = time.time() + 120
    while pending and time.time() < deadline:
        time.sleep(4)
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
                            print(f"[SFX OK] {filename} ({os.path.getsize(out_path)//1024} KB)")
                elif st == "fail":
                    print(f"[SFX FAIL] {filename}")
                else:
                    still.append((filename, tid))
            except Exception:
                still.append((filename, tid))
        pending = still
    print(f"--- Extra SFX Done. Remaining kie.ai credits: {kie_credits()} ---")


if __name__ == "__main__":
    generate_tts()
    generate_extra_sfx()
