# Asset Manifest — ПРОТОКОЛ: НЕ СМОТРИ (PROTOCOL: DO NOT LOOK)

All assets are stored locally inside `game/assets/` and `game/lib/`. The game runs 100% offline with zero external CDN links or API calls at runtime.

---

## 1. Visual Assets (`game/assets/images/` — Generated via CometAPI `gemini-3.1-flash-image-preview`)

| File | Resolution / Aspect | Method / Model | Description |
|---|---|---|---|
| `title_bg.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Atmospheric study desk & rain-streaked window background for the title screen |
| `dossier_scan.png` | 2K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | High-resolution classified dossier folder (`ЛИЧНОЕ ДЕЛО №404: КОСТЯ`) |
| `poster_anatomy.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Vintage Soviet acoustic & neurological chart on the study wall |
| `tex_wallpaper.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Seamless tileable aged apartment wallpaper texture + bump map |
| `tex_wood_floor.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Seamless tileable worn dark parquet wooden floor texture + bump map |
| `tex_bathroom_tile.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Seamless tileable grimy ceramic bathroom tile texture + bump map |
| `tex_ceiling.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Seamless cracked plaster ceiling texture + bump map |
| `tex_rug.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Worn Soviet-era hallway runner rug texture |
| `tex_door_heavy.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Padded leatherette apartment front door texture |
| `painting_normal.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Vintage oil portrait #1 in ornate frame (state A) |
| `painting_cursed.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Vintage oil portrait #1 in ornate frame (state B) |
| `painting_2_normal.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Vintage oil portrait #2 in ornate frame (state A) |
| `painting_2_cursed.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` | Vintage oil portrait #2 in ornate frame (state B) |
| `peephole_corridor.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Fisheye lens view of the outer stairwell landing (state A) |
| `peephole_entity.png` | 1K (1:1) | CometAPI `gemini-3.1-flash-image-preview` | Fisheye lens view of the outer stairwell landing (state B) |
| `mirror_scare_bathroom.png` | 1K (4:3) | CometAPI `gemini-3.1-flash-image-preview` | Bathroom mirror reflection frame |
| `cctv_1_clean.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 01 baseline (`03:00 AM`) |
| `cctv_room_1.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 01 live (`03:14 AM`) |
| `cctv_2_clean.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 02 baseline (`03:00 AM`) |
| `cctv_room_2.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 02 live (`03:14 AM`) |
| `cctv_4_clean.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 03 baseline (`03:00 AM`) |
| `cctv_4_anomaly.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 03 live (`03:14 AM`) |
| `cctv_5_clean.png` | 2K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 04 baseline (`03:00 AM`) |
| `cctv_5_anomaly.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 04 live (`03:14 AM`) |
| `cctv_3_clean.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 05 baseline (`03:00 AM`) |
| `cctv_room_3.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Surveillance feed 05 live (`03:14 AM`) |
| `entity_standing_raw.png` / `entity_standing.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` + alpha chroma-key | 3D billboard sprite pose A (transparent PNG cutout) |
| `entity_closer_raw.png` / `entity_closer.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` + alpha chroma-key | 3D billboard sprite pose B (transparent PNG cutout) |
| `entity_peeking_raw.png` / `entity_peeking.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` + alpha chroma-key | 3D billboard sprite pose C (transparent PNG cutout) |
| `entity_crawling_raw.png` / `entity_crawling.png` | 1K (3:4) | CometAPI `gemini-3.1-flash-image-preview` + alpha chroma-key | 3D billboard sprite pose D (transparent PNG cutout) |
| `entity_jumpscare.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Close-up sequence frame A |
| `entity_jumpscare_2k.png` | 2K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Ultra-sharp 2K close-up sequence frame A |
| `entity_jumpscare_2.png` | 1K (16:9) | CometAPI `gemini-3.1-flash-image-preview` | Close-up sequence frame B |

---

## 2. Voice Assets (`game/assets/audio/` — Generated via CometAPI `gpt-4o-mini-tts`, RU & EN)

