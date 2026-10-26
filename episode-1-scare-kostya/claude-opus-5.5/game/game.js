'use strict';
// ---------- core ----------
const $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
const S = {phase: 0, room: '', busy: false, key: 0, small: 0, cam: null, an: null, photo: null, seen: {}};
const FL = {mode: 'beam', d: .86, r: .42, flick: 0, flat: .3};
let mx = innerWidth / 2, my = innerHeight / 2, mv = 0, flickV = 1;
addEventListener('mousemove', e => {
  mv += Math.hypot(e.clientX - mx, e.clientY - my); mx = e.clientX; my = e.clientY;
  $('cur').style.left = mx + 'px'; $('cur').style.top = my + 'px';
});
addEventListener('contextmenu', e => e.preventDefault());

// ---------- audio (decoded from embedded audio.js, so it works from file://) ----------
let AC, master; const BUF = {}, LOOP = {};
async function loadAudio() {
  AC = new (window.AudioContext || window.webkitAudioContext)();
  const comp = AC.createDynamicsCompressor(); comp.threshold.value = -8; comp.ratio.value = 3;
  master = AC.createGain(); master.connect(comp); comp.connect(AC.destination);
  const names = Object.keys(window.AUD || {}); let n = 0;
  await Promise.all(names.map(async k => {
    const b = atob(AUD[k]), u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    try { BUF[k] = await AC.decodeAudioData(u.buffer); } catch (e) { console.warn('decode', k, e); }
    delete AUD[k]; $('go').textContent = 'ЗАГРУЗКА ' + Math.round(100 * ++n / names.length) + '%';
  }));
}
const NOOP = {stop() {}, vol() {}, pan() {}, dur: 0};
function play(name, o = {}) {
  const buf = BUF[name]; if (!buf || !AC) return NOOP;
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = !!o.loop; src.playbackRate.value = o.rate || 1;
  let node = src;
  for (const [t, f] of [['lowpass', o.lp], ['highpass', o.hp]]) if (f) {
    const q = AC.createBiquadFilter(); q.type = t; q.frequency.value = f; node.connect(q); node = q;
  }
  const g = AC.createGain(), p = AC.createStereoPanner ? AC.createStereoPanner() : null, v = o.vol ?? 1, t = AC.currentTime;
  node.connect(g); if (p) { p.pan.value = o.pan || 0; g.connect(p); p.connect(master); } else g.connect(master);
  if (o.fade) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + o.fade); } else g.gain.value = v;
  if (o.dur) src.start(t, o.offset || 0, o.dur); else src.start(t, o.offset || 0);
  const ramp = (prm, val, f) => { const n = AC.currentTime; prm.cancelScheduledValues(n); prm.setValueAtTime(prm.value, n); prm.linearRampToValueAtTime(val, n + f); };
  return {dur: buf.duration,
    stop(f = .08) { try { ramp(g.gain, 0, f); src.stop(AC.currentTime + f + .05); } catch (e) {} },
    vol(val, f = 1) { ramp(g.gain, val, f); },
    pan(val, f = 1) { if (p) ramp(p.pan, val, f); }};
}
function loop(name, vol, o = {}) {
  if (LOOP[name]) return LOOP[name].vol(vol, o.fade ?? 2);
  LOOP[name] = play(name, {...o, loop: true, vol, fade: o.fade ?? 2});
}
function unloop(name, f = 1.5) { if (LOOP[name]) { LOOP[name].stop(f); delete LOOP[name]; } }
function hush(f = .1) { for (const k in LOOP) unloop(k, f); }
async function say(n, parts, o = {}) {
  parts = [].concat(parts); play(n, o);
  const d = (BUF[n] ? BUF[n].duration / (o.rate || 1) : 2.5) * 1000, tot = parts.join('').length;
  for (const p of parts) { sub(p, o.g); await wait(d * p.length / tot); }
  subOff(); await wait(150);
}
const PHONE = {lp: 3200, hp: 350, vol: 1.1};

