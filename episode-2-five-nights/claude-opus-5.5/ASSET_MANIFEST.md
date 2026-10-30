# Asset manifest - Night Shift at Pumpkin Pete's

Every asset in `assets/` and how it was made. All generated assets were made during development through CometAPI and are stored locally; the game itself never calls any API.

## Cost

- CometAPI key total at the time of writing (assets **and** the AI development session itself, on one shared counter): `Money: $25.52 of $25.00 spent, $-0.52 left (102%)`
- Generation calls made: 45 images (Nano Banana 2.1, about $0.07 each at 1K, so roughly $3.15), 50 sound-effect calls (ElevenLabs SFX v2), 2 voice call (ElevenLabs v3), 1 music task (CometAPI music model, 2 clips).
- The counter does not split cost per asset; generation ran while the session itself was billing, so the asset share is an estimate (roughly $4-6). 21 of the sound effects were accidentally generated twice (a launch was repeated); the later file was kept.

## Images (`assets/img/*.jpg`)

Model: `gemini-nano-banana-2.1` (CometAPI), 1K, 16:9 unless noted; saved as PNG and converted to JPEG (quality 86). Character/room consistency: every scene with an animatronic is an image-to-image edit of the empty room image plus the character reference sheet(s) listed under *refs*.

Unless marked *(no style suffix)*, every image prompt had this art-direction suffix appended:

> Art direction: photorealistic still from a 1990s night-time security camera, abandoned Halloween-themed family pizzeria called Pumpkin Pete's, dusty, cobwebs, faded orange-and-purple Halloween decorations, paper bats, jack-o'-lantern props, checkered floor tiles, dim sickly lighting, deep shadows, muted desaturated colors with orange and teal tint, film grain, eerie, unsettling, cinematic horror. No text, no watermark, no captions, no UI overlay, no timestamp.

### `assets/img/backstage_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_backstage.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing between the shelves in the backstage room, partly in shadow, holding her broom, staring at the camera. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/closet_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_closet.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing squeezed inside the janitor closet next to the rack of brooms and mops, face lit from above by the caged bulb, staring at the camera with a wide smile. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/dining_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_dining.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing at the far end of the dining hall next to the dark doorway, half in shadow, head tilted, staring at the camera. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/dining_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_dining.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the pumpkin-headed animatronic from the second image standing in the middle of the dining hall between the tables, at mid distance, facing the camera, his eye holes glowing faintly amber. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/door_L_H.jpg`
- aspect 9:16, size 1K, refs: `assets/img/door_L_empty.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image: the witch animatronic from the second image now stands right outside the doorway, very close, filling much of the frame, lit harshly from above by the door light, head tilted, staring at the viewer with a frozen wide smile, long mechanical fingers curled. Keep the hallway, framing and lighting exactly the same. Photorealistic, film grain, horror.

### `assets/img/door_L_empty.jpg`
- aspect 9:16, size 1K, refs: `assets/img/office.jpg`
- prompt: Vertical view straight through an open doorway of the security office shown in the reference image, looking out into the narrow hallway just outside the door, lit harshly by a bright white door light from above: black-and-white checkered floor, grimy walls with a few peeling children's drawings, cobwebs, the hallway fading into blackness a few meters away. The hallway is EMPTY. Steel door frame visible at the image edges.

### `assets/img/door_R_H.jpg`
- aspect 9:16, size 1K, refs: `assets/img/door_R_empty.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image: the witch animatronic from the second image now stands right outside the doorway, very close, filling much of the frame, lit harshly from above by the door light, head tilted, staring at the viewer with a frozen wide smile, long mechanical fingers curled. Keep the hallway, framing and lighting exactly the same. Photorealistic, film grain, horror.

### `assets/img/door_R_P.jpg`
- aspect 9:16, size 1K, refs: `assets/img/door_R_empty.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image: the pumpkin-headed animatronic from the second image now stands right outside the doorway, very close, filling much of the frame, lit harshly from above by the door light, looming, his carved grin and glowing eye holes staring down at the viewer. Keep the hallway, framing and lighting exactly the same. Photorealistic, film grain, horror.

### `assets/img/door_R_empty.jpg`
- aspect 9:16, size 1K, refs: `assets/img/office.jpg`
- prompt: Vertical view straight through an open doorway of the security office shown in the reference image, looking out into the narrow hallway just outside the door, lit harshly by a bright white door light from above: black-and-white checkered floor, purple-painted grimy walls with a peeling Halloween party poster, a stack of plastic chairs, cobwebs, the hallway fading into blackness a few meters away. The hallway is EMPTY. Steel door frame visible at the image edges.

### `assets/img/door_dark_P.jpg`
- aspect 9:16, size 1K, refs: `assets/img/door_R_empty.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image: the power is out and the hallway is now in near-total darkness, almost pitch black. The pumpkin-headed animatronic from the second image stands in the doorway, his body invisible in the dark, only his jack-o'-lantern face visible, lit from inside: eye holes and carved grin glowing bright orange like candle light, faint orange glow on the rims of his hat. Photorealistic, film grain, horror.

