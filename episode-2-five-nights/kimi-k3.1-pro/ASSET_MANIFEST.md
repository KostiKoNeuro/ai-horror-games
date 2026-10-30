# Asset Manifest

All shipped assets are stored under `assets/`. The finished game makes no network requests. All AI assets were created for this project through CometAPI; no third-party or FNAF characters, images, sounds, or music are used.

## Art direction and image generation

**Model:** `gemini-nano-banana-2.1` (Nano Banana 2.1), 1K output. Room images are 1376×768; character references are 848×1264 before background removal.

Shared prompt direction: “Cinematic realistic survival-horror game art, an abandoned 1990s Halloween family pizzeria, practical physical materials, peeling paint, grime and cobwebs, muted pumpkin orange against deep teal-black shadows, soft volumetric light, subtle 35mm film grain, cohesive art direction, richly detailed but naturally dark, no readable text, no watermark, no people, no blood.”

| Local asset | Prompt / construction | Approx. cost |
|---|---|---:|
| `images/office.png` | Eye-level guard office, battered desk/fan/CRT/papers, two unobstructed open side doorways, Halloween decorations, empty room. | $0.07 |
| `images/stage.png` | High corner CCTV view, wooden show stage, three empty microphones, tattered purple curtains, crescent/pumpkin decorations, empty stage. | $0.07 |
| `images/dining.png` | High CCTV dining hall, long tables, overturned chairs, orange cloths, paper bats, checkerboard floor, serving counter. | $0.07 |
| `images/arcade.png` | Derelict 1990s arcade, boxy cabinets, skee-ball, geometric carpet, tokens, cyan/red practical lighting. | $0.07 |
| `images/prize.png` | Prize counter CCTV, glass displays, dusty pumpkin plush toys, ticket rolls, moon decorations, narrow room. | $0.07 |
| `images/west.png` | Narrow west hallway, office doorway, striped peeling wallpaper, pumpkin posters, checkerboard floor, one ceiling lamp. | $0.07 |
| `images/east.png` | Narrow east hallway, exposed brick/violet wallpaper, paper ghosts, checkerboard floor, distinct from west hall. | $0.07 |
| `images/parts.png` | Parts-and-service workshop, empty endoskeleton frames, spare mascot heads, workbench, chains, oily concrete. | $0.07 |
| `images/pete.png` | Original full-body Pumpkin Pete: carved jack-o-lantern showman, burgundy tailcoat, purple bow tie, striped trousers, white gloves, steel joints. Generated on #00FF00; locally chroma-keyed, despilled, and cropped. | $0.07 |
| `images/vesper.png` | Original full-body Vesper: cracked porcelain witch, black eyes, crooked violet hat, ragged star dress, marionette joints. Generated on #00FF00; locally chroma-keyed, despilled, and cropped. | $0.07 |
| `images/patch.png` | Original full-body Patch: stitched burlap scarecrow, straw, flannel/overalls, exposed metal ribs, piston joints, clawed gloves. Generated on #00FF00; locally chroma-keyed, despilled, and cropped. | $0.07 |
| `images/pete_scare.png` | Image-to-image using `pete.png` as reference: same character lunging into an extreme close-up, open mechanical mouth, reaching gloves, dark hallway. | $0.07 |
| `images/vesper_scare.png` | Image-to-image using `vesper.png` as reference: same witch lunging into an extreme close-up, cracked face, black eyes, reaching hands. | $0.07 |
| `images/patch_scare.png` | Image-to-image using `patch.png` as reference: same scarecrow lunging into an extreme close-up, ripped stitched grin, straw and claws. | $0.07 |
| `images/grain.png` | Original 256×256 deterministic monochrome noise, generated locally with Python/Pillow; no AI or external source. | $0.00 |

The office controls, tablet, camera map, typography, door panels, lighting, and transitions are original HTML/CSS. Transparent character references remain in use for office visitors and as an automatic camera fallback; the expanded natural camera encounters are documented below.

## Sound effects

**Model:** `eleven_text_to_sound_v2` through CometAPI. Each prompt below was submitted with the listed duration and loop setting. Files are local MP3s. Static, light, and chime levels were adjusted locally with FFmpeg gain and a peak limiter after auditing their loudness.