// ---------- text ----------
let msgT;
function msg(t, ms = 3800) { const m = $('msg'); m.textContent = t; m.style.opacity = 1; clearTimeout(msgT); msgT = setTimeout(() => m.style.opacity = 0, ms); }
function sub(t, g) { const s = $('sub'); s.textContent = t; s.className = 'txt' + (g ? ' g' : ''); s.style.opacity = 1; }
function subOff() { $('sub').style.opacity = 0; }
function obj(t) { $('obj').textContent = t || ''; }
function lbl(t) { const l = $('lbl'); if (t) l.textContent = t; l.style.opacity = t ? 1 : 0; }
async function center(html, ms) { const c = $('center'); c.innerHTML = html; c.style.opacity = 1; if (ms) { await wait(ms); c.style.opacity = 0; await wait(2000); } }
function black(v, s = .8) { const b = $('black'); b.style.transition = 'opacity ' + s + 's'; b.style.opacity = v; }

// ---------- visuals ----------
const IMGS = ['ext_building', 'stair_door', 'hall', 'hall_open', 'living', 'living_feet', 'kitchen', 'bedroom', 'portrait',
  'portrait_dead', 'docs_box', 'paper', 'peephole_empty', 'peephole_gran', 'wardrobe_view', 'wardrobe_gran', 'wardrobe_face', 'jumpscare_face'];
IMGS.forEach(n => { new Image().src = 'assets/img/' + n + '.jpg'; });
let curL = 0;
function bg(name, o = {}) {
  const fade = o.fade ?? .9, next = $('L' + (1 - curL)), prev = $('L' + curL);
  next.style.transition = 'none'; next.style.opacity = 0; next.src = 'assets/img/' + name + '.jpg';
  next.style.objectFit = o.fit || 'cover'; next.style.transform = 'none'; next.style.zIndex = 2; prev.style.zIndex = 1;
  void next.offsetWidth; curL = 1 - curL;
  if (!fade) { next.style.opacity = 1; prev.style.opacity = 0; return; }
  next.style.transition = 'opacity ' + fade + 's'; next.style.opacity = 1;
  setTimeout(() => { if ($('L' + curL) === next) prev.style.opacity = 0; }, fade * 1000 + 60);
}
function comp(id, on) { $(id).style.display = on ? 'block' : 'none'; }
function setHS(list = []) {
  const box = $('hs'); box.innerHTML = ''; $('cur').classList.remove('hot'); lbl('');
  for (const h of list) {
    const d = document.createElement('div'), [x0, y0, x1, y1] = h.r;
    Object.assign(d.style, {left: x0 * 100 + '%', top: y0 * 100 + '%', width: (x1 - x0) * 100 + '%', height: (y1 - y0) * 100 + '%'});
    d.onmouseenter = () => { if (!S.busy) { $('cur').classList.add('hot'); lbl(h.l); } };
    d.onmouseleave = () => { $('cur').classList.remove('hot'); lbl(''); };
    d.onclick = e => { e.stopPropagation(); if (S.busy) return; $('cur').classList.remove('hot'); lbl(''); h.f(); };
    box.appendChild(d);
  }
}
function shake(ms) { const s = $('stage'); s.classList.add('shake'); setTimeout(() => s.classList.remove('shake'), ms); }