### `assets/img/eastcorner_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_eastcorner.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing in the corner right next to the skeleton cutout, close to the camera, her head tilted unnaturally, staring up into the camera with a frozen smile. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/eastcorner_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_eastcorner.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the pumpkin-headed animatronic from the second image standing very close to the camera in the corner, looming large, looking straight up into the camera with glowing amber eye holes and his carved grin, menacing. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/easthall_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_easthall.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image at the far end of the corridor, emerging from the darkness under the paper lanterns, leaning forward, staring at the camera with glowing yellow eyes. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/easthall_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_easthall.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the pumpkin-headed animatronic from the second image standing halfway down the corridor next to the broken arcade cabinet, facing the camera, his eye holes glowing amber in the dark. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/gameover.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_backstage.jpg`, `assets/img/ref_pete.jpg`
- prompt: The backstage parts room from the first image: on the workbench, under the single bare bulb, lies an empty spare jack-o'-lantern mascot head like the one in the second image, next to it a crumpled security guard cap, a cracked flashlight and a guard ID badge. Dark, grim, implying the guard's terrible fate, nothing gory. Photorealistic security camera still, film grain, orange and teal. No people, no text.

### `assets/img/jump_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/ref_hattie.jpg`
- prompt: Horror game jumpscare frame: extreme close-up of the witch animatronic from the reference image lunging straight at the viewer, her pale green face filling most of the frame, jaw unhinged and wide open screaming, glass eyes with yellow irises bulging, wild grey hair flying, long spindly mechanical fingers reaching toward the viewer, motion blur, dark cramped security office, harsh light from below, film grain, photorealistic, terrifying. No text.

### `assets/img/jump_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/ref_pete.jpg`
- prompt: Horror game jumpscare frame: extreme close-up of the pumpkin-headed animatronic from the reference image lunging straight at the viewer, his giant carved jack-o'-lantern face filling most of the frame, mouth stretched impossibly wide showing rows of yellowed teeth and metal jaw mechanics inside, eye holes blazing bright orange, top hat askew, gloved hands reaching toward the viewer, motion blur, in a dark cramped security office, harsh light from below, film grain, photorealistic, terrifying. No text.

### `assets/img/jump_S.jpg`
- aspect 16:9, size 1K, refs: `assets/img/ref_scraps.jpg`
- prompt: Horror game jumpscare frame: extreme close-up of the scarecrow animatronic from the reference image lunging straight at the viewer, his burlap sack face filling most of the frame, the stitched mouth torn wide open with straw bursting out, the red eye blazing, long rake-tine fingers reaching toward the viewer, motion blur, straw flying, dark cramped security office, harsh light from below, film grain, photorealistic, terrifying. No text.

### `assets/img/office.jpg`
- aspect 21:9, size 1K, refs: none
- prompt: First-person view from the chair of a night security guard, looking straight at the back wall of a small cramped security office inside the pizzeria, wide panoramic view. The back wall is seen FRONTALLY. On the far LEFT part of the back wall there is a large rectangular open doorway with a heavy steel frame, facing the viewer, leading into a pitch-black corridor; on the far RIGHT part of the back wall there is an identical rectangular open doorway with a heavy steel frame, facing the viewer, also pitch black. Next to each doorway, on the wall beside the frame, a small panel with two big chunky buttons, one red and one white. Between the doorways: the wall covered in children's crayon drawings of pumpkins and witches, a paper bat garland, a wall clock, a cork board, a small shelf with a toy pumpkin mascot figurine. In the foreground a cluttered desk: an old CRT monitor, a small desk fan, a coffee mug, scattered papers, a plastic pumpkin bucket of candy wrappers. Dim warm desk lamp light, heavy shadows in the corners.