| Local asset | Prompt summary | Duration / loop |
|---|---|---|
| `audio/ambience.mp3` | Abandoned pizzeria transformer hum, ventilation, timber creaks and distant building settling; sparse realistic horror, no music/voices/sudden sounds. | 20 s / yes |
| `audio/static.mp3` | Quiet analog CCTV static, soft radio hiss, tiny crackles, no voices or loud tones. | 8 s / yes |
| `audio/door.mp3` | Heavy motorized steel security door sliding and slamming, mechanical clunk, concrete hallway reverb. | 2.5 s / no |
| `audio/light.mp3` | Old electrical switch, short fluorescent buzz and metallic ping. | 1.2 s / no |
| `audio/footsteps.mp3` | Three slow heavy robot footsteps on old tile, distant hallway reverb. | 4 s / no |
| `audio/knock.mp3` | Three slow heavy metal knocks on a security door, deep resonant impacts and reverb. | 3 s / no |
| `audio/jumpscare.mp3` | Sudden distorted mechanical attack shriek, metal impact, deep short horror hit. | 3 s / no |
| `audio/chime.mp3` | Six distant gentle clock bells at 6 AM, reassuring mechanical resonance. | 8 s / no |
| `audio/powerdown.mp3` | Electrical failure, descending motor, relays switching off, dying fluorescent buzz. | 4 s / no |

**Nine-SFX batch cost:** approximately **$0.36–$0.50**. CometAPI's shared counter does not itemize individual asynchronous sound tasks, so a precise per-file split is unavailable.

## Music

| Local asset | Model and prompt | Approx. cost |
|---|---|---:|
| `audio/music.mp3` | CometAPI music model, instrumental inspiration mode: “A sparse haunted music-box melody, detuned toy piano, distant reversed bell tones and subtle dark ambient drone. Slow, restrained, eerie abandoned family pizzeria at night. No vocals or jump-scare hits.” One 169.2-second clip selected from the task. | $0.20–$0.35 |

## Expanded environments and natural camera encounters

The following assets were added in the full-game expansion. Every encounter uses Nano Banana 2.1 image-to-image with the corresponding empty room and transparent character reference(s), preserving the original character designs and room viewpoints. Approximate cost is $0.07 per successful 1K image.

| Local asset | Prompt / construction |
|---|---|
| `images/title.png` | Rain-wet abandoned pizzeria exterior at midnight, giant weathered glowing pumpkin sign, dead trees and autumn mist. |
| `images/party.png` | Birthday banquet table, party hats, torn streamers, cake display, moon wall decoration, serving hatch. |
| `images/kitchen.png` | Industrial ovens, hanging pans, preparation counters, cracked tile, pizza boxes and dark serving hatch. |
| `images/blackout_pete.png` | Office + Pete references; Pete barely visible inside the left doorway, only amber eyes and grin glowing. |
| `images/stage_pete.png` | Pete integrated at the left stage microphone with natural lighting and contact shadow. |
| `images/stage_vesper.png` | Vesper integrated at the right stage microphone. |
| `images/stage_both.png` | Pete and Vesper together at their stage microphones. |
| `images/dining_pete.png` | Pete between dining tables in correct perspective. |
| `images/party_pete.png` | Pete at the far end of the birthday table. |
| `images/party_patch.png` | Patch beside the birthday table. |
| `images/party_both.png` | Pete and Patch sharing the party room. |
| `images/west_pete.png` | Pete facing the camera in west hall. |
| `images/west_patch.png` | Patch against the west-hall wall. |
| `images/west_both.png` | Pete and Patch sharing west hall. |
| `images/prize_vesper.png` | Vesper behind the prize counter. |
| `images/kitchen_vesper.png` | Vesper beside the industrial ovens. |
| `images/east_vesper.png` | Vesper motionless in east hall. |
| `images/parts_patch.png` | Patch beside the workshop bench and empty endoskeletons. |
| `images/arcade_patch.png` | Patch between arcade cabinets. |
| `images/shroud.png` | Original Shroud ghost mascot: ivory gauze over a metal puppet, cracked porcelain skull, steel arms, white claws and candle motifs. Green-screen generation followed by local chroma-keying. |
| `images/shroud_scare.png` | Image-to-image using `shroud.png`: close-range ghost attack, open mechanical jaw and reaching claws. |
| `images/office_pete_left.png` | Office + Pete references; Pete naturally lit inside the left security doorway, with correct scale and contact shadow. |
| `images/office_patch_left.png` | Office + Patch references; Patch naturally lit inside the left security doorway. |
| `images/office_shroud_left.png` | Office + Shroud references; Shroud hovering inside the left security doorway. |
| `images/office_vesper_right.png` | Office + Vesper references; Vesper naturally lit inside the right security doorway. |
| `images/office_shroud_right.png` | Office + Shroud references; Shroud hovering inside the right security doorway. |
| `images/office_dawn.png` | Image-to-image from the empty office: the same room at 6 AM, empty doorways and soft golden dawn light for the win screen. |
| `images/gloam.png` | Original Gloam bat mascot: charcoal mechanical face, pointed ears, amber eyes, copper chest speaker, tattered leather wings with brass struts and clawed steel limbs. Green-screen generation followed by local chroma-keying. |
| `images/gloam_scare.png` | Gloam reference; ceiling-diving close-up with open speaker throat, spreading ragged wings and reaching brass claws. |
| `images/vent.png` | Empty ribbed galvanized ventilation duct with rivets, old wiring, cobwebs and a distant bent fan grille; CAM 10. |
| `images/arcade_gloam.png` | Arcade + Gloam references; Gloam hanging from an exposed pipe with partly spread wings. |
| `images/vent_gloam.png` | Vent + Gloam references; Gloam hanging motionless inside the duct with wings folded around its body. |
| `images/office_gloam.png` | Office + Gloam references; a dim ceiling silhouette with amber eyes, both doorways left unchanged. |

