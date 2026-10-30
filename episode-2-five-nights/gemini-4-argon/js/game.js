/* ==========================================================================
   NIGHT SHIFT AT PUMPKIN PETE'S — CORE SURVIVAL HORROR ENGINE (v4.0 DIRECTOR'S CUT)
   8 Cameras, 5 Distinct Halloween Animatronics (incl. Withered Silas in Vents),
   Overhead Vent Shutter [V], Strobe Flash Beacon [X], Live Desk CRT PiP,
   Heart Rate BPM System, & Playable Sub-Basement Workshop Salvage Mode
   ========================================================================== */

const CAMERAS = {
  cam01: { id: "cam01", number: "CAM 01", name: "HARVEST SHOW STAGE" },
  cam02: { id: "cam02", number: "CAM 02", name: "LANTERN DINING HALL" },
  cam03: { id: "cam03", number: "CAM 03", name: "CURSED MARIONETTE ALCOVE" },
  cam04: { id: "cam04", number: "CAM 04", name: "WEST SERVICE CORRIDOR" },
  cam05: { id: "cam05", number: "CAM 05", name: "HAUNTED ARCADE ALLEY" },
  cam06: { id: "cam06", number: "CAM 06", name: "EAST STORAGE CORRIDOR" },
  cam07: { id: "cam07", number: "CAM 07", name: "SUB-BASEMENT BOILER ROOM" },
  cam08: { id: "cam08", number: "CAM 08", name: "OVERHEAD VENTILATION DUCT" },
};

const NIGHT_CONFIGS = {
  1: {
    title: "12:00 AM — NIGHT 1",
    sub: "OCT 27 // NIGHT 1 SHIFT",
    headline: "HELP WANTED: NIGHT SECURITY GUARD",
    pay: "$115.50",
    date: "OCT 28, 1993",
    baseAI: { pete: 5, stitch: 5, hexa: 5, grimshaw: 2, silas: 0 },
    rampAI: { pete: 2, stitch: 2, hexa: 1.5, grimshaw: 1, silas: 0.5 },
    subtitles: [
      { t: 0, text: '📞 [TAPE 1]: "Uh, hello? Hello, hello? Welcome to your night shift at Pumpkin Pete\'s Autumn Jamboree!"' },
      { t: 7, text: '📞 [TAPE 1]: "Listen closely, because the old generator wiring in this building drains battery fast."' },
      { t: 15, text: '📞 [TAPE 1]: "Pumpkin Pete takes the East route through the Arcade toward your Right Door. Watching him on camera slows him down!"' },
      { t: 25, text: '📞 [TAPE 1]: "Barnaby Stitch creeps down the West Hall. Cameras don\'t slow him—check your Left Light [Q] and shut Left Door [A]!"' },
      { t: 36, text: '📞 [TAPE 1]: "And keep the Carillon Music Box wound on CAM 03 [W], or Madame Hexa will sprint down the West Hall. Good luck!"' },
    ],
  },
  2: {
    title: "12:00 AM — NIGHT 2",
    sub: "OCT 28 // NIGHT 2 SHIFT",
    headline: "INTERNAL MEMO: ARCADE CURTAIN & OVERHEAD VENTS",
    pay: "$115.50",
    date: "OCT 29, 1993",
    baseAI: { pete: 7, stitch: 7, hexa: 7, grimshaw: 6, silas: 3 },
    rampAI: { pete: 2, stitch: 2, hexa: 2, grimshaw: 2, silas: 1.2 },
    subtitles: [
      { t: 0, text: '📞 [TAPE 2]: "Hey, you made it to Night Two! Great job! Listen, a quick heads-up about Camera Five, the Arcade Alley..."' },
      { t: 8, text: '📞 [TAPE 2]: "Grimshaw the Plague Crow has started waking up behind the curtain in CAM 05. Check CAM 05 often to keep him calm!"' },
      { t: 18, text: '📞 [TAPE 2]: "If Grimshaw bolts down the East Hallway on CAM 06, slam your Right Door [D] immediately before he reaches the office!"' },
      { t: 28, text: '📞 [TAPE 2]: "Also, watch CAM 07 & CAM 08—if something crawls into the Overhead Vent, shut your Ceiling Vent [V] or fire Flash Beacon [X]!"' },
    ],
  },
  3: {
    title: "12:00 AM — NIGHT 3",
    sub: "OCT 29 // NIGHT 3 SHIFT",
    headline: "INSPECTION NOTICE: ELECTROMAGNETIC SURGES",
    pay: "$115.50",
    date: "OCT 30, 1993",
    baseAI: { pete: 9, stitch: 9, hexa: 9, grimshaw: 9, silas: 6 },
    rampAI: { pete: 2, stitch: 2, hexa: 2, grimshaw: 2, silas: 1.5 },
    subtitles: [
      { t: 0, text: '📞 [TAPE 3]: "Hey, Night Three already! You\'re tougher than the last guard. Things are getting serious tonight."' },
      { t: 9, text: '📞 [TAPE 3]: "All five units are active now, and when they stare close into a camera lens, their servos jam the video signal."' },
      { t: 20, text: '📞 [TAPE 3]: "Hit Reboot Feed [R] on your monitor if a camera goes haywire, and watch Withered Silas in the CAM 08 Overhead Vent!"' },
    ],
  },
  4: {
    title: "12:00 AM — NIGHT 4",
    sub: "OCT 30 // NIGHT 4 SHIFT",
    headline: "URGENT: NIGHT WATCHMAN MISSING ON SHIFT",
    pay: "$115.50",
    date: "OCT 31, 1993",
    baseAI: { pete: 11, stitch: 11, hexa: 11, grimshaw: 11, silas: 9 },
    rampAI: { pete: 2, stitch: 2, hexa: 2, grimshaw: 2, silas: 1.8 },
    subtitles: [
      { t: 0, text: '📞 [TAPE 4]: "Hello? Hello?! Listen to me, if you\'re hearing this on Night Four, don\'t let your battery drop!"' },
      { t: 9, text: '📞 [TAPE 4]: "They\'re coordinating now—Stitch jammed my left door while Silas crawled through the ceiling vent above my desk..."' },
      { t: 19, text: '📞 [TAPE 4]: "Wait—something\'s hanging from the ceiling grate—my Flash Beacon is out of charges—no, stay back! [STATIC]"' },
    ],
  },
  5: {
    title: "12:00 AM — NIGHT 5 (HALLOWEEN)",
    sub: "OCT 31 // HALLOWEEN NIGHT 5",
    headline: "OCTOBER 31: FINAL SHIFT BEFORE DEMOLITION",
    pay: "$120.00",
    date: "NOV 01, 1993",
    baseAI: { pete: 13, stitch: 13, hexa: 13, grimshaw: 13, silas: 12 },
    rampAI: { pete: 1.5, stitch: 1.5, hexa: 1.5, grimshaw: 1.5, silas: 1.5 },
    subtitles: [
      { t: 0, text: '🎃 [TRANSMISSION]: "Welcome to Halloween Night, little watchman. No more recordings to help you now..."' },
      { t: 9, text: '🎃 [TRANSMISSION]: "The boiler furnace is burning, the Carillon is unwinding, and all five of us are coming for the office."' },
      { t: 19, text: '🎃 [TRANSMISSION]: "Look left, look right, look up at the ceiling vent... Let\'s see if you survive until six A.M.!"' },
    ],
  },
};

const BLUEPRINT_DATA = {
  pete: {
    img: "assets/images/blueprint_pete.png",
    title: "MODEL 01 // PUMPKIN PETE (1987)",
    specs: "HEIGHT: 7'2\" // WEIGHT: 480 LBS // ROUTE: EAST CORRIDOR -> RIGHT DOOR",
    lore: "Lead vocalist and culinary mascot of Pumpkin Pete's Family Pizzeria. Built around a heavy cast-iron brick-oven chassis, his optical sensors freeze when hit by direct infrared CCTV beams—slowing his advance until he reaches the CAM 06 blind spot.",
    voice: "voice_pete_whisper",
  },
  stitch: {
    img: "assets/images/blueprint_stitch.png",
    title: "MODEL 02 // BARNABY STITCH (1987)",
    specs: "HEIGHT: 6'11\" // WEIGHT: 340 LBS // ROUTE: WEST CORRIDOR -> LEFT DOOR",
    lore: "Agricultural harvest scarecrow outfitted with pneumatic threshing claws and toxic-green phosphor optics. Immune to camera stalling—excessive CCTV monitor usage amplifies his servo speed. Jams door controls if left in the doorway too long.",
    voice: "voice_stitch_whisper",
  },
  hexa: {
    img: "assets/images/blueprint_hexa.png",
    title: "MODEL 03 // MADAME HEXA & CARILLON (1987)",
    specs: "HEIGHT: 6'8\" // WEIGHT: 260 LBS // ROUTE: CAM 03 ALCOVE -> WEST SPRINT",
    lore: "Six-armed porcelain marionette suspended from ceiling tracks in the CAM 03 Alcove. Restrained only by the electromagnetic chime of the antique Carillon Music Box. When the Carillon unwinds to 0%, she bolts down CAM 04 at 28 ft/sec.",
    voice: "voice_hexa_whisper",
  },
  grimshaw: {
    img: "assets/images/blueprint_grimshaw.png",
    title: "MODEL 04 // GRIMSHAW THE PLAGUE CROW (1987)",
    specs: "HEIGHT: 6'10\" // WEIGHT: 390 LBS // ROUTE: CAM 05 ROOST -> EAST SPRINT",
    lore: "Wrought-iron avian plague-doctor mascot stationed behind the Crow's Roost curtain in CAM 05 Arcade Alley. Photosensitive amber monocle lenses calm down when observed on CAM 05; if neglected, he breaks out and sprints down CAM 06 toward the Right Door.",
    voice: "voice_grimshaw_whisper",
  },
  silas: {
    img: "assets/images/blueprint_silas.png",
    title: "PROJECT 00 // WITHERED SILAS ('THE CLOCKMAKER')",
    specs: "HEIGHT: 7'0\" // WEIGHT: 510 LBS // ROUTE: CAM 07 BOILER -> CAM 08 OVERHEAD VENT",
    lore: "Original 1987 brass clockwork prototype built by founder Silas Vane in the Sub-Basement Boiler Room. Crawls through the overhead ventilation shaft (CAM 08) directly toward the ceiling grate above the security desk. Seal the Ceiling Vent [V] or discharge the Strobe Flash Beacon [X] to repel him.",
    voice: "voice_silas_whisper",
  },
};

const SALVAGE_UNITS = {
  pete: {
    key: "pete",
    name: "UNIT 01: PUMPKIN PETE — SERVO CALIBRATION",
    perk: "PERK: +15% Auxiliary Generator Battery (115% Start)",
    perkTitle: "+15% Battery Cap",
    aggr: 1.0,
  },
  hexa: {
    key: "hexa",
    name: "UNIT 02: MADAME HEXA — CARILLON TENSION",
    perk: "PERK: -30% Carillon Music Box Unwind Speed on CAM 03",
    perkTitle: "-30% Carillon Unwind",
    aggr: 1.2,
  },
  grimshaw: {
    key: "grimshaw",
    name: "UNIT 03: GRIMSHAW CROW — OPTIC MONOCLE",
    perk: "PERK: -35% Blast Door Impact Battery Drain",
    perkTitle: "-35% Door Impact Drain",
    aggr: 1.35,
  },
  silas: {
    key: "silas",
    name: "UNIT 04: WITHERED SILAS — HEART-SPRING CORE",
    perk: "PERK: +2 Extra Strobe Flash Beacon Charges (5 Total)",
    perkTitle: "+2 Flash Capacitor Charges",
    aggr: 1.5,
  },
  stitch: {
    key: "stitch",
    name: "UNIT 05: BARNABY STITCH — BURLAP JAW LOCK",
    perk: "PERK: -30% Audio Decoy Cooldown (10s Cooldown)",
    perkTitle: "-30% Audio Decoy Cooldown",
    aggr: 1.3,
  },
};

const VHS_1987_DATA = {
  1: {
    img: "assets/images/vhs_1987_1_stage.png",
    title: "EVIDENCE TAPE 01 // THE MAIN SHOW STAGE",
    stamp: "OCT 31, 1987 — 08:15 PM // CAM 01 ARCHIVE",
    desc: "Notice how Pumpkin Pete's jaw servos lock mid-song leaking black oil while founder Silas Vane watches from the backstage curtain.",
    voice: "vhs_1987_log_1",
    cipherChar: "V",
  },
  2: {
    img: "assets/images/vhs_1987_2_backstage.png",
    title: "EVIDENCE TAPE 02 // BACKSTAGE SURGICAL BENCH",
    stamp: "OCT 31, 1987 — 09:40 PM // PARTS & SERVICE",
    desc: "Barnaby Stitch was never stuffed with straw—the agricultural burlap conceals a reinforced brass spring-lock ribcage and beating heart-gear.",
    voice: "vhs_1987_log_2",
    cipherChar: "A",
  },
  3: {
    img: "assets/images/vhs_1987_3_boiler.png",
    title: "EVIDENCE TAPE 03 // SUB-BASEMENT BOILER INTAKE",
    stamp: "OCT 31, 1987 — 10:20 PM // CAM 07 ARCHIVE",
    desc: "Silas Vane welded the master clockwork regulator directly into the coal furnace intake before sealing himself inside the prototype suit.",
    voice: "vhs_1987_log_3",
    cipherChar: "N",
  },
  4: {
    img: "assets/images/vhs_1987_4_carillon.png",
    title: "EVIDENCE TAPE 04 // THE WEEPING MARIONETTE",
    stamp: "OCT 31, 1987 — 11:15 PM // CAM 03 ARCHIVE",
    desc: "Whenever the brass Carillon stops winding, Madame Hexa's cracked white porcelain mask weeps black machine oil and violet arcs.",
    voice: "vhs_1987_log_4",
    cipherChar: "E",
  },
  5: {
    img: "assets/images/vhs_1987_5_ritual.png",
    title: "EVIDENCE TAPE 05 // MIDNIGHT HARVEST CONVERGENCE",
    stamp: "OCT 31, 1987 — 11:58 PM // CAM 02 ARCHIVE",
    desc: "All five animatronics converged around the central dining table in total silence just two minutes before the power grid failed.",
    voice: "vhs_1987_log_5",
    cipherChar: "8",
  },
  6: {
    img: "assets/images/vhs_1987_6_masked_children.png",
    title: "EVIDENCE TAPE 06 // OUTSIDE THE GUARD WINDOW",
    stamp: "NOV 01, 1987 — 12:01 AM // SECURITY OFFICE",
    desc: "Five vintage Halloween masks were left lined up outside the reinforced wire-mesh office window. The pizzeria was condemned at dawn.",
    voice: "vhs_1987_log_6",
    cipherChar: "7",
  },
};

const EPILOGUE_DATA = {
  1: {
    img: "assets/images/epilogue_1_demolition.png",
    title: "CHAPTER 01 // DEMOLITION EVE (NOV 1, 1993)",
    subtitle: "TIMESTAMP: 06:04 AM // EXTERIOR PARKING LOT",
    text: "November first, nineteen ninety-three. As the six A.M. sunrise broke over the condemned roof of Pumpkin Pete's Pizzeria, the heavy municipal wrecking cranes rolled into the parking lot.",
    voice: "epilogue_voice_1",
  },
  2: {
    img: "assets/images/epilogue_2_workshop_door.png",
    title: "CHAPTER 02 // THE LOCKED SUB-BASEMENT",
    subtitle: "TIMESTAMP: 06:18 AM // BELOW CAM 03 ALCOVE",
    text: "Before handing in the master keys, the night watchman followed the trail of black machine oil beneath the Cursed Marionette Alcove—to a padlocked steel door sealed since Halloween Eve, nineteen eighty-seven.",
    voice: "epilogue_voice_2",
  },
  3: {
    img: "assets/images/epilogue_3_silas_journal.png",
    title: "CHAPTER 03 // SILAS VANE'S FINAL LEDGER",
    subtitle: "TIMESTAMP: 06:29 AM // CLOCKMAKER'S WORKBENCH",
    text: "Inside the dusty workshop lay Silas Vane's final ledger. The clockmaker had never left the building. He had wired his own heartbeat into the Carillon's central spring—binding the four autumn mascots to guard the pizzeria forever.",
    voice: "epilogue_voice_3",
  },
  4: {
    img: "assets/images/epilogue_4_sunrise_escape.png",
    title: "CHAPTER 04 // THE HARVEST NEVER ENDS",
    subtitle: "TIMESTAMP: 06:45 AM // AUTUMN HIGHWAY EXIT",
    text: "You cashed your final paycheck and walked away into the November morning. Yet as the wrecking ball struck the front wall, the antique Carillon chime echoed one last time from beneath the rubble. The harvest never truly ends.",
    voice: "epilogue_voice_4",
  },
};