### `assets/img/patch_S0.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_patch.jpg`, `assets/img/ref_scraps.jpg`
- prompt: Edit the first image, a security camera view of a room. Hang the scarecrow animatronic from the second image on the wooden post among the corn stalks, like a scarecrow: arms stretched out along the crossbar, body limp, head drooping forward and down, lifeless. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/patch_S1.jpg`
- aspect 16:9, size 1K, refs: `assets/img/patch_S0.jpg`
- prompt: Edit this security camera image: the scarecrow animatronic hanging on the post has now lifted his head and is staring straight into the camera, his red eye glowing brighter, one rake-tine hand slightly raised off the crossbar. Keep everything else exactly the same: same room, same angle, same lighting.

### `assets/img/patch_S2.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_patch.jpg`, `assets/img/ref_scraps.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the scarecrow animatronic from the second image standing hunched in front of the broken picket fence, having climbed down from the empty wooden post behind him, long rake-tine fingers spread, head tilted, staring straight into the camera with his glowing red eye. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/ref_hattie.jpg`
- aspect 3:4, size 1K, refs: none
- prompt: Character design reference, full body, front view, standing, plain dark grey studio backdrop, flat even lighting so every detail is visible. HOLLOW HATTIE, an old animatronic witch from a children's restaurant: gaunt, unnaturally tall and thin, a pale sickly green latex face with cracked paint, a long hooked nose with a wart, a wide frozen painted smile showing small square teeth, glossy glass eyes with yellow irises that look slightly in different directions, wild frizzy grey yarn hair, a crooked tall black pointed hat with a purple band and a dented brass buckle, a tattered black dress patterned with faded purple stars and moons, a ragged purple shawl, long spindly mechanical fingers with exposed metal joints, holding a worn straw broom. Creepy 1980s animatronic puppet, not a real human.

### `assets/img/ref_pete.jpg`
- aspect 3:4, size 1K, refs: none
- prompt: Character design reference, full body, front view, standing, plain dark grey studio backdrop, flat even lighting so every detail is visible. PUMPKIN PETE, a 7-foot-tall old animatronic restaurant mascot: his head is a huge carved jack-o'-lantern made of cracked, sun-faded orange fiberglass with a short curled green stem, triangular eye holes with small amber light bulbs glowing inside, a wide jagged carved grin with rows of yellowed plastic teeth; he wears a battered black top hat with a purple band, a tattered purple tailcoat with big orange buttons, a dirty orange bow tie, striped black-and-orange trousers, stained white cartoon gloves; seams torn open at the wrists, elbows and ankles reveal rusty metal endoskeleton and wires; holding an old microphone. Lanky, heavy, menacing but clearly a 1980s children's restaurant robot costume.

### `assets/img/ref_scraps.jpg`
- aspect 3:4, size 1K, refs: none
- prompt: Character design reference, full body, front view, standing hunched, plain dark grey studio backdrop, flat even lighting so every detail is visible. SCRAPS THE SCARECROW, an old animatronic scarecrow from a children's restaurant: very tall, hunched and lanky with overly long limbs, a lumpy burlap sack head with a crudely stitched X-stitched mouth that is torn open, one black button eye and one missing eye socket with a small red LED glowing inside, a floppy straw hat with holes; a faded red plaid shirt and patched blue denim overalls, dry straw bursting out of the cuffs, collar and tears; exposed rusty metal joints at the knees and elbows; his hands end in long thin fingers made of bent garden rake tines. Creepy 1980s animatronic, not a real human.

### `assets/img/restrooms_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_restrooms.jpg`, `assets/img/ref_pete.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the pumpkin-headed animatronic from the second image standing in the restroom hallway next to the restroom doors, close to the camera, head turned toward the camera, eye holes glowing amber. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/room_backstage.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view of a cramped backstage parts-and-service room: metal shelves holding spare animatronic heads and empty pumpkin masks staring blankly, tangled cables, a cluttered workbench with tools and a soldering iron, a pegboard wall, a single bare hanging light bulb, a dented metal door. No complete characters, no people.

### `assets/img/room_closet.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view of a tiny cluttered janitor supply closet: a rusty mop bucket on wheels, metal shelves with cleaning bottles and paper towels, an old stained utility sink, a rack of brooms and mops, a single caged ceiling bulb casting hard shadows, a half-open door. EMPTY, no characters, no people.

### `assets/img/room_dining.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle wide security camera view of a long restaurant dining hall at night. Rows of long tables with orange-and-black checkered tablecloths, scattered paper party hats and paper plates, a few toppled chairs, half-deflated purple and orange balloons on strings, paper skeleton garlands and paper bats hanging from the ceiling, pumpkin-shaped paper lanterns, a dark open doorway on the far wall. The room is EMPTY, no characters, no people.

