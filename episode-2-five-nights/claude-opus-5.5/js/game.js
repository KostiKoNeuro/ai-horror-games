/* Night Shift at Pumpkin Pete's - rendering, input, sound direction. Game rules live in logic.js. */
(function () {
  'use strict';
  const cv = document.getElementById('c');
  const ctx = cv.getContext('2d');
  const W = 1600, H = 900;
  const A = window.AUD;

  // ---------------------------------------------------------------- assets
  const ROOM_IDS = PP.ROOMS;
  const IMG_NAMES = ['office', 'shutter', 'title', 'win', 'gameover', 'jump_P', 'jump_H', 'jump_S',
    'door_L_empty', 'door_R_empty', 'door_L_H', 'door_R_P', 'door_R_H', 'door_dark_P',
    'stage_PH', 'stage_P', 'stage_H', 'dining_P', 'dining_H', 'patch_S0', 'patch_S1', 'patch_S2',
    'restrooms_P', 'easthall_P', 'easthall_H', 'eastcorner_P', 'eastcorner_H', 'backstage_H', 'closet_H',
    'westhall_H', 'westhall_S', 'westcorner_H'].concat(ROOM_IDS.map(r => 'room_' + r));
  const SFX = ['amb_building', 'fan_loop', 'static_loop', 'cam_switch', 'tablet_up', 'tablet_down', 'door_close', 'door_open',
    'light_buzz', 'button_fail', 'steps_heavy', 'steps_fast', 'straw_rustle', 'witch_laugh', 'witch_whisper', 'pete_laugh',
    'distant_bang', 'distant_clang', 'door_bang', 'breathing', 'jumpscare_1', 'jumpscare_2', 'power_down', 'music_box',
    'chime_6am', 'stinger', 'hour_chime', 'window_tap', 'heartbeat'];
  const IMG = {};

  function loadImg(name) {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { IMG[name] = im; res(); };
      im.onerror = () => res();
      im.src = 'assets/img/' + name + '.jpg';
    });
  }

  async function loadAll() {
    A.init();
    const jobs = IMG_NAMES.map(n => () => loadImg(n))
      .concat(SFX.map(n => () => A.load(n, 'assets/sfx/' + n + '.mp3').catch(() => {})))
      .concat([() => A.load('call', 'assets/voice/call.mp3').catch(() => {}),
        () => A.load('menu', 'assets/music/menu.mp3').catch(() => {})]);
    let done = 0;
    const fill = document.getElementById('loadfill');
    await Promise.all(jobs.map(j => j().then(() => { done++; fill.style.width = (100 * done / jobs.length) + '%'; })));
    try { await Promise.all([document.fonts.load('40px VT323'), document.fonts.load('40px Creepster')]); } catch (e) { /* fallback fonts */ }
    buildFx();
    document.getElementById('loading').style.display = 'none';
    state = 'title';
  }

  // ---------------------------------------------------------------- pre-rendered effects
  const FX = { noise: [], scan: null, vig: null, fg: null };
  function buildFx() {
    for (let i = 0; i < 6; i++) {
      const c = document.createElement('canvas'); c.width = 400; c.height = 225;
      const g = c.getContext('2d'); const d = g.createImageData(400, 225);
      for (let p = 0; p < d.data.length; p += 4) { const v = Math.random() * 255; d.data[p] = d.data[p + 1] = d.data[p + 2] = v; d.data[p + 3] = 255; }
      g.putImageData(d, 0, 0); FX.noise.push(c);
    }
    const s = document.createElement('canvas'); s.width = 4; s.height = 4;
    const sg = s.getContext('2d'); sg.fillStyle = 'rgba(0,0,0,0.35)'; sg.fillRect(0, 0, 4, 2);
    FX.scan = ctx.createPattern(s, 'repeat');
    const v = document.createElement('canvas'); v.width = W; v.height = H;
    const vg = v.getContext('2d');
    const gr = vg.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.85)');
    vg.fillStyle = gr; vg.fillRect(0, 0, W, H); FX.vig = v;
    // foreground pieces of the office (candy bucket, desk papers) that must stay in front of the doorways
    const o = IMG.office;
    if (o) try {
      const f = document.createElement('canvas'); f.width = o.width; f.height = o.height;
      const fg = f.getContext('2d'); fg.drawImage(o, 0, 0);
      const d = fg.getImageData(0, 0, o.width, o.height);
      const boxes = [[1030, 490, 1205, 625]];
      for (let y = 0; y < o.height; y++) for (let x = 0; x < o.width; x++) {
        const p = (y * o.width + x) * 4;
        const r = d.data[p], gg = d.data[p + 1], b = d.data[p + 2];
        const inBox = boxes.some(bx => x >= bx[0] && x < bx[2] && y >= bx[1] && y < bx[3]);
        const lum = 0.3 * r + 0.59 * gg + 0.11 * b;
        const keep = (inBox && lum > 20 && r > 70 && r > b * 1.8 && r > gg * 1.2) || (x > 300 && x < 480 && y > 540 + (470 - x) * 0.94);
        d.data[p + 3] = keep ? 255 : 0;
      }
      fg.putImageData(d, 0, 0); FX.fg = f;
    } catch (e) { FX.fg = null; }
  }

  // ---------------------------------------------------------------- layout
  const OS = H / 672;                 // office image -> screen scale
  const OW = 1584 * OS;               // office width on screen
  const DOOR = { '-1': { x: 155, y: 92, w: 307, h: 505 }, '1': { x: 1128, y: 95, w: 292, h: 502 } };
  const BTN = { '-1': { door: [537, 320], light: [538, 346] }, '1': { door: [1517, 330], light: [1517, 367] } };
  const CAMS = [
    { id: 'stage', code: '1A', name: 'Show Stage', mx: 215, my: 28 },
    { id: 'dining', code: '1B', name: 'Dining Hall', mx: 215, my: 98 },
    { id: 'patch', code: '1C', name: 'Pumpkin Patch', mx: 60, my: 98 },
    { id: 'westhall', code: '2A', name: 'West Hall', mx: 130, my: 190 },
    { id: 'westcorner', code: '2B', name: 'W. Hall Corner', mx: 130, my: 262 },
    { id: 'backstage', code: '3', name: 'Backstage', mx: 370, my: 28 },
    { id: 'easthall', code: '4A', name: 'East Hall', mx: 300, my: 190 },
    { id: 'eastcorner', code: '4B', name: 'E. Hall Corner', mx: 300, my: 262 },
    { id: 'restrooms', code: '5', name: 'Restrooms', mx: 385, my: 130 },
    { id: 'closet', code: '6', name: 'Supply Closet', mx: 45, my: 190 }
  ];
  const MAP = { x: 1105, y: 455, w: 460, h: 380 };
  const MAP_LINKS = [['stage', 'dining'], ['dining', 'patch'], ['dining', 'westhall'], ['dining', 'easthall'], ['dining', 'backstage'],
    ['dining', 'restrooms'], ['restrooms', 'easthall'], ['westhall', 'westcorner'], ['easthall', 'eastcorner'], ['closet', 'westhall'],
    ['backstage', 'closet']];
  const NAMES = { P: 'Pumpkin Pete', H: 'Hollow Hattie', S: 'Scraps the Scarecrow' };
  const TIPS = {
    P: ['Pete always walks the EAST side toward your RIGHT door.', 'He will not move while you watch him on camera.', 'Light the right door: if he is there, close it until he leaves.'],
    H: ['Hattie can come to EITHER door. Listen for whispering.', 'Camera interference means she is hiding in that room.', 'Check both lights and close the door she is standing at.'],
    S: ['Scraps hates being ignored: check the Pumpkin Patch (CAM 1C) often.', 'Watching him keeps him on his post.', 'When his post is empty, close the LEFT door right away.'],
    X: ['You ran out of power.', 'Doors, lights and the camera all drain power.', 'Only close a door when someone is actually there.']
  };

  // ---------------------------------------------------------------- state
  let state = 'loading', night = null, T = 0;
  let mx = W / 2, my = H / 2, scroll = (OW - W) / 2;
  let tab = 0, tabTarget = 0, barArmed = true;
  let doorAnim = { '-1': 0, '1': 0 };
  let staticT = 0, shake = 0, jumpT = 0, overT = 0, winT = 0, killer = null, killedHour = 12;
  let callSrc = null, callOn = false, lastAmb = 0, revealed = { '-1': -1, '1': -1 };
  let lightKey = { '-1': false, '1': false }, lightMouse = { '-1': false, '1': false };
  let loopVol = {}, menuOn = false, winChimed = false, flick = 1;

  function setLoop(name, vol, fade) {
    if (Math.abs((loopVol[name] || 0) - vol) < 0.01) return;
    loopVol[name] = vol;
    if (vol <= 0.001) A.fade(name, 0, fade || 0.3);
    else A.loop(name, vol, { fade: fade || 0.3 });
  }

  function startMenuMusic() {
    if (menuOn) return;
    menuOn = true; loopVol = {};
    A.loop('menu', 0.55, { fade: 2 });
  }

  function newNight() {
    A.stopAll(0.3); loopVol = {}; menuOn = false;
    if (callSrc) { try { callSrc.src.stop(); } catch (e) { /* done */ } callSrc = null; }
    night = new PP.Night();
    state = 'night'; T = 0;
    tab = 0; tabTarget = 0; barArmed = false;
    doorAnim = { '-1': 0, '1': 0 }; staticT = 0; shake = 0; killer = null;
    revealed = { '-1': -1, '1': -1 }; lightKey = { '-1': false, '1': false }; lightMouse = { '-1': false, '1': false };
    lastAmb = 12 + Math.random() * 10; winChimed = false;
    callOn = true;
    setTimeout(() => {
      if (state !== 'night' || !callOn) return;
      callSrc = A.play('call', { vol: 0.9 });
      if (callSrc) callSrc.src.onended = () => { callOn = false; };
      else callOn = false;
    }, 2200);
  }

  function muteCall() {
    if (callSrc) { try { callSrc.src.stop(); } catch (e) { /* done */ } callSrc = null; }
    callOn = false;
  }

  // ---------------------------------------------------------------- night update
  function updateNight(dt) {
    const n = night;
    // lights: held by key or mouse
    [-1, 1].forEach(s => {
      const want = (lightKey[s] || lightMouse[s]) && tab === 0 && tabTarget === 0;
      const cur = s < 0 ? n.lightL : n.lightR;
      if (want !== cur) n.setLight(s, want);
    });
    n.update(dt);
    handleEvents();
    if (n.attacker && n.attackDelay <= 0 && state === 'night') startJump(n.attacker);

    doorAnim['-1'] += ((n.doorL ? 1 : 0) - doorAnim['-1']) * Math.min(1, dt * 14);
    doorAnim['1'] += ((n.doorR ? 1 : 0) - doorAnim['1']) * Math.min(1, dt * 14);
    tab += Math.sign(tabTarget - tab) * Math.min(Math.abs(tabTarget - tab), dt * 4.5);
    if (tab >= 1 && tabTarget === 1 && !n.tablet) n.setTablet(true);
    staticT = Math.max(0, staticT - dt * 2.2);
    shake = Math.max(0, shake - dt * 3);
    flick += ((0.9 + Math.random() * 0.1) - flick) * 0.25;

    // office look
    if (tab < 1) {
      const target = Math.max(0, Math.min(1, (mx - 250) / (W - 500))) * (OW - W);
      scroll += (target - scroll) * Math.min(1, dt * 5);
    }

    // light reveal stinger
    [-1, 1].forEach(s => {
      const on = s < 0 ? n.lightL : n.lightR;
      if (!on || doorAnim[s] > 0.2) return;
      const who = occupantAt(s);
      if (!who) return;
      const a = n[who.charAt(0)];
      const key = who.charAt(0) + a.visit;
      if (revealed[s] !== key) { revealed[s] = key; A.play('stinger', { vol: 0.75, pan: s * 0.4 }); }
    });

    // ambience
    const po = n.powerOut;
    setLoop('amb_building', po ? 0.35 : 0.5, 1);
    setLoop('fan_loop', po ? 0 : (tab > 0.5 ? 0.06 : 0.22), po ? 0.05 : 0.4);
    setLoop('static_loop', n.tablet ? 0.09 + staticT * 0.35 : 0, 0.15);
    setLoop('light_buzz', (n.lightL || n.lightR) ? 0.32 : 0, 0.05);
    setLoop('heartbeat', (po || n.power < 8) ? 0.55 : 0, 1.5);

    lastAmb -= dt;
    if (lastAmb <= 0 && !po) {
      lastAmb = 18 + Math.random() * 22 - n.hour() * 2;
      const pick = ['distant_bang', 'distant_clang', 'distant_clang', 'pete_laugh', 'witch_laugh'][Math.floor(Math.random() * 5)];
      A.play(pick, { vol: 0.22 + Math.random() * 0.15, muffle: 0.75, pan: Math.random() * 1.6 - 0.8, rate: 0.85 + Math.random() * 0.2 });
    }
  }

  function occupantAt(side) {
    const n = night, r = side < 0 ? 'doorL' : 'doorR';
    if (n.P.room === r) return side < 0 ? null : 'P';
    if (n.H.room === r) return 'H';
    return null;
  }

  function handleEvents() {
    const n = night;
    while (n.events.length) {
      const e = n.events.shift();
      switch (e.type) {
        case 'move': {
          if (n.tablet && (e.from === n.cam || e.to === n.cam)) { staticT = 1; A.play('cam_switch', { vol: 0.3 }); }
          const d = PP.DIST[e.to] == null ? 4 : PP.DIST[e.to];
          if (e.who === 'P') {
            const pan = e.to === 'dining' ? 0.15 : 0.35 + (4 - d) * 0.16;
            A.play('steps_heavy', { vol: [1, 0.75, 0.5, 0.32, 0.18][d], muffle: [0, 0.3, 0.5, 0.65, 0.8][d], pan: pan });
            if (e.from === 'stage') A.play('pete_laugh', { vol: 0.3, muffle: 0.75, pan: 0.1 });
          } else if (e.who === 'H') {
            if (e.from === 'stage') A.play('witch_laugh', { vol: 0.3, muffle: 0.7, pan: -0.1 });
            else if (d <= 1) A.play('steps_heavy', { vol: 0.35, muffle: 0.55, rate: 1.35, pan: e.to.indexOf('west') === 0 || e.to === 'doorL' ? -0.7 : 0.7 });
            else if (Math.random() < 0.25) A.play('witch_laugh', { vol: 0.18, muffle: 0.85, pan: Math.random() - 0.5 });
          }
          break;
        }
        case 'door': A.play(e.closed ? 'door_close' : 'door_open', { vol: 0.8, pan: e.side * 0.7 }); break;
        case 'breath': A.play('breathing', { vol: 0.5, pan: 0.85, muffle: n.doorR ? 0.6 : 0.1 }); break;
        case 'whisper': A.play('witch_whisper', { vol: 0.55, pan: e.side * 0.85, muffle: (e.side < 0 ? n.doorL : n.doorR) ? 0.6 : 0 }); break;
        case 'bang': A.play('door_bang', { vol: 1, pan: e.side * 0.75 }); shake = 0.6; break;
        case 'scrape': A.play('window_tap', { vol: 0.7, pan: e.side * 0.8, muffle: 0.3 }); break;
        case 'scraps': if (!e.reset) A.play('straw_rustle', { vol: 0.16 + e.stage * 0.05, muffle: 0.7, pan: -0.6 }); break;
        case 'sprint': A.play('steps_fast', { vol: 0.95, pan: -0.75 }); break;
        case 'attack':
          if (n.tablet || tabTarget) { tabTarget = 0; n.setTablet(false); A.play('tablet_down', { vol: 0.6 }); }
          break;
        case 'hour': A.play('hour_chime', { vol: 0.35 }); break;
        case 'powerout':
          tabTarget = 0; muteCall();
          ['fan_loop', 'static_loop', 'light_buzz'].forEach(k => { A.stop(k, 0.1); loopVol[k] = 0; });
          A.play('power_down', { vol: 0.9 });
          break;
        case 'musicbox': A.loop('music_box', 0.65, { fade: 1.5 }); break;
        case 'blackout': A.stop('music_box', 0.3); A.stop('heartbeat', 0.5); loopVol.heartbeat = 0; break;
        case 'win': startWin(); break;
      }
    }
  }

  function startJump(who) {
    state = 'jump'; jumpT = 0; killer = who; killedHour = night.clockHour();
    A.stopAll(0.05); loopVol = {};
    muteCall();
    A.play(who === 'H' ? 'jumpscare_2' : 'jumpscare_1', { vol: 1 });
  }

  function startWin() {
    state = 'win'; winT = 0;
    A.stopAll(1.2); loopVol = {}; muteCall();
  }

  // ---------------------------------------------------------------- input
  function toScreen(e) {
    const r = cv.getBoundingClientRect();
    mx = (e.clientX - r.left) * W / r.width; my = (e.clientY - r.top) * H / r.height;
  }
  function officePt(ox, oy) { return [ox * OS - scroll, oy * OS]; }
  function hitBtn(side, kind) {
    const b = BTN[side][kind], p = officePt(b[0], b[1]);
    return Math.hypot(mx - p[0], my - p[1]) < 34;
  }
  const CAM_BTN = { w: 70, h: 34 };
  function camAt(x, y) {
    for (const c of CAMS) {
      const bx = MAP.x + c.mx - CAM_BTN.w / 2, by = MAP.y + c.my - CAM_BTN.h / 2;
      if (x >= bx && x <= bx + CAM_BTN.w && y >= by && y <= by + CAM_BTN.h) return c;
    }
    return null;
  }
  function barHit() { return my > H - 58 && mx > 420 && mx < 1180; }

  function toggleTablet() {
    if (state !== 'night') return;
    const n = night;
    if (tabTarget === 0) {
      if (n.powerOut || n.attacker) return;
      tabTarget = 1; A.play('tablet_up', { vol: 0.6 }); staticT = 1;
    } else {
      tabTarget = 0; n.setTablet(false); A.play('tablet_down', { vol: 0.6 });
    }
  }

  function switchCam(id) {
    if (!night.tablet || night.cam === id) return;
    night.setCam(id); staticT = 1; A.play('cam_switch', { vol: 0.5 });
  }

  function pressDoor(side) {
    if (state !== 'night' || tab > 0) return;
    if (!night.toggleDoor(side)) A.play('button_fail', { vol: 0.6, pan: side * 0.6 });
  }

  cv.addEventListener('mousemove', e => {
    toScreen(e);
    if (state === 'night') {
      if (barHit()) { if (barArmed) { barArmed = false; toggleTablet(); } } else barArmed = true;
    }
  });
  cv.addEventListener('mousedown', e => {
    toScreen(e);
    if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
    if (state === 'title') {
      if (!menuOn) startMenuMusic(); else newNight();
      return;
    }
    if (state === 'over' && overT > 0.8) { newNight(); return; }
    if (state === 'win' && winT > 6) { newNight(); return; }
    if (state !== 'night') return;
    if (callOn && mx < 230 && my < 80) { muteCall(); return; }
    if (tab >= 1) { const c = camAt(mx, my); if (c) switchCam(c.id); return; }
    if (tab > 0) return;
    [-1, 1].forEach(s => {
      if (hitBtn(s, 'door')) pressDoor(s);
      if (hitBtn(s, 'light')) {
        if (night.powerOut) A.play('button_fail', { vol: 0.6, pan: s * 0.6 });
        else lightMouse[s] = true;
      }
    });
  });
  window.addEventListener('mouseup', () => { lightMouse['-1'] = false; lightMouse['1'] = false; });

  const CAM_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  window.addEventListener('keydown', e => {
    if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
    const k = e.key.toLowerCase();
    if (state === 'title') { if (!menuOn) startMenuMusic(); else if (k === 'enter' || k === ' ') newNight(); return; }
    if ((state === 'over' && overT > 0.8) || (state === 'win' && winT > 6)) { if (k === 'r' || k === 'enter' || k === ' ') newNight(); if (k === 'escape') toTitle(); return; }
    if (state !== 'night') return;
    if (e.repeat) return;
    if (k === ' ' || k === 's' || k === 'tab') { e.preventDefault(); toggleTablet(); }
    else if (k === 'a') pressDoor(-1);
    else if (k === 'd') pressDoor(1);
    else if (k === 'q') lightKey['-1'] = true;
    else if (k === 'e') lightKey['1'] = true;
    else if (k === 'm') muteCall();
    else if (k === 'escape') toTitle();
    else if (CAM_KEYS.indexOf(k) >= 0 && night.tablet) switchCam(CAMS[CAM_KEYS.indexOf(k)].id);
  });
  window.addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (k === 'q') lightKey['-1'] = false;
    if (k === 'e') lightKey['1'] = false;
  });

  function toTitle() {
    A.stopAll(0.3); loopVol = {}; muteCall(); menuOn = false;
    state = 'title'; T = 0; startMenuMusic();
  }

  // ---------------------------------------------------------------- drawing helpers
  function cover(img, x, y, w, h, alpha) {
    if (!img) return;
    const s = Math.max(w / img.width, h / img.height);
    const sw = w / s, sh = h / s;
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
    ctx.globalAlpha = 1;
  }
  function noise(alpha, x, y, w, h) {
    ctx.save();
    ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(FX.noise[Math.floor(T * 24) % FX.noise.length], x || 0, y || 0, w || W, h || H);
    ctx.restore();
  }
  function text(str, x, y, size, color, align, font) {
    ctx.font = size + 'px ' + (font || 'VT323, monospace');
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color || '#ddd'; ctx.fillText(str, x, y);
  }
  function shadowText(str, x, y, size, color, align, font) {
    text(str, x + 3, y + 3, size, 'rgba(0,0,0,0.8)', align, font);
    text(str, x, y, size, color, align, font);
  }

  // ---------------------------------------------------------------- office
  function drawOffice() {
    const n = night;
    const sx = shake > 0 ? (Math.random() - 0.5) * 16 * shake : 0;
    ctx.save(); ctx.translate(sx, 0);
    ctx.drawImage(IMG.office, -scroll, 0, OW, H);
    [-1, 1].forEach(s => {
      const d = DOOR[s];
      const x = d.x * OS - scroll, y = d.y * OS, w = d.w * OS, h = d.h * OS;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      const lit = s < 0 ? n.lightL : n.lightR;
      if (lit && doorAnim[s] < 0.98) {
        const who = occupantAt(s);
        const key = s < 0 ? (who === 'H' ? 'door_L_H' : 'door_L_empty') : (who === 'P' ? 'door_R_P' : who === 'H' ? 'door_R_H' : 'door_R_empty');
        cover(IMG[key] || IMG[s < 0 ? 'door_L_empty' : 'door_R_empty'], x, y, w, h, flick);
      }
      if (n.powerOut && n.po && n.po.stage === 1 && s > 0 && IMG.door_dark_P) {
        cover(IMG.door_dark_P, x, y, w, h, 0.55 + 0.4 * Math.sin(T * 2.2));
      }
      if (doorAnim[s] > 0.01 && IMG.shutter) {
        const sh = h * doorAnim[s];
        ctx.drawImage(IMG.shutter, x, y + sh - h, w, h);
        if (lit) { ctx.fillStyle = 'rgba(255,240,210,0.12)'; ctx.fillRect(x, y, w, sh); }
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, y, w, sh);
      }
      ctx.restore();
    });
    if (FX.fg) ctx.drawImage(FX.fg, -scroll, 0, OW, H);
    // overall mood: lamp flicker + darkness
    if (n.powerOut) {
      ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H);
      if (n.po && n.po.stage === 1 && IMG.door_dark_P) {   // keep the glowing face visible through the dark
        const d = DOOR[1];
        ctx.save(); ctx.beginPath(); ctx.rect(d.x * OS - scroll, d.y * OS, d.w * OS, d.h * OS); ctx.clip();
        ctx.globalCompositeOperation = 'lighter';
        cover(IMG.door_dark_P, d.x * OS - scroll, d.y * OS, d.w * OS, d.h * OS, 0.35 + 0.3 * Math.sin(T * 2.2));
        ctx.restore();
      }
      if (n.po && n.po.stage === 2) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,' + (0.18 + (1 - flick) * 0.6).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
      drawButtons();
    }
    ctx.drawImage(FX.vig, 0, 0);
    ctx.restore();
  }

  function drawButtons() {
    const n = night;
    [-1, 1].forEach(s => {
      const closed = s < 0 ? n.doorL : n.doorR, lit = s < 0 ? n.lightL : n.lightR;
      [['door', closed, '255,40,30'], ['light', lit, '255,250,220']].forEach(([kind, on, rgb]) => {
        const b = BTN[s][kind], p = officePt(b[0], b[1]);
        const hover = hitBtn(s, kind);
        const g = ctx.createRadialGradient(p[0], p[1], 2, p[0], p[1], on ? 46 : 26);
        g.addColorStop(0, 'rgba(' + rgb + ',' + (on ? 0.9 : hover ? 0.45 : 0.18) + ')');
        g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], on ? 46 : 26, 0, Math.PI * 2); ctx.fill();
        if (hover) {
          text(kind === 'door' ? 'DOOR [' + (s < 0 ? 'A' : 'D') + ']' : 'LIGHT [' + (s < 0 ? 'Q' : 'E') + ']', p[0] + (s < 0 ? 34 : -34), p[1] + 7, 24, 'rgba(230,220,200,0.85)', s < 0 ? 'left' : 'right');
        }
      });
    });
  }

  // ---------------------------------------------------------------- cameras
  function camImage(id) {
    const n = night, P = n.P.room === id, Hh = n.H.room === id;
    let k = 'room_' + id;
    if (id === 'stage') k = P && Hh ? 'stage_PH' : P ? 'stage_P' : Hh ? 'stage_H' : 'room_stage';
    else if (id === 'patch') k = (n.S.stage >= 3 || n.S.sprint > 0) ? 'room_patch' : 'patch_S' + n.S.stage;
    else if (id === 'westhall' && n.S.sprint > 0) k = 'westhall_S';
    else if (P && IMG[id + '_P']) k = id + '_P';
    else if (Hh && IMG[id + '_H']) k = id + '_H';
    return IMG[k] || IMG['room_' + id];
  }

  function drawCams() {
    const n = night, cam = n.cam;
    const img = camImage(cam);
    const pan = Math.sin(T * 0.35) * 40;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const jam = n.H.room === cam && n.H.hidden;
    if (img) {
      ctx.save();
      ctx.drawImage(img, -40 + pan - 20, -22, W + 120, H + 68);
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(10,30,25,0.18)'; ctx.fillRect(0, 0, W, H);
    noise(jam ? 0.82 : 0.07 + staticT * 0.75);
    ctx.fillStyle = FX.scan; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(FX.vig, 0, 0);
    if (jam) {
      shadowText('-- SIGNAL INTERFERENCE --', W / 2, H / 2 - 40, 46, 'rgba(230,230,230,0.85)', 'center');
    }
    // HUD
    const c = CAMS.find(x => x.id === cam);
    if (Math.floor(T * 1.2) % 2 === 0) { ctx.fillStyle = '#d22'; ctx.beginPath(); ctx.arc(60, 64, 12, 0, Math.PI * 2); ctx.fill(); }
    shadowText('REC', 82, 76, 34, '#e8e8e8');
    shadowText('CAM ' + c.code + '  ' + c.name.toUpperCase(), 48, 128, 44, '#f0f0f0');
    // corner brackets
    ctx.strokeStyle = 'rgba(230,230,230,0.6)'; ctx.lineWidth = 3;
    [[30, 30, 1, 1], [W - 30, 30, -1, 1], [30, H - 30, 1, -1], [W - 30, H - 30, -1, -1]].forEach(([x, y, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(x, y + dy * 50); ctx.lineTo(x, y); ctx.lineTo(x + dx * 50, y); ctx.stroke();
    });
    drawMap();
  }

  function drawMap() {
    const n = night;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(MAP.x - 14, MAP.y - 24, MAP.w + 28, MAP.h + 34);
    ctx.strokeStyle = 'rgba(200,200,200,0.5)'; ctx.lineWidth = 2;
    ctx.strokeRect(MAP.x - 14, MAP.y - 24, MAP.w + 28, MAP.h + 34);
    const pos = id => { if (id === 'office') return [MAP.x + 215, MAP.y + 330]; const c = CAMS.find(x => x.id === id); return [MAP.x + c.mx, MAP.y + c.my]; };
    ctx.strokeStyle = 'rgba(190,190,190,0.55)'; ctx.lineWidth = 10; ctx.lineCap = 'square';
    MAP_LINKS.concat([['westcorner', 'office'], ['eastcorner', 'office']]).forEach(([a, b]) => {
      const p = pos(a), q = pos(b);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]);
      if (b === 'office') ctx.lineTo(p[0], q[1]);
      ctx.lineTo(q[0], q[1]); ctx.stroke();
    });
    const o = pos('office');
    ctx.fillStyle = '#ddd'; ctx.fillRect(o[0] - 40, o[1] - 18, 80, 36);
    text('YOU', o[0], o[1] + 8, 26, '#111', 'center');
    CAMS.forEach(c => {
      const x = MAP.x + c.mx - CAM_BTN.w / 2, y = MAP.y + c.my - CAM_BTN.h / 2;
      const sel = c.id === n.cam;
      const hov = camAt(mx, my) === c;
      ctx.fillStyle = sel ? 'rgba(120,180,60,0.95)' : hov ? 'rgba(90,90,90,0.95)' : 'rgba(45,45,45,0.95)';
      ctx.fillRect(x, y, CAM_BTN.w, CAM_BTN.h);
      ctx.strokeStyle = 'rgba(230,230,230,0.8)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, CAM_BTN.w, CAM_BTN.h);
      text('CAM ' + c.code, x + CAM_BTN.w / 2, y + 25, 24, '#f2f2f2', 'center');
    });
    text('1-0: switch camera', MAP.x + MAP.w, MAP.y - 30, 22, 'rgba(220,220,220,0.6)', 'right');
  }

  // ---------------------------------------------------------------- HUD
  function drawHud() {
    const n = night;
    if (n.powerOut) return;
    const hr = n.clockHour();
    shadowText(hr + ' AM', W - 40, 70, 64, '#f2f2f2', 'right');
    shadowText('Night 1', W - 42, 106, 30, '#bdbdbd', 'right');
    const pw = Math.ceil(n.power);
    const low = n.power < 20;
    shadowText('Power left: ' + pw + '%', 40, H - 78, 38, low ? (Math.floor(T * 2) % 2 ? '#ff6a4a' : '#ffb39a') : '#f2f2f2');
    shadowText('Usage:', 40, H - 34, 34, '#f2f2f2');
    const u = n.usage();
    const cols = ['#4caf3c', '#4caf3c', '#d8c83a', '#e0882a', '#d63c2c'];
    for (let i = 0; i < u; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(140 + i * 30, H - 60, 22, 30); }
    if (!n.powerOut) {
      const hov = barHit();
      ctx.fillStyle = hov ? 'rgba(200,200,200,0.35)' : 'rgba(160,160,160,0.18)';
      ctx.fillRect(440, H - 50, 720, 38);
      ctx.strokeStyle = 'rgba(220,220,220,0.55)'; ctx.lineWidth = 2; ctx.strokeRect(440, H - 50, 720, 38);
      text(tabTarget ? '▼  LOWER CAMERA  [SPACE]  ▼' : '▲  CAMERAS  [SPACE]  ▲', 800, H - 22, 28, 'rgba(240,240,240,0.85)', 'center');
    }
    if (callOn) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(20, 20, 210, 54);
      ctx.strokeStyle = 'rgba(220,220,220,0.6)'; ctx.strokeRect(20, 20, 210, 54);
      text('MUTE CALL [M]', 125, 56, 30, '#f2f2f2', 'center');
    }
    if (T < 14 && tab === 0) {
      const a = Math.min(1, (14 - T) / 2);
      ctx.globalAlpha = a;
      shadowText('A / D  doors     hold Q / E  lights     SPACE  cameras', W / 2, 150, 30, '#e6dcc8', 'center');
      ctx.globalAlpha = 1;
    }
  }

  function drawTabletTransition() {
    // tablet sliding up over the office
    const y = H * (1 - tab);
    ctx.fillStyle = '#0b0b0b'; ctx.fillRect(40, y + 20, W - 80, H);
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 14; ctx.strokeRect(40, y + 20, W - 80, H);
    noise(0.25, 60, y + 40, W - 120, H - 60);
  }

  // ---------------------------------------------------------------- screens
  function drawTitle() {
    cover(IMG.title || IMG.stage_PH || IMG.room_stage, 0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, W * 0.6, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    noise(0.06);
    ctx.fillStyle = FX.scan; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(FX.vig, 0, 0);
    shadowText('NIGHT SHIFT AT', 90, 200, 52, '#c9b89a');
    shadowText("PUMPKIN", 84, 320, 128, '#e5761c', 'left', 'Creepster, serif');
    shadowText("PETE'S", 84, 440, 128, '#e5761c', 'left', 'Creepster, serif');
    const a = 0.55 + 0.45 * Math.sin(T * 2.4);
    ctx.globalAlpha = a; shadowText(menuOn ? 'Click to begin your shift' : 'Click to enable sound', 92, 540, 44, '#f2e6d0'); ctx.globalAlpha = 1;
    const lines = ['Survive from 12 AM to 6 AM.', 'A / D or click the red buttons: close doors', 'Hold Q / E or the white buttons: door lights',
      'SPACE or hover the bottom bar: cameras', '1-0 or click the map: switch cameras', 'Everything drains power. Listen carefully.'];
    lines.forEach((l, i) => text(l, 94, 620 + i * 36, 30, 'rgba(220,210,190,0.8)'));
    text('Headphones recommended', W - 40, H - 30, 26, 'rgba(200,190,170,0.6)', 'right');
  }

  function drawJump() {
    const img = IMG['jump_' + killer];
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const t = jumpT;
    if (t < 1.35) {
      const z = 1.25 - Math.min(1, t / 0.25) * 0.22 + Math.max(0, t - 0.25) * 0.05;
      const amp = 26 * Math.max(0.15, 1 - t);
      const ox = (Math.random() - 0.5) * amp, oy = (Math.random() - 0.5) * amp;
      ctx.save(); ctx.translate(W / 2 + ox, H / 2 + oy); ctx.scale(z, z);
      cover(img, -W / 2, -H / 2, W, H, Math.min(1, t / 0.06));
      ctx.restore();
      noise(0.12);
      ctx.drawImage(FX.vig, 0, 0);
    }
    if (t > 1.1) { ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, (t - 1.1) / 0.4) + ')'; ctx.fillRect(0, 0, W, H); }
  }

  function drawOver() {
    cover(IMG.gameover || IMG.room_backstage, 0, 0, W, H, Math.min(1, overT / 1.5) * 0.55);
    noise(0.1 + Math.max(0, 0.6 - overT) * 0.8);
    ctx.fillStyle = FX.scan; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(FX.vig, 0, 0);
    ctx.globalAlpha = Math.min(1, overT / 1.2);
    shadowText('GAME OVER', W / 2, 250, 130, '#c8321e', 'center', 'Creepster, serif');
    const who = night.powerOut ? 'X' : killer;
    const by = night.powerOut ? 'The power ran out and Pumpkin Pete found you' : 'Caught by ' + NAMES[killer];
    shadowText(by + ' at ' + killedHour + ' AM', W / 2, 330, 42, '#eadfcc', 'center');
    (TIPS[who] || []).forEach((l, i) => shadowText(l, W / 2, 430 + i * 42, 32, '#c6b9a2', 'center'));
    if (overT > 0.8) {
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(T * 3);
      shadowText('Click or press R to try again', W / 2, 700, 46, '#f2e6d0', 'center');
      ctx.globalAlpha = 1;
      text('ESC: title screen', W / 2, 760, 28, 'rgba(200,190,170,0.6)', 'center');
    }
    ctx.globalAlpha = 1;
  }

  function drawWin() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const t = winT;
    if (t > 1 && !winChimed) { winChimed = true; A.play('chime_6am', { vol: 0.9 }); }
    if (t < 5) {
      const roll = Math.max(0, Math.min(1, (t - 1.2) / 0.8));
      ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 - 110, W, 160); ctx.clip();
      shadowText('5', W / 2 - 60, H / 2 + 20 - roll * 150, 150, '#f2f2f2', 'right');
      shadowText('6', W / 2 - 60, H / 2 + 170 - roll * 150, 150, '#f2f2f2', 'right');
      ctx.restore();
      shadowText('AM', W / 2 - 30, H / 2 + 20, 150, '#f2f2f2', 'left');
      if (t > 4) { ctx.fillStyle = 'rgba(0,0,0,' + (t - 4) + ')'; ctx.fillRect(0, 0, W, H); }
      return;
    }
    const a = Math.min(1, (t - 5) / 1.5);
    cover(IMG.win || IMG.room_dining, 0, 0, W, H, a);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = a;
    shadowText('6 AM', W / 2, 270, 150, '#ffd9a0', 'center', 'Creepster, serif');
    shadowText('You survived the night at Pumpkin Pete\'s.', W / 2, 360, 48, '#fff1dc', 'center');
    shadowText('Power left: ' + Math.ceil(night.power) + '%', W / 2, 430, 36, '#f2e2c8', 'center');
    if (t > 6) {
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(T * 3);
      shadowText('Click or press R to work another shift', W / 2, 720, 44, '#fff1dc', 'center');
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- main loop
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    T += dt;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (state === 'title') drawTitle();
    else if (state === 'night') {
      updateNight(dt);
      if (state === 'night') {
        if (tab >= 1 && night.tablet) drawCams();
        else { drawOffice(); if (tab > 0) drawTabletTransition(); }
        drawHud();
      }
    }
    if (state === 'jump') {
      jumpT += dt; drawJump();
      if (jumpT > 1.6) { state = 'over'; overT = 0; A.loop('amb_building', 0.25, { fade: 2 }); }
    } else if (state === 'over') { overT += dt; drawOver(); }
    else if (state === 'win') { winT += dt; drawWin(); }
    requestAnimationFrame(frame);
  }

  window.GAME = { get night() { return night; }, get state() { return state; }, newNight: newNight };
  loadAll();
  requestAnimationFrame(frame);
})();
