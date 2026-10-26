#!/usr/bin/env python3
"""Generate SMENA's local image/audio assets without exposing API credentials."""
from __future__ import annotations

import argparse
import base64
from io import BytesIO
import json
import os
from pathlib import Path
import subprocess
from PIL import Image, ImageFilter
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
AUDIO = ROOT / "assets" / "audio"
REPORT = ROOT / "assets" / "generation_report.json"
COMET = "https://api.cometapi.com"
KIE = "https://api.kie.ai"
USD_PER_CREDIT = 0.005
AUDIO_CREDIT_CAP = 200

IMAGE_PROMPTS = {
    "office.png": "Eye-level first-person view inside a 1990s Russian municipal night security office. A bank of old CRT monitors is centered on the back wall, cluttered desk fills the lower foreground, rotary telephone on the left, open handwritten logbook on the right with illegible marks only, frosted glass security door behind and to the side. One weak desk lamp, deep blue night light through windows, dust, grime, worn paint, authentic utilitarian Soviet-era details. Cinematic photorealism, restrained horror, no humans, no readable text, no watermark. Wide 16:9 composition.",
    "office_dark.png": "Edit this reference into the exact same office and identical fixed camera angle, preserving every object and its position. It is now almost completely dark: only weak CRT monitor glow and a restrained emergency red spill from the side, deep shadows, blue window light nearly gone. Cinematic photorealism, no humans, no added text or watermark.",
    "hallway.png": "Fixed high ceiling-mounted CCTV view looking straight down a long grimy Soviet apartment hotel corridor. Repeating worn doors on both sides, stained walls, old patterned floor, fluorescent ceiling fixtures with a slightly uneven sickly glow but no visible rapid flashing. Monochrome green-gray CCTV palette, subtle analog noise and lens distortion, completely empty, no people, no readable text, no watermark. Wide 16:9 composition.",
    "hallway_figure.png": "Edit this reference while preserving the exact same corridor, fixed ceiling CCTV viewpoint, lighting, doors and image palette. Add exactly one motionless pale gaunt human figure standing very far away at the end of the corridor, small in the frame, facing the camera. Subtle restrained horror, not a closeup, no gore, no extra people, no text or watermark.",
    "elevator.png": "Fixed ceiling-mounted CCTV view of a worn old Soviet elevator interior, dented metal walls and stained floor, doors partly open onto absolute darkness outside. Completely empty, no people. Monochrome green-gray analog surveillance image, subtle noise, realistic wide-angle lens, restrained uncanny horror, no readable text, no watermark. Wide 16:9 composition.",
    "stairwell.png": "Fixed high corner ceiling CCTV view looking down a derelict concrete Soviet stairwell, multiple flights descending into shadow, chipped paint, grimy walls, old metal railings, uncanny oppressive geometry but completely empty, no people. Monochrome green-gray analog surveillance image, subtle noise, no readable text, no watermark. Wide 16:9 composition.",
    "elevator_figure.png": "Edit this reference into the exact same fixed CCTV elevator interior, preserving the camera, doors, walls, lighting and analog image palette. Add exactly one pale gaunt motionless human standing just inside the open dark doorway, facing the camera at medium distance. Realistic restrained horror, no gore, no extra people, no text or watermark.",
    "stairwell_figure.png": "Edit this reference into the exact same fixed CCTV stairwell, preserving the camera, stairs, railings, lighting and analog image palette. Add the same pale gaunt human figure standing motionless on the closest visible landing, facing up toward the camera, clearly visible but not a closeup. Realistic restrained horror, no gore, no extra people, no text or watermark.",
    "door.png": "Eye-level cinematic view of an office security door with textured frosted glass in a 1990s Russian municipal building. One dark human silhouette stands motionless directly behind the frosted glass, indistinct facial features, restrained and realistic. Weak lamp light from inside, blue night spill, grime and worn frame, subtle dread, no gore, no readable text, no watermark. Wide 16:9 composition.",
    "entity.png": "Close-up photorealistic portrait of a pale emaciated middle-aged human face, nearly black eyes, subtly open mouth, head slightly tilted, centered and looking directly into camera. Darkness background, low-key cinematic horror lighting, realistic skin texture, deeply unsettling but no gore, no wounds, no blood, no text, no watermark. Wide 16:9 composition with face centered.",
    "fusebox.png": "Eye-level closeup of an open grimy 1990s Soviet electrical breaker cabinet in the same municipal security office. Four large chunky black toggle breakers in a horizontal row, aged painted metal, paper instructions taped inside the open door with only simple unreadable marks. Weak emergency red light plus CRT monitor spill, photorealistic, no people, no gore, no readable text. Leave the central panel area clear for HTML labels. Wide 16:9 composition.",
    "fusebox_on.png": "Edit this reference with the exact same cabinet, fixed camera and object positions. All four chunky breaker switches are now down in the on position. Weak greenish monitor light is restored, emergency red spill greatly reduced. Photorealistic, no people, no added text or watermark.",
    "underdesk.png": "Using the office reference for the same room and materials, move the camera to a first-person view crouching beneath the heavy wooden security desk. Knees and desk edges frame the cramped foreground, looking across the floor toward the frosted office door. Very dark but enough floor and door visible, claustrophobic cinematic photorealism, no people, no gore, no text. Wide 16:9 composition.",
    "underdesk_legs.png": "Edit this reference with the exact same crouched camera, desk framing, floor, door and darkness. Add only the pale gaunt man's dark-trousered legs and dull shoes standing terrifyingly close just beyond the desk, upper body cropped out by the desk, motionless. Realistic restrained horror, no gore, no extra people, no text.",
    "office_morning.png": "Edit this reference into the exact same office and identical camera angle, preserving all furniture and objects. Cold pale sunrise enters through the window, all CRT monitors are dark, quiet empty room, natural realistic morning light, no people, no added text or watermark.",
    "shadow.png": "Full-body tall gaunt human silhouette, front-facing, completely solid near-black, centered on a perfectly flat pure white background. Entire body visible from head to feet with generous white margins, no floor, no scenery, no text, no watermark. Clean simple cutout source image, wide 16:9 composition.",
}