### `assets/img/room_eastcorner.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: Security camera view from a high ceiling corner looking down at the end of a corridor right next to an office: a life-size cardboard cutout of a cartoon skeleton waving, a dented water fountain, a stack of plastic chairs, a heap of deflated balloons, a flickering wall sconce, deep shadows. EMPTY, no characters, no people.

### `assets/img/room_easthall.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view down a long restaurant corridor: purple-painted walls with faded Halloween party posters showing cartoon ghosts, a row of hanging orange paper lanterns, a broken old arcade cabinet with a dark screen against the wall, checkered floor with stains, the far end disappears into darkness. EMPTY corridor, no characters, no people.

### `assets/img/room_patch.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view of the PUMPKIN PATCH play corner of a restaurant: a small raised alcove surrounded by a broken white picket fence, filled with tall dried corn stalks, hay bales and fake plastic pumpkins of different sizes, a tall crooked wooden post with a crossbar standing in the middle among the corn stalks where a scarecrow would hang, the post is empty. A dim orange lamp. No characters, no people.

### `assets/img/room_restrooms.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view of a dim restroom hallway in a restaurant: two restroom doors with simple boy and girl pictogram signs, a yellow wet floor cone, cracked tiles, a pile of plastic jack-o'-lantern buckets on the floor, a flickering light above. EMPTY, no characters, no people.

### `assets/img/room_stage.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle wide security camera view looking toward a small raised wooden show stage at the end of a restaurant dining room. Torn purple velvet curtains, a strand of orange string lights with most bulbs dead, a large painted backdrop of a full moon over a pumpkin patch, cardboard tombstones and fake cobwebs on the stage, a single microphone stand at center stage, a dusty spotlight on the ceiling truss. The stage is completely EMPTY, no characters, no people.

### `assets/img/room_westcorner.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: Security camera view from a high ceiling corner looking down at the end of a corridor right next to an office: a dead-end corner with a dirty checkered floor, a wall-mounted cartoon pumpkin mascot poster peeling off the wall, stacked boxes of party supplies and plastic trick-or-treat buckets, a dim red emergency light, deep shadows. EMPTY, no characters, no people.

### `assets/img/room_westhall.jpg`
- aspect 16:9, size 1K, refs: none
- prompt: High-angle security camera view down a long narrow restaurant corridor, black-and-white checkered floor, walls covered with taped children's crayon drawings of pumpkins, ghosts and witches, one flickering fluorescent ceiling light halfway down, cobwebs in the corners, the far end of the corridor fades into darkness. EMPTY corridor, no characters, no people.

### `assets/img/shutter.jpg`
- aspect 9:16, size 1K, refs: none
- prompt: Flat front view texture of a heavy rusty corrugated steel security shutter door filling the entire image edge to edge, horizontal ribs, scratches, dents, faded yellow-and-black hazard stripes along the bottom edge, grime, dim lighting. Just the metal surface, nothing else.

### `assets/img/stage_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/stage_PH.jpg`
- prompt: Edit this security camera image: remove the pumpkin-headed animatronic from the stage completely, leaving the microphone stand and the empty stage behind him. Keep everything else exactly the same, including the witch animatronic in the same pose and position.

### `assets/img/stage_P.jpg`
- aspect 16:9, size 1K, refs: `assets/img/stage_PH.jpg`
- prompt: Edit this security camera image: remove the witch animatronic from the stage completely, leaving the empty stage floor and backdrop behind her. Keep everything else exactly the same, including the pumpkin-headed animatronic in the same pose and position.

### `assets/img/stage_PH.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_stage.jpg`, `assets/img/ref_pete.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the two animatronic characters from the reference images on the stage: the pumpkin-headed animatronic (second image) standing at center stage behind the microphone stand, and the witch animatronic (third image) standing on the stage to his left side. Both stand still, lifeless, slightly slumped, facing the audience. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/title.jpg`
- aspect 16:9, size 1K, refs: `assets/img/stage_PH.jpg`, `assets/img/ref_scraps.jpg`
- prompt: Cinematic horror game title screen key art, wide 16:9: the dark stage of an abandoned Halloween pizzeria seen from the dining room, a single dusty spotlight from above; the pumpkin-headed animatronic and the witch animatronic from the first image stand on the stage, and the scarecrow animatronic from the second image stands at the side of the stage; their eyes glow faintly; everything else falls into deep black shadow. Composition: characters on the RIGHT two-thirds, the LEFT third mostly dark empty space for a title. Photorealistic, film grain, orange and teal, ominous. No text, no letters.