| File | Voice / Model | Description |
|---|---|---|
| `vo_intro.mp3` / `vo_intro_en.mp3` | CometAPI `gpt-4o-mini-tts` (`onyx`) | Session initialization briefing |
| `vo_cam5_bath.mp3` / `vo_cam5_bath_en.mp3` | CometAPI `gpt-4o-mini-tts` (`onyx`) | Automated camera 04 telemetry voice line |
| `vo_tape_log.mp3` / `vo_tape_log_en.mp3` | CometAPI `gpt-4o-mini-tts` (`echo`) | Reel-to-reel magnetic tape recording #03 |
| `vo_error_door.mp3` / `vo_error_door_en.mp3` | CometAPI `gpt-4o-mini-tts` (`onyx`) | Emergency intercom alert |
| `vo_phone_call.mp3` / `vo_phone_call_en.mp3` | CometAPI `gpt-4o-mini-tts` (`echo`) | Hallway wall intercom voice message |
| `vo_closet_scare.mp3` / `vo_closet_scare_en.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Hallway closet spatial voice line |
| `vo_whisper_outside.mp3` / `vo_whisper_outside_en.mp3` | CometAPI `gpt-4o-mini-tts` (`coral` / `shimmer`) | Spatial voice line 01 |
| `vo_whisper_mirror.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Spatial voice line 02 |
| `vo_whisper_dark.mp3` | CometAPI `gpt-4o-mini-tts` (`coral`) | Spatial voice line 03 |
| `vo_breaker_whisper.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Spatial voice line 04 (alcove) |
| `vo_whisper_behind.mp3` / `vo_whisper_behind_en.mp3` | CometAPI `gpt-4o-mini-tts` (`coral` / `shimmer`) | Spatial voice line 05 (left ear) |
| `vo_whisper_neck.mp3` / `vo_whisper_neck_en.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Spatial voice line 06 (close proximity) |
| `vo_whisper_ear.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Spatial voice line 07 (right ear) |
| `vo_whisper_climax.mp3` | CometAPI `gpt-4o-mini-tts` (`shimmer`) | Spatial voice line 08 |
| `vo_outro.mp3` / `vo_outro_en.mp3` | CometAPI `gpt-4o-mini-tts` (`onyx`) | Epilogue evaluation summary voice line |

---

## 3. Sound Effects & Music (`game/assets/audio/` — Generated via kie.ai + Web Audio Synthesis)

| File | Model / Source | Description |
|---|---|---|
| `bgm_dread.mp3` | kie.ai music model, instrumental | Dark ambient drone & detuned music box score |
| `bgm_chase.mp3` | kie.ai music model, instrumental | High-tension industrial pulse & sub-bass score |
| `sfx_door_knock.mp3` | kie.ai Sound Effect | Heavy apartment door knocking |
| `sfx_door_slam.mp3` | kie.ai Sound Effect | Heavy interior door slam |
| `sfx_footsteps_wet.mp3` | kie.ai Sound Effect | Slow footsteps on wooden floorboards |
| `sfx_jumpscare_shriek.mp3` | kie.ai Sound Effect | High-intensity acoustic stinger |
| `sfx_mirror_sting.mp3` | kie.ai Sound Effect | Bowed contrabass dissonance stinger |
| `sfx_power_down.mp3` | kie.ai Sound Effect | Breaker trip and electrical power shutdown |
| `sfx_breathing_behind.mp3` | kie.ai Sound Effect | Close-proximity spatial breathing loop |
| `sfx_phone_ring.mp3` | kie.ai Sound Effect | Vintage Soviet rotary intercom bell ring |
| `sfx_closet_creak.mp3` | kie.ai Sound Effect | Wooden closet door creak |
| `sfx_camera_shutter.mp3` | kie.ai Sound Effect | Polaroid mechanical shutter clack & flash discharge |
| `sfx_alarm_pulse.mp3` | kie.ai Sound Effect | Low-frequency emergency buzzer |
| `sfx_tape_stop.mp3` | kie.ai Sound Effect | Analog reel-to-reel tape stop clunk |
| Procedural Web Audio (`game/audio.js`) | Custom Web Audio API Synthesizer + HRTF Panner | Dynamic heartbeat, 60Hz fluorescent hum, 3D window rain loop, rotary bell fallback, capacitor whine, water drips, and floorboard creaks |

---

## 4. Third-Party Libraries (`game/lib/`)

| File | License | Source |
|---|---|---|
| `game/lib/three.min.js` | MIT License (free for commercial & YouTube use) | Three.js r160 (`npm pack three@0.160.0`) |

---

## 5. Total Asset Generation Cost Summary

- **CometAPI Assets (33 Nano Banana 2.1 images including 2K high-resolution assets + 25 acted RU/EN TTS voice files)**: **$6.58 USD** (out of $25.00 budget)
- **kie.ai Audio Assets (2 music tracks + 12 sound effects)**: **54.00 credits (~$0.27 USD)** (out of 200-credit / $1.00 limit; `409.42 -> 355.42` credits)
- **Total Asset Cost**: **~$6.85 USD**

