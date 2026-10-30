(() => {
  "use strict";

  const MODES = {
    normal: { length: 270, power: 100, speed: 1, drain: 1, label: "NIGHT SECURITY · 01" },
    overtime: { length: 300, power: 95, speed: 1.27, drain: 0.82, label: "OVERTIME · NO CALLS" },
    custom: { length: 300, power: 100, speed: 1, drain: 0.95, label: "CUSTOM SHIFT · FIVE MASCOTS" }
  };
  const CAMERAS = {
    stage: { id: "01", name: "SHOW STAGE" }, dining: { id: "02", name: "DINING HALL" },
    arcade: { id: "03", name: "ARCADE" }, prize: { id: "04", name: "PRIZE CORNER" },
    west: { id: "05", name: "WEST HALL" }, east: { id: "06", name: "EAST HALL" },
    parts: { id: "07", name: "PARTS & SERVICE" }, party: { id: "08", name: "PARTY ROOM" },
    kitchen: { id: "09", name: "KITCHEN" }, vent: { id: "10", name: "VENTILATION" }
  };
  const CAM_ORDER = ["stage", "dining", "arcade", "prize", "west", "east", "parts", "party", "kitchen", "vent"];
  const ENEMY_INFO = {
    pete: { name: "PUMPKIN PETE", route: ["stage", "dining", "party", "west", "left"], side: "left", interval: 8.2 },
    vesper: { name: "VESPER", route: ["stage", "prize", "kitchen", "east", "right"], side: "right", interval: 9.5 },
    patch: { name: "PATCH", route: ["parts", "arcade", "party", "west", "left"], side: "left", interval: 10.5 },
    shroud: { name: "SHROUD", route: ["unseen", "left"], side: "left", interval: 32 },
    gloam: { name: "GLOAM", route: ["arcade", "vent", "ceiling"], side: "ceiling", interval: 20 }
  };
  const PLACEMENTS = {
    pete: { stage: [21, 17, 72], dining: [14, 17, 76], party: [45, 16, 77], west: [48, 12, 84] },
    vesper: { stage: [64, 16, 74], prize: [46, 13, 83], kitchen: [53, 15, 80], east: [48, 12, 84] },
    patch: { parts: [50, 13, 82], arcade: [19, 16, 78], party: [12, 17, 77], west: [13, 18, 75] },
    gloam: { arcade: [34, 3, 65], vent: [31, 3, 72] }
  };
  const VARIANTS = new Set([
    "stage_pete", "stage_vesper", "stage_both", "dining_pete", "party_pete", "party_patch",
    "party_both", "west_pete", "west_patch", "west_both", "prize_vesper", "kitchen_vesper",
    "east_vesper", "parts_patch", "arcade_patch", "arcade_gloam", "vent_gloam"
  ]);
  const OFFICE_VARIANTS = new Set([
    "office_pete_left", "office_patch_left", "office_shroud_left", "office_vesper_right", "office_shroud_right"
  ]);
  const OFFICE_ROUTES = { pete: 4, vesper: 4, patch: 4, shroud: 1, gloam: 2 };
  const $ = id => document.getElementById(id);
  const ui = {
    playfield: $("playfield"), start: $("startScreen"), pause: $("pauseScreen"), end: $("endScreen"), custom: $("customScreen"),
    scare: $("jumpscare"), tablet: $("tablet"), cameraImage: $("cameraImage"), characters: $("cameraCharacters"),
    clock: $("clock"), power: $("powerText"), powerBar: $("powerBar"), progress: $("nightProgress"),
    subtitle: $("subtitle"), notice: $("threatNotice"), voice: $("voiceCaption"), ambience: $("ambienceAudio"),
    static: $("staticAudio"), music: $("musicAudio"), blackout: $("blackoutFigure"), vent: $("ventWarning"), lure: $("lureButton")
  };
  const state = {
    mode: "title", difficulty: "normal", nightLength: 270, paused: false, elapsed: 0, power: 100,
    tablet: false, selected: "stage", doors: { left: false, right: false }, lights: { left: false, right: false },
    blackout: false, blackoutTimer: 0, blackoutFigure: false, enemies: {}, motion: {}, lastTime: 0,
    ambienceTimer: 18, hauntTimer: 45, lureCooldown: 0, hour: 0, stats: {}
  };
  let selectedDifficulty = "normal";
  let selectedAiLevels = { pete: 5, vesper: 5, patch: 5, shroud: 5, gloam: 5 };
  let random = Math.random;
  let subtitleTimeout = 0;
  let noticeTimeout = 0;
  let cameraTimeout = 0;
  let hauntTimeout = 0;
  let audioContext = null;
  let muted = load("petesMuted", "0") === "1";
  const activeSounds = new Set();
  const voiceTimers = [];

  function load(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }
  function overtimeUnlocked() { return load("petesOvertime", "0") === "1"; }
  function customUnlocked() { return load("petesCustom", "0") === "1"; }
  function config() { return MODES[state.difficulty]; }
  function enemySpeed(enemy) { return config().speed * (state.difficulty === "custom" ? 0.45 + enemy.level * 0.11 : 1); }

  function makeEnemies() {
    return Object.fromEntries(Object.entries(ENEMY_INFO).map(([id, info], index) => {
      const level = selectedAiLevels[id] ?? 5;
      const speed = MODES[selectedDifficulty].speed * (selectedDifficulty === "custom" ? 0.45 + level * 0.11 : 1);
      const timer = id === "shroud" ? (30 + random() * 8) / speed : id === "gloam" ? (100 + random() * 8) / speed : (info.interval + 5 + index * 2 + random() * 3) / speed;
      return [id, {
        id, level, disabled: selectedDifficulty === "custom" && level === 0, position: 0, timer,
        doorTime: 0, lightTime: 0, side: info.side, attackDelay: 3.8, retreatDelay: 4.5 + random() * 1.5
      }];
    }));
  }

  function ensureAudio() {
    if (!audioContext) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (Context) audioContext = new Context();
    }
    if (audioContext?.state === "suspended") audioContext.resume().catch(() => {});
  }

  function playSound(name, volume = 0.65, rate = 1, pan = 0) {
    const audio = new Audio(`assets/audio/${name}.mp3`);
    audio.playbackRate = rate;
    const record = { audio, gain: null, volume };
    if (audioContext) {
      try {
        const source = audioContext.createMediaElementSource(audio);
        const gain = audioContext.createGain();
        const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
        gain.gain.value = muted ? 0 : volume;
        if (panner) {
          panner.pan.value = Math.max(-1, Math.min(1, pan));
          source.connect(gain).connect(panner).connect(audioContext.destination);
        } else source.connect(gain).connect(audioContext.destination);
        record.gain = gain;
      } catch {
        audio.volume = muted ? 0 : volume;
      }
    } else audio.volume = muted ? 0 : volume;
    activeSounds.add(record);
    audio.onended = () => activeSounds.delete(record);
    audio.play().catch(() => activeSounds.delete(record));
    return audio;
  }

  function stopOneShots() {
    activeSounds.forEach(({ audio }) => audio.pause());
    activeSounds.clear();
    voiceTimers.forEach(clearTimeout);
    voiceTimers.length = 0;
    ui.voice.classList.remove("visible");
  }

  function applyAudioLevels() {
    ui.music.volume = muted ? 0 : 0.13;
    ui.ambience.volume = muted ? 0 : 0.42;
    ui.static.volume = muted ? 0 : 0.38;
    activeSounds.forEach(record => {
      if (record.gain) record.gain.gain.value = muted ? 0 : record.volume;
      else record.audio.volume = muted ? 0 : record.volume;
    });
    $("muteButton").textContent = muted ? "MUTED" : "SOUND";
    $("muteButton").classList.toggle("muted", muted);
    $("muteButton").setAttribute("aria-pressed", String(muted));
  }

  function toggleMute() {
    muted = !muted;
    save("petesMuted", muted ? "1" : "0");
    applyAudioLevels();
  }

  function setScreen(screen) {
    [ui.start, ui.pause, ui.end, ui.scare, ui.custom].forEach(el => el.classList.remove("active"));
    if (screen) screen.classList.add("active");
  }

  function subtitle(text, seconds = 2.8) {
    clearTimeout(subtitleTimeout);
    ui.subtitle.textContent = text;
    ui.subtitle.classList.add("visible");
    subtitleTimeout = setTimeout(() => ui.subtitle.classList.remove("visible"), seconds * 1000);
  }

  function notice(text, seconds = 2.2) {
    clearTimeout(noticeTimeout);
    ui.notice.querySelector("span").textContent = text;
    ui.notice.classList.add("visible");
    noticeTimeout = setTimeout(() => ui.notice.classList.remove("visible"), seconds * 1000);
  }

  function startVoiceover() {
    if (state.difficulty !== "normal") return;
    const captions = [
      [1, "Hey... you made it. Sorry about the mess."],
      [5.2, "Corporate locked the doors thirteen years ago, but insurance still requires a guard."],
      [11.2, "The cameras should be enough to keep track of the mascots."],
      [15.6, "Pete moves when you don't give him attention. The witch is the opposite."],
      [21.5, "If you hear straw scraping, put the tablet down."],
      [25.5, "Watch your power. Those doors are the only thing between you and..."],
      [31, "Just make it to six. I'll call back."]
    ];
    voiceTimers.push(setTimeout(() => {
      if (state.mode !== "playing") return;
      playSound("voice_intro", 0.68);
      ui.voice.classList.add("visible");
    }, 800));
    captions.forEach(([time, text]) => voiceTimers.push(setTimeout(() => {
      if (state.mode === "playing") ui.voice.querySelector("span").textContent = text;
    }, time * 1000)));
    voiceTimers.push(setTimeout(() => ui.voice.classList.remove("visible"), 37000));
  }

  function syncCustomLevels() {
    try {
      const saved = JSON.parse(load("petesAiLevels", "{}"));
      Object.keys(selectedAiLevels).forEach(id => {
        if (Number.isFinite(saved[id])) selectedAiLevels[id] = Math.max(0, Math.min(10, Math.round(saved[id])));
      });
    } catch {}
    document.querySelectorAll("#customLevels label").forEach(row => {
      const id = row.dataset.enemy;
      row.querySelector("input").value = selectedAiLevels[id];
      row.querySelector("output").textContent = selectedAiLevels[id];
    });
    $("customTotal").textContent = `TOTAL AI · ${Object.values(selectedAiLevels).reduce((sum, level) => sum + level, 0)}`;
  }

  function openCustom() {
    if (!customUnlocked()) return;
    syncCustomLevels();
    setDifficulty("custom");
    setScreen(ui.custom);
  }

  function refreshMenu() {
    const unlocked = overtimeUnlocked();
    $("overtimeMode").disabled = !unlocked;
    $("overtimeMode").textContent = unlocked ? "OVERTIME" : "OVERTIME · LOCKED";
    $("customMode").disabled = !customUnlocked();
    $("customMode").textContent = customUnlocked() ? "CUSTOM" : "CUSTOM · LOCKED";
    const wins = Number(load("petesWins", "0"));
    const best = Number(load("petesBestPower", "0"));
    const bestAi = Number(load("petesCustomBest", "0"));
    $("recordLine").textContent = wins ? `${wins} SHIFT${wins === 1 ? "" : "S"} SURVIVED · BEST POWER ${Math.ceil(best)}%${bestAi ? ` · BEST AI ${bestAi}` : ""}` : "NO COMPLETED SHIFTS ON RECORD";
    setDifficulty(selectedDifficulty);
  }

  function setDifficulty(mode) {
    if (mode === "overtime" && !overtimeUnlocked()) return;
    if (mode === "custom" && !customUnlocked()) return;
    selectedDifficulty = mode;
    $("normalMode").classList.toggle("active", mode === "normal");
    $("overtimeMode").classList.toggle("active", mode === "overtime");
    $("customMode").classList.toggle("active", mode === "custom");
    $("startButton").querySelector("span").textContent = mode === "overtime" ? "BEGIN OVERTIME" : mode === "custom" ? "BEGIN CUSTOM" : "BEGIN NIGHT";
    $("startButton").querySelector("small").textContent = mode === "normal" ? "12 AM — 6 AM" : "FASTER · LONGER · 5 MINUTES";
  }

  function startNight() {
    ensureAudio();
    stopOneShots();
    stopLoops();
    clearTimeout(hauntTimeout);
    const settings = MODES[selectedDifficulty];
    Object.assign(state, {
      mode: "playing", difficulty: selectedDifficulty, nightLength: settings.length, paused: false,
      elapsed: 0, power: settings.power, tablet: false, selected: "stage", blackout: false,
      blackoutTimer: 0, blackoutFigure: false, enemies: makeEnemies(), motion: {}, lastTime: performance.now(),
      ambienceTimer: 16 + random() * 8, hauntTimer: 38 + random() * 20, shroudCall: false, gloamCall: false,
      lureCooldown: 0, hour: 0,
      stats: { cameraChecks: 0, doorSaves: 0, lightSaves: 0, lureSaves: 0, luresUsed: 0, cameraTime: 0, doorsUsed: 0 }
    });
    state.doors = { left: false, right: false };
    state.lights = { left: false, right: false };
    ui.playfield.classList.remove("hidden", "power-out", "low-power", "haunted", "vent-active");
    ui.end.classList.remove("win");
    ui.blackout.classList.remove("visible");
    setScreen(null);
    ui.tablet.classList.remove("raised");
    ui.music.currentTime = 0;
    ui.ambience.currentTime = 0;
    applyAudioLevels();
    ui.music.play().catch(() => {});
    ui.ambience.play().catch(() => {});
    $("shiftModeLabel").textContent = settings.label;
    selectCamera("stage", false);
    updateUI();
    subtitle(selectedDifficulty === "overtime" ? "OVERTIME. They already know you're here." : selectedDifficulty === "custom" ? "CUSTOM SHIFT. You chose what waits outside." : "12 AM. Keep an eye on them. Conserve power.", 4.5);
    startVoiceover();
  }

  function returnToTitle() {
    state.mode = "title";
    state.paused = false;
    stopLoops();
    stopOneShots();
    ui.music.pause();
    ui.playfield.classList.add("hidden");
    refreshMenu();
    setScreen(ui.start);
  }

  function stopLoops() {
    ui.ambience.pause();
    ui.static.pause();
  }

  function togglePause(force) {
    if (state.mode !== "playing") return;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    if (state.paused) {
      setScreen(ui.pause);
      stopLoops();
      ui.music.pause();
      activeSounds.forEach(({ audio }) => audio.pause());
    } else {
      setScreen(null);
      state.lastTime = performance.now();
      ui.ambience.play().catch(() => {});
      ui.music.play().catch(() => {});
      activeSounds.forEach(({ audio }) => audio.play().catch(() => {}));
      if (state.tablet) ui.static.play().catch(() => {});
    }
  }

  function canUseOffice() {
    return state.mode === "playing" && !state.paused && !state.blackout && !state.tablet;
  }

  function toggleDoor(side) {
    if (!canUseOffice()) return;
    state.doors[side] = !state.doors[side];
    if (state.doors[side]) {
      state.stats.doorsUsed++;
      if (state.lights[side]) state.lights[side] = false;
    }
    playSound("door", 0.68, state.doors[side] ? 1 : 1.12, side === "left" ? -0.9 : 0.9);
    updateUI();
  }

  function toggleLight(side) {
    if (!canUseOffice()) return;
    state.lights[side] = !state.lights[side];
    playSound("light", 0.42, state.lights[side] ? 1 : 0.85, side === "left" ? -0.75 : 0.75);
    updateUI();
  }

  function toggleTablet(force) {
    if (state.mode !== "playing" || state.paused || state.blackout) return;
    state.tablet = typeof force === "boolean" ? force : !state.tablet;
    if (state.tablet) {
      state.lights.left = state.lights.right = false;
      ui.static.currentTime = 0;
      ui.static.play().catch(() => {});
    } else ui.static.pause();
    renderCameraCharacters();
    updateUI();
  }

  function useLure() {
    if (state.mode !== "playing" || state.paused || state.blackout || !state.tablet) return;
    if (state.lureCooldown > 0) { subtitle(`Lure speaker recharging · ${Math.ceil(state.lureCooldown)} seconds.`, 1.5); return; }
    if (state.power <= 0.8) { subtitle("Not enough power for the lure.", 2); return; }
    state.lureCooldown = 6;
    state.power = Math.max(0, state.power - 0.8);
    state.stats.luresUsed++;
    playSound("lure", 0.62);
    const enemy = state.enemies.gloam;
    const location = enemy.position === 2 ? "vent" : ENEMY_INFO.gloam.route[enemy.position];
    if (!enemy.disabled && state.selected === location) {
      enemy.position = 0;
      enemy.doorTime = 0;
      enemy.timer = ENEMY_INFO.gloam.interval * (1.15 + random() * 0.25) / enemySpeed(enemy);
      state.motion.arcade = state.elapsed + 3;
      state.stats.lureSaves++;
      playSound("wings", 0.35, 1.18);
      notice("LURE ANSWERED · ARCADE");
      subtitle("Wings recede through the ducts.", 2.5);
    } else {
      enemy.timer = Math.max(0, enemy.timer - 2);
      subtitle("Only static answers from this feed.", 2);
    }
    renderCameraCharacters();
    updateUI();
  }

  function occupants(cam) {
    return Object.values(state.enemies).filter(enemy => !enemy.disabled && (ENEMY_INFO[enemy.id].route[enemy.position] === cam || (enemy.id === "gloam" && enemy.position === 2 && cam === "vent"))).map(enemy => enemy.id);
  }

  function cameraVariant(cam, present) {
    if (!present.length) return null;
    if (cam === "stage" && present.includes("pete") && present.includes("vesper")) return "stage_both";
    if ((cam === "party" || cam === "west") && present.includes("pete") && present.includes("patch")) return `${cam}_both`;
    if (present.length === 1) {
      const name = `${cam}_${present[0]}`;
      return VARIANTS.has(name) ? name : null;
    }
    return null;
  }

  function selectCamera(cam, audible = true) {
    if (!CAMERAS[cam] || (state.tablet && (state.blackout || state.paused))) return;
    const changed = state.selected !== cam;
    state.selected = cam;
    if (audible && state.tablet && changed) {
      state.stats.cameraChecks++;
      ui.static.currentTime = 0;
      ui.static.play().catch(() => {});
      const feed = document.querySelector(".camera-feed");
      feed.classList.add("switching");
      clearTimeout(cameraTimeout);
      cameraTimeout = setTimeout(() => feed.classList.remove("switching"), 130);
    }
    $("camId").textContent = `CAM ${CAMERAS[cam].id}`;
    $("camName").textContent = CAMERAS[cam].name;
    document.querySelectorAll(".map-node").forEach(node => node.classList.toggle("active", node.dataset.cam === cam));
    renderCameraCharacters();
  }

  function renderCameraCharacters() {
    const cam = state.selected;
    const present = occupants(cam);
    const variant = cameraVariant(cam, present);
    ui.characters.replaceChildren();
    ui.cameraImage.dataset.fallback = variant ? "0" : "1";
    ui.cameraImage.src = `assets/images/${variant || cam}.png`;
    ui.cameraImage.alt = `${CAMERAS[cam].name} camera feed${present.length ? ` with ${present.join(" and ")}` : ""}`;
    if (!variant) renderCameraSprites(present);
    const hint = $("behaviorHint");
    const text = $("behaviorText");
    if (!present.length) {
      hint.textContent = "NO MOTION ON FEED";
      text.textContent = "Recent movement is marked on the map. Check another room.";
    } else if (present.includes("gloam")) {
      hint.textContent = "GLOAM IS LISTENING";
      text.textContent = "Play the lure on this feed to drive it back to the arcade.";
    } else if (present.includes("patch")) {
      hint.textContent = "PATCH IS ACTIVE";
      text.textContent = "His movement timer is running. Lower the tablet to stop him.";
    } else if (present.includes("pete")) {
      hint.textContent = "PETE IS OBSERVED";
      text.textContent = "His movement timer is suspended while this feed stays open.";
    } else {
      hint.textContent = "VESPER IS OBSERVED";
      text.textContent = "She cannot advance while this feed stays open.";
    }
    document.querySelectorAll(".map-node").forEach(node => node.classList.toggle("ping", (state.motion[node.dataset.cam] || 0) > state.elapsed));
  }

  function renderCameraSprites(present) {
    ui.characters.replaceChildren();
    if (!state.tablet) return;
    present.forEach(id => {
      const placement = PLACEMENTS[id][state.selected];
      if (!placement) return;
      const image = document.createElement("img");
      image.src = `assets/images/${id}.png`;
      image.alt = ENEMY_INFO[id].name;
      image.className = "cam-character";
      Object.assign(image.style, { left: `${placement[0]}%`, top: `${placement[1]}%`, height: `${placement[2]}%` });
      ui.characters.appendChild(image);
    });
  }

  function moveEnemy(enemy) {
    const info = ENEMY_INFO[enemy.id];
    const hour = Math.min(5, Math.floor(state.elapsed / (state.nightLength / 6)));
    enemy.timer = info.interval * (0.82 + random() * 0.4) / (1 + hour * 0.08) / enemySpeed(enemy);
    if (random() > 0.64 + hour * 0.06) return;
    enemy.position = Math.min(info.route.length - 1, enemy.position + 1);
    enemy.doorTime = 0;
    enemy.attackDelay = enemy.id === "gloam" ? Math.max(4.8, 8 - hour * 0.35) / (state.difficulty === "overtime" ? 1.15 : 1) / (state.difficulty === "custom" ? enemySpeed(enemy) : 1) : (Math.max(2.4, 4 - hour * 0.22) + random() * 0.8) / (state.difficulty === "overtime" ? 1.18 : 1) / (state.difficulty === "custom" ? enemySpeed(enemy) : 1);
    enemy.retreatDelay = 4.2 + random() * 2;
    const location = info.route[enemy.position];
    state.motion[location] = state.elapsed + 3;
    if (enemy.id === "gloam") {
      state.motion.vent = state.elapsed + 3;
      playSound("wings", enemy.position === 2 ? 0.85 : 0.55, 0.85 + random() * 0.15);
      notice(enemy.position === 2 ? "WINGBEATS · ABOVE OFFICE" : "MOVEMENT · VENTILATION", 3);
      subtitle(enemy.position === 2 ? "It's above you. Open CAM 10 and play the lure." : "Metal wings scrape inside the ducts.", 3);
    } else if (enemy.position === info.route.length - 1) {
      playSound("footsteps", 0.85, 0.86 + random() * 0.1, info.side === "left" ? -0.9 : 0.9);
      notice(`${info.name} · ${info.side.toUpperCase()} DOOR`);
      subtitle(`Heavy footsteps outside the ${info.side} door.`, 2.5);
    } else {
      if (location === "west" || location === "east") {
        playSound("footsteps", 0.4, 0.82 + random() * 0.12, info.side === "left" ? -0.7 : 0.7);
        notice(`MOVEMENT · ${location.toUpperCase()} HALL`);
      } else playSound("servo", 0.2, 0.85 + random() * 0.2, random() * 1.4 - 0.7);
      if (state.tablet && state.selected === location) playSound("servo", 0.38, 0.8);
    }
    renderCameraCharacters();
    updateUI();
  }

  function updateShroud(enemy, dt) {
    const hour = Math.min(5, Math.floor(state.elapsed / (state.nightLength / 6)));
    const pan = enemy.side === "left" ? -0.9 : 0.9;
    if (enemy.position === 0) {
      if (state.lights.left || state.lights.right) return;
      enemy.timer -= dt;
      if (enemy.timer <= 0) {
        enemy.position = 1;
        enemy.side = random() < 0.5 ? "left" : "right";
        enemy.doorTime = 0;
        enemy.lightTime = 0;
        enemy.attackDelay = Math.max(3.8, 6 - hour * 0.35) / (state.difficulty === "overtime" ? 1.15 : 1) / (state.difficulty === "custom" ? enemySpeed(enemy) : 1);
        playSound("whisper", 0.72, 0.82, enemy.side === "left" ? -0.9 : 0.9);
        notice(`COLD SPOT · ${enemy.side.toUpperCase()} DOOR`, 3.5);
        subtitle("The air turns cold. Hold the hall light on it.", 3.5);
        updateUI();
      }
      return;
    }
    enemy.doorTime += dt;
    if (state.lights[enemy.side]) {
      enemy.lightTime += dt;
      if (enemy.lightTime >= 1.5) {
        enemy.position = 0;
        enemy.doorTime = 0;
        enemy.lightTime = 0;
        enemy.timer = Math.max(19, 32 - hour * 2) * (0.9 + random() * 0.3) / enemySpeed(enemy);
        state.stats.lightSaves++;
        playSound("whisper", 0.4, 1.25, pan);
        subtitle("The cold air recedes.", 2.5);
        updateUI();
      }
    } else {
      enemy.lightTime = 0;
      if (enemy.doorTime >= enemy.attackDelay) triggerScare("shroud");
    }
  }

  function updateEnemy(enemy, dt) {
    if (enemy.disabled) return;
    if (enemy.id === "shroud") { updateShroud(enemy, dt); return; }
    const info = ENEMY_INFO[enemy.id];
    const location = info.route[enemy.position];
    if (enemy.id === "gloam") {
      if (enemy.position === 2) {
        enemy.doorTime += dt;
        if (enemy.doorTime >= enemy.attackDelay) triggerScare("gloam");
        return;
      }
      enemy.timer -= dt * (state.tablet ? 1.15 : 0.85);
      if (enemy.timer <= 0) moveEnemy(enemy);
      return;
    }
    const atDoor = enemy.position === info.route.length - 1;
    if (atDoor) {
      enemy.doorTime += dt;
      if (state.doors[info.side]) {
        if (enemy.doorTime >= enemy.retreatDelay) {
          enemy.position = Math.max(0, enemy.position - 2);
          enemy.doorTime = 0;
          enemy.timer = info.interval * (1.1 + random() * 0.5) / enemySpeed(enemy);
          state.stats.doorSaves++;
          state.motion[info.route[enemy.position]] = state.elapsed + 3;
          playSound("knock", 0.72, 0.85, info.side === "left" ? -0.9 : 0.9);
          playSound("footsteps", 0.48, 1.08, info.side === "left" ? -0.7 : 0.7);
          subtitle(`Something is moving away from the ${info.side} door.`, 3);
          renderCameraCharacters();
        }
      } else if (enemy.doorTime >= enemy.attackDelay) triggerScare(enemy.id);
      return;
    }
    const watched = state.tablet && state.selected === location;
    if ((enemy.id === "pete" || enemy.id === "vesper") && watched) return;
    if (enemy.id === "patch" && !state.tablet) return;
    enemy.timer -= dt;
    if (enemy.timer <= 0) moveEnemy(enemy);
  }

  function powerOut() {
    state.blackout = true;
    state.blackoutTimer = (5.5 + random() * 4) / (state.difficulty === "overtime" ? 1.2 : 1);
    state.tablet = false;
    state.doors.left = state.doors.right = false;
    state.lights.left = state.lights.right = false;
    stopLoops();
    ui.music.pause();
    playSound("powerdown", 0.8);
    subtitle("POWER DEPLETED", 4);
    updateUI();
  }

  function triggerScare(enemyId) {
    if (state.mode !== "playing") return;
    state.mode = "scare";
    state.tablet = false;
    stopLoops();
    stopOneShots();
    ui.music.pause();
    $("scareImage").src = `assets/images/${enemyId}_scare.png`;
    setScreen(ui.scare);
    playSound("jumpscare", 0.95);
    setTimeout(() => {
      if (state.mode !== "scare") return;
      state.mode = "over";
      const hour = Math.min(5, Math.floor(state.elapsed / (state.nightLength / 6)));
      $("endEyebrow").textContent = "SHIFT TERMINATED";
      $("endTitle").textContent = "YOU WERE FOUND";
      $("endTime").textContent = `${hour === 0 ? 12 : hour} AM`;
      $("endMessage").textContent = `${ENEMY_INFO[enemyId].name} found a way in. Listen. Watch. Try again.`;
      $("endRank").textContent = "";
      $("overtimeButton").style.display = "none";
      $("customEndButton").style.display = "none";
      document.querySelector(".end-card").classList.remove("win");
      ui.end.classList.remove("win");
      updateEndStats();
      setScreen(ui.end);
    }, 1350);
  }

  function updateEndStats() {
    $("endStats").textContent = `${state.stats.cameraChecks} CAMERA CHECKS · ${state.stats.doorSaves} DOOR SAVES · ${state.stats.lightSaves} LIGHT SAVES · ${state.stats.lureSaves} LURE SAVES · ${Math.ceil(state.power)}% POWER`;
  }

  function winNight() {
    if (state.mode !== "playing") return;
    state.mode = "win";
    state.elapsed = state.nightLength;
    state.tablet = false;
    stopLoops();
    stopOneShots();
    ui.music.pause();
    playSound("chime", 0.8);
    $("sceneImage").dataset.scene = "office_dawn";
    $("sceneImage").src = "assets/images/office_dawn.png";
    $("endEyebrow").textContent = state.difficulty === "overtime" ? "OVERTIME SURVIVED" : state.difficulty === "custom" ? "CUSTOM SHIFT COMPLETE" : "SHIFT COMPLETE";
    $("endTitle").textContent = "YOU MADE IT";
    $("endTime").textContent = "6 AM";
    const rating = state.power >= 30 ? "S" : state.power >= 15 ? "A" : state.power >= 5 ? "B" : "C";
    const aiTotal = Object.values(state.enemies).reduce((sum, enemy) => sum + enemy.level, 0);
    $("endRank").textContent = `SHIFT RATING · ${rating}${state.difficulty === "custom" ? ` · TOTAL AI ${aiTotal}` : ""}`;
    $("endMessage").textContent = state.difficulty === "overtime" ? "The sun is up. Custom Shift is now open. Choose your own nightmare." : state.difficulty === "custom" ? `You survived a total AI level of ${aiTotal}. The building can always get worse.` : "Morning light reaches the windows. The mascots are still. For now.";
    document.querySelector(".end-card").classList.add("win");
    save("petesWins", String(Number(load("petesWins", "0")) + 1));
    save("petesBestPower", String(Math.max(Number(load("petesBestPower", "0")), state.power)));
    if (state.difficulty === "normal") save("petesOvertime", "1");
    if (state.difficulty === "overtime") save("petesCustom", "1");
    if (state.difficulty === "custom") save("petesCustomBest", String(Math.max(Number(load("petesCustomBest", "0")), aiTotal)));
    $("overtimeButton").style.display = state.difficulty === "normal" ? "inline-block" : "none";
    $("customEndButton").style.display = state.difficulty === "overtime" ? "inline-block" : "none";
    $("restartButton").textContent = "REPLAY SHIFT";
    updateEndStats();
    ui.end.classList.add("win");
    setScreen(ui.end);
    updateUI();
  }

  function update(dt) {
    if (state.mode !== "playing" || state.paused) return;
    state.elapsed += dt;
    if (state.elapsed >= state.nightLength) { winNight(); return; }
    const currentHour = Math.min(5, Math.floor(state.elapsed / (state.nightLength / 6)));
    if (currentHour > state.hour) {
      state.hour = currentHour;
      playSound("knock", 0.2, 0.68);
      subtitle(`${currentHour} AM. The building is getting restless.`, 3);
    }
    if (state.blackout) {
      state.blackoutTimer -= dt;
      if (state.blackoutTimer < 4 && !state.blackoutFigure) {
        state.blackoutFigure = true;
        ui.blackout.classList.add("visible");
        playSound("musicbox", 0.58);
      }
      if (state.blackoutTimer <= 0) triggerScare("pete");
      updateUI();
      return;
    }
    state.lureCooldown = Math.max(0, state.lureCooldown - dt);
    const drain = (0.22 + (state.tablet ? 0.18 : 0) +
      (state.doors.left || state.doors.right ? (state.doors.left && state.doors.right ? 0.56 : 0.28) : 0) +
      (state.lights.left || state.lights.right ? (state.lights.left && state.lights.right ? 0.32 : 0.16) : 0)) * config().drain;
    state.power = Math.max(0, state.power - drain * dt);
    if (state.power <= 0) { powerOut(); return; }
    if (state.tablet) state.stats.cameraTime += dt;
    if (state.difficulty === "normal" && !state.shroudCall && state.elapsed >= 82) {
      state.shroudCall = true;
      playSound("voice_shroud", 0.7);
      ui.voice.classList.add("visible");
      const warnings = [
        [0, "One more thing. The old ghost costume... we called it Shroud."],
        [5, "It never showed up on the cameras. Don't waste a door on it."],
        [10, "When the air turns cold, hold the hall light on it. Light is all it remembers."]
      ];
      warnings.forEach(([time, text]) => voiceTimers.push(setTimeout(() => {
        if (state.mode === "playing") ui.voice.querySelector("span").textContent = text;
      }, time * 1000)));
      voiceTimers.push(setTimeout(() => ui.voice.classList.remove("visible"), 21000));
    }
    if (state.difficulty === "normal" && !state.gloamCall && state.elapsed >= 110) {
      state.gloamCall = true;
      playSound("voice_gloam", 0.72);
      ui.voice.classList.add("visible");
      const warnings = [
        [0, "There's one I didn't tell you about. Gloam, the old bat mascot."],
        [5.2, "It nested in the vents. If you hear wings above you, the doors won't help."],
        [11, "Open the vent feed and play the lure tone. Make it go back."]
      ];
      warnings.forEach(([time, text]) => voiceTimers.push(setTimeout(() => {
        if (state.mode === "playing") ui.voice.querySelector("span").textContent = text;
      }, time * 1000)));
      voiceTimers.push(setTimeout(() => ui.voice.classList.remove("visible"), 20500));
    }
    Object.values(state.enemies).forEach(enemy => updateEnemy(enemy, dt));
    state.ambienceTimer -= dt;
    if (state.ambienceTimer <= 0) {
      state.ambienceTimer = 18 + random() * 20;
      playSound(random() > 0.45 ? "footsteps" : "knock", 0.12 + random() * 0.1, 0.7 + random() * 0.25, random() * 1.6 - 0.8);
    }
    state.hauntTimer -= dt;
    if (state.hauntTimer <= 0) {
      state.hauntTimer = 35 + random() * 30;
      if (!state.tablet && state.elapsed > 40) {
        playSound(random() > 0.45 ? "whisper" : "servo", 0.38, 0.9, random() > 0.5 ? -0.5 : 0.5);
        ui.playfield.classList.add("haunted");
        clearTimeout(hauntTimeout);
        hauntTimeout = setTimeout(() => ui.playfield.classList.remove("haunted"), 1400);
      }
    }
    updateUI();
  }

  function updateUI() {
    const hour = Math.min(6, Math.floor(state.elapsed / (state.nightLength / 6)));
    ui.clock.textContent = hour === 0 ? "12 AM" : `${hour} AM`;
    ui.progress.style.width = `${Math.min(100, state.elapsed / state.nightLength * 100)}%`;
    ui.power.textContent = `${Math.ceil(state.power)}%`;
    ui.powerBar.style.width = `${state.power}%`;
    ui.powerBar.style.background = state.power < 20 ? "#d84a37" : state.power < 45 ? "#f4a340" : "#8ea76a";
    ui.playfield.classList.toggle("low-power", state.power < 20 && !state.blackout);
    ui.playfield.classList.toggle("power-out", state.blackout);
    ui.tablet.classList.toggle("raised", state.tablet);
    const visitors = Object.values(state.enemies).filter(enemy => {
      if (enemy.id === "gloam" || enemy.disabled) return false;
      const side = enemy.id === "shroud" ? enemy.side : ENEMY_INFO[enemy.id].side;
      return enemy.position === OFFICE_ROUTES[enemy.id] && state.lights[side] && !state.doors[side];
    });
    const gloam = state.enemies.gloam;
    const gloamActive = gloam && !gloam.disabled && gloam.position === 2;
    const candidate = visitors.length === 1 ? `office_${visitors[0].id}_${visitors[0].id === "shroud" ? visitors[0].side : ENEMY_INFO[visitors[0].id].side}` : null;
    const officeScene = state.mode === "win" ? "office_dawn" : candidate && OFFICE_VARIANTS.has(candidate) ? candidate : gloamActive && !visitors.length ? "office_gloam" : "office";
    if ($("sceneImage").dataset.scene !== officeScene) {
      $("sceneImage").dataset.scene = officeScene;
      $("sceneImage").src = `assets/images/${officeScene}.png`;
    }
    ["left", "right"].forEach(side => {
      $(`${side}Door`).classList.toggle("closed", state.doors[side]);
      $(`${side}DoorButton`).classList.toggle("active", state.doors[side]);
      $(`${side}DoorButton`).setAttribute("aria-pressed", String(state.doors[side]));
      $(`${side}Light`).classList.toggle("active", state.lights[side]);
      $(`${side}Light`).setAttribute("aria-pressed", String(state.lights[side]));
      $(`doorway${side[0].toUpperCase() + side.slice(1)}`).classList.toggle("lit", state.lights[side]);
      const visitor = visitors.find(enemy => (enemy.id === "shroud" ? enemy.side : ENEMY_INFO[enemy.id].side) === side);
      const visitorImage = $(`${side}Visitor`);
      if (visitor && officeScene === "office") {
        visitorImage.src = `assets/images/${visitor.id}.png`;
        visitorImage.style.display = "block";
      } else visitorImage.style.display = "none";
    });
    const usage = Math.min(5, 1 + Number(state.tablet) + Number(state.doors.left) + Number(state.doors.right) + Number(state.lights.left) + Number(state.lights.right));
    [...$("usageBars").children].forEach((bar, index) => bar.classList.toggle("on", index < usage));
    document.querySelectorAll(".map-node").forEach(node => node.classList.toggle("ping", (state.motion[node.dataset.cam] || 0) > state.elapsed));
    const shroud = state.enemies.shroud;
    const coldSpot = shroud && !shroud.disabled && shroud.position === 1;
    $("signal").textContent = coldSpot ? `COLD SPOT · ${shroud.side.toUpperCase()}` : gloamActive ? "VENT BREACH · PLAY LURE" : "SIGNAL ▰▰▰";
    $("signal").classList.toggle("cold", coldSpot || gloamActive);
    ui.vent.classList.toggle("visible", gloamActive);
    ui.playfield.classList.toggle("vent-active", gloamActive);
    ui.lure.disabled = !state.tablet || state.lureCooldown > 0 || state.power <= 0.8 || state.blackout;
    ui.lure.classList.toggle("ready", state.lureCooldown <= 0);
    $("lureStatus").textContent = state.lureCooldown > 0 ? `RECHARGING · ${Math.ceil(state.lureCooldown)}S` : "0.8% POWER · F";
    $("cameraToggle").setAttribute("aria-pressed", String(state.tablet));
  }

  function frame(now) {
    const dt = Math.min(0.1, (now - state.lastTime) / 1000 || 0);
    state.lastTime = now;
    update(dt);
    requestAnimationFrame(frame);
  }

  ui.cameraImage.addEventListener("error", () => {
    if (ui.cameraImage.dataset.fallback === "1") return;
    ui.cameraImage.dataset.fallback = "1";
    ui.cameraImage.src = `assets/images/${state.selected}.png`;
    renderCameraSprites(occupants(state.selected));
  });
  $("startButton").addEventListener("click", startNight);
  $("restartButton").addEventListener("click", startNight);
  $("restartPause").addEventListener("click", startNight);
  $("menuButton").addEventListener("click", returnToTitle);
  $("normalMode").addEventListener("click", () => setDifficulty("normal"));
  $("overtimeMode").addEventListener("click", () => setDifficulty("overtime"));
  $("customMode").addEventListener("click", openCustom);
  $("overtimeButton").addEventListener("click", () => { setDifficulty("overtime"); startNight(); });
  $("customEndButton").addEventListener("click", openCustom);
  $("customBegin").addEventListener("click", () => {
    document.querySelectorAll("#customLevels label").forEach(row => { selectedAiLevels[row.dataset.enemy] = Number(row.querySelector("input").value); });
    save("petesAiLevels", JSON.stringify(selectedAiLevels));
    startNight();
  });
  $("customBack").addEventListener("click", returnToTitle);
  $("pauseButton").addEventListener("click", () => togglePause());
  $("resumeButton").addEventListener("click", () => togglePause(false));
  $("muteButton").addEventListener("click", toggleMute);
  $("pauseMute").addEventListener("click", toggleMute);
  $("cameraToggle").addEventListener("click", () => toggleTablet());
  $("lureButton").addEventListener("click", useLure);
  $("leftDoorButton").addEventListener("click", () => toggleDoor("left"));
  $("rightDoorButton").addEventListener("click", () => toggleDoor("right"));
  $("leftLight").addEventListener("click", () => toggleLight("left"));
  $("rightLight").addEventListener("click", () => toggleLight("right"));
  document.querySelectorAll("#customLevels input").forEach(input => input.addEventListener("input", () => {
    const row = input.closest("label");
    selectedAiLevels[row.dataset.enemy] = Number(input.value);
    row.querySelector("output").textContent = input.value;
    $("customTotal").textContent = `TOTAL AI · ${Object.values(selectedAiLevels).reduce((sum, level) => sum + level, 0)}`;
  }));
  document.querySelectorAll(".map-node").forEach(node => node.addEventListener("click", () => selectCamera(node.dataset.cam)));
  document.addEventListener("keydown", event => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === " " || key === "spacebar") { event.preventDefault(); toggleTablet(); }
    else if (key === "a") toggleDoor("left");
    else if (key === "d") toggleDoor("right");
    else if (key === "q") toggleLight("left");
    else if (key === "e") toggleLight("right");
    else if (key === "f") useLure();
    else if (key === "m") toggleMute();
    else if (key === "escape") { if (ui.custom.classList.contains("active")) returnToTitle(); else togglePause(); }
    else if (key === "r" && (state.mode === "over" || state.mode === "win")) startNight();
    else if (state.tablet && /^[0-9]$/.test(key)) selectCamera(CAM_ORDER[key === "0" ? 9 : Number(key) - 1]);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.mode === "playing" && !state.paused) togglePause(true);
  });

  state.enemies = makeEnemies();
  state.lastTime = performance.now();
  refreshMenu();
  applyAudioLevels();
  updateUI();
  requestAnimationFrame(frame);

  if (new URLSearchParams(location.search).has("debug")) {
    window.__nightShift = {
      state, start: startNight, step: seconds => { for (let i = 0; i < seconds * 10; i++) update(0.1); },
      setElapsed: seconds => { state.elapsed = seconds; updateUI(); },
      setPower: value => { state.power = value; updateUI(); }, setDifficulty,
      selectCamera, toggleTablet, toggleDoor, toggleLight, useLure, triggerScare, win: winNight,
      setRandom: fn => { random = fn; }, occupants, renderCameraCharacters, openCustom, refreshMenu,
      setAiLevels: levels => { Object.assign(selectedAiLevels, levels); }
    };
  }
})();
