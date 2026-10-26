# Scare Kostya

Your only goal: **make the scariest game you can.**

Kostya is a YouTuber who tests AI models. He will play your game once, live on camera, without knowing anything about it in advance. His face will be on screen. Several AI models get this exact task, and the one that scares him the most wins. Viewers will see his real reaction.

What "scary" means, which genre, story, mechanics, visuals and pacing to use is entirely your decision. Think like a horror game director: build atmosphere and dread, escalate tension, and land the scares where he does not expect them. Cheap random jumpscares every few seconds are not scary; earned ones are.

## Budget and time: $25 and 3 hours, the same for every model

You have **$25** on CometAPI for this game and **3 hours**, and every model in this test gets exactly the same. The money pays for everything: your own work in this session (every request you make is billed to the same key) and every asset you generate. Run `python budget.py` to see the money and time spent and left, and run it before every big step.

Both limits are hard. When the money runs out, every call stops, including your own; when the time runs out, the session is stopped. Whatever is in the folder at that moment is the final game, and **an unfinished game loses**: a smaller game that works from start to finish always beats a bigger one that breaks. So plan for it:

- Before you start, estimate what your plan will cost and cut it to fit.
- By half of the money or the time (whichever comes first), the game must already be playable from start to finish, with an ending, even if rough. Only then make it better.
- At 80%, stop adding features: only fixes, polish and the final check.
- Keep the last 10% for a final playthrough and for `HOW_TO_RUN.md` and `ASSET_MANIFEST.md`.
- If you see you will not make it, cut features instead of leaving something half-done, and never leave the game broken between steps.

Unspent money is not a bonus: within these rules, use the budget to make the best game you can.

## Requirements

- The game must be playable from start to finish in about 3–6 minutes and have a clear ending.
- It must look and sound like a professional horror game, not a prototype. Create real assets: images, textures, characters, sound effects, music, voices — generate them through the CometAPI API described in `COMET_API.md` in this folder. Spend on assets as you see fit, within the budget. Sound matters: he will play with headphones. You may also use free assets whose license allows use in a published YouTube video.
- The engine is your choice: browser or Godot 4.7 (installed: `godot` runs the editor or the game, `godot_console` is the same binary with terminal output).
- You may use system features (fullscreen, webcam, microphone, the window title, the cursor, anything else) if it makes the game scarier — but the game must still fully work if he denies any permission. Do not send any data anywhere; everything stays on his computer.
- All assets are stored locally in the project. The finished game must run offline and never call CometAPI or any other API.
- Create `ASSET_MANIFEST.md` (every asset, how it was made, what the assets cost) and `HOW_TO_RUN.md` with one command to start the game. Do not describe the scares in these files.
- No rapid full-screen strobe flashing.

Do not ask questions. Build it, run it, play it yourself, and fix anything that breaks before finishing. Do not describe the scares in your final message — just say how to start the game, so the surprise is not spoiled.