### `assets/img/westcorner_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_westcorner.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing very close to the camera in the corner, lit red by the emergency light, looking straight up into the camera, mouth open in a frozen grin, menacing. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/westhall_H.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_westhall.jpg`, `assets/img/ref_hattie.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the witch animatronic from the second image standing in the middle of the corridor under the flickering light, long spindly fingers raised, staring at the camera. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/westhall_S.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_westhall.jpg`, `assets/img/ref_scraps.jpg`
- prompt: Edit the first image, a security camera view of a room. Put the scarecrow animatronic from the second image sprinting down the corridor straight toward the camera, very close, mid-stride, long arms swinging, straw flying, slight motion blur, his red eye glowing. Keep everything else exactly the same as the first image: same room, same camera angle, same framing, same lighting and colors. The character must match the reference character design exactly (same face, costume, colors), lit by the room's dim light so it belongs in the scene, looking like a real physical animatronic photographed by the security camera.

### `assets/img/win.jpg`
- aspect 16:9, size 1K, refs: `assets/img/room_dining.jpg`
- prompt: The same dining hall as the reference image but at dawn: warm golden early morning sunlight streams in through dusty windows, long soft light beams with floating dust, the room is calm and empty, the night is over, a feeling of relief. Photorealistic, film grain. No people, no characters, no text.

`ref_*.jpg` are character design sheets used only as image-to-image references (not shown in game).

## Sound effects (`assets/sfx/*.mp3`)

Model: `eleven_text_to_sound_v2` (ElevenLabs Sound Effects v2 via CometAPI).

| file | duration (s) | loop | prompt |
|---|---|---|---|
| `assets/sfx/amb_building.mp3` | 30 | yes | Dark ambient room tone of an empty abandoned building at night: low electrical hum, faint ventilation drone, very distant indistinct metallic creaks, subtle unsettling low drone. Seamless loop, no music. |
| `assets/sfx/breathing.mp3` | 4 | no | Slow heavy mechanical wheezing breath, like a broken animatronic with a damaged air pump, close by in the dark, horror. |
| `assets/sfx/button_fail.mp3` | 0.6 | no | Dull plastic button click with a broken electrical error buzz, nothing happens. |
| `assets/sfx/cam_switch.mp3` | 0.6 | no | Short electronic click and brief burst of analog TV static when switching a security camera channel. |
| `assets/sfx/chime_6am.mp3` | 6 | no | Old clock tower bells chiming six times, followed by distant cheerful recorded children cheering yay, warm relief. |
| `assets/sfx/distant_bang.mp3` | 2.5 | no | Distant loud metal pots and pans crashing in a kitchen far away in an empty building, echoing. |
| `assets/sfx/distant_clang.mp3` | 2.5 | no | Distant single heavy metallic clang echoing through empty building corridors, followed by silence. |
| `assets/sfx/door_bang.mp3` | 2.5 | no | Three heavy fists pounding on a closed steel shutter door from the other side, loud metallic booms, horror. |
| `assets/sfx/door_close.mp3` | 1.5 | no | Heavy steel security shutter door slamming down fast, loud metallic clang, short reverb in a small room. |
| `assets/sfx/door_open.mp3` | 1.5 | no | Heavy steel security shutter door rolling up with mechanical grinding and a metallic clunk at the end. |
| `assets/sfx/fan_loop.mp3` | 10 | yes | Small old electric desk fan whirring steadily in a quiet room, soft motor hum and light rattle. Seamless loop. |
| `assets/sfx/heartbeat.mp3` | 4 | yes | Slow deep heavy human heartbeat thumping, tense horror. Seamless loop. |
| `assets/sfx/hour_chime.mp3` | 2 | no | Single soft old digital watch beep chime, quiet, slightly detuned. |
| `assets/sfx/jumpscare_1.mp3` | 2 | no | Horror jumpscare: sudden extremely loud distorted robotic animatronic screech scream with metallic grinding, harsh, terrifying. |
| `assets/sfx/jumpscare_2.mp3` | 2 | no | Horror jumpscare: sudden loud shrieking witch scream mixed with electronic distortion and mechanical whine, harsh, terrifying. |
| `assets/sfx/light_buzz.mp3` | 4 | yes | Bright industrial hallway light buzzing loudly with electrical hum and slight flicker crackle. Seamless loop. |
| `assets/sfx/music_box.mp3` | 14 | no | Slow out-of-tune old music box playing a creepy lullaby melody in the dark, slightly warbling, horror, soft. |
| `assets/sfx/pete_laugh.mp3` | 3 | no | Deep distorted low-pitched mechanical robot laugh from a broken old animatronic speaker, slow ho ho ho, echoing down a hallway, horror. |
| `assets/sfx/power_down.mp3` | 3 | no | Building power failure: all electricity shutting down with a deep descending electrical whine, relay clunks, lights dying, then silence. |
| `assets/sfx/static_loop.mp3` | 6 | yes | Old CRT security monitor analog video static white noise hiss with faint electrical buzz and subtle interference warble. Seamless loop. |
| `assets/sfx/steps_fast.mp3` | 2.5 | no | Fast scrambling footsteps running down a tiled hallway, with dry straw rustling and wood creaking, getting closer, in a dark empty building. |
| `assets/sfx/steps_heavy.mp3` | 3 | no | Slow heavy mechanical footsteps of a large robot walking in an empty tiled corridor, servo whirs and metal clanks with each step, distant reverb. |
| `assets/sfx/stinger.mp3` | 3 | no | Short horror sting: low ominous brass and string swell with a deep impact, scary reveal. |
| `assets/sfx/straw_rustle.mp3` | 2 | no | Dry straw and burlap rustling and creaking close by, something shifting in the dark, unsettling. |
| `assets/sfx/tablet_down.mp3` | 0.7 | no | Plastic tablet being lowered quickly with a soft whoosh and a short electronic power-off blip. |
| `assets/sfx/tablet_up.mp3` | 0.8 | no | Plastic tablet being flipped up quickly with a soft whoosh and an electronic power-on beep. |
| `assets/sfx/window_tap.mp3` | 2.5 | no | Long thin metal fingers slowly scraping and tapping on a steel door, creepy, close. |
| `assets/sfx/witch_laugh.mp3` | 3 | no | Distant echoing old mechanical witch animatronic cackle, distorted and slowed down, crackling speaker, creepy, in an empty building. |
| `assets/sfx/witch_whisper.mp3` | 3 | no | Creepy raspy whispering just outside a door, unintelligible hissing whisper, close and intimate, horror. |

