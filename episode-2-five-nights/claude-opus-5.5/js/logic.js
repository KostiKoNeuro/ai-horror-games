/* Night Shift at Pumpkin Pete's - pure game logic (no DOM). Runs in the browser and in node (tools/sim.js). */
(function (root) {
  'use strict';

  const HOUR_LEN = 45;                 // real seconds per in-game hour
  const NIGHT_LEN = HOUR_LEN * 6;      // 12 AM -> 6 AM = 4.5 minutes
  const DRAIN = 0.1;                   // % power per second per usage bar

  // AI level (0-20) per hour: 12, 1, 2, 3, 4, 5 AM
  const LEVELS = { P: [3, 5, 7, 10, 12, 15], H: [2, 4, 7, 9, 12, 15], S: [3, 5, 7, 9, 12, 14] };
  const INTERVAL = { P: 5.0, H: 4.6, S: 5.1 };

  const ROOMS = ['stage', 'dining', 'patch', 'westhall', 'westcorner', 'backstage', 'easthall', 'eastcorner', 'restrooms', 'closet'];

  // Pumpkin Pete: slow, heavy, always walks the east route. Freezes while you watch him on camera.
  const PETE_PATH = ['stage', 'dining', 'restrooms', 'easthall', 'eastcorner', 'doorR'];

  // Hollow Hattie: wanders anywhere, either door, can jam the camera feed of the room she is in.
  const HATTIE_GRAPH = {
    stage: ['dining'],
    dining: ['backstage', 'closet', 'westhall', 'easthall'],
    backstage: ['dining', 'closet'],
    closet: ['westhall', 'backstage'],
    westhall: ['westcorner', 'closet', 'dining'],
    westcorner: ['doorL', 'westhall'],
    easthall: ['eastcorner', 'dining'],
    eastcorner: ['doorR', 'easthall'],
    doorL: [], doorR: []
  };
  const DIST = { stage: 4, dining: 3, backstage: 4, closet: 3, westhall: 2, westcorner: 1, easthall: 2, eastcorner: 1, doorL: 0, doorR: 0 };

  // Scraps the Scarecrow: climbs off his post in the Pumpkin Patch when ignored, then sprints down the west hall.

  function Night(opts) {
    opts = opts || {};
    this.rng = opts.rng || Math.random;
    this.t = 0;
    this.power = 100;
    this.drain = opts.drain || DRAIN;
    this.events = [];
    this.doorL = false; this.doorR = false;
    this.lightL = false; this.lightR = false;
    this.tablet = false; this.cam = 'stage';
    this.won = false;
    this.attacker = null; this.attackDelay = 0;
    this.powerOut = false; this.po = null;
    this.lastHour = 0;
    this.lastPatchView = 0;
    this.P = { room: 'stage', tick: 2 + this.rng() * 4, doorTimer: 0, breathT: 0, visit: 0 };
    this.H = { room: 'stage', tick: 2 + this.rng() * 4, doorTimer: 0, whisperT: 0, hidden: false, visit: 0 };
    this.S = { stage: 0, tick: 2 + this.rng() * 4, runTimer: 0, sprint: 0, bangs: 0 };
  }

  const N = Night.prototype;

  N.emit = function (type, data) { const e = data || {}; e.type = type; this.events.push(e); };
  N.hour = function () { return Math.min(5, Math.floor(this.t / HOUR_LEN)); };
  N.clockHour = function () { const h = Math.min(6, Math.floor(this.t / HOUR_LEN)); return h === 0 ? 12 : h; };
  N.usage = function () {
    if (this.powerOut) return 0;
    return 1 + (this.doorL ? 1 : 0) + (this.doorR ? 1 : 0) + ((this.lightL || this.lightR) ? 1 : 0) + (this.tablet ? 1 : 0);
  };
  N.watching = function () { return this.tablet && !this.powerOut ? this.cam : null; };
  N.occupied = function (room, except) {
    if (room === 'stage') return false;
    if (except !== 'P' && this.P.room === room) return true;
    if (except !== 'H' && this.H.room === room) return true;
    return false;
  };
  N.roll = function (id, bonus) { return this.rng() * 20 < LEVELS[id][this.hour()] + (bonus || 0); };
  N.pick = function (arr) { return arr[Math.floor(this.rng() * arr.length)]; };

  N.moveTo = function (who, to) {
    const a = this[who];
    if (this.occupied(to, who)) to = 'stage';
    const from = a.room;
    a.room = to;
    if (to === 'doorL' || to === 'doorR') a.visit++;
    this.emit('move', { who: who, from: from, to: to });
  };

  N.attack = function (who) {
    if (this.attacker || this.won) return;
    this.attacker = who;
    this.attackDelay = this.tablet ? 0.7 : 0.15;
    this.emit('attack', { who: who });
  };

  // ---- player actions --------------------------------------------------------------------------------------
  N.toggleDoor = function (side) {
    if (this.powerOut || this.attacker) return false;
    if (side < 0) this.doorL = !this.doorL; else this.doorR = !this.doorR;
    this.emit('door', { side: side, closed: side < 0 ? this.doorL : this.doorR });
    return true;
  };
  N.setLight = function (side, on) {
    if (this.powerOut || this.attacker) return false;
    if (side < 0) { this.lightL = on; if (on) this.lightR = false; } else { this.lightR = on; if (on) this.lightL = false; }
    return true;
  };
  N.setTablet = function (up) {
    if (up && (this.powerOut || this.attacker)) return false;
    this.tablet = up;
    if (up) { this.lightL = false; this.lightR = false; }
    return true;
  };
  N.setCam = function (room) { if (ROOMS.indexOf(room) >= 0) this.cam = room; };

  // ---- simulation ------------------------------------------------------------------------------------------
  N.update = function (dt) {
    if (this.won) return;
    if (this.attacker) { this.attackDelay -= dt; return; }
    this.t += dt;
    if (this.t >= NIGHT_LEN) { this.won = true; this.emit('win'); return; }
    const h = this.hour();
    if (h !== this.lastHour) { this.lastHour = h; this.emit('hour', { hour: h }); }
    if (!this.powerOut) {
      this.power -= this.drain * this.usage() * dt;
      if (this.power <= 0) { this.power = 0; this.cutPower(); }
    }
    if (this.powerOut) { this.updatePowerOut(dt); return; }
    if (this.watching() === 'patch') this.lastPatchView = this.t;
    this.updatePete(dt);
    this.updateHattie(dt);
    this.updateScraps(dt);
  };

  N.updatePete = function (dt) {
    const p = this.P;
    if (p.room === 'doorR') {
      p.doorTimer -= dt; p.breathT -= dt;
      if (p.breathT <= 0) { p.breathT = 4.5 + this.rng() * 3; this.emit('breath', { side: 1 }); }
      if (p.doorTimer <= 0) {
        if (this.doorR) { this.emit('bang', { side: 1, who: 'P' }); this.moveTo('P', this.rng() < 0.6 ? 'easthall' : 'dining'); p.tick = INTERVAL.P; }
        else this.attack('P');
      }
      return;
    }
    p.tick -= dt;
    if (p.tick > 0) return;
    p.tick = INTERVAL.P;
    if (this.watching() === p.room) return;          // he will not move while you watch him
    if (!this.roll('P')) return;
    const next = PETE_PATH[PETE_PATH.indexOf(p.room) + 1];
    if (!next || this.occupied(next, 'P')) return;
    this.moveTo('P', next);
    if (next === 'doorR') { p.doorTimer = Math.max(4, 8.5 - this.hour() * 0.7 + this.rng() * 3); p.breathT = 1.2; }
  };

  N.updateHattie = function (dt) {
    const h = this.H;
    if (h.room === 'doorL' || h.room === 'doorR') {
      const side = h.room === 'doorL' ? -1 : 1;
      h.doorTimer -= dt; h.whisperT -= dt;
      if (h.whisperT <= 0) { h.whisperT = 3.4 + this.rng() * 1.5; this.emit('whisper', { side: side }); }
      if (h.doorTimer <= 0) {
        const closed = side < 0 ? this.doorL : this.doorR;
        if (closed) { this.emit('scrape', { side: side }); this.moveTo('H', this.rng() < 0.5 ? 'dining' : 'backstage'); h.hidden = false; h.tick = INTERVAL.H; }
        else this.attack('H');
      }
      return;
    }
    h.tick -= dt;
    if (h.tick > 0) return;
    h.tick = INTERVAL.H;
    if (!this.roll('H')) return;
    const opts = HATTIE_GRAPH[h.room].filter(r => !this.occupied(r, 'H'));
    if (!opts.length) return;
    let next;
    if (this.rng() < 0.68) {
      const best = Math.min.apply(null, opts.map(r => DIST[r]));
      next = this.pick(opts.filter(r => DIST[r] === best));
    } else next = this.pick(opts);
    this.moveTo('H', next);
    h.hidden = next !== 'stage' && next !== 'dining' && this.rng() < 0.5;
    if (next === 'doorL' || next === 'doorR') { h.doorTimer = Math.max(3.2, 7 - this.hour() * 0.5 + this.rng() * 2.5); h.whisperT = 0.4; }
  };

  N.updateScraps = function (dt) {
    const s = this.S;
    if (s.sprint > 0) {
      s.sprint -= dt;
      if (s.sprint <= 0) {
        if (this.doorL) {
          const dmg = Math.min(10, 2 + 3 * s.bangs);
          s.bangs++;
          this.power = Math.max(0.01, this.power - dmg);
          s.stage = this.rng() < 0.6 ? 0 : 1;
          s.tick = INTERVAL.S + 2;
          this.emit('bang', { side: -1, who: 'S', dmg: dmg });
          this.emit('scraps', { stage: s.stage, reset: true });
        } else this.attack('S');
      }
      return;
    }
    if (s.stage >= 3) {
      s.runTimer -= dt;
      if (this.watching() === 'westhall' || s.runTimer <= 0) { s.sprint = 2.6; this.emit('sprint'); }
      return;
    }
    if (this.watching() === 'patch') { s.tick = Math.max(s.tick, 1.5 + this.rng() * 2.5); return; }  // watching holds him on his post
    s.tick -= dt;
    if (s.tick > 0) return;
    s.tick = INTERVAL.S;
    const ignored = this.t - this.lastPatchView > 35 ? 5 : 0;     // he hates being ignored
    if (!this.roll('S', ignored)) return;
    s.stage++;
    this.emit('scraps', { stage: s.stage });
    if (s.stage === 3) s.runTimer = Math.max(6, 15 - this.hour() * 1.6);
  };

  N.cutPower = function () {
    this.powerOut = true;
    this.doorL = this.doorR = this.lightL = this.lightR = this.tablet = false;
    this.po = { stage: 0, timer: 3 + this.rng() * 4 };
    this.emit('powerout');
  };

  N.updatePowerOut = function (dt) {
    const po = this.po;
    po.timer -= dt;
    if (po.timer > 0) return;
    if (po.stage === 0) { po.stage = 1; po.timer = 7 + this.rng() * 9; this.emit('musicbox'); }
    else if (po.stage === 1) { po.stage = 2; po.timer = 2 + this.rng() * 3; this.emit('blackout'); }
    else this.attack('P');
  };

  root.PP = { Night: Night, HOUR_LEN: HOUR_LEN, NIGHT_LEN: NIGHT_LEN, ROOMS: ROOMS, LEVELS: LEVELS, DIST: DIST };
})(typeof window !== 'undefined' ? window : globalThis);