class PumpkinPetesGame {
  constructor() {
    this.titleCanvas = document.getElementById("title-canvas");
    this.titleCtx = this.titleCanvas.getContext("2d");
    this.officeCanvas = document.getElementById("office-canvas");
    this.officeCtx = this.officeCanvas.getContext("2d");
    this.cctvCanvas = document.getElementById("cctv-canvas");
    this.cctvCtx = this.cctvCanvas.getContext("2d");
    this.staticCanvas = document.getElementById("static-canvas");
    this.staticCtx = this.staticCanvas.getContext("2d");
    this.salvageCanvas = document.getElementById("salvage-canvas");
    this.salvageCtx = this.salvageCanvas ? this.salvageCanvas.getContext("2d") : null;

    this.screens = {
      title: document.getElementById("title-screen"),
      intro: document.getElementById("intro-screen"),
      game: document.getElementById("game-screen"),
      gameover: document.getElementById("gameover-screen"),
      win: document.getElementById("win-screen"),
      salvage: document.getElementById("salvage-screen"),
    };

    // Preloaded Image Dictionary (98 generated assets)
    this.images = {};
    this.imageList = {
      title_bg: "assets/images/title_bg.png",
      title_bg_4k: "assets/images/title_bg_4k.png",
      office_base: "assets/images/office_base.png",
      office_left_light_empty: "assets/images/office_left_light_empty.png",
      office_right_light_empty: "assets/images/office_right_light_empty.png",
      office_left_light_stitch: "assets/images/office_left_light_stitch.png",
      office_left_light_hexa: "assets/images/office_left_light_hexa.png",
      office_right_light_pete: "assets/images/office_right_light_pete.png",
      office_right_light_grimshaw: "assets/images/office_right_light_grimshaw.png",
      office_left_window_stitch_close: "assets/images/office_left_window_stitch_close.png",
      office_left_window_hexa_close: "assets/images/office_left_window_hexa_close.png",
      office_right_window_pete_close: "assets/images/office_right_window_pete_close.png",
      office_right_window_grimshaw_close: "assets/images/office_right_window_grimshaw_close.png",
      office_left_door_closed: "assets/images/office_left_door_closed.png",
      office_right_door_closed: "assets/images/office_right_door_closed.png",
      office_vent_peek_silas: "assets/images/office_vent_peek_silas.png",
      office_power_out: "assets/images/office_power_out.png",
      office_power_out_2: "assets/images/office_power_out_2.png",
      hallucination_golden_pete: "assets/images/hallucination_golden_pete.png",
      hallucination_silas_4k: "assets/images/hallucination_silas_4k.png",
      hallucination_hexa_4k: "assets/images/hallucination_hexa_4k.png",
      hallucination_stitch_4k: "assets/images/hallucination_stitch_4k.png",
      hallucination_grimshaw_4k: "assets/images/hallucination_grimshaw_4k.png",
      cam01_empty: "assets/images/cam01_empty.png",
      cam01_both: "assets/images/cam01_both.png",
      cam01_pete: "assets/images/cam01_pete.png",
      cam01_pete_stare: "assets/images/cam01_pete_stare.png",
      cam01_stitch: "assets/images/cam01_stitch.png",
      cam01_stitch_stare: "assets/images/cam01_stitch_stare.png",
      cam02_empty: "assets/images/cam02_empty.png",
      cam02_pete: "assets/images/cam02_pete.png",
      cam02_pete_close: "assets/images/cam02_pete_close.png",
      cam02_stitch: "assets/images/cam02_stitch.png",
      cam02_stitch_close: "assets/images/cam02_stitch_close.png",
      cam02_both: "assets/images/cam02_both.png",
      cam03_empty: "assets/images/cam03_empty.png",
      cam03_stitch: "assets/images/cam03_stitch.png",
      cam03_hexa_1: "assets/images/cam03_hexa_1.png",
      cam03_hexa_2: "assets/images/cam03_hexa_2.png",
      cam03_hexa_stare: "assets/images/cam03_hexa_stare.png",
      cam03_both_hexa_stitch: "assets/images/cam03_both_hexa_stitch.png",
      cam04_empty: "assets/images/cam04_empty.png",
      cam04_stitch: "assets/images/cam04_stitch.png",
      cam04_stitch_close: "assets/images/cam04_stitch_close.png",
      cam04_hexa_sprint: "assets/images/cam04_hexa_sprint.png",
      cam04_both_stitch_hexa: "assets/images/cam04_both_stitch_hexa.png",
      cam04_anomaly_shadow: "assets/images/cam04_anomaly_shadow.png",
      cam05_empty: "assets/images/cam05_empty.png",
      cam05_pete: "assets/images/cam05_pete.png",
      cam05_grimshaw_1: "assets/images/cam05_grimshaw_1.png",
      cam05_grimshaw_2: "assets/images/cam05_grimshaw_2.png",
      cam05_grimshaw_stare: "assets/images/cam05_grimshaw_stare.png",
      cam05_both: "assets/images/cam05_both.png",
      cam05_anomaly_arcade: "assets/images/cam05_anomaly_arcade.png",
      cam06_empty: "assets/images/cam06_empty.png",
      cam06_pete: "assets/images/cam06_pete.png",
      cam06_pete_close: "assets/images/cam06_pete_close.png",
      cam06_grimshaw_sprint: "assets/images/cam06_grimshaw_sprint.png",
      cam06_both_pete_grimshaw: "assets/images/cam06_both_pete_grimshaw.png",
      cam06_anomaly_hooks: "assets/images/cam06_anomaly_hooks.png",
      cam07_empty: "assets/images/cam07_empty.png",
      cam07_silas_1: "assets/images/cam07_silas_1.png",
      cam07_silas_2: "assets/images/cam07_silas_2.png",
      cam07_anomaly_furnace: "assets/images/cam07_anomaly_furnace.png",
      cam08_empty: "assets/images/cam08_empty.png",
      cam08_silas_crawl_1: "assets/images/cam08_silas_crawl_1.png",
      cam08_silas_crawl_2: "assets/images/cam08_silas_crawl_2.png",
      cam08_stitch_crawl: "assets/images/cam08_stitch_crawl.png",
      cam08_anomaly_teeth: "assets/images/cam08_anomaly_teeth.png",
      jumpscare_pete: "assets/images/jumpscare_pete.png",
      jumpscare_pete_2: "assets/images/jumpscare_pete_2.png",
      jumpscare_pete_3: "assets/images/jumpscare_pete_3.png",
      jumpscare_pete_4: "assets/images/jumpscare_pete_4.png",
      jumpscare_stitch: "assets/images/jumpscare_stitch.png",
      jumpscare_stitch_2: "assets/images/jumpscare_stitch_2.png",
      jumpscare_stitch_3: "assets/images/jumpscare_stitch_3.png",
      jumpscare_stitch_4: "assets/images/jumpscare_stitch_4.png",
      jumpscare_hexa: "assets/images/jumpscare_hexa.png",
      jumpscare_hexa_2: "assets/images/jumpscare_hexa_2.png",
      jumpscare_hexa_3: "assets/images/jumpscare_hexa_3.png",
      jumpscare_hexa_4: "assets/images/jumpscare_hexa_4.png",
      jumpscare_grimshaw: "assets/images/jumpscare_grimshaw.png",
      jumpscare_grimshaw_2: "assets/images/jumpscare_grimshaw_2.png",
      jumpscare_grimshaw_3: "assets/images/jumpscare_grimshaw_3.png",
      jumpscare_grimshaw_4: "assets/images/jumpscare_grimshaw_4.png",
      jumpscare_silas: "assets/images/jumpscare_silas.png",
      jumpscare_silas_2: "assets/images/jumpscare_silas_2.png",
      jumpscare_silas_3: "assets/images/jumpscare_silas_3.png",
      jumpscare_silas_4: "assets/images/jumpscare_silas_4.png",
      sprite_pete: "assets/images/sprite_pete.png",
      sprite_stitch: "assets/images/sprite_stitch.png",
      sprite_hexa: "assets/images/sprite_hexa.png",
      sprite_grimshaw: "assets/images/sprite_grimshaw.png",
      sprite_silas: "assets/images/sprite_silas.png",
      sprite_plush_pete: "assets/images/sprite_plush_pete.png",
      blueprint_pete: "assets/images/blueprint_pete.png",
      blueprint_stitch: "assets/images/blueprint_stitch.png",
      blueprint_hexa: "assets/images/blueprint_hexa.png",
      blueprint_grimshaw: "assets/images/blueprint_grimshaw.png",
      blueprint_silas: "assets/images/blueprint_silas.png",
      win_night5_paycheck: "assets/images/win_night5_paycheck.png",
      win_overtime_trophy: "assets/images/win_overtime_trophy.png",
      lore_newspaper_1987: "assets/images/lore_newspaper_1987.png",
      epilogue_1_demolition: "assets/images/epilogue_1_demolition.png",
      epilogue_2_workshop_door: "assets/images/epilogue_2_workshop_door.png",
      epilogue_3_silas_journal: "assets/images/epilogue_3_silas_journal.png",
      epilogue_4_sunrise_escape: "assets/images/epilogue_4_sunrise_escape.png",
      cam01_anomaly_poster: "assets/images/cam01_anomaly_poster.png",
      cam02_anomaly_jackolanterns: "assets/images/cam02_anomaly_jackolanterns.png",
      cam03_anomaly_masks: "assets/images/cam03_anomaly_masks.png",
      salvage_table_empty: "assets/images/salvage_table_empty.png",
      salvage_pete_1: "assets/images/salvage_pete_1.png",
      salvage_pete_2: "assets/images/salvage_pete_2.png",
      salvage_pete_3: "assets/images/salvage_pete_3.png",
      salvage_hexa_1: "assets/images/salvage_hexa_1.png",
      salvage_hexa_2: "assets/images/salvage_hexa_2.png",
      salvage_hexa_3: "assets/images/salvage_hexa_3.png",
      salvage_grimshaw_1: "assets/images/salvage_grimshaw_1.png",
      salvage_grimshaw_2: "assets/images/salvage_grimshaw_2.png",
      salvage_grimshaw_3: "assets/images/salvage_grimshaw_3.png",
      salvage_silas_1: "assets/images/salvage_silas_1.png",
      salvage_silas_2: "assets/images/salvage_silas_2.png",
      salvage_silas_3: "assets/images/salvage_silas_3.png",
      salvage_stitch_1: "assets/images/salvage_stitch_1.png",
      salvage_stitch_2: "assets/images/salvage_stitch_2.png",
      salvage_stitch_3: "assets/images/salvage_stitch_3.png",
      vhs_1987_1_stage: "assets/images/vhs_1987_1_stage.png",
      vhs_1987_2_backstage: "assets/images/vhs_1987_2_backstage.png",
      vhs_1987_3_boiler: "assets/images/vhs_1987_3_boiler.png",
      vhs_1987_4_carillon: "assets/images/vhs_1987_4_carillon.png",
      vhs_1987_5_ritual: "assets/images/vhs_1987_5_ritual.png",
      vhs_1987_6_masked_children: "assets/images/vhs_1987_6_masked_children.png",
      win_collector_poster_4k: "assets/images/win_collector_poster_4k.png",
    };

    // Campaign & Custom Night Settings
    this.mode = "normal"; // "normal" | "nightmare" | "custom"
    this.selectedNight = 1; // 1..5
    this.customLevels = { pete: 10, stitch: 10, hexa: 10, grimshaw: 10, silas: 10 };
    this.nightDuration = 270; // 4.5 minutes (270s) for 12:00 AM -> 6:00 AM (45s per in-game hour)
    this.currentBlueprintChar = "pete";
    this.currentEpilogueChapter = 1;
    this.currentVhsTape = 1;
    this.vhsDecoded = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };

    // Completion Badges & Salvage Upgrades persisted in localStorage
    this.stars = { night1: false, night5: false, overtime: false };
    this.perks = { pete: false, hexa: false, grimshaw: false, silas: false, stitch: false };
    this.loadStars();

    this.mouseNormX = 0.5;
    this.mouseNormY = 0.5;
    this.keysDown = {};
    this.windingBox = false;
    this.salvageWorking = false;
    this.lastFrameTime = performance.now();