## Music (`assets/music/menu.mp3`)

- CometAPI music model, instrumental, inspiration prompt: "slow creepy detuned music box lullaby melody over dark ambient drones and distant warped carnival organ, abandoned Halloween pizzeria horror game title screen, eerie, minimal". The task returned two clips; clip 0 was kept and re-encoded to 128 kbps with ffmpeg, clip 1 was discarded. Used on the title screen.

## Voice (`assets/voice/call.mp3`)

- `eleven_v3`, preset voice `Mark`, the manager's phone call at the start of the night. Script: "[nervous] Hey, uh... hello? Hello! Okay, welcome to your first night at Pumpkin Pete's. [clears throat] So, the place has been closed for years, but the animatronics still walk around at night. Pete, Hattie and Scraps. If one of them gets into your office... [pause] well, they won't think you're a person. Let's leave it at that. Okay, quick tips. Pete comes down the east side, toward your right door. He doesn't like being watched, so if you keep the camera on him, he stays put. Hattie wanders. She can show up at either door, and the cameras won't always catch her, so listen. If you hear whispering, check your lights. And Scraps, out in the Pumpkin Patch, camera one C. He hates being ignored. Check on him a lot. If his post is empty... [quickly] shut the left door. Right away. [sighs] The doors, the lights and the tablet all use power, and you only get so much each night. Don't run out. [pause] Good luck. See you at six."

## Fonts (`assets/fonts/`)

- `VT323-Regular.ttf` - VT323 by Peter Hull, from Google Fonts, SIL Open Font License 1.1 (`OFL_VT323.txt`). Free for commercial use and video.
- `Creepster-Regular.ttf` - Creepster by Sideshow, from Google Fonts, SIL Open Font License 1.1 (`OFL_Creepster.txt`).

## Made in code

- Camera static, scanlines, vignette, door/button glows, tablet transition, the map and all HUD elements are drawn at runtime on the canvas (`js/game.js`).
- Stereo panning, low-pass muffling (distance / closed doors) and fades are done at runtime with the Web Audio API (`js/audio.js`).
