# How to Run — ПРОТОКОЛ: НЕ СМОТРИ (PROTOCOL: DO NOT LOOK)

## Start the Game (One Command)

Run the following command in this directory:

```bash
python start_game.py
```

This starts a local multi-threaded HTTP server (`http://127.0.0.1:8765/index.html`) and automatically opens the game in your default browser.

## Recommended Setup & Controls

- **Headphones**: Strongly recommended (uses real-time HRTF 3D spatial audio).
- **Webcam & Microphone**: Optional calibration on the start screen. All processing stays 100% local in browser memory; the game works fully whether permissions are granted or denied.
- **Language**: Toggle between **RU** (Russian) and **EN** (English) in the top-right corner of the start screen.

### Controls
- **`W A S D` / Arrow Keys** — Walk
- **`Mouse`** — Look around / Aim scanner loupe
- **`E`** — Interact with objects, doors, intercom, peephole, and terminal
- **`Q`** — Open/close the classified subject dossier & reel-to-reel audio log (while in the Study)
- **`F`** — Toggle flashlight
- **`Left Mouse Button` / `Space`** — Fire camera flash (once camera is acquired) / Confirm anomaly tag in terminal
- **`R` / `Right Mouse Button`** — Toggle between `03:00 AM` reference baseline and `03:14 AM` live feed inside the surveillance terminal
