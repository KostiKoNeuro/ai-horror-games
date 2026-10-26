# ASSET MANIFEST — «Сорок дней»

All assets were generated for this game during development and are stored locally in `game/assets/`.
The game never calls any API at runtime.

## Images — CometAPI, Nano Banana 2.1 (`gemini-nano-banana-2.1`)

All images are photorealistic text-to-image generations. Some are edits of an earlier image (the earlier image was sent as a reference so the room stays the same). Files are in `game/assets/img/`, resized to a 1600 px long edge and converted to JPEG. Green-screen images were keyed to transparency in Python (Pillow + NumPy).

| File | Size | How it was made |
|---|---|---|
| ext_building.jpg | 2K | text-to-image: Soviet panel building at night |
| stair_door.jpg | 2K | text-to-image: dark stairwell landing, padded front door |
| hall.jpg | 2K | text-to-image: apartment hallway, covered mirror |
| hall_open.jpg | 2K | edit of `hall` |
| living.jpg | 2K | text-to-image: living room, sideboard, memorial table |
| living_feet.jpg | 2K | edit of `living` |
| kitchen.jpg | 2K | text-to-image: Soviet kitchen |
| bedroom.jpg | 2K | text-to-image: old bedroom with wardrobe |
| wardrobe_view.jpg | 2K | text-to-image: view from inside a wardrobe |
| wardrobe_gran.jpg | 2K | edit of `wardrobe_view` |
| wardrobe_face.jpg | 2K | edit of `wardrobe_view` |
| mirror_frame.png | 2K | text-to-image on a green screen, glass keyed to transparency |
| end_frame.png | 2K | text-to-image on a green screen, photo area keyed to transparency |
| peephole_gran.jpg | 1K | text-to-image: fisheye peephole view |
| peephole_empty.jpg | 1K | edit of `peephole_gran` |
| portrait.jpg | 1K | text-to-image: memorial portrait |
| portrait_dead.jpg | 1K | edit of `portrait` |
| gran_cutout.png | 1K | text-to-image on a green screen, keyed to transparency |
| jumpscare_face.jpg | 1K | text-to-image |
| docs_box.jpg | 1K | text-to-image: wooden box with documents |
| paper.jpg | 1K | text-to-image: blank notebook page (generated, not used in the final flow) |

21 images in total (13 at 2K, 8 at 1K).

## Voice — CometAPI, ElevenLabs (`eleven_v3`, preset voices)

Russian voice lines. Silence was trimmed with ffmpeg. They play through a WebAudio filter in the game (phone or behind-the-door muffling).

| File | Voice preset |
|---|---|
| v_aunt.mp3, v_aunt_end.mp3 | Claudia |
| g_call, g_door1, g_door2, g_door3, g_in1, g_in2, g_found, g_see, g_turn, g_quiet (.mp3) | Mabel |

12 lines (plus one voice test that is not shipped).

## Sound effects and music — kie.ai (`ai-music-api/sounds` V6, `ai-music-api/generate` V6)

The first clip of each task was used. Silence was trimmed and files re-encoded to 128 kbps MP3 with ffmpeg.

| File | Kind |
|---|---|
| amb_apartment, stairwell, clock, drone | looping ambience |
| knock_slow, knock_fast, steps_slow, door_creak, cloth_fall, wardrobe, key_unlock, phone_ring, radio, whispers, glass_crack, breathing | sound effects |
| sting_big, sting_small | stingers |
| music_box, tension | music (instrumental) |

kie.ai voice generation was tried (2 test tasks) but failed on the provider side, so all voices went through CometAPI.

## Packaging

`game/audio.js` holds all the MP3s above as base64, so the audio also decodes when the page is opened straight from disk. Film grain, the flashlight, flicker and camera-shake are drawn in code at runtime and are not asset files.

## Free / third-party assets

None. Fonts are system fonts (Georgia / Times New Roman / Segoe Print).

## Cost

| Item | Cost |
|---|---|
| Images (21 × Nano Banana 2.1) | ≈ $1.90 (≈ $0.07 per 1K, ≈ $0.10 per 2K, by the CometAPI price list) |
| Voice lines (13 × ElevenLabs via CometAPI) | ≈ $0.15 |
| **Assets on CometAPI** | **≈ $2.05** |
| Sound effects and music on kie.ai | 193 credits ≈ $0.97 (measured from the kie.ai credit counter, separate $1 audio limit) |

The rest of the CometAPI spend was the AI model's own development requests. Total CometAPI spend at the end: $28.50 of the $25 budget (over by $3.50).