VOICE_LINES = {
    "voice1.mp3": "Ты новый? Слушай внимательно. До шести утра проверяй камеры. Если увидишь человека — не подходи к нему. И главное… не дай ему понять, что ты его видишь.",
    "voice2.mp3": "Он сменил камеру. Не смотри на него так долго. Вернись в офис. Сейчас же.",
    "voice3.mp3": "Он уже не на камерах. Не оборачивайся.",
    "voice4.mp3": "Костя… я вижу тебя.",
    "voice5.mp3": "Он в лифте. Он поднимается. Проверь лестницу. Быстрее.",
    "voice6.mp3": "Он на лестнице. Он уже здесь. Запиши всё в журнал.",
    "voice7.mp3": "Щиток рядом с дверью. Порядок переключателей на крышке. Не выходи.",
}

SOUND_PROMPTS = {
    "ambience.mp3": "Seamless very quiet old building room tone at night, low electrical hum, faint wind at windows, sparse distant structural creaks, no voices, no music, no sudden sounds, subtle and loopable.",
    "music.mp3": "Seamless restrained dark analog horror drone, low sub-bass, faint detuned tape texture, no melody, no vocals, no sudden sounds, minimal sustained dread, loopable.",
    "knock.mp3": "Exactly three slow heavy knocks on a solid wooden office door, spaced apart, natural empty room reverberation, no voices, no music, no other impacts.",
    "sting.mp3": "One short deep metallic impact followed by a reversed human breath, dark cinematic horror sting, no piercing high frequencies, no music, no scream.",
    "breath.mp3": "Close dry human breathing immediately behind the listener, anxious but restrained, slow tense inhale and exhale, no words, no music, no scream, quiet realistic horror.",
    "static.mp3": "Seamless low analog CCTV hiss and static, soft steady broadband texture, no sudden bursts, no voices, no music, quiet and loopable.",
    "paper.mp3": "Quiet journal page turning and pencil writing on paper, close natural foley, restrained, no voices, no music.",
    "switch.mp3": "One chunky mechanical electrical breaker toggle clunk, solid aged metal mechanism, short realistic foley, no voices, no music.",
    "sparks.mp3": "Brief restrained electrical crackle from an old breaker panel, a few soft sparks, not painfully loud, no explosion, no voices, no music.",
    "elevator.mp3": "Distant old elevator cable rumble and machinery in a shaft, then one muted arrival bell, restrained realistic building sound, no voices, no music.",
    "footsteps.mp3": "Slow heavy footsteps approaching on old wooden floorboards, gradually nearer, then stopping, restrained realistic horror foley, no voices, no music.",
    "morning.mp3": "Seamless quiet cold morning room tone with faint distant birds outside, peaceful and natural, no voices, no music, no sudden sounds, loopable.",
}


