# Night Shift at Pumpkin Pete's

Create a polished, genuinely tense **survival horror game in the style of Five Nights at Freddy's**.

The player is a night security guard at **Pumpkin Pete's**, an abandoned Halloween-themed family pizzeria. The guard sits in a small office and must survive one night, from 12 AM to 6 AM, while the restaurant's animatronic mascots slowly move through the building toward the office.

The core fantasy is:

**you can only watch them through cameras, your power is running out, and you never know where they are right now.**

## Budget and time: $25 and 3 hours, the same for every model

You have **$25** on CometAPI for this game and **3 hours**, and every model in this test gets exactly the same. The money pays for everything: your own work in this session (every request you make is billed to the same key) and every asset you generate. Run `python budget.py` to see the money and time spent and left, and run it before every big step.

Both limits are hard. When the money runs out, every call stops, including your own; when the time runs out, the session is stopped. Whatever is in the folder at that moment is the final game, and **an unfinished game loses**: a smaller game that works from start to finish always beats a bigger one that breaks. So plan for it:

- Before you start, estimate what your plan will cost and cut it to fit.
- By half of the money or the time (whichever comes first), the game must already be playable from start to finish, with an ending, even if rough. Only then make it better.
- At 80%, stop adding features: only fixes, polish and the final check.
- Keep the last 10% for a final playthrough and for `HOW_TO_RUN.md` and `ASSET_MANIFEST.md`.
- If you see you will not make it, cut features instead of leaving something half-done, and never leave the game broken between steps.

Unspent money is not a bonus: within these rules, use the budget to make the best game you can.

## Gameplay

- A security office with a left door and a right door. Doors and door lights drain power while used; the camera tablet also drains power. When power runs out, the office goes dark and the player is in serious trouble.
- A camera system with at least 6 cameras covering different rooms of the pizzeria, with a map to switch between them. Each room must look different, and the player must be able to see which animatronics are in the room right now.
- At least 3 original Halloween animatronics (no characters from Five Nights at Freddy's itself) with **different movement patterns and behaviors**, so the player has to learn and react to each one. Design them yourself.
- The night lasts about 4–5 real minutes, with a visible in-game clock. Difficulty grows toward 6 AM.
- A jumpscare with sound when an animatronic gets into the office, a game over screen, a "6 AM" win screen and instant restart.
- Tension through sound: ambience, footsteps, distant noises, camera static.

## Assets and engine

- It must look and sound like a professional indie horror game, not a programmer prototype. Create real assets: images (office, camera views, animatronics, jumpscares, UI), sound effects, music and, if you want, voice lines — generate them through the CometAPI API described in `COMET_API.md` in this folder. Spend on assets as you see fit, within the budget.
- Keep the animatronics and rooms consistent across all images (use image-to-image with references) and keep one art direction for the whole game.
- You may also use free assets whose license allows use in a published YouTube video.
- The engine is your choice: browser (Three.js, Babylon.js, PixiJS, Phaser or anything else) or Godot 4.7 (installed: `godot` runs the editor or the game, `godot_console` is the same binary with terminal output).
- All assets are stored locally in the project. The finished game must run offline and never call CometAPI or any other API.
- Create `ASSET_MANIFEST.md`: every asset, how it was made (model + prompt, or source + license), and what the assets cost.
- Create `HOW_TO_RUN.md` with one command to start the game.
- No rapid full-screen strobe flashing.

Visual style, art direction, AI behavior, balancing and all technical decisions are yours.

Do not ask questions. Build it, run it, play it yourself, and fix anything that breaks before finishing.