The five original doorway scenes and dawn image cost approximately **$0.42** total. The six Gloam and ventilation images cost approximately **$0.42** total, excluding any rejected or interrupted requests.

## Additional sound and voice

| Local asset | Model and prompt / processing | Approx. cost |
|---|---|---:|
| `audio/musicbox.mp3` | ElevenLabs SFX v2: slow detuned broken-lullaby music box, metallic tines and mechanical winding; locally gained and limited. | Shared batch |
| `audio/whisper.mp3` | ElevenLabs SFX v2: close dry unintelligible rasping whisper, no scream. | Shared batch |
| `audio/servo.mp3` | ElevenLabs SFX v2: two short animatronic neck/arm servo movements and metal creak. | Shared batch |
| `audio/voice_intro.mp3` | ElevenLabs v3, preset `Clint`: 40-second guarded former-employee briefing; local telephone high-pass/low-pass EQ and compression. | Shared voice batch |
| `audio/voice_shroud.mp3` | ElevenLabs v3, preset `Clint`: 20.48-second warning that Shroud is invisible on CCTV and must be held in hall light; matching telephone EQ. | Shared voice batch |
| `audio/lure.mp3` | ElevenLabs SFX v2: four-note detuned calliope lullaby from a dusty wall speaker, with light radio static; 4 seconds. | Shared expansion batch |
| `audio/wings.mp3` | ElevenLabs SFX v2: heavy leather wingbeats, brass joints and claws scraping inside a metal duct; 3 seconds. | Shared expansion batch |
| `audio/voice_gloam.mp3` | ElevenLabs v3, preset `Clint`: 20.08-second warning about Gloam, the ceiling warning and CAM 10 lure; matching telephone EQ. | Shared voice batch |

The three additional SFX cost approximately **$0.12–$0.20** together; the first two voice tasks cost approximately **$0.12–$0.25** together. The two expansion SFX and Gloam voice add an estimated **$0.16–$0.30**. Exact per-task itemization is unavailable from the shared counter.

## Cost notes

- Original successful images: **14**, approximately **$0.98**.
- Expansion successful images: **21**, approximately **$1.47**.
- Final office and dawn images: **6**, approximately **$0.42**.
- Gloam and ventilation images: **6**, approximately **$0.42**.
- Total: **47 AI images plus one procedural grain texture**. Allow approximately **$0.84** for 12 interrupted image responses across the original and expanded batches.
- Fourteen generated SFX, three voice recordings, and one generated music track bring estimated total generated-media spend, including earlier retries, to **approximately $4.98–$5.77**.
- These figures exclude the model's own session requests. The shared CometAPI counter includes both and can lag, so ranges distinguish asset estimates from exact itemized billing.

Generation scripts are retained in `tools/` for provenance only. They are not used by the game and are not needed to run it.