// ---------- light, grain, parallax ----------
let flickHold = 0, gfr = 0;
const gc = $('grain'), gx = gc.getContext('2d'); gc.width = 256; gc.height = 144;
const gimg = gx.createImageData(256, 144);
function frame() {
  const nx = mx / innerWidth - .5, ny = my / innerHeight - .5;
  $('inner').style.transform = `scale(1.06) translate(${(-nx * 2.4).toFixed(3)}%,${(-ny * 1.7).toFixed(3)}%)`;
  if (flickHold > 0) flickHold--; else { flickV = 1; if (Math.random() < FL.flick * .025) { flickV = .2 + Math.random() * .55; flickHold = 2 + (Math.random() * 7 | 0); } }
  const dk = $('dark');
  if (FL.mode === 'beam') {
    const R = Math.max(innerWidth, innerHeight) * FL.r, d = FL.d, a0 = (1 - flickV) * .85;
    dk.style.background = `radial-gradient(circle at ${mx}px ${my}px, rgba(0,0,0,${a0.toFixed(2)}) 0, rgba(0,0,0,${Math.max(a0, d * .22).toFixed(2)}) ${(R * .4) | 0}px, rgba(0,0,0,${Math.max(a0, d * .72).toFixed(2)}) ${(R * .78) | 0}px, rgba(0,0,0,${d}) ${R | 0}px)`;
  } else if (FL.mode === 'flat') dk.style.background = `rgba(0,0,0,${Math.min(1, FL.flat + (1 - flickV) * .6).toFixed(2)})`;
  else dk.style.background = '#000';
  if (++gfr % 3 === 0) {
    const d = gimg.data;
    for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    gx.putImageData(gimg, 0, 0);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
function zoom(k, sec) { const l = $('L' + curL); l.style.transition = 'opacity .9s, transform ' + sec + 's ease-in-out'; l.style.transform = 'scale(' + k + ')'; }
function flicker(ms, k = 3) { const o = FL.flick; FL.flick = k; setTimeout(() => FL.flick = o, ms); }
const back = (f, l = 'НАЗАД') => ({r: [0, .86, .3, 1], l, f});

// ---------- permissions (optional) ----------
function attachMedia(st) {
  if (st.getVideoTracks().length) { S.cam = st; const v = $('cam'); v.srcObject = st; v.play().catch(() => {}); }
  if (st.getAudioTracks().length && AC) {
    try { const an = AC.createAnalyser(); an.fftSize = 512; AC.createMediaStreamSource(st).connect(an); S.an = an; } catch (e) {}
  }
}
async function askMedia() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  const p = navigator.mediaDevices.getUserMedia({video: {width: 640, height: 480, facingMode: 'user'}, audio: true})
    .then(attachMedia)
    .catch(() => navigator.mediaDevices.getUserMedia({video: true}).then(attachMedia).catch(() => {}));
  await Promise.race([p, wait(15000)]);
}
function micLevel() {
  if (!S.an) return 0;
  const d = new Uint8Array(S.an.fftSize); S.an.getByteTimeDomainData(d);
  let s = 0; for (const v of d) s += (v - 128) * (v - 128);
  return Math.sqrt(s / d.length) / 128;
}
function snapshot() {
  if (!S.cam) return;
  const v = $('cam'); if (!v.videoWidth) return;
  const c = document.createElement('canvas'); c.width = 360; c.height = 480;
  const x = c.getContext('2d'), vw = v.videoWidth, vh = v.videoHeight, sw = Math.min(vw, vh * .75);
  x.filter = 'grayscale(1) sepia(.25) brightness(.85) contrast(1.25)';
  x.translate(360, 0); x.scale(-1, 1);
  x.drawImage(v, (vw - sw) / 2, 0, sw, vh, 0, 0, 360, 480);
  S.photo = c.toDataURL('image/jpeg', .85);
}
function silhouette(cv, w, h) {
  cv.width = w; cv.height = h; const x = cv.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d0d0d'); g.addColorStop(1, '#030303');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.filter = 'blur(' + (w / 40 | 0) + 'px)'; x.fillStyle = '#1a1a1a';
  x.beginPath(); x.ellipse(w * .5, h * .38, w * .2, h * .16, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(w * .5, h * 1.02, w * .55, h * .42, 0, 0, 7); x.fill();
}

// ---------- composites ----------
const MBOX = [.4306, .2201, .5752, .7396], EBOX = [.3299, .1510, .5309, .7246];
function place(el, b) { Object.assign(el.style, {left: b[0] * 100 + '%', top: b[1] * 100 + '%', width: (b[2] - b[0]) * 100 + '%', height: (b[3] - b[1]) * 100 + '%'}); }
place($('mglass'), MBOX); place($('eglass'), EBOX);
Object.assign($('mgran').style, {left: '-46%', right: 'auto', bottom: '3%', height: '70%', filter: 'brightness(.62) contrast(1.15) blur(.6px)', transition: 'opacity 3.5s'});
silhouette($('mfake'), 200, 500);

// ---------- rooms ----------
function roomImg(r) {
  if (r === 'hall') return S.mirrorOpen && !S.mirrorDone ? 'hall_open' : 'hall';
  if (r === 'living') return S.phase >= 3 && !S.feetSeen ? 'living_feet' : 'living';
  return {stair: 'stair_door', kitchen: 'kitchen', bedroom: 'bedroom'}[r] || r;
}
async function go(r, cut) {
  S.busy = true; setHS([]); comp('mirror', false);
  if (cut) { black(1, .3); await wait(350); }
  S.room = r; FL.mode = 'beam';
  bg(roomImg(r), {fade: cut ? 0 : .8});
  if (cut) black(0, .6);
  await wait(cut ? 550 : 850);
  S.busy = false;
  const fn = ENTER[r]; if (fn) { const p = fn(); if (p) { S.busy = true; await p; S.busy = false; } }
  refresh();
}
function refresh() { if (!S.busy) setHS(HS[S.room]()); }
async function act(fn) { S.busy = true; setHS([]); try { await fn(); } finally { S.busy = false; refresh(); } }
const bmsg = t => () => act(async () => { msg(t); await wait(2400); });

// ---------- enter handlers ----------
const ENTER = {
  hall() {
    obj('ПРИХОЖАЯ');
    if (S.phase >= 4 && !S.mirrorOpen) {
      return (async () => {
        S.mirrorOpen = true;
        bg('hall_open', {fade: .25}); play('cloth_fall', {vol: 1.1, pan: -.4});
        flicker(1200, 3.5); await wait(1300); play('sting_small', {vol: .55});
        msg('Покрывало само упало с зеркала.'); await wait(2200);
      })();
    }
  },
};

// ---------- hotspot maps ----------
const HS = {
  stair: () => [
    {r: [.27, .25, .41, .53], l: 'ЭЛЕКТРОЩИТОК', f: bmsg('Пробки выкручены. Кто-то сделал это намеренно.')},
    {r: [.46, .79, .68, .96], l: 'КОВРИК', f: () => act(async () => {
      if (S.key) { msg('Пусто.'); await wait(1500); return; }
      S.key = true; play('key_unlock', {vol: .35, dur: .6}); msg('Ключ. Под ковриком.'); await wait(2600);
      play('g_call', {vol: .55, lp: 900}); sub('— Костя...', true); await wait(2200); subOff();
    })},
    {r: [.49, .22, .69, .78], l: 'ДВЕРЬ', f: () => S.key ? enterFlat() : bmsg('Заперто.')()},
  ],
  hall: () => {
    const doors = [
      {r: [.33, .15, .42, .74], l: 'ГОСТИНАЯ', f: () => go('living')},
      {r: [.45, .25, .56, .66], l: 'КУХНЯ',    f: () => go('kitchen')},
      {r: [.76, .05, .99, .8],  l: 'СПАЛЬНЯ',  f: () => { play('door_creak', {vol: .6, dur: 2.5}); go('bedroom'); }},
    ];
    const exit = {r: [0, .82, .3, 1], l: S.phase === 5 ? 'ВХОДНАЯ ДВЕРЬ' : 'К ВЫХОДУ', f: frontDoor};
    if (S.phase >= 6) return [doors[2], exit, bmsg_hs(.33, .15, .42, .74, 'ГОСТИНАЯ', 'Она где-то там.'), bmsg_hs(.45, .25, .56, .66, 'КУХНЯ', 'Она где-то там.')];
    if (S.phase === 5) return [exit, bmsg_hs(.33, .15, .42, .74, 'ГОСТИНАЯ', 'Надо уходить.'), bmsg_hs(.45, .25, .56, .66, 'КУХНЯ', 'Надо уходить.'), bmsg_hs(.76, .05, .99, .8, 'СПАЛЬНЯ', 'Надо уходить.'), {r: [.11, .03, .33, .72], l: 'ЗЕРКАЛО', f: bmsg('Не смотреть.')}];
    if (S.mirrorOpen && !S.mirrorDone) return [
      {r: [.11, .03, .33, .72], l: 'ЗЕРКАЛО',    f: mirrorScene},
      {r: [.32, .78, .53, .98], l: 'ПОКРЫВАЛО',  f: mirrorScene},
      bmsg_hs(.33, .15, .42, .74, 'ГОСТИНАЯ', 'Сначала накрой зеркало.'),
      bmsg_hs(.45, .25, .56, .66, 'КУХНЯ',    'Сначала накрой зеркало.'),
      bmsg_hs(.76, .05, .99, .8,  'СПАЛЬНЯ',  'Сначала накрой зеркало.'),
    ];
    return [
      {r: [.11, .03, .33, .72], l: 'ЗЕРКАЛО', f: () => act(async () => { msg(S.mirrorDone ? 'Больше — не смотреть.' : 'Завешено. «Зеркала не открывай».',  2800); await wait(2900); })},
      ...doors,
      {r: [.6, .2, .73, .7], l: 'ПАЛЬТО', f: bmsg('Её пальто. В кармане — тёплая перчатка.')},
      exit];
  },
  living: () => {
    const items = [
      {r: [.46, .42, .58, .67], l: 'ПОРТРЕТ',    f: portrait},
      {r: [.64, .48, .79, .64], l: 'ШКАТУЛКА',   f: box},
      {r: [.02, .44, .13, .58], l: 'ТЕЛЕФОН',     f: bmsg('Гудков нет.')},
      back(() => go('hall'), 'В ПРИХОЖУЮ'),
    ];
    items.unshift({r: [.1, .02, .38, .84], l: 'ШТОРА', f: curtain});
    return items;
  },
  kitchen: () => [
    {r: [.49, .41, .62, .55], l: 'РАДИО', f: () => act(async () => {
      play('radio', {vol: .7, dur: 5}); play('whispers', {vol: .22, dur: 5, fade: 1.5}); await wait(1500);
      msg('Только шум. Но в шуме — будто голоса.'); await wait(3800);
    })},
    {r: [.64, .24, .71, .37], l: 'КЛЮЧИК', f: () => act(async () => {
      if (S.boxKey) { msg('Гвоздик. Ключа уже нет.'); await wait(1600); return; }
      S.boxKey = true; S.phase = Math.max(S.phase, 3); play('key_unlock', {vol: .3, dur: .5}); msg('Маленький ключик. Наверное, от шкатулки.'); obj('Открыть шкатулку в гостиной'); await wait(2500);
    })},
    {r: [.85, .25, .96, .47], l: 'КАЛЕНДАРЬ', f: bmsg('Последняя отметка — 13 сентября.')},
    {r: [.6, .58, .92, .9],   l: 'ЧАШКИ',    f: bmsg('Две чашки. Чай в одной ещё тёплый.')},
    {r: [.02, .35, .26, .66], l: 'ПЛИТА',     f: bmsg('Чайник ещё не остыл.')},
    back(() => go('hall'), 'В ПРИХОЖУЮ'),
  ],
  bedroom: () => [
    {r: [.66, .14, .98, .98], l: S.phase >= 6 ? 'СПРЯТАТЬСЯ В ШКАФ' : 'ШКАФ', f: S.phase >= 6 ? hideInWardrobe : bmsg('Пахнет нафталином. Дверца приоткрыта изнутри.')},
    {r: [.47, .19, .57, .33], l: 'ИКОНА', f: bmsg('Лампадка горит. Кто её зажёг?')},
    {r: [.2, .55, .56, .86],  l: S.phase >= 6 ? 'ПОД КРОВАТЬ' : 'КРОВАТЬ', f: bmsg(S.phase >= 6 ? 'Не спрятаться.' : 'Нетронутая постель. На подушке — вмятина, как после головы.')},
    back(() => go('hall'), 'В ПРИХОЖУЮ'),
  ],
};
function bmsg_hs(x0, y0, x1, y1, l, t) { return {r: [x0, y0, x1, y1], l, f: bmsg(t)}; }
function barStart(ms) { const m=$('meter'),b=m.querySelector('i'); m.style.display='block'; b.style.width='0%'; b.style.transition='none'; void b.offsetWidth; b.style.transition='width '+ms+'ms linear'; b.style.width='100%'; }
function barStop() { $('meter').style.display='none'; $('meter').querySelector('i').style.width='0%'; }

// ---------- scenes ----------
async function enterFlat() {
  S.busy = true; setHS([]); play('key_unlock', {vol: .9});
  black(1, .7); await wait(900);
  loop('clock', .3, {fade: 2}); loop('amb_apartment', .5, {fade: 2});
  S.room = 'hall'; unloop('stairwell', 2);
  bg('hall', {fade: 0}); FL.mode = 'beam'; FL.r = .38; FL.d = .92; FL.flick = .5;
  black(0, .8); await wait(1100); obj('ПРИХОЖАЯ');
  await say('g_in1', ['— Костенька... где ты? Бабушка пришла.'], {vol: .7, pan: .35, lp: 2800, fade: .2});
  await wait(500); S.busy = false; refresh();
}

async function curtain() {
  if (!(S.phase >= 3 && !S.feetSeen)) return bmsg('Просто штора. За ней — тёмное окно.')();
  await act(async () => {
    S.feetSeen = true; S.phase = Math.max(S.phase, 3); FL.flick = 1.2;
    bg('living_feet', {fade: .6}); await wait(700);
    play('sting_small', {vol: .9}); shake(400); await wait(900);
    play('breathing', {vol: .9, pan: -.45, dur: 5}); await wait(5200);
    FL.flick = .4; bg('living', {fade: .5}); await wait(600);
  });
}

async function portrait() {
  await act(async () => {
    black(1, .25); await wait(320);
    bg('portrait', {fade: 0, fit: 'contain'}); FL.mode = 'flat'; FL.flat = .0;
    black(0, .3); await wait(1500 + Math.random() * 800);
    bg('portrait_dead', {fade: .35}); play('sting_small', {vol: .75}); await wait(2200);
    black(1, .4); await wait(450);
    bg(roomImg('living'), {fade: 0}); FL.mode = 'beam'; FL.r = .34; FL.d = .95; black(0, .5); await wait(700);
  });
}

async function box() {
  await act(async () => {
    if (!S.boxKey) { msg('Закрыта. Нужен ключ.'); await wait(1800); return; }
    if (S.docs) { msg('Пусто. Документы уже у вас.'); await wait(1800); return; }
    black(1, .25); await wait(320);
    bg('docs_box', {fade: 0, fit: 'contain'}); FL.mode = 'flat'; FL.flat = .0;
    black(0, .3); await wait(800);
    msg('Документы. Паспорт, свидетельства.'); play('key_unlock', {vol: .4, dur: .5}); await wait(600);
    barStart(1800); await wait(1800); barStop();
    S.docs = true; S.phase = Math.max(S.phase, 4); obj('Выходить из квартиры');
    black(1, .5); await wait(550); bg(roomImg('living'), {fade: 0}); FL.mode = 'beam'; FL.r = .34; FL.d = .95;
    black(0, .5); await wait(700);
    play('g_in2', {vol: .75, pan: .2, lp: 2800}); sub('— Я слышу, как ты дышишь.', true); await wait(2400); subOff();
  });
}

async function mirrorScene() {
  await act(async () => {
    loop('music_box', .4, {fade: 2}); unloop('clock', 1.5);
    comp('mirror', true); place($('mglass'), MBOX);
    bg('hall_open', {fade: 0}); play('sting_small', {vol: .5});
    msg('Это просто зеркало.', 2500); await wait(1500); snapshot(); await wait(2500);
    $('mgran').style.opacity = 1; await wait(2200);
    play('g_see', {vol: .9, pan: .15, lp: 2800}); sub('— Вот теперь я тебя вижу.', true);
    await wait(3200); subOff(); snapshot();
    await wait(800); $('mgran').style.opacity = 0; await wait(900);
    black(1, .15); unloop('music_box', .2); await wait(1600);
    comp('mirror', false); bg('hall', {fade: 0}); S.mirrorDone = true; S.room = 'hall'; S.phase = 5;
    loop('drone', .3, {fade: 2}); black(0, .6); await wait(1400);
    play('knock_slow', {vol: 1.1, pan: -.55, dur: 6}); await wait(3200);
    await say('g_door1', ['— Костенька? Это бабушка. Открой, внучек.'], {vol: 1, lp: 1500, pan: -.5});
    obj('Уйти. Не открывать.');
  });
}

async function frontDoor() {
  if (!S.docs) { await act(async () => { msg('Тётя Люда просила взять документы. Они в шкатулке в гостиной.'); await wait(3000); }); return; }
  if (S.phase >= 6) { await act(async () => { msg('Не открывать. Только не открывать.'); await wait(2200); }); return; }
  await act(async () => {
    black(1, .3); await wait(400);
    FL.mode = 'flat'; FL.flat = .05; unloop('drone', 1);
    if (!S.peep) {
      S.peep = 1;
      bg('peephole_gran', {fade: 0, fit: 'contain'}); black(0, .4); await wait(800);
      msg('Глазок.', 1800); zoom(1.12, 9); await wait(2600);
      await say('g_door2', ['— Костя, ну открой... Холодно мне тут.', ' Холодно.'], {vol: .95, lp: 1500});
      await wait(1200);
      play('knock_fast', {vol: 1.25, dur: 5}); shake(900); flicker(800, 4);
      await say('g_door3', ['— Я знаю, что ты дома.', ' Открой бабушке.', ' Открой!'], {vol: 1.1, lp: 1700});
      black(1, .2); await wait(500); bg('hall', {fade: 0}); FL.mode = 'beam'; FL.flick = .9; loop('drone', .35, {fade: 1});
      black(0, .5); await wait(2500);
      msg('Тихо. Она перестала стучать.', 3000); await wait(3000);
    } else {
      bg('peephole_empty', {fade: 0, fit: 'contain'}); black(0, .4); await wait(900);
      zoom(1.08, 6); await wait(3200);
      msg('Никого.', 1800); await wait(2300);
      play('steps_slow', {vol: .9, pan: .55, dur: 5}); await wait(2600);
      play('g_call', {vol: 1.1, pan: .85}); sub('— Костя...', true); await wait(1700); subOff();
      black(1, .15); await wait(400);
      bg('hall', {fade: 0}); FL.mode = 'beam'; FL.r = .3; FL.d = .97; FL.flick = 1.6; loop('tension', .45, {fade: 1});
      S.phase = 6; obj('Спрятаться');
      black(0, .4); await wait(700);
      msg('Она уже в квартире.', 3000); await wait(1500);
    }
  });
}

async function hideInWardrobe() {
  S.busy = true; setHS([]); S.phase = 7;
  play('wardrobe', {vol: 1, dur: 2}); black(1, .35); await wait(450);
  bg('wardrobe_view', {fade: 0}); FL.mode = 'flat'; FL.flat = .08; FL.flick = 0;
  unloop('tension', 2); black(0, .4); await wait(1200);
  msg('Не издавай ни звука.', 3500); await wait(2800);
  play('steps_slow', {vol: .8, dur: 7, fade: 1}); await wait(2500);
  bg('wardrobe_gran', {fade: 2.5}); await wait(3000);
  play('g_quiet', {vol: .85}); sub('— Тшшш...', true); await wait(1600); subOff();
  // listen: if the player makes noise, she hears
  let heard = false;
  if (S.an) $('meter').style.display = 'block';
  for (let i = 0; i < 70; i++) {
    const lv = micLevel(); if (S.an) $('meter').querySelector('i').style.width = Math.min(100, lv * 400) + '%';
    if (lv > .22) { heard = true; break; }
    await wait(100);
  }
  $('meter').style.display = 'none';
  if (!heard) {
    bg('wardrobe_view', {fade: 3}); play('steps_slow', {vol: .4, pan: -.4, dur: 4, fade: .5}); await wait(4500);
    msg('Ушла?..', 2500); await wait(4200);
  }
  play('g_found', {vol: 1.3, pan: .9}); sub('— Вот ты где.', true); await wait(heard ? 700 : 1100); subOff();
  bg('wardrobe_face', {fade: 0}); play('sting_big', {vol: 1}); shake(700);
  await wait(2300);
  black(1, .1); hush(.1); await wait(300);
  ending();
}

async function ending() {
  if (S.endStarted) return; S.endStarted = true;
  S.busy = true; setHS([]); if (!S.photo) snapshot();
  $('sub').style.opacity = $('msg').style.opacity = $('lbl').style.opacity = $('obj').style.opacity = 0;
  black(1, .1); await wait(3500);
  await center('<span style="font-size:.7em;letter-spacing:.4em;color:#8a8275">три дня спустя</span>', 3000);
  comp('mirror', false); $('L0').style.opacity = $('L1').style.opacity = 0;
  comp('endc', true); place($('eglass'), EBOX); FL.mode = 'flat'; FL.flat = .1;
  if (S.photo) Object.assign($('eglass').style, {backgroundImage: 'url(' + S.photo + ')', backgroundSize: 'cover', backgroundPosition: 'center 30%'});
  else { const c = document.createElement('canvas'); silhouette(c, 240, 400); Object.assign($('eglass').style, {backgroundImage: 'url(' + c.toDataURL() + ')', backgroundSize: 'cover'}); }
  loop('clock', .3, {fade: 2}); black(0, 3); await wait(3500);
  await say('v_aunt_end', [
    '— Костя? Костя, ты где? Ты третий день трубку не берёшь...',
    ' Я приехала к бабушке на квартиру.',
    ' Тут все зеркала открыты...',
    ' Костя... а почему на столе стоит твоя фотография?'
  ], {vol: 1, lp: 3200, hp: 350, fade: .3});
  unloop('clock', .1); await wait(3200);
  play('g_call', {vol: 1.2, pan: -.85}); sub('— Костя...', true); await wait(1300); subOff();
  comp('endc', false); bg('jumpscare_face', {fade: 0}); FL.mode = 'flat'; FL.flat = 0;
  play('sting_big', {vol: 1}); shake(800); await wait(1300);
  black(1, .05); hush(.2); await wait(2500);
  document.title = 'Она ещё дома';
  $('center').innerHTML = '<b>СОРОК ДНЕЙ</b><br><span style="font-size:.5em;letter-spacing:.3em;color:#6d665b">конец</span>';
  $('center').style.opacity = 1; loop('music_box', .3, {fade: 4});
}

// ---------- title / boot ----------
async function boot() {
  FL.mode = 'dark'; $('obj').style.opacity = 0; $('black').style.opacity = 1;
  $('title').style.display = 'flex'; $('title').style.opacity = 1;
  $('go').style.cursor = 'none';
  // preload images
  ['ext_building','stair_door','hall','hall_open','living','living_feet','kitchen','bedroom',
   'portrait','portrait_dead','docs_box','paper','peephole_empty','peephole_gran',
   'wardrobe_view','wardrobe_gran','wardrobe_face','jumpscare_face'].forEach(n => {
     const i = new Image(); i.src = 'assets/img/' + n + '.jpg';
  });
  await loadAudio();
  $('go').textContent = 'НАЧАТЬ';
  await new Promise(r => { $('go').onclick = () => { $('go').onclick = null; r(); }; });
  $('title').style.transition = 'opacity 1.5s'; $('title').style.opacity = 0;
  setTimeout(() => $('title').style.display = 'none', 1700);
  try { AC.resume(); } catch (e) {}
  await askMedia();
  await wait(700);
  FL.mode = 'flat'; FL.flat = .07;
  bg('ext_building', {fade: 0}); black(0, 2); await wait(2600);
  await say('v_aunt', [
    '— Костя, привет. Ключ под ковриком.',
    ' В подъезде света нет — пробки выбило.',
    ' Документы в серванте, в шкатулке.',
    ' И... зеркала не открывай, ладно?',
    ' Сорок дней ещё не прошло.',
    ' Это пока ещё её дом.',
    ' Забери документы — и сразу уходи.'
  ], {vol: .92, lp: 3200, hp: 350, fade: .2});
  await wait(700);
  msg('Нужно забрать документы у бабушки.', 4000); await wait(4200);
  loop('stairwell', .8, {fade: .5}); FL.mode = 'beam'; FL.r = .36; FL.d = .95; FL.flick = .7;
  bg('stair_door', {fade: 1.2}); await wait(1500);
  S.room = 'stair'; obj('ПОДЪЕЗД'); S.busy = false; refresh();
}

boot().catch(e => console.error('boot', e));

