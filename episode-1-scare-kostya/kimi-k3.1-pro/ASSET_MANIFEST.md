# Asset manifest — СМЕНА

All shipped media is local. The game does not contact any generation service or external host. Full generation prompts, task IDs, technical details, retries and measured balances are preserved in `assets/generation_report.json`; the reproducible development generator is `tools/generate_assets.py`.

## Images

All images were generated for this project through **CometAPI**, model `gemini-nano-banana-2.1`, at 1376×768 (16:9). Reference-image editing was used to keep related compositions consistent.

| Local file | Source / treatment |
|---|---|
| `assets/images/office.png` | Text-to-image; 1990s municipal security office. |
| `assets/images/office_dark.png` | Reference edit of `office.png`; low-light treatment. |
| `assets/images/hallway.png` | Text-to-image; analog CCTV corridor. |
| `assets/images/hallway_figure.png` | Reference edit of `hallway.png`; character variation. |
| `assets/images/elevator.png` | Text-to-image; analog CCTV elevator. |
| `assets/images/elevator_figure.png` | Reference edit of `elevator.png`; character variation. |
| `assets/images/stairwell.png` | Text-to-image; analog CCTV stairwell. |
| `assets/images/stairwell_figure.png` | Reference edit of `stairwell.png`; character variation. |
| `assets/images/door.png` | Text-to-image; security-door scene. |
| `assets/images/entity.png` | Text-to-image; photorealistic character portrait. |
| `assets/images/fusebox.png` | Text-to-image; detailed electrical cabinet. |
| `assets/images/fusebox_on.png` | Reference edit of `fusebox.png`; powered state. |
| `assets/images/underdesk.png` | Office-referenced first-person environment. |
| `assets/images/underdesk_legs.png` | Reference edit of `underdesk.png`; character variation. |
| `assets/images/office_morning.png` | Reference edit of `office.png`; morning lighting. |
| `assets/images/shadow.png` | Text-to-image cutout, converted locally with Pillow to transparent RGBA. |

**Measured CometAPI image cost:** **$0.839062** total. This consists of $0.53846 for the first eight-image batch, $0.172934 for the second two-image batch and $0.127686 for the final six-image batch, including generation retries. No stock images or third-party image assets were used.

## Audio

Audio was generated for this project through **kie.ai**, downloaded immediately, converted to browser-compatible MP3 and processed locally with FFmpeg. Voices are Russian. Dispatcher voices received telephone-band filtering; the remaining voice is dry. Music and ambience are loop-safe.

| Local file | Model / content | Measured cost |
|---|---|---:|
| `assets/audio/ambience.mp3` | `ai-music-api/sounds`; 24.99 s room-tone loop | $0.01250 |
| `assets/audio/music.mp3` | `ai-music-api/sounds`; 29.99 s dark analog drone | see batch below |
| `assets/audio/knock.mp3` | `ai-music-api/sounds`; 6.00 s wooden-door effect | $0.01250 |
| `assets/audio/sting.mp3` | `ai-music-api/sounds`; 3.99 s cinematic effect | $0.01250 |
| `assets/audio/breath.mp3` | `ai-music-api/sounds`; 9.99 s close breathing | see batch below |
| `assets/audio/voice1.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 14.36 s | $0.00150 |
| `assets/audio/voice2.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 6.24 s | $0.00065 |
| `assets/audio/voice3.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 3.72 s | $0.00040 |
| `assets/audio/voice4.mp3` | `google/gemini-3-8-flash-lite-tts`, Charon; 3.40 s | see batch below |
| `assets/audio/voice5.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 4.12 s | see batch below |
| `assets/audio/voice6.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 5.44 s | see batch below |
| `assets/audio/voice7.mp3` | `google/gemini-3-8-flash-lite-tts`, Kore; 5.68 s | $0.00060 |
| `assets/audio/static.mp3` | `ai-music-api/sounds`; 24.99 s analog hiss loop | $0.01250 |
| `assets/audio/paper.mp3` | `ai-music-api/sounds`; 5.99 s paper foley | $0.01250 |
| `assets/audio/switch.mp3` | `ai-music-api/sounds`; 3.00 s mechanical foley | $0.01250 |
| `assets/audio/sparks.mp3` | `ai-music-api/sounds`; 4.00 s electrical foley | $0.01250 |
| `assets/audio/elevator.mp3` | `ai-music-api/sounds`; 8.00 s machinery foley | $0.01250 |
| `assets/audio/footsteps.mp3` | `ai-music-api/sounds`; 10.00 s footsteps foley | $0.01250 |
| `assets/audio/morning.mp3` | `ai-music-api/sounds`; 24.99 s morning room-tone loop | $0.01250 |

The `music.mp3` + `breath.mp3` + `voice4.mp3` batch cost **$0.02535**. The `voice5.mp3` + `voice6.mp3` batch cost **$0.00105**.

**Total measured kie.ai audio spend:** **$0.27455**, including $0.12000 consumed by unsuccessful/timed-out generation attempts and all delivered audio above. The final eight-audio batch added **$0.08810**. This remained below the separate $1 audio cap. No stock audio or third-party recordings were used.

## Procedural assets

These were made locally in code at no asset-generation cost:

- Film grain: Canvas noise, rendered at low opacity without full-screen flashing.
- Telephone bell: two quiet Web Audio oscillators with a short envelope and stereo placement.
- Favicon: inline SVG.
- Interface, journal, scan lines, vignette and transitions: HTML/CSS/Canvas.

## Totals

- **Generated images:** 16 files; $0.839062 (CometAPI budget).
- **Generated audio, including failed attempts:** 19 files; $0.27455 (separate kie.ai audio budget).
- **Combined measured asset spend:** **$1.113612**.
- External/free asset libraries used: **none**.