    // Floating atmospheric dust particles in the security office
    this.dustMotes = Array.from({ length: 28 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 768,
      r: 1.0 + Math.random() * 2.2,
      vx: -6 + Math.random() * 12,
      vy: -8 - Math.random() * 10,
      alpha: 0.15 + Math.random() * 0.35,
    }));

    this.preloadImages();
    this.resetState();
    this.bindEvents();
    this.syncStarsUI();
    requestAnimationFrame((ts) => this.loop(ts));
  }

  loadStars() {
    try {
      const raw = localStorage.getItem("pumpkin_petes_stars_v3");
      if (raw) {
        const parsed = JSON.parse(raw);
        this.stars = { ...this.stars, ...parsed };
      }
      const rawPerks = localStorage.getItem("pumpkin_petes_perks_v4");
      if (rawPerks) {
        const parsedPerks = JSON.parse(rawPerks);
        this.perks = { ...this.perks, ...parsedPerks };
      }
    } catch (_) {}
  }

  saveStars() {
    try {
      localStorage.setItem("pumpkin_petes_stars_v3", JSON.stringify(this.stars));
      localStorage.setItem("pumpkin_petes_perks_v4", JSON.stringify(this.perks));
    } catch (_) {}
    this.syncStarsUI();
  }

  syncStarsUI() {
    document.getElementById("star-night1")?.classList.toggle("unlocked", Boolean(this.stars.night1));
    document.getElementById("star-night5")?.classList.toggle("unlocked", Boolean(this.stars.night5));
    document.getElementById("star-overtime")?.classList.toggle("unlocked", Boolean(this.stars.overtime));
    ["pete", "hexa", "grimshaw", "silas", "stitch"].forEach((u) => {
      const btn = document.querySelector(`.salvage-unit-btn[data-unit='${u}']`);
      const badge = document.getElementById(`perk-badge-${u}`);
      if (btn) btn.classList.toggle("completed", Boolean(this.perks[u]));
      if (badge && SALVAGE_UNITS[u]) {
        badge.textContent = this.perks[u] ? `✓ ${SALVAGE_UNITS[u].perkTitle}` : SALVAGE_UNITS[u].perkTitle;
      }
    });
  }

  preloadImages() {
    for (const [key, src] of Object.entries(this.imageList)) {
      const img = new Image();
      img.src = src;
      this.images[key] = img;
    }
  }

  resetState() {
    const startPower = this.perks?.pete ? 115.0 : 100.0;
    const startFlashes = this.perks?.silas ? 5 : 3;
    this.state = {
      phase: "title", // "title" | "intro" | "playing" | "powerout" | "jumpscare" | "gameover" | "win" | "salvage"
      elapsedSec: 0,
      hour: 0, // 0 = 12 AM, 1 = 1 AM ... 6 = 6 AM
      power: startPower,
      usage: 1,

      // Office View, Doors, Lights, Ceiling Vent & Strobe Flash Beacon
      officePanX: 0.5, // 0.0 (far left) to 1.0 (far right), 0.5 = center desk
      leftDoorClosed: false,
      rightDoorClosed: false,
      leftDoorAnim: 0.0, // 0 open -> 1 closed
      rightDoorAnim: 0.0,
      leftLightOn: false,
      rightLightOn: false,
      leftDoorJammed: false,
      rightDoorJammed: false,
      ventSealed: false,
      flashCharges: startFlashes,
      flashCooldown: 0.0,
      flashAlpha: 0.0,
      ghostCallRinging: false,
      ghostCallsTriggered: { 2: false, 4: false },

      // Thermal Desk Fan & Guard Heart Rate (BPM) System
      fanOn: true,
      officeTemp: 68.0, // 68°F baseline -> 120°F max
      heartBpm: 72.0, // 72 BPM calm -> 168 BPM panic
      heartbeatLooping: false,

      // CCTV Tablet + Tactical Tools
      camOpen: false,
      currentCam: "cam01",
      camStaticAlpha: 0.0,
      camPanPhase: 0.0,
      camOpenContinuousSec: 0.0,
      decoyCooldown: 0.0,
      decoyActiveRoom: null,
      decoyActiveTimer: 0.0,
      camJammedTimer: 0.0,
      hallucinationTimer: 0.0,
      hallucinationType: "golden_pete",

      // Animatronic 1: Pumpkin Pete (East Route: cam01 -> cam02 -> cam05 -> cam06 -> right_door)
      pete: {
        loc: "cam01",
        ai: 6,
        moveTimer: 0,
        doorWaitSec: 0,
        spottedInLight: false,
        closeStare: false,
      },

      // Animatronic 2: Barnaby Stitch (West Route: cam01 -> cam02 -> cam03 -> cam04 -> left_door)
      stitch: {
        loc: "cam01",
        ai: 6,
        moveTimer: 0,
        doorWaitSec: 0,
        spottedInLight: false,
        closeStare: false,
      },

      // Animatronic 3: Madame Hexa (CAM 03 Carillon Music Box -> West Sprint -> left_door)
      hexa: {
        ai: 6,
        carillon: 100.0, // 100% -> 0%
        stage: 0, // 0 (>50%), 1 (20-50%), 2 (1-20%), 3 (0% SPRINTING DOWN WEST HALL!)
        sprintTimer: 0,
        closeStare: false,
      },

      // Animatronic 4: Grimshaw the Plague Crow (CAM 05 Roost Curtain -> East Sprint -> right_door)
      grimshaw: {
        ai: 4,
        calm: 100.0, // 100% -> 0%
        stage: 0, // 0 (>55% Curtain Closed), 1 (25-55% Peeking), 2 (1-25% In Arcade Aisle), 3 (0% SPRINTING DOWN EAST HALL!)
        sprintTimer: 0,
        closeStare: false,
      },

      // Animatronic 5: Withered Silas ("The Clockmaker" — CAM 07 Boiler -> CAM 08 Overhead Vent -> Ceiling Grate)
      silas: {
        ai: 0,
        loc: "cam07", // "cam07" | "cam08" | "vent_peek"
        stage: 0, // 0..2 in current location
        moveTimer: 0,
        ventWaitSec: 0,
      },

      // Sub-Basement Workshop Salvage State
      salvage: {
        unit: "pete", // "pete" | "hexa" | "grimshaw" | "silas"
        progress: 0.0, // 0..100%
        agitation: 0.0, // 0..100% (0-42 = Stage 1 Dormant, 42-76 = Stage 2 Watching, 76-99 = Stage 3 Leaning, 100 = Jumpscare)
        stage: 1, // 1 | 2 | 3
        shocksLeft: 3,
        shockFlashAlpha: 0.0,
        lampSwingPhase: 0.0,
      },

      // Power Outage Sequence
      powerOutStage: 0,
      powerOutTimer: 0,

      // Jumpscare Sequence
      jumpscareWho: "pete",
      jumpscareTimer: 0,
      previewJumpscareReturnToExtras: false,

      // Desk Fan Rotation
      fanAngle: 0,

      // Telemetry Stats & Whisper Triggers
      stats: {
        doorCloses: 0,
        ventSeals: 0,
        flashesUsed: 0,
        boxWinds: 0,
        hexasBlocked: 0,
        grimshawsBlocked: 0,
        silasBlocked: 0,
        decoysUsed: 0,
      },
      whispersPlayed: {
        pete: false,
        stitch: false,
        hexa: false,
        grimshaw: false,
        silas: false,
        lateAmbience: false,
      },
    };
  }

  bindEvents() {
    const startAudioOnce = () => {
      window.audioEngine.init();
      if (this.state.phase === "title") {
        window.audioEngine.startMenuMusic();
      }
    };
    window.addEventListener("pointerdown", startAudioOnce, { once: true });
    window.addEventListener("keydown", startAudioOnce, { once: true });

    // 5-Night Campaign Selector Pills
    document.querySelectorAll(".night-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.audioEngine.play("cam_blip", { volume: 0.6 });
        this.selectCampaignNight( parseInt(btn.dataset.night, 10) || 1 );
      });
    });

    // Title Menu Buttons
    document.getElementById("btn-start-night").addEventListener("click", () => {
      this.mode = "normal";
      this.showIntro();
    });

    document.getElementById("btn-open-salvage")?.addEventListener("click", () => {
      this.openSalvageMode("pete");
    });

    document.getElementById("btn-nightmare-mode").addEventListener("click", () => {
      this.mode = "nightmare";
      this.showIntro();
    });

    document.getElementById("btn-custom-night").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      window.audioEngine.stopLoop("bgm_menu");
      window.audioEngine.startLoop("bgm_custom_night", { volume: 0.38 });
      document.getElementById("custom-night-panel").classList.remove("hidden");
    });

    document.getElementById("btn-close-custom").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      window.audioEngine.stopLoop("bgm_custom_night");
      window.audioEngine.startMenuMusic();
      document.getElementById("custom-night-panel").classList.add("hidden");
    });

    document.querySelectorAll(".step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = btn.dataset.char;
        const delta = parseInt(btn.dataset.delta, 10);
        this.customLevels[ch] = Math.max(0, Math.min(20, (this.customLevels[ch] ?? 10) + delta));
        document.getElementById(`lvl-${ch}`).textContent = this.customLevels[ch];
        window.audioEngine.play("cam_blip", { volume: 0.5 });
      });
    });

    document.querySelectorAll(".preset-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parts = (btn.dataset.preset || "10,10,10,10,10").split(",").map((n) => parseInt(n, 10));
        const keys = ["pete", "stitch", "hexa", "grimshaw", "silas"];
        keys.forEach((k, idx) => {
          this.customLevels[k] = parts[idx] ?? 10;
          const el = document.getElementById(`lvl-${k}`);
          if (el) el.textContent = this.customLevels[k];
        });
        window.audioEngine.play("cam_blip", { volume: 0.65 });
      });
    });

    document.getElementById("btn-launch-custom").addEventListener("click", () => {
      document.getElementById("custom-night-panel").classList.add("hidden");
      window.audioEngine.stopLoop("bgm_custom_night");
      this.mode = "custom";
      this.showIntro();
    });

    // Extras & Blueprints Vault Modal
    document.getElementById("btn-open-extras").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      window.audioEngine.stopLoop("bgm_menu");
      window.audioEngine.startLoop("bgm_extras", { volume: 0.4 });
      document.getElementById("extras-panel").classList.remove("hidden");
    });

    document.getElementById("btn-close-extras").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      window.audioEngine.stopPhoneCall();
      window.audioEngine.stopLoop("bgm_extras");
      window.audioEngine.stopLoop("bgm_epilogue");
      window.audioEngine.stopLoop("bgm_vhs_1987");
      window.audioEngine.startMenuMusic();
      document.getElementById("extras-panel").classList.add("hidden");
    });

    document.querySelectorAll(".extras-tab").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        window.audioEngine.play("cam_blip", { volume: 0.55 });
        const tabName = tabBtn.dataset.tab;
        document.querySelectorAll(".extras-tab").forEach((b) => b.classList.toggle("active", b === tabBtn));
        document.querySelectorAll(".extras-tab-body").forEach((panel) => {
          panel.classList.toggle("hidden", panel.id !== `extras-tab-${tabName}`);
        });
        window.audioEngine.stopLoop("bgm_extras");
        window.audioEngine.stopLoop("bgm_epilogue");
        window.audioEngine.stopLoop("bgm_vhs_1987");
        if (tabName === "epilogue") {
          window.audioEngine.startLoop("bgm_epilogue", { volume: 0.42 });
        } else if (tabName === "vhs") {
          window.audioEngine.play("vhs_tape_insert", { volume: 0.8 });
          window.audioEngine.startLoop("bgm_vhs_1987", { volume: 0.42 });
          this.selectVhsTape(this.currentVhsTape || 1, false);
        } else {
          window.audioEngine.startLoop("bgm_extras", { volume: 0.4 });
        }
      });
    });

    document.querySelectorAll(".bp-char-btn:not(.epilogue-ch-btn):not(.vhs-tape-btn)").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.audioEngine.play("cam_blip", { volume: 0.55 });
        const key = btn.dataset.bp;
        this.selectBlueprintChar(key);
      });
    });

    document.querySelectorAll(".epilogue-ch-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.audioEngine.play("cam_blip", { volume: 0.55 });
        const ch = parseInt(btn.dataset.ep, 10) || 1;
        this.selectEpilogueChapter(ch, true);
      });
    });

    document.querySelectorAll(".vhs-tape-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.audioEngine.play("vhs_tape_insert", { volume: 0.72 });
        const tapeNum = parseInt(btn.dataset.vhs, 10) || 1;
        this.selectVhsTape(tapeNum, true);
      });
    });

    document.getElementById("btn-vhs-voice")?.addEventListener("click", () => {
      const info = VHS_1987_DATA[this.currentVhsTape || 1];
      if (info && info.voice) {
        window.audioEngine.play(info.voice, { volume: 0.92, pan: 0 });
      }
    });

    document.getElementById("btn-vhs-decode")?.addEventListener("click", () => {
      this.decodeVhsAnomaly();
    });

    document.getElementById("btn-play-epilogue")?.addEventListener("click", () => {
      const info = EPILOGUE_DATA[this.currentEpilogueChapter];
      if (info && info.voice) {
        window.audioEngine.play(info.voice, { volume: 0.92, pan: 0 });
      }
    });

    document.getElementById("btn-next-epilogue")?.addEventListener("click", () => {
      window.audioEngine.play("cam_blip", { volume: 0.55 });
      const nextCh = (this.currentEpilogueChapter % 4) + 1;
      this.selectEpilogueChapter(nextCh, true);
    });

    document.getElementById("btn-bp-voice").addEventListener("click", () => {
      const info = BLUEPRINT_DATA[this.currentBlueprintChar];
      if (info && info.voice) {
        window.audioEngine.play(info.voice, { volume: 0.9, pan: 0 });
      }
    });

    document.getElementById("btn-bp-jumpscare").addEventListener("click", () => {
      document.getElementById("extras-panel").classList.add("hidden");
      window.audioEngine.stopLoop("bgm_extras");
      this.state.previewJumpscareReturnToExtras = true;
      this.switchScreen("game");
      this.triggerJumpscare(this.currentBlueprintChar, "Blueprint Vault Jumpscare Simulation");
    });

    document.querySelectorAll(".tape-play-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tapeKey = btn.dataset.tape || "phone_guy_night1";
        const nightNum = parseInt(tapeKey.replace("phone_guy_night", ""), 10) || 1;
        window.audioEngine.startPhoneCall(nightNum);
      });
    });

    // Security Field Manual
    document.getElementById("btn-open-manual").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      document.getElementById("manual-panel").classList.remove("hidden");
    });

    document.getElementById("btn-close-manual").addEventListener("click", () => {
      window.audioEngine.play("cam_blip");
      document.getElementById("manual-panel").classList.add("hidden");
    });

    // Intro Skip
    document.getElementById("btn-skip-intro").addEventListener("click", () => {
      this.startNightShift();
    });

    // Mute Phone Guy
    document.getElementById("btn-mute-call").addEventListener("click", () => {
      this.muteCall();
    });

    // Office Door & Light Controls
    document.getElementById("btn-left-door").addEventListener("click", () => this.toggleDoor("left"));
    document.getElementById("btn-right-door").addEventListener("click", () => this.toggleDoor("right"));
    document.getElementById("btn-left-light").addEventListener("click", () => this.toggleLight("left"));
    document.getElementById("btn-right-light").addEventListener("click", () => this.toggleLight("right"));

    // Thermal Desk Fan, Overhead Ceiling Vent, Flash Beacon & Haunted Rotary Phone Buttons
    document.getElementById("btn-toggle-fan").addEventListener("click", () => this.toggleDeskFan());
    document.getElementById("btn-vent-seal")?.addEventListener("click", () => this.toggleVentSeal());
    document.getElementById("btn-flash-beacon")?.addEventListener("click", () => this.triggerFlashBeacon());
    document.getElementById("btn-answer-ghost")?.addEventListener("click", () => this.answerGhostCall());

    // Sub-Basement Workshop Salvage Controls
    document.getElementById("btn-salvage-exit")?.addEventListener("click", () => {
      this.salvageWorking = false;
      this.returnToMenu();
    });

    document.querySelectorAll(".salvage-unit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.audioEngine.play("cam_blip", { volume: 0.6 });
        this.selectSalvageUnit(btn.dataset.unit || "pete");
      });
    });

    const salvageWorkBtn = document.getElementById("btn-salvage-work");
    if (salvageWorkBtn) {
      const startSalvageWork = (e) => {
        e.preventDefault();
        if (this.state.phase === "salvage" && this.state.salvage.progress < 100) {
          this.salvageWorking = true;
          salvageWorkBtn.classList.add("winding");
          window.audioEngine.play("salvage_servo_tune", { volume: 0.7 });
        }
      };
      const stopSalvageWork = () => {
        this.salvageWorking = false;
        salvageWorkBtn.classList.remove("winding");
      };
      salvageWorkBtn.addEventListener("pointerdown", startSalvageWork);
      window.addEventListener("pointerup", stopSalvageWork);
      window.addEventListener("pointercancel", stopSalvageWork);
    }

    document.getElementById("btn-salvage-shock")?.addEventListener("click", () => {
      this.triggerSalvageShock();
    });

    // CCTV Monitor Flip Bar
    document.getElementById("btn-toggle-Monitor").addEventListener("click", () => this.toggleCameraTablet());

    // CCTV Tactical Buttons (Audio Decoy & Feed Reboot)
    document.getElementById("btn-audio-decoy").addEventListener("click", () => this.triggerAudioDecoy());
    document.getElementById("btn-reboot-cam").addEventListener("click", () => this.rebootCameraFeed());

    // CCTV Map Camera Nodes
    document.querySelectorAll(".cam-node").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectCamera(btn.dataset.cam);
      });
    });

    // CAM 03 Carillon Music Box Winding Button (Hold)
    const windBtn = document.getElementById("btn-wind-box");
    const startWind = (e) => {
      e.preventDefault();
      if (this.state.phase === "playing" && this.state.camOpen && this.state.currentCam === "cam03") {
        this.windingBox = true;
        windBtn.classList.add("winding");
        window.audioEngine.play("music_box_wind", { volume: 0.65 });
      }
    };
    const stopWind = () => {
      this.windingBox = false;
      windBtn.classList.remove("winding");
    };
    windBtn.addEventListener("pointerdown", startWind);
    window.addEventListener("pointerup", stopWind);
    window.addEventListener("pointercancel", stopWind);

    // Mouse Move for Office Panning & Dynamic Flashlight Cone
    window.addEventListener("mousemove", (e) => {
      this.mouseNormX = Math.max(0, Math.min(1, e.clientX / Math.max(1, window.innerWidth)));
      this.mouseNormY = Math.max(0, Math.min(1, e.clientY / Math.max(1, window.innerHeight)));
    });

    // Click Hotspots on Office Canvas (Poster Nose Honk, Desk Fan, CRT Monitors, In-World Door/Light Buttons)
    this.officeCanvas.addEventListener("click", (e) => {
      if (this.state.phase !== "playing" || this.state.camOpen) return;
      const rect = this.officeCanvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / Math.max(1, rect.width);
      const relY = (e.clientY - rect.top) / Math.max(1, rect.height);
      const worldX = this.state.officePanX * (1920 - 1376) + relX * 1376;
      const worldY = relY * 768;

      // Center wall Pumpkin Pete poster nose honk easter egg
      if (worldX > 900 && worldX < 1030 && worldY > 235 && worldY < 355) {
        window.audioEngine.playHonk();
        this.showWarningSubtitle("🎃 *HONK!* Pumpkin Pete's Nose Squeaked!", 1800);
        return;
      }
      // Desk Fan click hotspot (x: 700..830, y: 295..445)
      if (worldX > 700 && worldX < 830 && worldY > 295 && worldY < 445) {
        this.toggleDeskFan();
        return;
      }
      // Desk CRT Monitors click hotspot -> opens CCTV Tablet (x: 980..1240, y: 365..465)
      if (worldX > 980 && worldX < 1240 && worldY > 365 && worldY < 465) {
        this.toggleCameraTablet();
        return;
      }
      // In-world Left Wall Door & Light buttons
      if (worldX >= 145 && worldX <= 235) {
        if (worldY >= 360 && worldY <= 440) {
          this.toggleDoor("left");
          return;
        }
        if (worldY > 440 && worldY <= 525) {
          this.toggleLight("left");
          return;
        }
      }
      // In-world Right Wall Door & Light buttons
      if (worldX >= 1685 && worldX <= 1775) {
        if (worldY >= 360 && worldY <= 440) {
          this.toggleDoor("right");
          return;
        }
        if (worldY > 440 && worldY <= 525) {
          this.toggleLight("right");
          return;
        }
      }
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      this.keysDown[e.code] = true;

      if (this.state.phase === "title" && e.code === "Space") {
        const customOpen = !document.getElementById("custom-night-panel").classList.contains("hidden");
        const manualOpen = !document.getElementById("manual-panel").classList.contains("hidden");
        const extrasOpen = !document.getElementById("extras-panel").classList.contains("hidden");
        if (!customOpen && !manualOpen && !extrasOpen) {
          e.preventDefault();
          this.mode = "normal";
          this.showIntro();
        }
        return;
      }

      if (this.state.phase === "intro" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        this.startNightShift();
        return;
      }

      if (this.state.phase === "gameover" && (e.code === "Space" || e.code === "KeyR")) {
        e.preventDefault();
        this.startNightShift();
        return;
      }

      if (this.state.phase === "win" && e.code === "Space") {
        e.preventDefault();
        this.advanceOrRestartAfterWin();
        return;
      }

      if (this.state.phase === "salvage") {
        if (e.code === "Space") {
          e.preventDefault();
          this.triggerSalvageShock();
        } else if (e.code === "KeyW" && !this.salvageWorking && this.state.salvage.progress < 100) {
          this.salvageWorking = true;
          document.getElementById("btn-salvage-work")?.classList.add("winding");
          window.audioEngine.play("salvage_servo_tune", { volume: 0.7 });
        }
        return;
      }

      if (this.state.phase !== "playing") return;

      if (e.code === "Space") {
        e.preventDefault();
        this.toggleCameraTablet();
      } else if (e.code === "KeyA") {
        this.toggleDoor("left");
      } else if (e.code === "KeyD") {
        this.toggleDoor("right");
      } else if (e.code === "KeyQ") {
        this.toggleLight("left");
      } else if (e.code === "KeyE") {
        this.toggleLight("right");
      } else if (e.code === "KeyV") {
        this.toggleVentSeal();
      } else if (e.code === "KeyX") {
        this.triggerFlashBeacon();
      } else if (e.code === "KeyP") {
        this.answerGhostCall();
      } else if (e.code === "KeyF") {
        this.toggleDeskFan();
      } else if (e.code === "KeyM") {
        this.muteCall();
      } else if (e.code === "KeyC" && this.state.camOpen) {
        this.triggerAudioDecoy();
      } else if (e.code === "KeyR" && this.state.camOpen) {
        this.rebootCameraFeed();
      } else if (e.code === "KeyW") {
        if (this.state.camOpen && this.state.currentCam === "cam03" && !this.windingBox) {
          this.windingBox = true;
          document.getElementById("btn-wind-box").classList.add("winding");
          window.audioEngine.play("music_box_wind", { volume: 0.65 });
        }
      } else if (e.code.startsWith("Digit")) {
        const num = parseInt(e.code.replace("Digit", ""), 10);
        if (num >= 1 && num <= 8) {
          const camId = `cam0${num}`;
          if (!this.state.camOpen) this.toggleCameraTablet();
          this.selectCamera(camId);
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keysDown[e.code] = false;
      if (e.code === "KeyW") {
        this.windingBox = false;
        this.salvageWorking = false;
        document.getElementById("btn-wind-box")?.classList.remove("winding");
        document.getElementById("btn-salvage-work")?.classList.remove("winding");
      }
    });

    // End Screen Buttons
    document.getElementById("btn-retry").addEventListener("click", () => {
      this.startNightShift();
    });
    document.getElementById("btn-gameover-menu").addEventListener("click", () => {
      this.returnToMenu();
    });
    document.getElementById("btn-play-again").addEventListener("click", () => {
      this.advanceOrRestartAfterWin();
    });
    document.getElementById("btn-win-salvage")?.addEventListener("click", () => {
      this.openSalvageMode("pete");
    });
    document.getElementById("btn-win-nightmare").addEventListener("click", () => {
      this.mode = "nightmare";
      this.startNightShift();
    });
    document.getElementById("btn-win-epilogue")?.addEventListener("click", () => {
      this.openEpilogueFromWin();
    });
    document.getElementById("btn-win-menu").addEventListener("click", () => {
      this.returnToMenu();
    });
  }

  selectEpilogueChapter(chNum, playVoice = false) {
    const ch = Math.max(1, Math.min(4, chNum));
    this.currentEpilogueChapter = ch;
    const info = EPILOGUE_DATA[ch];
    if (!info) return;
    document.querySelectorAll(".epilogue-ch-btn").forEach((b) => {
      b.classList.toggle("active", parseInt(b.dataset.ep, 10) === ch);
    });
    const imgEl = document.getElementById("epilogue-img");
    if (imgEl) imgEl.src = info.img;
    const titleEl = document.getElementById("epilogue-title");
    if (titleEl) titleEl.textContent = info.title;
    const subEl = document.getElementById("epilogue-subtitle");
    if (subEl) subEl.textContent = info.subtitle;
    const txtEl = document.getElementById("epilogue-text");
    if (txtEl) txtEl.textContent = info.text;
    if (playVoice && info.voice) {
      window.audioEngine.play(info.voice, { volume: 0.92, pan: 0 });
    }
  }

  selectVhsTape(tapeNum, playVoice = false) {
    const t = Math.max(1, Math.min(6, tapeNum));
    this.currentVhsTape = t;
    const info = VHS_1987_DATA[t];
    if (!info) return;
    document.querySelectorAll(".vhs-tape-btn").forEach((b) => {
      b.classList.toggle("active", parseInt(b.dataset.vhs, 10) === t);
    });
    const imgEl = document.getElementById("vhs-deck-img");
    if (imgEl) imgEl.src = info.img;
    const titleEl = document.getElementById("vhs-deck-title");
    if (titleEl) titleEl.textContent = info.title;
    const stampEl = document.getElementById("vhs-deck-stamp");
    if (stampEl) stampEl.textContent = info.stamp;
    const descEl = document.getElementById("vhs-deck-desc");
    if (descEl) descEl.textContent = info.desc;
    this.updateVhsCipherUI();
    if (playVoice && info.voice) {
      window.audioEngine.play(info.voice, { volume: 0.92, pan: 0 });
    }
  }

  decodeVhsAnomaly() {
    const t = this.currentVhsTape || 1;
    this.vhsDecoded[t] = true;
    window.audioEngine.play("anomaly_decode_chime", { volume: 0.88, pan: 0 });
    this.updateVhsCipherUI();
  }

  updateVhsCipherUI() {
    const statusEl = document.getElementById("vhs-cipher-status");
    if (!statusEl) return;
    let count = 0;
    const chars = [];
    for (let i = 1; i <= 6; i++) {
      if (this.vhsDecoded[i]) {
        count++;
        chars.push(VHS_1987_DATA[i].cipherChar);
      } else {
        chars.push("?");
      }
    }
    statusEl.textContent =
      count === 6
        ? `✔ ALL 6 ANOMALIES DECODED // MASTER CIPHER UNLOCKED: [ V - A - N - E - 8 - 7 ]`
        : `DECODED ANOMALIES: ${count} / 6 // CIPHER: [ ${chars.join(" - ")} ]`;
  }

  openEpilogueFromWin() {
    this.returnToMenu();
    window.audioEngine.stopLoop("bgm_menu");
    window.audioEngine.startLoop("bgm_epilogue", { volume: 0.42 });
    document.getElementById("extras-panel").classList.remove("hidden");
    document.querySelectorAll(".extras-tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === "epilogue");
    });
    document.querySelectorAll(".extras-tab-body").forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== "extras-tab-epilogue");
    });
    this.selectEpilogueChapter(1, true);
  }

  selectCampaignNight(nightNum) {
    this.selectedNight = Math.max(1, Math.min(5, nightNum));
    document.querySelectorAll(".night-pill").forEach((pill) => {
      pill.classList.toggle("active", parseInt(pill.dataset.night, 10) === this.selectedNight);
    });
    const lbl = document.getElementById("start-night-btn-text");
    if (lbl) {
      lbl.textContent = `Start Night ${this.selectedNight} Shift`;
    }
  }

  selectBlueprintChar(charKey) {
    if (!BLUEPRINT_DATA[charKey]) return;
    this.currentBlueprintChar = charKey;
    const info = BLUEPRINT_DATA[charKey];
    document.querySelectorAll(".bp-char-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.bp === charKey);
    });
    document.getElementById("blueprint-img").src = info.img;
    document.getElementById("bp-title").textContent = info.title;
    document.getElementById("bp-specs").textContent = info.specs;
    document.getElementById("bp-lore").textContent = info.lore;
  }

  advanceOrRestartAfterWin() {
    if (this.mode === "normal" && this.selectedNight < 5) {
      this.selectCampaignNight(this.selectedNight + 1);
    }
    this.startNightShift();
  }

  switchScreen(name) {
    Object.entries(this.screens).forEach(([k, el]) => {
      el.classList.toggle("active", k === name);
    });
  }

  returnToMenu() {
    window.audioEngine.stopAllLoops();
    this.resetState();
    this.state.phase = "title";
    this.switchScreen("title");
    window.audioEngine.startMenuMusic();
  }

  showIntro() {
    window.audioEngine.init();
    window.audioEngine.stopMenuMusic();
    window.audioEngine.play("cam_toggle", { volume: 0.7 });
    this.state.phase = "intro";

    const cfg = NIGHT_CONFIGS[this.selectedNight] || NIGHT_CONFIGS[1];
    let label = cfg.title;
    let headline = cfg.headline;
    if (this.mode === "nightmare") {
      label = "12:00 AM — NIGHT 6: HALLOWEEN OVERTIME";
      headline = "FINAL OVERTIME: MAXIMUM HAZARD PAY ($120.50)";
    } else if (this.mode === "custom") {
      label = `12:00 AM — CUSTOM SHIFT (${this.customLevels.pete}/${this.customLevels.stitch}/${this.customLevels.hexa}/${this.customLevels.grimshaw}/${this.customLevels.silas})`;
      headline = "CUSTOM SECURITY SHIFT — AI OVERRIDE ACTIVE";
    }

    document.getElementById("intro-shift-label").textContent = label;
    document.getElementById("intro-paper-headline").textContent = headline;
    this.switchScreen("intro");

    if (this.introTimeout) clearTimeout(this.introTimeout);
    this.introTimeout = setTimeout(() => {
      if (this.state.phase === "intro") {
        this.startNightShift();
      }
    }, 3400);
  }

  startNightShift() {
    if (this.introTimeout) clearTimeout(this.introTimeout);
    window.audioEngine.stopAllLoops();
    this.resetState();
    this.state.phase = "playing";

    // Apply Salvage Workshop Perk 1: Pumpkin Pete (+15% Auxiliary Generator Battery)
    if (this.perks && this.perks.pete) {
      this.state.power = 115.0;
    }
    // Apply Salvage Workshop Perk 4: Withered Silas (+2 Extra Strobe Flash Charges = 5 Total)
    if (this.perks && this.perks.silas) {
      this.state.flashCharges = 5;
    }

    const cfg = NIGHT_CONFIGS[this.selectedNight] || NIGHT_CONFIGS[1];
    let tapeNight = this.selectedNight;

    // Set initial AI levels based on mode and night
    if (this.mode === "nightmare") {
      this.state.pete.ai = 16;
      this.state.stitch.ai = 16;
      this.state.hexa.ai = 16;
      this.state.grimshaw.ai = 16;
      this.state.silas.ai = 16;
      tapeNight = 6;
      document.getElementById("hud-night-label").textContent = "NIGHT 6 // OVERTIME";
      document.getElementById("cassette-tape-label").textContent = "TAPE LOG // OVERTIME";
    } else if (this.mode === "custom") {
      this.state.pete.ai = this.customLevels.pete;
      this.state.stitch.ai = this.customLevels.stitch;
      this.state.hexa.ai = this.customLevels.hexa;
      this.state.grimshaw.ai = this.customLevels.grimshaw;
      this.state.silas.ai = this.customLevels.silas;
      tapeNight = 6;
      document.getElementById("hud-night-label").textContent = "CUSTOM SHIFT // PROGRESS";
      document.getElementById("cassette-tape-label").textContent = "TAPE LOG // CUSTOM";
    } else {
      this.state.pete.ai = cfg.baseAI.pete;
      this.state.stitch.ai = cfg.baseAI.stitch;
      this.state.hexa.ai = cfg.baseAI.hexa;
      this.state.grimshaw.ai = cfg.baseAI.grimshaw;
      this.state.silas.ai = cfg.baseAI.silas || 0;
      document.getElementById("hud-night-label").textContent = cfg.sub;
      document.getElementById("cassette-tape-label").textContent = `TAPE LOG // NIGHT ${this.selectedNight}`;
    }

    // Reset UI elements
    this.screens.game.classList.remove("jumpscare-active");
    document.getElementById("overheat-overlay").classList.add("hidden");
    this.syncControlButtons();
    this.syncFanUI();
    this.syncVentUI();
    document.getElementById("camera-tablet").classList.add("hidden");
    document.getElementById("monitor-btn-label").textContent = "OPEN CAMERA MONITOR [SPACE]";
    document.getElementById("left-control-panel").classList.remove("hidden");
    document.getElementById("right-control-panel").classList.remove("hidden");
    const ventBar = document.getElementById("vent-control-bar");
    if (ventBar) ventBar.classList.remove("hidden");
    document.getElementById("cassette-widget").classList.remove("hidden");
    document.getElementById("subtitle-bar").classList.remove("hidden");
    this.selectCamera("cam01", true);

    this.switchScreen("game");
    window.audioEngine.startLoop("ambience_office", { volume: 0.42 });
    window.audioEngine.startPhoneCall(tapeNight, () => {
      document.getElementById("cassette-widget").classList.add("hidden");
      document.getElementById("subtitle-bar").classList.add("hidden");
    });
  }

  muteCall() {
    window.audioEngine.stopPhoneCall();
    window.audioEngine.play("cam_blip", { volume: 0.5 });
    document.getElementById("cassette-widget").classList.add("hidden");
    document.getElementById("subtitle-bar").classList.add("hidden");
  }

  toggleDeskFan() {
    if (this.state.phase !== "playing" || this.state.power <= 0) return;
    this.state.fanOn = !this.state.fanOn;
    window.audioEngine.play("fan_toggle", { volume: 0.7, pan: -0.15 });
    this.syncFanUI();
  }

  syncFanUI() {
    const btn = document.getElementById("btn-toggle-fan");
    const lbl = document.getElementById("fan-state-lbl");
    if (btn && lbl) {
      btn.classList.toggle("active", this.state.fanOn);
      lbl.textContent = this.state.fanOn ? "ON" : "OFF";
    }
  }

  toggleVentSeal() {
    const s = this.state;
    if (s.phase !== "playing" || s.power <= 0) return;
    s.ventSealed = !s.ventSealed;
    if (s.ventSealed) {
      s.stats.ventSeals++;
      window.audioEngine.play("vent_slam", { volume: 0.88, pan: 0 });
    } else {
      window.audioEngine.play("door_open", { volume: 0.68, pan: 0 });
    }
    this.syncVentUI();
  }

  triggerFlashBeacon() {
    const s = this.state;
    if (s.phase !== "playing" || s.power <= 1 || s.camOpen) return;
    if (s.flashCharges <= 0 || s.flashCooldown > 0) {
      window.audioEngine.playJammedBuzz(0);
      return;
    }

    s.flashCharges--;
    s.flashCooldown = 6.0;
    s.flashAlpha = 0.74;
    s.power = Math.max(0, s.power - 1.5);
    s.stats.flashesUsed++;
    window.audioEngine.play("flash_beacon", { volume: 0.92, pan: 0 });

    let stunnedList = [];
    // Stun & repel Silas if peeking from overhead ceiling vent or crawling in CAM 08
    if (s.silas.loc === "vent_peek" || s.silas.loc === "cam08") {
      s.silas.loc = "cam07";
      s.silas.stage = 1;
      s.silas.moveTimer = 0;
      s.silas.ventWaitSec = 0;
      stunnedList.push("Withered Silas");
    }
    // Dislodge jammed door animatronics or push back doorway stalkers
    if (s.pete.loc === "right_door") {
      s.pete.loc = "cam05";
      s.pete.moveTimer = 0;
      s.pete.doorWaitSec = 0;
      s.rightDoorJammed = false;
      stunnedList.push("Pumpkin Pete");
    }
    if (s.stitch.loc === "left_door") {
      s.stitch.loc = "cam03";
      s.stitch.moveTimer = 0;
      s.stitch.doorWaitSec = 0;
      s.leftDoorJammed = false;
      stunnedList.push("Barnaby Stitch");
    }

    this.syncControlButtons();
    this.syncVentUI();
    this.showWarningSubtitle(
      stunnedList.length > 0
        ? `⚡ FLASH BEACON DISCHARGED! Blinded & repelled: ${stunnedList.join(" + ")}!`
        : `⚡ FLASH BEACON DISCHARGED (${s.flashCharges} Charges Left)`,
      3200
    );
  }

  syncVentUI() {
    const s = this.state;
    const ventBtn = document.getElementById("btn-vent-seal");
    const ventSub = document.getElementById("vent-state-lbl") || document.getElementById("vent-status-sub");
    if (ventBtn && ventSub) {
      ventBtn.classList.toggle("active", s.ventSealed);
      ventSub.textContent = s.ventSealed ? "SEALED" : "OPEN";
    }
    const flashBtn = document.getElementById("btn-flash-beacon");
    const flashSub = document.getElementById("flash-charges-lbl") || document.getElementById("flash-charges-sub");
    if (flashBtn && flashSub) {
      flashBtn.disabled = s.flashCharges <= 0 || s.flashCooldown > 0;
      if (s.flashCooldown > 0) {
        flashSub.textContent = `${Math.ceil(s.flashCooldown)}s`;
      } else {
        flashSub.textContent = `${s.flashCharges}`;
      }
    }
    const ghostBtn = document.getElementById("btn-answer-ghost");
    if (ghostBtn) {
      ghostBtn.classList.toggle("hidden", !s.ghostCallRinging);
    }
  }

  answerGhostCall() {
    const s = this.state;
    if (s.phase !== "playing" || !s.ghostCallRinging) return;
    s.ghostCallRinging = false;
    window.audioEngine.stopLoop("rotary_phone_ring");
    const callKey = s.hour >= 4 ? "ghost_call_2" : "ghost_call_1";
    window.audioEngine.play(callKey, { volume: 0.9, pan: 0 });
    this.syncVentUI();
    this.showWarningSubtitle(
      s.hour >= 4
        ? '☎ [1987 GHOST TRANSMISSION]: "Why did you come back? Look at the wire-mesh window... we are right outside."'
        : '☎ [1987 GHOST TRANSMISSION]: "Can you hear me through the static? Silas is inside the ceiling duct above your desk!"',
      5500
    );
  }

  /* ========================================================================
     SUB-BASEMENT WORKSHOP SALVAGE MODE (PLAYABLE INTERACTIVE MINIGAME)
     ======================================================================== */
  openSalvageMode(unitKey = "pete") {
    window.audioEngine.init();
    window.audioEngine.stopAllLoops();
    this.state.phase = "salvage";
    this.salvageWorking = false;
    this.selectSalvageUnit(unitKey);
    this.switchScreen("salvage");
    window.audioEngine.startLoop("bgm_salvage_workshop", { volume: 0.42, pan: 0 });
    window.audioEngine.play("salvage_briefing", { volume: 0.9, pan: 0 });
  }

  selectSalvageUnit(unitKey) {
    if (!SALVAGE_UNITS[unitKey]) unitKey = "pete";
    const u = SALVAGE_UNITS[unitKey];
    const sv = this.state.salvage;
    sv.unit = unitKey;
    sv.progress = this.perks[unitKey] ? 100 : 0;
    sv.agitation = 0;
    sv.stage = 1;
    sv.shocksLeft = 3;
    sv.shockCooldown = 0;
    sv.completed = Boolean(this.perks[unitKey]);
    this.salvageWorking = false;

    document.querySelectorAll(".salvage-unit-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.unit === unitKey);
    });
    const nameEl = document.getElementById("salvage-unit-title");
    if (nameEl) nameEl.textContent = u.name;
    this.updateSalvageHUD();
  }

  triggerSalvageShock() {
    const sv = this.state.salvage;
    if (this.state.phase !== "salvage" || sv.completed) return;
    if (sv.shocksLeft <= 0 || sv.shockCooldown > 0) {
      window.audioEngine.playJammedBuzz(0);
      return;
    }
    sv.shocksLeft--;
    sv.shockCooldown = 2.5;
    sv.agitation = 0;
    sv.stage = 1;
    this.state.flashAlpha = 0.65;
    window.audioEngine.play("taser_shock", { volume: 0.92, pan: 0 });
    this.updateSalvageHUD();
  }

  updateSalvage(dt) {
    const sv = this.state.salvage;
    if (this.state.flashAlpha > 0) {
      this.state.flashAlpha = Math.max(0, this.state.flashAlpha - dt * 2.2);
    }
    if (sv.shockCooldown > 0) {
      sv.shockCooldown = Math.max(0, sv.shockCooldown - dt);
    }
    if (sv.completed) {
      this.updateSalvageHUD();
      return;
    }

    const u = SALVAGE_UNITS[sv.unit] || SALVAGE_UNITS.pete;
    if (this.salvageWorking) {
      sv.progress = Math.min(100, sv.progress + 17.5 * dt);
      sv.agitation = Math.min(100, sv.agitation + 24.5 * u.aggr * dt);
      if (Math.random() < dt * 2.5) {
        window.audioEngine.play("salvage_servo_tune", { volume: 0.55, pan: 0 });
      }
    } else {
      // Passive agitation creep while sitting across the table
      sv.agitation = Math.min(100, sv.agitation + 5.2 * u.aggr * dt);
    }

    const prevStage = sv.stage;
    if (sv.agitation < 40) sv.stage = 1;
    else if (sv.agitation < 74) sv.stage = 2;
    else sv.stage = 3;

    if (sv.stage !== prevStage && sv.stage >= 2) {
      window.audioEngine.play("clockwork_tick", { volume: 0.78, pan: 0 });
      if (sv.stage === 3) {
        window.audioEngine.playWindowStinger(0);
      }
    }

    // Check Completion!
    if (sv.progress >= 100 && !sv.completed) {
      sv.completed = true;
      sv.stage = 1;
      sv.agitation = 0;
      this.salvageWorking = false;
      this.perks[sv.unit] = true;
      this.saveStars();
      window.audioEngine.play("salvage_complete", { volume: 0.95, pan: 0 });
      window.audioEngine.play("chime_6am", { volume: 0.75, pan: 0 });
    } else if (sv.agitation >= 100) {
      // Animatronic lunges across the salvage workbench!
      this.salvageWorking = false;
      this.triggerJumpscare(
        sv.unit,
        `You failed to administer a Controlled Taser Shock before ${u.name} lunged across the Sub-Basement Salvage workbench!`
      );
      return;
    }

    this.updateSalvageHUD();
  }

  updateSalvageHUD() {
    const sv = this.state.salvage;
    const bar = document.getElementById("salvage-progress-bar");
    const pctEl = document.getElementById("salvage-progress-text");
    const pct = Math.floor(sv.progress);
    if (bar && pctEl) {
      bar.style.width = `${pct}%`;
      pctEl.textContent = sv.completed
        ? "CALIBRATION: 100% (PERK UNLOCKED ✔)"
        : `CALIBRATION: ${pct}%`;
    }
    const s1 = document.getElementById("salvage-step-1");
    const s2 = document.getElementById("salvage-step-2");
    const s3 = document.getElementById("salvage-step-3");
    if (s1) s1.classList.toggle("done", pct >= 33);
    if (s2) s2.classList.toggle("done", pct >= 66);
    if (s3) s3.classList.toggle("done", pct >= 100);

    const statusPill = document.getElementById("salvage-posture-pill");
    if (statusPill) {
      statusPill.classList.remove("warn", "danger");
      if (sv.completed) {
        statusPill.textContent = "POSTURE: CALIBRATED & LOCKED ✔";
      } else if (sv.stage === 3) {
        statusPill.textContent = "⚠ POSTURE: STAGE 3 (ABOUT TO LUNGE! SHOCK [SPACE]!)";
        statusPill.classList.add("danger");
      } else if (sv.stage === 2) {
        statusPill.textContent = "⚠ POSTURE: STAGE 2 (SERVO TWITCH / EYES ACTIVE)";
        statusPill.classList.add("warn");
      } else {
        statusPill.textContent = "POSTURE: DORMANT (STAGE 1)";
      }
    }
    const shockSub = document.getElementById("salvage-shocks-left");
    const shockBtn = document.getElementById("btn-salvage-shock");
    if (shockSub && shockBtn) {
      shockBtn.disabled = sv.shocksLeft <= 0 || sv.shockCooldown > 0 || sv.completed;
      shockSub.textContent = String(sv.shocksLeft);
    }
  }

  renderSalvage(dt) {
    if (!this.salvageCanvas || !this.salvageCtx) return;
    const ctx = this.salvageCtx;
    const w = this.salvageCanvas.width;
    const h = this.salvageCanvas.height;
    const sv = this.state.salvage;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    const imgKey = `salvage_${sv.unit}_${sv.stage}`;
    const img = this.images[imgKey] || this.images[`salvage_${sv.unit}_1`] || this.images.salvage_table_empty;
    if (this.isReady(img)) {
      const breathe = 1.02 + Math.sin(performance.now() * 0.0025) * 0.01;
      const dw = w * breathe;
      const dh = h * breathe;
      const shakeX = this.salvageWorking ? (Math.random() - 0.5) * 4 : 0;
      const shakeY = this.salvageWorking ? (Math.random() - 0.5) * 4 : 0;
      ctx.drawImage(img, (w - dw) * 0.5 + shakeX, (h - dh) * 0.5 + shakeY, dw, dh);
    } else {
      ctx.fillStyle = "#090a0f";
      ctx.fillRect(0, 0, w, h);
    }

    // Overhead swinging worklamp vignette
    const lampX = w * 0.5 + Math.sin(performance.now() * 0.0018) * 55;
    const grad = ctx.createRadialGradient(lampX, h * 0.42, 40, w * 0.5, h * 0.5, w * 0.65);
    grad.addColorStop(0, "rgba(255, 195, 110, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Taser shock arc flash
    if (this.state.flashAlpha > 0) {
      ctx.fillStyle = `rgba(140, 220, 255, ${this.state.flashAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  triggerAudioDecoy() {
    const s = this.state;
    if (s.phase !== "playing" || !s.camOpen || s.power <= 2 || s.decoyCooldown > 0) return;

    s.power = Math.max(0, s.power - 2.0);
    s.decoyCooldown = this.perks && this.perks.stitch ? 10.0 : 15.0;
    s.decoyActiveRoom = s.currentCam;
    s.decoyActiveTimer = 4.0;
    s.stats.decoysUsed++;
    window.audioEngine.play("audio_decoy", { volume: 0.85, pan: 0 });

    let luredAnyone = false;
    // Audio decoy can push Pumpkin Pete back one room or reset his moveTimer
    if (s.pete.loc === s.currentCam || (s.currentCam === "cam02" && s.pete.loc === "cam05")) {
      s.pete.moveTimer = 0;
      s.pete.closeStare = false;
      if (s.pete.loc === "cam05") s.pete.loc = "cam02";
      else if (s.pete.loc === "cam02") s.pete.loc = "cam01";
      luredAnyone = true;
    }
    // Audio decoy can push Barnaby Stitch back one room or reset his moveTimer
    if (s.stitch.loc === s.currentCam || (s.currentCam === "cam02" && s.stitch.loc === "cam03")) {
      s.stitch.moveTimer = 0;
      s.stitch.closeStare = false;
      if (s.stitch.loc === "cam04") s.stitch.loc = "cam03";
      else if (s.stitch.loc === "cam03") s.stitch.loc = "cam02";
      luredAnyone = true;
    }
    // Audio decoy on CAM 05 calms Grimshaw's curtain agitation!
    if (s.currentCam === "cam05" && s.grimshaw.stage < 3) {
      s.grimshaw.calm = Math.min(100, s.grimshaw.calm + 36);
      s.grimshaw.closeStare = false;
      if (s.grimshaw.calm > 55) s.grimshaw.stage = 0;
      else if (s.grimshaw.calm > 25) s.grimshaw.stage = 1;
      luredAnyone = true;
    }
    // Audio decoy on CAM 07 or CAM 08 lures Withered Silas back toward the Boiler Room!
    if (s.currentCam === "cam07" || s.currentCam === "cam08") {
      s.silas.moveTimer = 0;
      if (s.silas.loc === "vent_peek") s.silas.loc = "cam08";
      else if (s.silas.loc === "cam08") s.silas.loc = "cam07";
      luredAnyone = true;
    }

    s.camStaticAlpha = 0.72;
    this.updateCameraHUD();
    this.showWarningSubtitle(
      luredAnyone
        ? `🔊 Audio Decoy emitted in ${CAMERAS[s.currentCam].number} — Mascot movement disrupted!`
        : `🔊 Audio Decoy emitted in ${CAMERAS[s.currentCam].number} (-2% Battery)`,
      3200
    );
  }

  rebootCameraFeed() {
    const s = this.state;
    if (s.phase !== "playing" || !s.camOpen) return;
    window.audioEngine.play("cam_reboot", { volume: 0.85, pan: 0 });
    s.camJammedTimer = 0;
    s.camStaticAlpha = 0.92;
    s.pete.closeStare = false;
    s.stitch.closeStare = false;
    s.hexa.closeStare = false;
    s.grimshaw.closeStare = false;
    this.updateCameraHUD();
    this.showWarningSubtitle("⚡ CCTV Video Feed De-gaussed & Rebooted — Signal Restored!", 2500);
  }

  toggleDoor(side) {
    if (this.state.phase !== "playing" || this.state.power <= 0) return;

    if (side === "left") {
      if (this.state.leftDoorJammed) {
        window.audioEngine.playJammedBuzz(-0.7);
        this.showWarningSubtitle("⚠ LEFT DOOR JAMMED! Barnaby Stitch is inside the frame!");
        return;
      }
      this.state.leftDoorClosed = !this.state.leftDoorClosed;
      if (this.state.leftDoorClosed) {
        this.state.stats.doorCloses++;
        window.audioEngine.play("door_slam", { volume: 0.85, pan: -0.65 });
      } else {
        window.audioEngine.play("door_open", { volume: 0.75, pan: -0.65 });
      }
    } else {
      if (this.state.rightDoorJammed) {
        window.audioEngine.playJammedBuzz(0.7);
        this.showWarningSubtitle("⚠ RIGHT DOOR JAMMED! Pumpkin Pete is inside the frame!");
        return;
      }
      this.state.rightDoorClosed = !this.state.rightDoorClosed;
      if (this.state.rightDoorClosed) {
        this.state.stats.doorCloses++;
        window.audioEngine.play("door_slam", { volume: 0.85, pan: 0.65 });
      } else {
        window.audioEngine.play("door_open", { volume: 0.75, pan: 0.65 });
      }
    }
    this.syncControlButtons();
  }

  toggleLight(side) {
    if (this.state.phase !== "playing" || this.state.power <= 0 || this.state.camOpen) return;

    if (side === "left") {
      this.state.leftLightOn = !this.state.leftLightOn;
      if (this.state.leftLightOn) {
        this.state.rightLightOn = false;
        window.audioEngine.startLoop("hall_light", { volume: 0.35, pan: -0.6 });
        this.state.officePanX = Math.min(this.state.officePanX, 0.18);
        if (this.state.stitch.loc === "left_door" && !this.state.stitch.spottedInLight) {
          this.state.stitch.spottedInLight = true;
          window.audioEngine.playWindowStinger(-0.75);
          this.showWarningSubtitle("❗ BARNABY STITCH IS AT THE LEFT DOOR! SHUT DOOR [A] NOW!");
        } else if (this.state.hexa.stage === 3) {
          window.audioEngine.playWindowStinger(-0.75);
          this.showWarningSubtitle("❗ MADAME HEXA IS AT THE LEFT DOOR! SHUT DOOR [A] NOW!");
        }
      } else {
        window.audioEngine.stopLoop("hall_light");
      }
    } else {
      this.state.rightLightOn = !this.state.rightLightOn;
      if (this.state.rightLightOn) {
        this.state.leftLightOn = false;
        window.audioEngine.startLoop("hall_light", { volume: 0.35, pan: 0.6 });
        this.state.officePanX = Math.max(this.state.officePanX, 0.82);
        if (this.state.pete.loc === "right_door" && !this.state.pete.spottedInLight) {
          this.state.pete.spottedInLight = true;
          window.audioEngine.playWindowStinger(0.75);
          this.showWarningSubtitle("❗ PUMPKIN PETE IS AT THE RIGHT DOOR! SHUT DOOR [D] NOW!");
        } else if (this.state.grimshaw.stage === 3) {
          window.audioEngine.playWindowStinger(0.75);
          this.showWarningSubtitle("❗ GRIMSHAW THE PLAGUE CROW IS SPRINTING TO RIGHT DOOR! SHUT [D]!");
        }
      } else {
        window.audioEngine.stopLoop("hall_light");
      }
    }
    this.syncControlButtons();
  }

  toggleCameraTablet() {
    if (this.state.phase !== "playing" || this.state.power <= 0) return;

    this.state.camOpen = !this.state.camOpen;
    window.audioEngine.play("cam_toggle", { volume: 0.75 });

    if (this.state.camOpen) {
      this.state.leftLightOn = false;
      this.state.rightLightOn = false;
      window.audioEngine.stopLoop("hall_light");
      this.state.camStaticAlpha = 0.85;
      document.getElementById("camera-tablet").classList.remove("hidden");
      document.getElementById("monitor-btn-label").textContent = "CLOSE CAMERA MONITOR [SPACE]";
      this.updateCameraHUD();
    } else {
      this.windingBox = false;
      document.getElementById("camera-tablet").classList.add("hidden");
      document.getElementById("monitor-btn-label").textContent = "OPEN CAMERA MONITOR [SPACE]";

      // Rare 2% chance of brief 0.35s Golden Pumpkin Pete hallucination when lowering monitor after 2 AM!
      if (this.state.hour >= 2 && Math.random() < 0.03) {
        this.state.hallucinationTimer = 0.35;
      }

      if (this.state.leftDoorJammed && !this.state.leftDoorClosed) {
        this.triggerJumpscare("stitch", "Barnaby Stitch slipped inside while you were watching the cameras!");
        return;
      }
      if (this.state.rightDoorJammed && !this.state.rightDoorClosed) {
        this.triggerJumpscare("pete", "Pumpkin Pete ambushed you the moment you lowered your monitor!");
        return;
      }
    }
    this.syncControlButtons();
  }

  selectCamera(camId, silent = false) {
    if (!CAMERAS[camId]) return;
    this.state.currentCam = camId;
    this.state.camStaticAlpha = 0.78;
    if (!silent) {
      window.audioEngine.play("cam_blip", { volume: 0.65 });
    }

    document.querySelectorAll(".cam-node").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.cam === camId);
    });

    document.getElementById("cam03-box-panel").classList.toggle("hidden", camId !== "cam03");
    document.getElementById("cam05-roost-panel").classList.toggle("hidden", camId !== "cam05");
    this.updateCameraHUD();
  }

  updateCameraHUD() {
    const cam = CAMERAS[this.state.currentCam];
    document.getElementById("cctv-cam-title").textContent = `${cam.number} — ${cam.name}`;

    const occupants = this.getCameraOccupants(this.state.currentCam);
    const tagEl = document.getElementById("cctv-motion-tag");
    if (this.state.camJammedTimer > 0) {
      tagEl.textContent = "⚠ SIGNAL INTERFERENCE — PRESS REBOOT FEED [R]!";
      tagEl.classList.add("occupied");
    } else if (occupants.length > 0) {
      tagEl.textContent = `SIGNAL DETECTED: ${occupants.join(" + ")}`;
      tagEl.classList.add("occupied");
    } else {
      tagEl.textContent = "MOTION SENSOR: AREA CLEAR";
      tagEl.classList.remove("occupied");
    }
  }

  getCameraOccupants(camId) {
    const list = [];
    if (this.state.pete.loc === camId) list.push("PUMPKIN PETE");
    if (this.state.stitch.loc === camId) list.push("BARNABY STITCH");
    if (camId === "cam03" && this.state.hexa.stage < 3) {
      if (this.state.hexa.stage === 0) list.push("CARILLON BOX (DORMANT)");
      else if (this.state.hexa.stage === 1) list.push("MADAME HEXA (EMERGING)");
      else if (this.state.hexa.stage === 2) list.push("MADAME HEXA (CRITICAL!)");
    }
    if (camId === "cam04" && this.state.hexa.stage === 3) {
      list.push("MADAME HEXA (SPRINTING!)");
    }
    if (camId === "cam05" && this.state.grimshaw.stage < 3 && this.state.grimshaw.ai > 0) {
      if (this.state.grimshaw.stage === 0) list.push("CROW'S ROOST (CURTAIN)");
      else if (this.state.grimshaw.stage === 1) list.push("GRIMSHAW (PEEKING)");
      else if (this.state.grimshaw.stage === 2) list.push("GRIMSHAW (IN ARCADE!)");
    }
    if (camId === "cam06" && this.state.grimshaw.stage === 3) {
      list.push("GRIMSHAW (SPRINTING!)");
    }
    if (camId === "cam07" && this.state.silas.ai > 0) {
      if (this.state.silas.loc === "cam07") {
        list.push(
          this.state.silas.stage === 2
            ? "WITHERED SILAS (ENTERING VENT!)"
            : "WITHERED SILAS (STALKING)"
        );
      }
    }
    if (camId === "cam08") {
      if (this.state.silas.loc === "cam08") {
        list.push(
          this.state.silas.stage >= 2
            ? "WITHERED SILAS (IMMINENT DROP!)"
            : "WITHERED SILAS (CRAWLING IN DUCT)"
        );
      } else if (this.state.stitch.loc === "cam04") {
        list.push("DUCT VIBRATION DETECTED");
      }
    }
    return list;
  }

  syncControlButtons() {
    const lDoor = document.getElementById("btn-left-door");
    const rDoor = document.getElementById("btn-right-door");
    const lLight = document.getElementById("btn-left-light");
    const rLight = document.getElementById("btn-right-light");

    lDoor.classList.toggle("active", this.state.leftDoorClosed);
    lDoor.classList.toggle("jammed", this.state.leftDoorJammed);
    rDoor.classList.toggle("active", this.state.rightDoorClosed);
    rDoor.classList.toggle("jammed", this.state.rightDoorJammed);

    lLight.classList.toggle("active", this.state.leftLightOn);
    rLight.classList.toggle("active", this.state.rightLightOn);
  }

  showWarningSubtitle(text, durationMs = 4000) {
    const bar = document.getElementById("subtitle-bar");
    bar.textContent = text;
    bar.classList.remove("hidden");
    if (this.subTimeout) clearTimeout(this.subTimeout);
    this.subTimeout = setTimeout(() => {
      if (window.audioEngine.mutedCall || !window.audioEngine.phoneAudio) {
        bar.classList.add("hidden");
      }
      this.subTimeout = null;
    }, durationMs);
  }

  /* ========================================================================
     MAIN GAME UPDATE LOOP
     ======================================================================== */
  loop(now) {
    const dt = Math.min(0.1, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    if (this.state.phase === "title") {
      this.renderTitleScreen(now * 0.001);
    } else if (this.state.phase === "salvage") {
      this.updateSalvage(dt);
      this.renderSalvage(dt);
    } else if (this.state.phase === "playing") {
      this.updatePlaying(dt);
      this.renderOffice(dt);
      if (this.state.camOpen) {
        this.renderCCTV(dt);
      }
    } else if (this.state.phase === "powerout") {
      this.updatePowerOut(dt);
      this.renderOffice(dt);
    } else if (this.state.phase === "jumpscare") {
      this.updateJumpscare(dt);
      this.renderJumpscare();
    } else if (this.state.phase === "gameover") {
      this.renderStaticCanvas();
    }

    requestAnimationFrame((ts) => this.loop(ts));
  }

  updatePlaying(dt) {
    const s = this.state;
    s.elapsedSec += dt;
    if (s.fanOn) {
      s.fanAngle = (s.fanAngle + dt * 18) % (Math.PI * 2);
    }
    if (s.hallucinationTimer > 0) {
      s.hallucinationTimer = Math.max(0, s.hallucinationTimer - dt);
    }
    if (s.flashAlpha > 0) {
      s.flashAlpha = Math.max(0, s.flashAlpha - dt * 1.9);
    }
    if (s.flashCooldown > 0) {
      s.flashCooldown = Math.max(0, s.flashCooldown - dt);
      this.syncVentUI();
    }
    if (s.decoyCooldown > 0) {
      s.decoyCooldown = Math.max(0, s.decoyCooldown - dt);
    }
    if (s.decoyActiveTimer > 0) {
      s.decoyActiveTimer = Math.max(0, s.decoyActiveTimer - dt);
    }
    if (s.camJammedTimer > 0) {
      s.camJammedTimer = Math.max(0, s.camJammedTimer - dt);
      if (s.camJammedTimer === 0 && s.camOpen) {
        this.updateCameraHUD();
      }
    }

    // Update CCTV Utility Buttons UI
    const decoyBtn = document.getElementById("btn-audio-decoy");
    const decoyTxt = document.getElementById("decoy-status-text");
    if (decoyBtn && decoyTxt) {
      if (s.decoyCooldown > 0) {
        decoyBtn.disabled = true;
        decoyTxt.textContent = `COOLDOWN (${Math.ceil(s.decoyCooldown)}s)`;
      } else {
        decoyBtn.disabled = false;
        decoyTxt.textContent = "READY (-2% PWR)";
      }
    }
    const rebootBtn = document.getElementById("btn-reboot-cam");
    const rebootTxt = document.getElementById("reboot-status-text");
    if (rebootBtn && rebootTxt) {
      const jammed = s.camJammedTimer > 0;
      rebootBtn.classList.toggle("alert", jammed);
      rebootTxt.textContent = jammed ? "JAMMED! PRESS [R]" : "SIGNAL OK";
    }

    // 1. Check 6:00 AM Victory
    if (s.elapsedSec >= this.nightDuration) {
      this.triggerWin6AM();
      return;
    }

    // Update Hour (0..5)
    const newHour = Math.min(5, Math.floor((s.elapsedSec / this.nightDuration) * 6));
    if (newHour !== s.hour) {
      s.hour = newHour;
      if (this.mode === "normal") {
        const cfg = NIGHT_CONFIGS[this.selectedNight] || NIGHT_CONFIGS[1];
        s.pete.ai = Math.min(20, Math.round(cfg.baseAI.pete + newHour * cfg.rampAI.pete));
        s.stitch.ai = Math.min(20, Math.round(cfg.baseAI.stitch + newHour * cfg.rampAI.stitch));
        s.hexa.ai = Math.min(20, Math.round(cfg.baseAI.hexa + newHour * cfg.rampAI.hexa));
        s.grimshaw.ai = Math.min(20, Math.round(cfg.baseAI.grimshaw + newHour * cfg.rampAI.grimshaw));
        s.silas.ai = Math.min(
          20,
          Math.round((cfg.baseAI.silas || 0) + newHour * (cfg.rampAI.silas || 0))
        );
      }
      if (newHour >= 3 && !s.whispersPlayed.lateAmbience) {
        s.whispersPlayed.lateAmbience = true;
        window.audioEngine.startLoop("ambience_late_night", { volume: 0.35, pan: 0 });
        if (this.mode === "nightmare") {
          window.audioEngine.startLoop("bgm_overtime_finale", { volume: 0.28, pan: 0 });
        } else if (this.selectedNight >= 5) {
          window.audioEngine.startLoop("bgm_night5_boss", { volume: 0.24, pan: 0 });
        }
      }
      // Haunted 1987 Rotary Desk Phone rings at 2 AM and 4 AM!
      if ((newHour === 2 || newHour === 4) && !s.ghostCallsTriggered[newHour]) {
        s.ghostCallsTriggered[newHour] = true;
        s.ghostCallRinging = true;
        window.audioEngine.startLoop("rotary_phone_ring", { volume: 0.52, pan: -0.1 });
        this.syncVentUI();
        this.showWarningSubtitle(
          "☎ ROTARY DESK PHONE RINGING! Press [P] or click GHOST CALL to answer/silence before the noise attracts animatronics!",
          4500
        );
      }
    }

    // Update Clock HUD
    const displayHour = s.hour === 0 ? "12 AM" : `${s.hour} AM`;
    document.getElementById("hud-clock").textContent = displayHour;
    const pctShift = Math.min(100, (s.elapsedSec / this.nightDuration) * 100);
    document.getElementById("hud-shift-progress").style.width = `${pctShift.toFixed(1)}%`;

    // Phone Guy Subtitles during first 46s if not muted
    if (!window.audioEngine.mutedCall && window.audioEngine.phoneAudio && s.elapsedSec < 46) {
      const cfg = NIGHT_CONFIGS[this.selectedNight] || NIGHT_CONFIGS[1];
      const subs = cfg.subtitles || NIGHT_CONFIGS[1].subtitles;
      let activeLine = subs[0].text;
      for (const item of subs) {
        if (s.elapsedSec >= item.t) activeLine = item.text;
      }
      const subBar = document.getElementById("subtitle-bar");
      if (!this.subTimeout) {
        subBar.textContent = activeLine;
        subBar.classList.remove("hidden");
      }
    }

    // 2. Office Panning (Mouse near edges or Arrow Keys)
    if (!s.camOpen) {
      let panVel = 0;
      if (this.keysDown["ArrowLeft"]) panVel = -0.85;
      else if (this.keysDown["ArrowRight"]) panVel = 0.85;
      else if (this.mouseNormX < 0.32) panVel = -((0.32 - this.mouseNormX) / 0.32) * 0.9;
      else if (this.mouseNormX > 0.68) panVel = ((this.mouseNormX - 0.68) / 0.32) * 0.9;

      s.officePanX = Math.max(0, Math.min(1, s.officePanX + panVel * dt));
    }

    // Animate Blast Doors
    const doorSpeed = 5.5;
    s.leftDoorAnim += ((s.leftDoorClosed ? 1 : 0) - s.leftDoorAnim) * Math.min(1, dt * doorSpeed);
    s.rightDoorAnim += ((s.rightDoorClosed ? 1 : 0) - s.rightDoorAnim) * Math.min(1, dt * doorSpeed);

    // 3. Update Office Thermal System & Desk Fan
    if (s.fanOn) {
      s.officeTemp = Math.max(68.0, s.officeTemp - 2.4 * dt);
    } else {
      const doorHeat =
        (s.leftDoorClosed ? 0.35 : 0) +
        (s.rightDoorClosed ? 0.35 : 0) +
        (s.ventSealed ? 0.25 : 0);
      s.officeTemp = Math.min(120.0, s.officeTemp + (1.25 + doorHeat) * dt);
    }
    const tempEl = document.getElementById("hud-temp");
    const tempInt = Math.round(s.officeTemp);
    if (tempEl) {
      tempEl.innerHTML = `${tempInt}&deg;F`;
      tempEl.classList.toggle("warn", tempInt >= 90 && tempInt < 105);
      tempEl.classList.toggle("danger", tempInt >= 105);
    }
    const overheatEl = document.getElementById("overheat-overlay");
    if (s.officeTemp >= 100) {
      overheatEl.classList.remove("hidden");
      overheatEl.style.opacity = String(Math.min(0.85, (s.officeTemp - 98) / 22));
      if (s.officeTemp >= 108) {
        window.audioEngine.startLoop("alarm_overheat", { volume: 0.32, pan: 0 });
      }
    } else {
      overheatEl.classList.add("hidden");
      window.audioEngine.stopLoop("alarm_overheat");
    }

    // 4. Calculate Power Usage & Drain
    let usage = 1;
    let drainPerSec = s.fanOn ? 0.145 : 0.10; // Turning Desk Fan OFF saves 0.045%/sec!
    if (s.camOpen) {
      usage++;
      drainPerSec += 0.21;
      s.camOpenContinuousSec += dt;
    } else {
      s.camOpenContinuousSec = Math.max(0, s.camOpenContinuousSec - dt * 2);
    }
    if (s.leftLightOn) {
      usage++;
      drainPerSec += 0.19;
    }
    if (s.rightLightOn) {
      usage++;
      drainPerSec += 0.19;
    }
    if (s.leftDoorClosed) {
      usage++;
      drainPerSec += 0.41;
    }
    if (s.rightDoorClosed) {
      usage++;
      drainPerSec += 0.41;
    }
    if (s.ventSealed) {
      usage++;
      drainPerSec += 0.26;
    }

    s.usage = Math.min(5, usage);
    s.power = Math.max(0, s.power - drainPerSec * dt);

    // Update Power HUD
    const pwrEl = document.getElementById("hud-power");
    const pwrInt = Math.ceil(s.power);
    pwrEl.textContent = `${pwrInt}%`;
    pwrEl.classList.toggle("warn", pwrInt <= 40 && pwrInt > 15);
    pwrEl.classList.toggle("danger", pwrInt <= 15);

    const bars = document.querySelectorAll("#hud-usage-bars .u-bar");
    bars.forEach((b, idx) => b.classList.toggle("active", idx < s.usage));

    if (s.power <= 0) {
      this.enterPowerOutage();
      return;
    }

    // 5. Update All 5 Animatronics
    this.updateHexa(dt);
    this.updatePete(dt);
    this.updateStitch(dt);
    this.updateGrimshaw(dt);
    this.updateSilas(dt);

    // 6. Update Heartbeat Pulse & Panic Meter (72 -> 168 BPM)
    let targetBpm = 72 + s.hour * 5;
    if (s.pete.loc === "right_door" || s.stitch.loc === "left_door" || s.silas.loc === "vent_peek") {
      targetBpm += 42;
    }
    if (s.hexa.stage === 3 || s.grimshaw.stage === 3 || s.silas.loc === "cam08") {
      targetBpm += 32;
    }
    if (s.power <= 20 || s.officeTemp >= 100) {
      targetBpm += 20;
    }
    targetBpm = Math.min(168, targetBpm);
    s.heartBpm += (targetBpm - s.heartBpm) * Math.min(1, dt * 3.0);
    const bpmInt = Math.round(s.heartBpm);
    const bpmEl = document.getElementById("hud-bpm");
    if (bpmEl) {
      bpmEl.textContent = `${bpmInt} BPM`;
      bpmEl.classList.toggle("warn", bpmInt >= 105 && bpmInt < 135);
      bpmEl.classList.toggle("danger", bpmInt >= 135);
    }
    if (bpmInt >= 132) {
      window.audioEngine.startLoop("heartbeat_panic", { volume: 0.42, pan: 0 });
    } else {
      window.audioEngine.stopLoop("heartbeat_panic");
    }

    // Update Audio Threat Indicators on Left/Right/Vent Panels
    const leftInd = document.getElementById("left-audio-indicator");
    if (s.stitch.loc === "left_door" || s.hexa.stage === 3) {
      leftInd.textContent = "⚠ SOUND AT DOOR!";
      leftInd.classList.add("alert");
    } else if (s.stitch.loc === "cam04") {
      leftInd.textContent = "CLAWS IN HALL";
      leftInd.classList.add("alert");
    } else {
      leftInd.textContent = "AUDIO: QUIET";
      leftInd.classList.remove("alert");
    }

    const rightInd = document.getElementById("right-audio-indicator");
    if (s.pete.loc === "right_door" || s.grimshaw.stage === 3) {
      rightInd.textContent = "⚠ THREAT AT DOOR!";
      rightInd.classList.add("alert");
    } else if (s.pete.loc === "cam06") {
      rightInd.textContent = "HEAVY STEPS NEAR";
      rightInd.classList.add("alert");
    } else {
      rightInd.textContent = "AUDIO: QUIET";
      rightInd.classList.remove("alert");
    }

    const ventInd = document.getElementById("vent-audio-indicator");
    if (ventInd) {
      if (s.silas.loc === "vent_peek") {
        ventInd.textContent = "⚠ SILAS IN CEILING GRATE!";
        ventInd.classList.add("alert");
      } else if (s.silas.loc === "cam08") {
        ventInd.textContent = "⚠ SCRAPING IN CAM 08 DUCT";
        ventInd.classList.add("alert");
      } else {
        ventInd.textContent = "DUCT: CLEAR";
        ventInd.classList.remove("alert");
      }
    }
  }

  /* ========================================================================
     ANIMATRONIC AI 1: MADAME HEXA (CAM 03 CARILLON -> WEST SPRINT)
     ======================================================================== */
  updateHexa(dt) {
    const s = this.state;
    const hexa = s.hexa;
    if (hexa.ai <= 0) return;

    if (hexa.stage < 3) {
      if (this.windingBox && s.camOpen && s.currentCam === "cam03") {
        hexa.carillon = Math.min(100, hexa.carillon + 24.0 * dt);
        hexa.closeStare = false;
        s.stats.boxWinds += dt;
      } else {
        if (s.elapsedSec > 12) {
          const perkMult = this.perks && this.perks.hexa ? 0.7 : 1.0;
          const drainRate = (1.2 + (hexa.ai / 20) * 1.45) * perkMult;
          hexa.carillon = Math.max(0, hexa.carillon - drainRate * dt);
        }
      }

      const prevStage = hexa.stage;
      if (hexa.carillon > 50) hexa.stage = 0;
      else if (hexa.carillon > 20) hexa.stage = 1;
      else if (hexa.carillon > 0) {
        hexa.stage = 2;
        if (hexa.carillon < 10) hexa.closeStare = true;
      } else {
        hexa.stage = 3;
        hexa.sprintTimer = 4.2;
        window.audioEngine.play("hexa_sprint", { volume: 0.95, pan: -0.6 });
        this.showWarningSubtitle("🚨 MADAME HEXA SPRINTING DOWN WEST HALL! SHUT LEFT DOOR [A]!");
        if (s.camOpen && (s.currentCam === "cam03" || s.currentCam === "cam04")) {
          s.camStaticAlpha = 0.9;
          this.updateCameraHUD();
        }
      }

      if (prevStage !== hexa.stage && s.camOpen && s.currentCam === "cam03") {
        s.camStaticAlpha = 0.75;
        this.updateCameraHUD();
      }
      if (hexa.stage === 2 && !s.whispersPlayed.hexa) {
        s.whispersPlayed.hexa = true;
        window.audioEngine.play("voice_hexa_whisper", { volume: 0.72, pan: -0.35 });
      }
    } else {
      hexa.sprintTimer -= dt;
      if (hexa.sprintTimer <= 0) {
        if (s.leftDoorClosed) {
          window.audioEngine.play("door_bang", { volume: 0.95, pan: -0.75 });
          const pwrLoss = this.perks && this.perks.grimshaw ? 2.6 : 4.0;
          s.power = Math.max(0, s.power - pwrLoss);
          s.stats.hexasBlocked++;
          hexa.stage = 0;
          hexa.carillon = 78.0;
          hexa.closeStare = false;
          this.showWarningSubtitle("💥 Madame Hexa slammed into the closed Left Door and retreated to CAM 03!");
          if (s.camOpen) this.updateCameraHUD();
        } else {
          this.triggerJumpscare(
            "hexa",
            "Madame Hexa's Carillon Music Box ran out on CAM 03 and she sprinted through your open Left Door!"
          );
          return;
        }
      }
    }

    const pct = Math.ceil(hexa.carillon);
    document.getElementById("cam03-meter-bar").style.width = `${pct}%`;
    document.getElementById("cam03-meter-text").textContent =
      hexa.stage === 3 ? "SPRINTING!" : `${pct}%`;

    const globalAlert = document.getElementById("global-box-alert");
    const warnDot = document.getElementById("cam03-warn-dot");
    globalAlert.textContent = hexa.stage === 3 ? "HEX SPRINT!" : `BOX: ${pct}%`;
    globalAlert.classList.toggle("warn", pct <= 50 && pct > 20 && hexa.stage < 3);
    globalAlert.classList.toggle("danger", pct <= 20 || hexa.stage === 3);
    warnDot.classList.toggle("warn", pct <= 50 && pct > 20 && hexa.stage < 3);
    warnDot.classList.toggle("danger", pct <= 20 || hexa.stage === 3);
  }

  /* ========================================================================
     ANIMATRONIC AI 2: PUMPKIN PETE (EAST ROUTE -> RIGHT DOOR)
     Path: cam01 -> cam02 -> cam05 -> cam06 -> right_door
     ======================================================================== */
  updatePete(dt) {
    const s = this.state;
    const pete = s.pete;
    if (pete.ai <= 0 || s.elapsedSec < 14) return;

    if (pete.loc !== "right_door") {
      const isWatched = s.camOpen && s.currentCam === pete.loc && pete.loc !== "cam06";
      const rateMultiplier = isWatched ? 0.25 : 1.0;
      pete.moveTimer += dt * rateMultiplier;

      const stepInterval = Math.max(5.5, 15.5 - (pete.ai / 20) * 8.5);
      // Halfway through interval, Pete may turn to stare directly into the camera lens!
      if (pete.moveTimer >= stepInterval * 0.62 && !pete.closeStare && pete.ai >= 7) {
        pete.closeStare = true;
        if (s.camOpen && s.currentCam === pete.loc) {
          s.camStaticAlpha = 0.65;
          if (this.selectedNight >= 3 && Math.random() < 0.35) {
            s.camJammedTimer = 3.5;
            this.updateCameraHUD();
          }
        }
      }

      if (pete.moveTimer >= stepInterval) {
        pete.moveTimer = 0;
        pete.closeStare = false;
        const prevLoc = pete.loc;
        const route = {
          cam01: "cam02",
          cam02: "cam05",
          cam05: "cam06",
          cam06: "right_door",
        };
        pete.loc = route[pete.loc] || "cam02";

        if (pete.loc === "right_door") {
          pete.doorWaitSec = 0;
          pete.spottedInLight = false;
          window.audioEngine.play("pete_laugh", { volume: 0.85, pan: 0.7 });
        } else {
          window.audioEngine.play("footsteps_heavy", { volume: 0.55, pan: 0.55 });
          if (pete.loc === "cam06" && !s.whispersPlayed.pete) {
            s.whispersPlayed.pete = true;
            window.audioEngine.play("voice_pete_whisper", { volume: 0.72, pan: 0.45 });
          }
        }

        if (s.camOpen && (s.currentCam === prevLoc || s.currentCam === pete.loc)) {
          s.camStaticAlpha = 0.85;
          this.updateCameraHUD();
        }
      }
    } else {
      pete.doorWaitSec += dt;

      if (s.rightDoorClosed) {
        if (pete.doorWaitSec >= 4.5) {
          window.audioEngine.play("footsteps_heavy", { volume: 0.7, pan: 0.65 });
          pete.loc = Math.random() < 0.5 ? "cam02" : "cam05";
          pete.moveTimer = 0;
          pete.doorWaitSec = 0;
          pete.spottedInLight = false;
          pete.closeStare = false;
          if (s.camOpen) this.updateCameraHUD();
        }
      } else {
        const graceWindow = Math.max(4.8, 8.8 - (pete.ai / 20) * 3.5);
        if (pete.doorWaitSec >= graceWindow) {
          s.rightDoorJammed = true;
          this.syncControlButtons();
          if (!s.camOpen || pete.doorWaitSec >= graceWindow + 2.8) {
            this.triggerJumpscare(
              "pete",
              "Pumpkin Pete slipped through your open Right Door after laughing in the East Corridor!"
            );
          }
        }
      }
    }
  }

  /* ========================================================================
     ANIMATRONIC AI 3: BARNABY STITCH (WEST ROUTE -> LEFT DOOR)
     Path: cam01 -> cam02 -> cam03 -> cam04 -> left_door
     ======================================================================== */
  updateStitch(dt) {
    const s = this.state;
    const stitch = s.stitch;
    if (stitch.ai <= 0 || s.elapsedSec < 16) return;

    if (stitch.loc !== "left_door") {
      const camPenalty = s.camOpenContinuousSec > 7 ? 1.38 : 1.0;
      stitch.moveTimer += dt * camPenalty;

      const stepInterval = Math.max(5.5, 16.0 - (stitch.ai / 20) * 8.5);
      if (stitch.moveTimer >= stepInterval * 0.65 && !stitch.closeStare && stitch.ai >= 7) {
        stitch.closeStare = true;
        if (s.camOpen && s.currentCam === stitch.loc) {
          s.camStaticAlpha = 0.65;
          if (this.selectedNight >= 3 && Math.random() < 0.35) {
            s.camJammedTimer = 3.5;
            this.updateCameraHUD();
          }
        }
      }

      if (stitch.moveTimer >= stepInterval) {
        stitch.moveTimer = 0;
        stitch.closeStare = false;
        const prevLoc = stitch.loc;
        const route = {
          cam01: "cam02",
          cam02: "cam03",
          cam03: "cam04",
          cam04: "left_door",
        };
        stitch.loc = route[stitch.loc] || "cam02";

        if (stitch.loc === "left_door" || stitch.loc === "cam04") {
          window.audioEngine.play("burlap_scrape", { volume: 0.78, pan: -0.7 });
          if (stitch.loc === "cam04" && !s.whispersPlayed.stitch) {
            s.whispersPlayed.stitch = true;
            window.audioEngine.play("voice_stitch_whisper", { volume: 0.75, pan: -0.45 });
          }
        } else {
          window.audioEngine.play("footsteps_heavy", { volume: 0.45, pan: -0.55 });
        }

        if (stitch.loc === "left_door") {
          stitch.doorWaitSec = 0;
          stitch.spottedInLight = false;
        }

        if (s.camOpen && (s.currentCam === prevLoc || s.currentCam === stitch.loc)) {
          s.camStaticAlpha = 0.85;
          this.updateCameraHUD();
        }
      }
    } else {
      stitch.doorWaitSec += dt;

      if (s.leftDoorClosed) {
        if (stitch.doorWaitSec >= 4.5) {
          window.audioEngine.play("burlap_scrape", { volume: 0.65, pan: -0.65 });
          stitch.loc = Math.random() < 0.55 ? "cam02" : "cam03";
          stitch.moveTimer = 0;
          stitch.doorWaitSec = 0;
          stitch.spottedInLight = false;
          stitch.closeStare = false;
          if (s.camOpen) this.updateCameraHUD();
        }
      } else {
        const graceWindow = Math.max(4.8, 8.8 - (stitch.ai / 20) * 3.5);
        if (stitch.doorWaitSec >= graceWindow) {
          s.leftDoorJammed = true;
          this.syncControlButtons();
          if (!s.camOpen || stitch.doorWaitSec >= graceWindow + 2.8) {
            this.triggerJumpscare(
              "stitch",
              "Barnaby Stitch crept up the West Corridor into your Left Door blind spot and jammed the door!"
            );
          }
        }
      }
    }
  }

  /* ========================================================================
     ANIMATRONIC AI 4: GRIMSHAW THE PLAGUE CROW (CAM 05 ROOST -> EAST SPRINT)
     ======================================================================== */
  updateGrimshaw(dt) {
    const s = this.state;
    const g = s.grimshaw;
    if (g.ai <= 0) {
      document.getElementById("global-roost-alert").textContent = "ROOST: OFFLINE";
      return;
    }

    if (g.stage < 3) {
      // Viewing CAM 05 calms Grimshaw's agitation!
      if (s.camOpen && s.currentCam === "cam05") {
        g.calm = Math.min(100, g.calm + 15.5 * dt);
        g.closeStare = false;
      } else if (s.elapsedSec > 18) {
        const drainRate = 0.72 + (g.ai / 20) * 1.45;
        g.calm = Math.max(0, g.calm - drainRate * dt);
      }

      const prevStage = g.stage;
      if (g.calm > 55) g.stage = 0;
      else if (g.calm > 25) g.stage = 1;
      else if (g.calm > 0) {
        g.stage = 2;
        if (g.calm < 11) g.closeStare = true;
      } else {
        // Grimshaw breaks out of CAM 05 and sprints down CAM 06 toward the Right Door!
        g.stage = 3;
        g.sprintTimer = 4.0;
        window.audioEngine.play("grimshaw_caw", { volume: 0.9, pan: 0.65 });
        window.audioEngine.play("grimshaw_sprint", { volume: 0.95, pan: 0.65 });
        this.showWarningSubtitle("🦅 GRIMSHAW SPRINTING DOWN EAST HALL (CAM 06)! SHUT RIGHT DOOR [D]!");
        if (s.camOpen && (s.currentCam === "cam05" || s.currentCam === "cam06")) {
          s.camStaticAlpha = 0.9;
          this.updateCameraHUD();
        }
      }

      if (prevStage !== g.stage) {
        if (g.stage === 2) {
          window.audioEngine.play("grimshaw_caw", { volume: 0.62, pan: 0.45 });
          if (!s.whispersPlayed.grimshaw) {
            s.whispersPlayed.grimshaw = true;
            window.audioEngine.play("voice_grimshaw_whisper", { volume: 0.75, pan: 0.45 });
          }
        }
        if (s.camOpen && s.currentCam === "cam05") {
          s.camStaticAlpha = 0.72;
          this.updateCameraHUD();
        }
      }
    } else {
      // Stage 3: Sprinting down East Hall toward Right Door!
      g.sprintTimer -= dt;
      if (g.sprintTimer <= 0) {
        if (s.rightDoorClosed) {
          window.audioEngine.play("door_bang", { volume: 0.95, pan: 0.75 });
          const pwrLoss = this.perks && this.perks.grimshaw ? 2.2 : 3.5;
          s.power = Math.max(0, s.power - pwrLoss);
          s.stats.grimshawsBlocked++;
          g.stage = 0;
          g.calm = 82.0;
          g.closeStare = false;
          this.showWarningSubtitle("💥 Grimshaw crashed his iron talons into the closed Right Door and retreated to CAM 05!");
          if (s.camOpen) this.updateCameraHUD();
        } else {
          this.triggerJumpscare(
            "grimshaw",
            "You left the CAM 05 Arcade Alley unwatched and Grimshaw the Plague Crow sprinted through your open Right Door!"
          );
          return;
        }
      }
    }

    const pct = Math.ceil(g.calm);
    const roostBar = document.getElementById("cam05-meter-bar");
    const roostTxt = document.getElementById("cam05-meter-text");
    if (roostBar && roostTxt) {
      roostBar.style.width = `${pct}%`;
      const stageNames = ["CALM", "PEEKING", "IN ARCADE!", "EAST SPRINT!"];
      roostTxt.textContent = g.stage === 3 ? "SPRINTING DOWN CAM 06!" : `${stageNames[g.stage]} (${pct}%)`;
    }

    const globalRoost = document.getElementById("global-roost-alert");
    const warnDot = document.getElementById("cam05-warn-dot");
    if (globalRoost && warnDot) {
      globalRoost.textContent = g.stage === 3 ? "CROW SPRINT!" : `ROOST: ${pct}%`;
      globalRoost.classList.toggle("warn", pct <= 55 && pct > 25 && g.stage < 3);
      globalRoost.classList.toggle("danger", pct <= 25 || g.stage === 3);
      warnDot.classList.toggle("warn", pct <= 55 && pct > 25 && g.stage < 3);
      warnDot.classList.toggle("danger", pct <= 25 || g.stage === 3);
    }
  }

  /* ========================================================================
     ANIMATRONIC AI 5: WITHERED SILAS (CAM 07 BOILER -> CAM 08 DUCT -> VENT)
     ======================================================================== */
  updateSilas(dt) {
    const s = this.state;
    const silas = s.silas;
    const warnDot7 = document.getElementById("cam07-warn-dot");
    const warnDot8 = document.getElementById("cam08-warn-dot");
    if (silas.ai <= 0 || s.elapsedSec < 18) {
      if (warnDot7) warnDot7.classList.remove("warn", "danger");
      if (warnDot8) warnDot8.classList.remove("warn", "danger");
      return;
    }

    if (silas.loc !== "vent_peek") {
      // Watching Silas on CAM 07 or CAM 08 slows his clockwork advance by 65%
      const isWatched = s.camOpen && s.currentCam === silas.loc;
      const rateMult = isWatched ? 0.35 : 1.0;
      silas.moveTimer += dt * rateMult;

      const stepInterval = Math.max(5.5, 16.5 - (silas.ai / 20) * 8.5);
      if (silas.moveTimer >= stepInterval * 0.55 && silas.stage === 1) {
        silas.stage = 2;
        if (silas.loc === "cam08") {
          window.audioEngine.play("vent_crawl", { volume: 0.78, pan: 0 });
        } else {
          window.audioEngine.play("clockwork_tick", { volume: 0.65, pan: 0 });
        }
        if (s.camOpen && s.currentCam === silas.loc) {
          s.camStaticAlpha = 0.72;
          this.updateCameraHUD();
        }
      }

      if (silas.moveTimer >= stepInterval) {
        silas.moveTimer = 0;
        const prevLoc = silas.loc;
        if (silas.loc === "cam07") {
          silas.loc = "cam08";
          silas.stage = 1;
          window.audioEngine.play("vent_crawl", { volume: 0.82, pan: 0 });
          if (!s.whispersPlayed.silas) {
            s.whispersPlayed.silas = true;
            window.audioEngine.play("voice_silas_whisper", { volume: 0.78, pan: 0 });
          }
        } else if (silas.loc === "cam08") {
          silas.loc = "vent_peek";
          silas.stage = 3;
          silas.ventWaitSec = 0;
          window.audioEngine.play("vent_crawl", { volume: 0.92, pan: 0 });
          this.showWarningSubtitle(
            "⚙ WITHERED SILAS IS ABOVE YOUR DESK IN THE CEILING GRATE! SEAL VENT [V] OR FLASH [X]!"
          );
        }
        if (s.camOpen && (s.currentCam === prevLoc || s.currentCam === silas.loc)) {
          s.camStaticAlpha = 0.85;
          this.updateCameraHUD();
        }
      }
    } else {
      // Silas is peeking directly through the ceiling vent grate above the guard's desk!
      silas.ventWaitSec += dt;
      if (s.ventSealed) {
        if (silas.ventWaitSec >= 3.8) {
          window.audioEngine.play("vent_slam", { volume: 0.88, pan: 0 });
          s.stats.silasBlocked++;
          silas.loc = "cam07";
          silas.stage = 1;
          silas.moveTimer = 0;
          silas.ventWaitSec = 0;
          this.showWarningSubtitle(
            "💥 Withered Silas scraped against the sealed Ceiling Vent Shutter and retreated to CAM 07!"
          );
          if (s.camOpen) this.updateCameraHUD();
        }
      } else {
        const graceWindow = Math.max(4.6, 8.5 - (silas.ai / 20) * 3.4);
        if (silas.ventWaitSec >= graceWindow) {
          this.triggerJumpscare(
            "silas",
            "Withered Silas crawled through the overhead ventilation shaft (CAM 08) and dropped through your unsealed Ceiling Vent [V]!"
          );
          return;
        }
      }
    }

    if (warnDot7) {
      warnDot7.classList.toggle("warn", silas.loc === "cam07" && silas.stage >= 2);
    }
    if (warnDot8) {
      warnDot8.classList.toggle("warn", silas.loc === "cam08" && silas.stage === 1);
      warnDot8.classList.toggle("danger", (silas.loc === "cam08" && silas.stage >= 2) || silas.loc === "vent_peek");
    }
  }

  /* ========================================================================
     POWER OUTAGE (0% BATTERY BLACKOUT SEQUENCE)
     ======================================================================== */
  enterPowerOutage() {
    const s = this.state;
    s.phase = "powerout";
    s.power = 0;
    s.camOpen = false;
    s.leftDoorClosed = false;
    s.rightDoorClosed = false;
    s.ventSealed = false;
    s.leftLightOn = false;
    s.rightLightOn = false;
    s.fanOn = false;
    s.powerOutStage = 0;
    s.powerOutTimer = 0;
    s.officePanX = 0.32;

    document.getElementById("camera-tablet").classList.add("hidden");
    document.getElementById("left-control-panel").classList.add("hidden");
    document.getElementById("right-control-panel").classList.add("hidden");
    const ventBar = document.getElementById("vent-control-bar");
    if (ventBar) ventBar.classList.add("hidden");
    document.getElementById("cassette-widget").classList.add("hidden");
    document.getElementById("overheat-overlay").classList.add("hidden");

    window.audioEngine.stopAllLoops();
    window.audioEngine.play("power_down", { volume: 0.95 });
    this.showWarningSubtitle("⚡ GENERATOR BATTERY DEPLETED (0%) — AUXILIARY POWER OFFLINE...", 8000);
  }

  updatePowerOut(dt) {
    const s = this.state;
    s.elapsedSec += dt;
    s.powerOutTimer += dt;

    if (s.elapsedSec >= this.nightDuration) {
      this.triggerWin6AM();
      return;
    }

    s.leftDoorAnim = Math.max(0, s.leftDoorAnim - dt * 2.5);
    s.rightDoorAnim = Math.max(0, s.rightDoorAnim - dt * 2.5);

    if (s.powerOutStage === 0 && s.powerOutTimer >= 3.5) {
      s.powerOutStage = 1;
      s.powerOutTimer = 0;
      window.audioEngine.startLoop("music_box_melody", { volume: 0.75, pan: -0.35 });
      window.audioEngine.play("voice_pete_whisper", { volume: 0.85, pan: -0.35 });
    } else if (s.powerOutStage === 1 && s.powerOutTimer >= 8.5) {
      s.powerOutStage = 2;
      s.powerOutTimer = 0;
      window.audioEngine.stopLoop("music_box_melody");
    } else if (s.powerOutStage === 2 && s.powerOutTimer >= 2.2) {
      this.triggerJumpscare(
        "pete",
        "Your auxiliary battery hit 0% before 6:00 AM! Conserve power by only closing blast doors when an animatronic is right outside."
      );
    }
  }

  /* ========================================================================
     JUMPSCARE, GAME OVER & 6:00 AM VICTORY
     ======================================================================== */
  triggerJumpscare(who, reasonText) {
    const s = this.state;
    s.phase = "jumpscare";
    s.jumpscareWho = who;
    s.jumpscareTimer = 0;
    s.camOpen = false;
    this.lastDeathReason = reasonText;

    this.screens.game.classList.add("jumpscare-active");
    this.switchScreen("game");
    document.getElementById("camera-tablet").classList.add("hidden");
    document.getElementById("subtitle-bar").classList.add("hidden");
    document.getElementById("overheat-overlay").classList.add("hidden");

    window.audioEngine.stopAllLoops();
    const screamKey = who === "silas" ? "jumpscare_silas_scream" : "jumpscare_scream";
    window.audioEngine.play(screamKey, { volume: 1.0 });
    window.audioEngine.playWindowStinger(0);
  }

  updateJumpscare(dt) {
    this.state.jumpscareTimer += dt;
    if (this.state.jumpscareTimer >= 1.35) {
      if (this.state.previewJumpscareReturnToExtras) {
        this.state.previewJumpscareReturnToExtras = false;
        this.returnToMenu();
        window.audioEngine.stopLoop("bgm_menu");
        window.audioEngine.startLoop("bgm_extras", { volume: 0.4 });
        document.getElementById("extras-panel").classList.remove("hidden");
        return;
      }
      this.showGameOver();
    }
  }

  showGameOver() {
    const s = this.state;
    s.phase = "gameover";

    const names = {
      pete: "Pumpkin Pete",
      stitch: "Barnaby Stitch",
      hexa: "Madame Hexa",
      grimshaw: "Grimshaw the Plague Crow",
      silas: "Withered Silas (The Clockmaker)",
    };
    const killerName = names[s.jumpscareWho] || "Pumpkin Pete";
    const totalMinutes = Math.floor((s.elapsedSec / this.nightDuration) * 360);
    const hr = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;
    const hrStr = hr === 0 ? "12" : String(hr);
    const timeStr = `${hrStr}:${String(min).padStart(2, "0")} AM`;

    document.getElementById("gameover-cause").textContent = `Claimed by ${killerName} at ${timeStr}`;
    document.getElementById("gameover-tip").textContent =
      this.lastDeathReason ||
      "Watch your battery usage, wind the Carillon on CAM 03, check CAM 05 for Grimshaw, monitor CAM 08 for Silas, and check lights before slamming doors.";

    // Play spoken Game Over taunt from the animatronic that caught you!
    const variant = Math.random() < 0.5 ? 1 : 2;
    const tauntKey = `taunt_${s.jumpscareWho}_${variant}`;
    window.audioEngine.play(tauntKey, { volume: 0.9, pan: 0 });

    this.switchScreen("gameover");
  }

  triggerWin6AM() {
    const s = this.state;
    s.phase = "win";
    window.audioEngine.stopAllLoops();
    window.audioEngine.play("chime_6am", { volume: 0.95 });
    window.audioEngine.startLoop("bgm_victory", { volume: 0.45, pan: 0 });

    // Unlock Completion Stars
    this.stars.night1 = true;
    if (this.mode === "normal" && this.selectedNight >= 5) {
      this.stars.night5 = true;
    }
    if (
      this.mode === "nightmare" ||
      (this.mode === "custom" &&
        this.customLevels.pete >= 20 &&
        this.customLevels.stitch >= 20 &&
        this.customLevels.hexa >= 20 &&
        this.customLevels.grimshaw >= 20)
    ) {
      this.stars.overtime = true;
    }
    this.saveStars();

    const cfg = NIGHT_CONFIGS[this.selectedNight] || NIGHT_CONFIGS[1];
    const pwrLeft = Math.max(0, Math.ceil(s.power));
    const isOvertimeOrMax = this.mode === "nightmare" || this.mode === "custom";

    document.getElementById("win-shift-tag").textContent =
      this.mode === "nightmare"
        ? "NIGHT 6 OVERTIME SURVIVED!"
        : this.mode === "custom"
        ? "CUSTOM SHIFT SURVIVED!"
        : `NIGHT ${this.selectedNight} SHIFT SURVIVED`;

    document.getElementById("win-paycheck-date").textContent = `DATE: ${cfg.date}`;
    document.getElementById("win-paycheck-amount").textContent =
      this.mode === "nightmare" ? "$120.50" : cfg.pay;

    const artImg = document.getElementById("win-artwork-img");
    if (artImg) {
      const allSalvaged =
        this.perks.pete &&
        this.perks.hexa &&
        this.perks.grimshaw &&
        this.perks.silas &&
        this.perks.stitch;
      if (allSalvaged && this.isReady(this.images.win_collector_poster_4k)) {
        artImg.src = "assets/images/win_collector_poster_4k.png";
      } else {
        artImg.src = isOvertimeOrMax
          ? "assets/images/win_overtime_trophy.png"
          : "assets/images/win_night5_paycheck.png";
      }
    }

    document.getElementById(
      "win-stats-summary"
    ).textContent = `MEMO: Shift Survived (12 AM – 6 AM) // Battery Left: ${pwrLeft}% // Doors Used: ${s.stats.doorCloses} // Vent Seals: ${s.stats.ventSeals} // Sprinters Blocked: ${s.stats.hexasBlocked + s.stats.grimshawsBlocked + s.stats.silasBlocked}`;

    const nextLbl = document.getElementById("btn-next-shift-label");
    if (nextLbl) {
      if (this.mode === "normal" && this.selectedNight < 5) {
        nextLbl.textContent = `Continue to Night ${this.selectedNight + 1} Shift`;
      } else {
        nextLbl.textContent = "Play Shift Again (Instant Restart)";
      }
    }

    this.switchScreen("win");
  }

  /* ========================================================================
     RENDERING: TITLE, PANORAMIC OFFICE, CCTV & 4-FRAME JUMPSCARE
     ======================================================================== */
  isReady(img) {
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }

  renderTitleScreen(timeSec) {
    const ctx = this.titleCtx;
    const w = this.titleCanvas.width;
    const h = this.titleCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const bg = this.isReady(this.images.title_bg_4k)
      ? this.images.title_bg_4k
      : this.images.title_bg;
    if (this.isReady(bg)) {
      const zoom = 1.04 + Math.sin(timeSec * 0.4) * 0.02;
      const dw = w * zoom;
      const dh = h * zoom;
      const dx = (w - dw) * 0.5 + Math.cos(timeSec * 0.3) * 14;
      const dy = (h - dh) * 0.5;
      ctx.drawImage(bg, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = "#09080c";
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = "rgba(242, 125, 22, 0.04)";
    const scanY = (timeSec * 90) % h;
    ctx.fillRect(0, scanY, w, 3);
  }

  renderOffice(dt) {
    const ctx = this.officeCtx;
    const cw = this.officeCanvas.width;
    const ch = this.officeCanvas.height;
    const s = this.state;

    // Brief 4K Nightmare Hallucination flash when lowering monitor late at night
    if (s.hallucinationTimer > 0) {
      const halPool = [
        this.images.hallucination_silas_4k,
        this.images.hallucination_hexa_4k,
        this.images.hallucination_stitch_4k,
        this.images.hallucination_grimshaw_4k,
        this.images.hallucination_golden_pete,
      ].filter((img) => this.isReady(img));
      const halImg = halPool[Math.floor((s.elapsedSec * 7) % Math.max(1, halPool.length))];
      if (this.isReady(halImg)) {
        ctx.save();
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(halImg, 0, 0, cw, ch);
        this.drawAnalogStatic(ctx, cw, ch, 0.28);
        ctx.restore();
        return;
      }
    }

    const worldW = 1920;
    const worldH = 768;
    const maxScroll = worldW - cw;
    const scrollX = Math.round(s.officePanX * maxScroll);

    ctx.save();
    ctx.clearRect(0, 0, cw, ch);
    ctx.translate(-scrollX, 0);

    const baseImg =
      s.silas.loc === "vent_peek" &&
      !s.ventSealed &&
      this.isReady(this.images.office_vent_peek_silas)
        ? this.images.office_vent_peek_silas
        : this.images.office_base;
    if (s.phase === "powerout") {
      const pwrImg =
        s.powerOutStage >= 2 && this.isReady(this.images.office_power_out_2)
          ? this.images.office_power_out_2
          : s.powerOutStage === 1 && this.isReady(this.images.office_power_out)
          ? this.images.office_power_out
          : this.images.office_base;
      if (this.isReady(pwrImg)) {
        ctx.drawImage(pwrImg, 0, 0, worldW, worldH);
      } else {
        ctx.fillStyle = "#08090d";
        ctx.fillRect(0, 0, worldW, worldH);
      }
    } else {
      // 1. Draw center/base panoramic office (or Withered Silas peeking from ceiling vent!)
      if (this.isReady(baseImg)) {
        ctx.drawImage(baseImg, 0, 0, worldW, worldH);
      } else {
        ctx.fillStyle = "#11131a";
        ctx.fillRect(0, 0, worldW, worldH);
      }

      // 2. Composite Left Wing (x: 0..680) for pre-rendered Left Door or Left Hallway Light / Window Press!
      let leftImg = baseImg;
      if (s.leftDoorClosed && s.leftDoorAnim > 0.92 && this.isReady(this.images.office_left_door_closed)) {
        leftImg = this.images.office_left_door_closed;
      } else if (s.leftLightOn) {
        if (s.stitch.loc === "left_door") {
          if (s.stitch.doorWaitSec >= 2.2 && this.isReady(this.images.office_left_window_stitch_close)) {
            leftImg = this.images.office_left_window_stitch_close;
          } else if (this.isReady(this.images.office_left_light_stitch)) {
            leftImg = this.images.office_left_light_stitch;
          }
        } else if (s.hexa.stage === 3) {
          if (s.hexa.sprintTimer <= 2.0 && this.isReady(this.images.office_left_window_hexa_close)) {
            leftImg = this.images.office_left_window_hexa_close;
          } else if (this.isReady(this.images.office_left_light_hexa)) {
            leftImg = this.images.office_left_light_hexa;
          }
        } else if (this.isReady(this.images.office_left_light_empty)) {
          leftImg = this.images.office_left_light_empty;
        }
      }
      if (leftImg !== baseImg && this.isReady(leftImg)) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 680, worldH);
        ctx.clip();
        ctx.drawImage(leftImg, 0, 0, worldW, worldH);
        ctx.restore();
      }

      // 3. Composite Right Wing (x: 1240..1920) for pre-rendered Right Door or Right Hallway Light / Window Press!
      let rightImg = baseImg;
      if (s.rightDoorClosed && s.rightDoorAnim > 0.92 && this.isReady(this.images.office_right_door_closed)) {
        rightImg = this.images.office_right_door_closed;
      } else if (s.rightLightOn) {
        if (s.pete.loc === "right_door") {
          if (s.pete.doorWaitSec >= 2.2 && this.isReady(this.images.office_right_window_pete_close)) {
            rightImg = this.images.office_right_window_pete_close;
          } else if (this.isReady(this.images.office_right_light_pete)) {
            rightImg = this.images.office_right_light_pete;
          }
        } else if (s.grimshaw.stage === 3) {
          if (s.grimshaw.sprintTimer <= 2.0 && this.isReady(this.images.office_right_window_grimshaw_close)) {
            rightImg = this.images.office_right_window_grimshaw_close;
          } else if (this.isReady(this.images.office_right_light_grimshaw)) {
            rightImg = this.images.office_right_light_grimshaw;
          }
        } else if (this.isReady(this.images.office_right_light_empty)) {
          rightImg = this.images.office_right_light_empty;
        }
      }
      if (rightImg !== baseImg && this.isReady(rightImg)) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(1240, 0, worldW - 1240, worldH);
        ctx.clip();
        ctx.drawImage(rightImg, 0, 0, worldW, worldH);
        ctx.restore();
      }

      // 4. Subtle fluorescent flicker when hallway light is held on
      if (s.leftLightOn) {
        const flicker = 0.85 + Math.sin(performance.now() * 0.035) * 0.12;
        const grad = ctx.createRadialGradient(350, 380, 20, 350, 380, 320);
        grad.addColorStop(0, `rgba(255, 195, 110, ${0.18 * flicker})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(150, 20, 420, 730);
      }
      if (s.rightLightOn) {
        const flicker = 0.85 + Math.cos(performance.now() * 0.035) * 0.12;
        const grad = ctx.createRadialGradient(1570, 380, 20, 1570, 380, 320);
        grad.addColorStop(0, `rgba(255, 170, 90, ${0.18 * flicker})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(1350, 20, 420, 730);
      }
    }

    // 5. Draw Perspective-Matched Sliding Blast Doors during transition (or fallback)
    if (
      s.leftDoorAnim > 0.01 &&
      (s.leftDoorAnim <= 0.92 || !this.isReady(this.images.office_left_door_closed))
    ) {
      this.drawBlastDoor(ctx, "left", s.leftDoorAnim);
    }
    if (
      s.rightDoorAnim > 0.01 &&
      (s.rightDoorAnim <= 0.92 || !this.isReady(this.images.office_right_door_closed))
    ) {
      this.drawBlastDoor(ctx, "right", s.rightDoorAnim);
    }

    // 6. Draw Overhead Ceiling Vent Steel Shutter when Vent is Sealed [V]
    if (s.ventSealed && s.phase === "playing") {
      ctx.save();
      ctx.fillStyle = "#1c222d";
      ctx.strokeStyle = "#f27d16";
      ctx.lineWidth = 2;
      ctx.fillRect(830, 6, 260, 46);
      ctx.strokeRect(830, 6, 260, 46);
      ctx.fillStyle = "#f27d16";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CEILING VENT SHUTTER SEALED [V]", 960, 33);
      ctx.restore();
    }

    // 7. Draw Animated Spinning Fan Blades + Golden Plushie Trophy + Live Picture-in-Picture Desk CRT Monitor!
    if (s.phase === "playing") {
      this.drawDeskFan(ctx, 765, 365, s.fanAngle);
      if (
        (this.stars.night1 || this.selectedNight >= 2 || this.mode !== "normal") &&
        this.isReady(this.images.sprite_plush_pete)
      ) {
        ctx.drawImage(this.images.sprite_plush_pete, 835, 368, 92, 92);
      }
      this.drawDeskMiniCRT(ctx, 1124, 355, 108, 76);
    }

    // 8. Power Outage Darkness Overlay
    if (s.phase === "powerout") {
      ctx.fillStyle = s.powerOutStage === 2 ? "rgba(0, 0, 0, 0.97)" : "rgba(0, 0, 0, 0.68)";
      ctx.fillRect(0, 0, worldW, worldH);

      if (s.powerOutStage === 1) {
        const glowAlpha = 0.55 + Math.sin(performance.now() * 0.015) * 0.35;
        ctx.fillStyle = `rgba(255, 145, 20, ${glowAlpha})`;
        ctx.beginPath();
        ctx.arc(335, 295, 8, 0, Math.PI * 2);
        ctx.arc(375, 295, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // 9. Screen-Space Volumetric Cursor Flashlight & Floating Dust Motes + Flash Beacon Decay
    if (s.phase === "playing" && !s.camOpen) {
      const fx = this.mouseNormX * cw;
      const fy = (this.mouseNormY || 0.5) * ch;
      const fGrad = ctx.createRadialGradient(fx, fy, 30, fx, fy, 360);
      fGrad.addColorStop(0, "rgba(255, 220, 165, 0.08)");
      fGrad.addColorStop(0.5, "rgba(255, 190, 120, 0.03)");
      fGrad.addColorStop(1, "rgba(0, 0, 0, 0.24)");
      ctx.fillStyle = fGrad;
      ctx.fillRect(0, 0, cw, ch);
    }

    if (s.flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 245, 215, ${s.flashAlpha})`;
      ctx.fillRect(0, 0, cw, ch);
    }
  }

  drawDeskMiniCRT(ctx, x, y, w, h) {
    const s = this.state;
    const camKey = this.pickCameraImageKey(s.currentCam);
    const img = this.images[camKey] || this.images[`${s.currentCam}_empty`];

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    if (this.isReady(img)) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = "#06100a";
      ctx.fillRect(x, y, w, h);
    }

    // Phosphor green mini-CRT tint + scanlines
    ctx.fillStyle = "rgba(25, 180, 95, 0.18)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(53, 212, 106, 0.9)";
    ctx.font = "bold 9px monospace";
    ctx.fillText(CAMERAS[s.currentCam] ? CAMERAS[s.currentCam].number : "CAM 01", x + 5, y + 12);

    if (s.camJammedTimer > 0) {
      this.drawAnalogStatic(ctx, w, h, 0.45);
    }
    ctx.strokeStyle = "rgba(53, 212, 106, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  drawBlastDoor(ctx, side, animProgress) {
    if (animProgress <= 0.01) return;

    const poly =
      side === "left"
        ? [
            { x: 226, y: 32 },
            { x: 478, y: 128 },
            { x: 478, y: 695 },
            { x: 226, y: 745 },
          ]
        : [
            { x: 1442, y: 128 },
            { x: 1694, y: 32 },
            { x: 1694, y: 745 },
            { x: 1442, y: 695 },
          ];

    const xMin = poly[0].x;
    const xMax = poly[1].x;
    const w = xMax - xMin;
    const fullH = 720;
    const yOffset = (1 - animProgress) * fullH;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    ctx.lineTo(poly[1].x, poly[1].y);
    ctx.lineTo(poly[2].x, poly[2].y);
    ctx.lineTo(poly[3].x, poly[3].y);
    ctx.closePath();
    ctx.clip();

    ctx.translate(0, -yOffset);

    const grad = ctx.createLinearGradient(xMin, 0, xMax, 0);
    grad.addColorStop(0, "#181b22");
    grad.addColorStop(0.5, "#2f3543");
    grad.addColorStop(1, "#15181f");
    ctx.fillStyle = grad;
    ctx.fillRect(xMin, 20, w, fullH + 40);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.68)";
    ctx.lineWidth = 4;
    for (let frac = 0.1; frac < 0.9; frac += 0.12) {
      const ly = poly[0].y + (poly[3].y - poly[0].y) * frac;
      const ry = poly[1].y + (poly[2].y - poly[1].y) * frac;
      ctx.beginPath();
      ctx.moveTo(xMin + 4, ly);
      ctx.lineTo(xMax - 4, ry);
      ctx.stroke();
    }

    const bL = poly[3].y;
    const bR = poly[2].y;
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.moveTo(xMin, bL - 32);
    ctx.lineTo(xMax, bR - 32);
    ctx.lineTo(xMax, bR);
    ctx.lineTo(xMin, bL);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawDeskFan(ctx, cx, cy, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(160, 175, 190, 0.24)";
    for (let i = 0; i < 3; i++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(0, -16, 8, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderCCTV(dt) {
    const ctx = this.cctvCtx;
    const w = this.cctvCanvas.width;
    const h = this.cctvCanvas.height;
    const s = this.state;

    s.camPanPhase += dt * 0.35;
    s.camStaticAlpha = Math.max(0.06, s.camStaticAlpha - dt * 1.8);

    const camKey = this.pickCameraImageKey(s.currentCam);
    const img = this.images[camKey] || this.images[`${s.currentCam}_empty`];

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    if (this.isReady(img)) {
      const zoom = 1.08;
      const dw = w * zoom;
      const dh = h * zoom;
      const panOffset = Math.sin(s.camPanPhase) * ((dw - w) * 0.48);
      const dx = (w - dw) * 0.5 + panOffset;
      const dy = (h - dh) * 0.5;
      ctx.drawImage(img, dx, dy, dw, dh);

      this.renderSecondaryCameraOccupant(ctx, s.currentCam, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = "#080a0e";
      ctx.fillRect(0, 0, w, h);
    }

    // Night-vision green/amber CCTV tint
    ctx.fillStyle = "rgba(18, 38, 28, 0.14)";
    ctx.fillRect(0, 0, w, h);

    // Audio Decoy Ripple Indicator on CCTV
    if (s.decoyActiveTimer > 0 && s.decoyActiveRoom === s.currentCam) {
      const r = ((4.0 - s.decoyActiveTimer) * 140) % 260;
      ctx.strokeStyle = "rgba(53, 212, 106, 0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Heavy signal interference if camera is jammed, otherwise normal analog snow
    if (s.camJammedTimer > 0) {
      this.drawAnalogStatic(ctx, w, h, 0.62);
    } else if (s.camStaticAlpha > 0.05) {
      this.drawAnalogStatic(ctx, w, h, s.camStaticAlpha * 0.42);
    }

    ctx.restore();
  }

  pickCameraImageKey(camId) {
    const s = this.state;
    const peteHere = s.pete.loc === camId;
    const stitchHere = s.stitch.loc === camId;

    if (camId === "cam01") {
      if (peteHere && stitchHere) return "cam01_both";
      if (peteHere) {
        if (s.pete.closeStare && this.isReady(this.images.cam01_pete_stare)) return "cam01_pete_stare";
        return "cam01_pete";
      }
      if (stitchHere) {
        if (s.stitch.closeStare && this.isReady(this.images.cam01_stitch_stare)) return "cam01_stitch_stare";
        return "cam01_stitch";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 2) && this.isReady(this.images.cam01_anomaly_poster)) {
        return "cam01_anomaly_poster";
      }
      return "cam01_empty";
    }
    if (camId === "cam02") {
      if (peteHere && stitchHere) return "cam02_both";
      if (peteHere) {
        if (s.pete.closeStare && this.isReady(this.images.cam02_pete_close)) return "cam02_pete_close";
        return "cam02_pete";
      }
      if (stitchHere) {
        if (s.stitch.closeStare && this.isReady(this.images.cam02_stitch_close)) return "cam02_stitch_close";
        return "cam02_stitch";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 3) && this.isReady(this.images.cam02_anomaly_jackolanterns)) {
        return "cam02_anomaly_jackolanterns";
      }
      return "cam02_empty";
    }
    if (camId === "cam03") {
      if (stitchHere && s.hexa.stage > 0 && this.isReady(this.images.cam03_both_hexa_stitch)) {
        return "cam03_both_hexa_stitch";
      }
      if (s.hexa.stage === 2) {
        if (s.hexa.closeStare && this.isReady(this.images.cam03_hexa_stare)) return "cam03_hexa_stare";
        return "cam03_hexa_2";
      }
      if (s.hexa.stage === 1) return "cam03_hexa_1";
      if (stitchHere && this.isReady(this.images.cam03_stitch)) return "cam03_stitch";
      if ((s.camJammedTimer > 0 || s.hour >= 4) && this.isReady(this.images.cam03_anomaly_masks)) {
        return "cam03_anomaly_masks";
      }
      return "cam03_empty";
    }
    if (camId === "cam04") {
      if (s.hexa.stage === 3 && stitchHere && this.isReady(this.images.cam04_both_stitch_hexa)) {
        return "cam04_both_stitch_hexa";
      }
      if (s.hexa.stage === 3) return "cam04_hexa_sprint";
      if (stitchHere) {
        if (s.stitch.closeStare && this.isReady(this.images.cam04_stitch_close)) return "cam04_stitch_close";
        return "cam04_stitch";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 3) && this.isReady(this.images.cam04_anomaly_shadow)) {
        return "cam04_anomaly_shadow";
      }
      return "cam04_empty";
    }
    if (camId === "cam05") {
      const grimStage = s.grimshaw.ai > 0 ? s.grimshaw.stage : 0;
      if (peteHere && grimStage > 0 && grimStage < 3 && this.isReady(this.images.cam05_both)) {
        return "cam05_both";
      }
      if (peteHere) return "cam05_pete";
      if (grimStage === 2) {
        if (s.grimshaw.closeStare && this.isReady(this.images.cam05_grimshaw_stare)) return "cam05_grimshaw_stare";
        if (this.isReady(this.images.cam05_grimshaw_2)) return "cam05_grimshaw_2";
      }
      if (grimStage === 1 && this.isReady(this.images.cam05_grimshaw_1)) {
        return "cam05_grimshaw_1";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 3) && this.isReady(this.images.cam05_anomaly_arcade)) {
        return "cam05_anomaly_arcade";
      }
      return "cam05_empty";
    }
    if (camId === "cam06") {
      if (s.grimshaw.stage === 3 && peteHere && this.isReady(this.images.cam06_both_pete_grimshaw)) {
        return "cam06_both_pete_grimshaw";
      }
      if (s.grimshaw.stage === 3 && this.isReady(this.images.cam06_grimshaw_sprint)) {
        return "cam06_grimshaw_sprint";
      }
      if (peteHere) {
        if (s.pete.closeStare && this.isReady(this.images.cam06_pete_close)) return "cam06_pete_close";
        return "cam06_pete";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 4) && this.isReady(this.images.cam06_anomaly_hooks)) {
        return "cam06_anomaly_hooks";
      }
      return "cam06_empty";
    }
    if (camId === "cam07") {
      if (s.silas.ai > 0 && s.silas.loc === "cam07") {
        if (s.silas.stage >= 2 && this.isReady(this.images.cam07_silas_2)) return "cam07_silas_2";
        if (this.isReady(this.images.cam07_silas_1)) return "cam07_silas_1";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 3) && this.isReady(this.images.cam07_anomaly_furnace)) {
        return "cam07_anomaly_furnace";
      }
      return "cam07_empty";
    }
    if (camId === "cam08") {
      if (s.silas.ai > 0 && s.silas.loc === "cam08") {
        if (s.silas.stage >= 2 && this.isReady(this.images.cam08_silas_crawl_2)) {
          return "cam08_silas_crawl_2";
        }
        if (this.isReady(this.images.cam08_silas_crawl_1)) return "cam08_silas_crawl_1";
      }
      if (s.stitch.loc === "cam04" && this.isReady(this.images.cam08_stitch_crawl)) {
        return "cam08_stitch_crawl";
      }
      if ((s.camJammedTimer > 0 || s.hour >= 4) && this.isReady(this.images.cam08_anomaly_teeth)) {
        return "cam08_anomaly_teeth";
      }
      return "cam08_empty";
    }
    return `${camId}_empty`;
  }

  renderSecondaryCameraOccupant(ctx, camId, dx, dy, dw, dh) {
    const s = this.state;
    // Fallback sprite composite only if a pre-rendered combined camera image isn't loaded yet
    if (
      camId === "cam03" &&
      s.stitch.loc === "cam03" &&
      s.hexa.stage > 0 &&
      !this.isReady(this.images.cam03_both_hexa_stitch)
    ) {
      const sp = this.images.sprite_stitch;
      if (this.isReady(sp)) {
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.drawImage(sp, dx + dw * 0.08, dy + dh * 0.22, dw * 0.28, dh * 0.72);
        ctx.restore();
      }
    }
  }

  drawAnalogStatic(ctx, w, h, alpha) {
    ctx.save();
    ctx.fillStyle = `rgba(210, 220, 215, ${alpha})`;
    for (let i = 0; i < 48; i++) {
      const y = Math.random() * h;
      const bh = 2 + Math.random() * 8;
      ctx.fillRect(0, y, w, bh);
    }
    ctx.restore();
  }

  renderJumpscare() {
    const ctx = this.officeCtx;
    const w = this.officeCanvas.width;
    const h = this.officeCanvas.height;
    const s = this.state;

    // 4-Frame High-Speed Animated Jumpscare Sequence!
    const frameIdx = Math.floor(s.jumpscareTimer / 0.095) % 4;
    const suffix = frameIdx === 0 ? "" : `_${frameIdx + 1}`;
    const candidateKey = `jumpscare_${s.jumpscareWho}${suffix}`;
    const baseKey = `jumpscare_${s.jumpscareWho}`;
    const spKey = `sprite_${s.jumpscareWho}`;

    const img = this.isReady(this.images[candidateKey])
      ? this.images[candidateKey]
      : this.images[baseKey];
    const sp = this.images[spKey];

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Organic camera shake & violent zoom lunge (no strobe flashing)
    const t = s.jumpscareTimer;
    const zoom = 1.0 + Math.min(0.38, t * 0.45);
    const shakeX = (Math.random() - 0.5) * 38;
    const shakeY = (Math.random() - 0.5) * 32;

    const dw = w * zoom;
    const dh = h * zoom;
    const dx = (w - dw) * 0.5 + shakeX;
    const dy = (h - dh) * 0.5 + shakeY;

    if (this.isReady(img)) {
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = "#180606";
      ctx.fillRect(0, 0, w, h);
      if (this.isReady(sp)) {
        ctx.drawImage(sp, w * 0.2 + shakeX, h * 0.05 + shakeY, w * 0.6, h * 0.95);
      }
    }

    // Crimson vignette edge
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.2, w * 0.5, h * 0.5, w * 0.65);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(180, 15, 15, 0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  renderStaticCanvas() {
    const ctx = this.staticCtx;
    const w = this.staticCanvas.width;
    const h = this.staticCanvas.height;
    ctx.fillStyle = "#08090c";
    ctx.fillRect(0, 0, w, h);
    this.drawAnalogStatic(ctx, w, h, 0.25);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.gameInstance = new PumpkinPetesGame();
});