def load_env() -> dict[str, str]:
    result = {}
    for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            result[key.strip()] = value.strip()
    return result


ENV = load_env()


def request_json(url: str, key: str, payload: dict | None = None, attempts: int = 5) -> dict:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8") if payload is not None else None
    headers = {"Authorization": "Bearer " + key, "Content-Type": "application/json", "User-Agent": "smena-assets/1.0"}
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
            with urllib.request.urlopen(req, timeout=120) as response:
                body = json.load(response)
            if isinstance(body, dict) and body.get("code") not in (None, 200):
                raise RuntimeError(f"API error {body.get('code')}: {body.get('msg')}")
            return body
        except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
            if attempt == attempts - 1:
                raise
            print(f"Retrying request after transient error: {type(exc).__name__}")
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def download(url: str, destination: Path) -> int:
    destination.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "smena-assets/1.0"}), timeout=120) as response:
                content = response.read()
            if not content:
                raise RuntimeError("Downloaded empty file")
            destination.write_bytes(content)
            return len(content)
        except (urllib.error.URLError, TimeoutError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def comet_usage() -> float:
    key = ENV["COMETAPI_KEY"]
    url = COMET + "/v1/dashboard/billing/usage?start_date=2026-01-01&end_date=2027-12-31"
    try:
        return request_json(url, key)["total_usage"] / 100
    except Exception:
        return request_json(COMET + "/api/usage/token", key)["data"]["total_used"] / 500_000


def kie_credits() -> float:
    return float(request_json(KIE + "/api/v1/chat/credit", ENV["KIE_API_KEY"])["data"])


def read_report() -> dict:
    if REPORT.exists():
        return json.loads(REPORT.read_text(encoding="utf-8"))
    return {"game": "СМЕНА", "images": [], "audio": [], "failures": [], "budgets": {}}


def write_report(report: dict) -> None:
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def generate_image(name: str, prompt: str, reference: Path | None) -> dict:
    parts = [{"text": prompt}]
    if reference:
        parts.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(reference.read_bytes()).decode("ascii")}})
    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "1K"}},
    }
    url = COMET + "/v1beta/models/gemini-nano-banana-2.1:generateContent"
    # This Gemini endpoint uses x-goog-api-key rather than Authorization.
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, data=data, headers={"x-goog-api-key": ENV["COMETAPI_KEY"], "Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=180) as response:
                body = json.load(response)
            break
        except Exception:
            if attempt == 3:
                raise
            print(f"Retrying image response: {name}")
            time.sleep(2 ** attempt)
    image_part = None
    for candidate in body.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            if part.get("inlineData") and not part.get("thought"):
                image_part = part
    if not image_part:
        raise RuntimeError(f"No image returned for {name}: {str(body)[:500]}")
    raw = base64.b64decode(image_part["inlineData"]["data"])
    if not raw:
        raise RuntimeError(f"Empty image returned for {name}")
    destination = IMAGES / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(BytesIO(raw))
    if name == "shadow.png":
        luminance = image.convert("L")
        alpha = luminance.point(lambda value: 0 if value >= 250 else 255 if value <= 225 else round((250 - value) * 255 / 25))
        alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
        processed = Image.new("RGBA", image.size, (3, 3, 5, 255))
        processed.putalpha(alpha)
        processed.save(destination, format="PNG")
    else:
        image.convert("RGB").save(destination, format="PNG")
    return {"file": f"assets/images/{name}", "provider": "CometAPI", "model": "gemini-nano-banana-2.1", "prompt": prompt, "reference": f"assets/images/{reference.name}" if reference else None, "bytes": destination.stat().st_size}


def images() -> None:
    report = read_report()
    before = comet_usage()
    initial = report["budgets"].get("comet_usage_before_images_usd", before)
    report["budgets"]["comet_usage_before_images_usd"] = round(initial, 6)
    write_report(report)
    order = ["office.png", "office_dark.png", "hallway.png", "hallway_figure.png", "elevator.png", "elevator_figure.png", "stairwell.png", "stairwell_figure.png", "door.png", "entity.png", "fusebox.png", "fusebox_on.png", "underdesk.png", "underdesk_legs.png", "office_morning.png", "shadow.png"]
    for name in order:
        destination = IMAGES / name
        if destination.exists() and destination.stat().st_size > 0:
            print(f"Already exists: {name}")
            continue
        reference = None
        if name in ("office_dark.png", "office_morning.png", "fusebox.png", "underdesk.png"):
            reference = IMAGES / "office.png"
        elif name == "hallway_figure.png":
            reference = IMAGES / "hallway.png"
        elif name == "elevator_figure.png":
            reference = IMAGES / "elevator.png"
        elif name == "stairwell_figure.png":
            reference = IMAGES / "stairwell.png"
        elif name == "fusebox_on.png":
            reference = IMAGES / "fusebox.png"
        elif name == "underdesk_legs.png":
            reference = IMAGES / "underdesk.png"
        print(f"Generating image: {name}")
        try:
            item = generate_image(name, IMAGE_PROMPTS[name], reference)
            report["images"] = [x for x in report["images"] if x["file"] != item["file"]] + [item]
            write_report(report)
            print(f"Downloaded {name}: {item['bytes']} bytes")
        except Exception as exc:
            report["failures"].append({"file": f"assets/images/{name}", "error": str(exc)[:1000]})
            write_report(report)
            print(f"FAILED {name}: {exc}")
    after = comet_usage()
    report["budgets"]["comet_usage_after_images_usd"] = round(after, 6)
    previous = report["budgets"].get("comet_images_measured_cost_usd", 0)
    total = previous + max(after - before, 0)
    report["budgets"]["comet_images_measured_cost_usd"] = round(total, 6)
    write_report(report)
    print(f"Comet image batch measured cost: ${max(after-before, 0):.4f}; total: ${total:.4f}")


def validate_kie_schema(model: str) -> None:
    body = request_json(KIE + "/api/v1/models/" + model + "/schema", ENV["KIE_API_KEY"])
    openapi = body.get("data", {}).get("openapi")
    if not openapi or "/api/v1/jobs/createTask" not in openapi.get("paths", {}):
        raise RuntimeError(f"Unexpected or missing task schema for {model}")
    time.sleep(1.1)


def create_audio_task(model: str, inputs: dict) -> str:
    body = request_json(KIE + "/api/v1/jobs/createTask", ENV["KIE_API_KEY"], {"model": model, "input": inputs})
    return body["data"]["taskId"]


def poll_audio_task(task_id: str) -> dict:
    deadline = time.time() + 600
    while time.time() < deadline:
        body = request_json(KIE + "/api/v1/jobs/recordInfo?taskId=" + urllib.parse.quote(task_id), ENV["KIE_API_KEY"])
        data = body["data"]
        state = data.get("state")
        if state == "success":
            return data
        if state == "fail":
            raise RuntimeError(f"KIE task failed: {data.get('failCode')} {data.get('failMsg')}")
        time.sleep(4)
    raise RuntimeError("KIE task timed out after 10 minutes")


def audio_urls(data: dict) -> list[str]:
    response = data.get("response") or {}
    if response.get("resultUrls"):
        return response["resultUrls"]
    if response.get("data"):
        return [x["audio_url"] for x in response["data"] if x.get("audio_url")]
    if data.get("resultJson"):
        parsed = json.loads(data["resultJson"])
        if parsed.get("resultUrls"):
            return parsed["resultUrls"]
        if parsed.get("data"):
            return [x["audio_url"] for x in parsed["data"] if x.get("audio_url")]
    raise RuntimeError("Successful KIE task contained no audio URLs")


def normalize_audio(source: Path, destination: Path, name: str) -> None:
    target = {"ambience.mp3": 25, "music.mp3": 30, "breath.mp3": 10, "knock.mp3": 6, "sting.mp3": 4, "static.mp3": 25, "paper.mp3": 6, "switch.mp3": 3, "sparks.mp3": 4, "elevator.mp3": 8, "footsteps.mp3": 10, "morning.mp3": 25}.get(name)
    loudness = "-20" if name in ("ambience.mp3", "music.mp3", "static.mp3", "morning.mp3") else "-18"
    filters = []
    if name.startswith("voice") and name != "voice4.mp3":
        filters.append("highpass=f=300,lowpass=f=3400,acompressor=threshold=-18dB:ratio=3:attack=10:release=100")
    filters.append(f"loudnorm=I={loudness}:LRA=7:TP=-2")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
    if target:
        cmd += ["-stream_loop", "-1"]
    cmd += ["-i", str(source)]
    if target:
        cmd += ["-t", str(target)]
    cmd += ["-af", ",".join(filters), "-codec:a", "libmp3lame", "-b:a", "192k", str(destination)]
    subprocess.run(cmd, check=True)


def audio() -> None:
    report = read_report()
    start_credits = kie_credits()
    initial_credits = report["budgets"].get("kie_credits_before_audio", start_credits)
    report["budgets"]["kie_credits_before_audio"] = initial_credits
    write_report(report)
    print(f"KIE credits before audio: {start_credits}")
    models = {
        "voice": "google/gemini-3-8-flash-lite-tts",
        "sound": "ai-music-api/sounds",
    }
    for model in models.values():
        validate_kie_schema(model)

    jobs = []
    for name, text in VOICE_LINES.items():
        style = "Russian female night dispatcher speaking naturally in a tense quiet whisper, slow and controlled." if name == "voice1.mp3" else "Same Russian female dispatcher, now more frightened and urgent, quiet whisper, natural breath." if name == "voice2.mp3" else "Same Russian female dispatcher, broken fearful whisper, very quiet, faltering breath."
        voice_name = "Kore"
        if name == "voice4.mp3":
            style = "Deep male Russian voice, intimate slow whisper directly near the listener, restrained dread, dry and close, not a shout."
            voice_name = "Charon"
        elif name == "voice5.mp3":
            style = "Same Russian female dispatcher, frightened urgent whisper, escalating pace, breathless but intelligible, not a shout."
        elif name == "voice6.mp3":
            style = "Same Russian female dispatcher, broken frightened whisper, faltering breath, extremely tense, not a shout."
        elif name == "voice7.mp3":
            style = "Same Russian female dispatcher, frightened but clear whisper, urgent precise instructions, natural restrained breath, not a shout."
        inputs = {"temperature": 0.7, "speakers": [{"speaker_id": "Speaker 1", "voice_name": voice_name}], "dialogue_turns": [{"speaker_id": "Speaker 1", "text": text, "style": style}]}
        jobs.append((name, "voice", inputs, text))
    for name in SOUND_PROMPTS:
        jobs.append((name, "sound", {"prompt": SOUND_PROMPTS[name], "model": "V6", "sound_loop": name in ("ambience.mp3", "music.mp3", "static.mp3", "morning.mp3")}, SOUND_PROMPTS[name]))

    for name, kind, inputs, prompt in jobs:
        destination = AUDIO / name
        if destination.exists() and destination.stat().st_size > 0:
            print(f"Already exists: {name}")
            continue
        remaining = AUDIO_CREDIT_CAP - report["budgets"].get("kie_task_credits_consumed", 0)
        # Optional assets are only attempted with enough headroom for their typical cost.
        needed = 60 if name == "music.mp3" else 30 if name == "breath.mp3" else 0
        if remaining < needed:
            print(f"Skipping optional {name}: insufficient budget headroom")
            continue
        print(f"Generating audio: {name}")
        raw_path = AUDIO / ("." + name + ".source")
        try:
            task_id = create_audio_task(models[kind], inputs)
            data = poll_audio_task(task_id)
            urls = audio_urls(data)
            size = download(urls[0], raw_path)
            normalize_audio(raw_path, destination, name)
            raw_path.unlink(missing_ok=True)
            consumed = float(data.get("creditsConsumed") or 0)
            report["budgets"]["kie_task_credits_consumed"] = report["budgets"].get("kie_task_credits_consumed", 0) + consumed
            item = {"file": f"assets/audio/{name}", "provider": "kie.ai", "model": models[kind], "task_id": task_id, "prompt": prompt, "input": inputs, "credits_consumed": consumed, "measured_cost_usd": round(consumed * USD_PER_CREDIT, 6), "source_download_bytes": size, "bytes": destination.stat().st_size}
            report["audio"] = [x for x in report["audio"] if x["file"] != item["file"]] + [item]
            write_report(report)
            print(f"Saved {name}: {consumed} credits")
        except Exception as exc:
            raw_path.unlink(missing_ok=True)
            report["failures"].append({"file": f"assets/audio/{name}", "error": str(exc)[:1000]})
            write_report(report)
            print(f"FAILED {name}: {exc}")
    end_credits = kie_credits()
    report["budgets"]["kie_credits_after_audio"] = end_credits
    report["budgets"]["kie_audio_balance_delta_credits"] = round(initial_credits - end_credits, 6)
    report["budgets"]["kie_audio_balance_delta_usd"] = round((initial_credits - end_credits) * USD_PER_CREDIT, 6)
    write_report(report)
    print(f"KIE credits after audio: {end_credits}; batch used: {start_credits-end_credits}; total used: {initial_credits-end_credits}")


def verify() -> None:
    report = read_report()
    expected_images = list(IMAGE_PROMPTS)
    expected_audio = list(VOICE_LINES) + list(SOUND_PROMPTS)
    optional = []
    for name in expected_images:
        path = IMAGES / name
        if not path.exists() or path.stat().st_size == 0:
            raise RuntimeError(f"Missing or empty: {path}")
        header = path.read_bytes()[:24]
        if header[:8] != b"\x89PNG\r\n\x1a\n":
            raise RuntimeError(f"Not PNG encoded: {path}")
        dimensions = [int.from_bytes(header[16:20], "big"), int.from_bytes(header[20:24], "big")]
        metadata = {"bytes": path.stat().st_size, "dimensions": dimensions, "format": "png"}
        if name == "shadow.png":
            with Image.open(path) as cutout:
                if cutout.mode != "RGBA":
                    raise RuntimeError("shadow.png must be RGBA")
                alpha = cutout.getchannel("A")
                extrema = alpha.getextrema()
                corners = [alpha.getpixel(point) for point in ((0, 0), (dimensions[0]-1, 0), (0, dimensions[1]-1), (dimensions[0]-1, dimensions[1]-1))]
                if extrema != (0, 255) or any(corners):
                    raise RuntimeError(f"Invalid shadow transparency: extrema={extrema}, corners={corners}")
                metadata.update({"color_mode": "RGBA", "transparent_background": True, "alpha_extrema": list(extrema), "transparent_corners": True})
        for item in report["images"]:
            if item["file"] == f"assets/images/{name}":
                item.update(metadata)
        print(f"{name}: {path.stat().st_size} bytes, {dimensions[0]}x{dimensions[1]}")
    for name in expected_audio + optional:
        path = AUDIO / name
        if not path.exists() or path.stat().st_size == 0:
            raise RuntimeError(f"Missing or empty: {path}")
        result = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)], check=True, capture_output=True, text=True)
        duration = round(float(result.stdout.strip()), 3)
        for item in report["audio"]:
            if item["file"] == f"assets/audio/{name}":
                item.update({"bytes": path.stat().st_size, "duration_seconds": duration, "format": "mp3"})
        print(f"{name}: {path.stat().st_size} bytes, {duration:.2f}s")
    for failure in report["failures"]:
        if failure.get("file") and (ROOT / failure["file"]).exists():
            failure["resolved"] = True
    report["verification"] = {"required_images": len(expected_images), "required_audio": len(expected_audio), "optional_audio": optional, "all_required_files_nonzero": True}
    report["budgets"]["comet_image_cap_usd"] = 2.0
    report["budgets"]["kie_audio_cap_usd"] = 1.0
    write_report(report)
    print("All required assets exist, are nonzero, and have valid formats.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("phase", choices=["images", "audio", "verify", "all"])
    args = parser.parse_args()
    if args.phase in ("images", "all"):
        images()
    if args.phase in ("audio", "all"):
        audio()
    if args.phase in ("verify", "all"):
        verify()


if __name__ == "__main__":
    main()
