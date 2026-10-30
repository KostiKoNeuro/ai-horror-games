/* Web Audio wrapper: decoded buffers, looping beds with fades, positional one-shots (stereo pan + muffling). */
(function () {
  'use strict';
  const A = {
    ctx: null, buf: {}, loops: {}, master: null,
    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -10; comp.ratio.value = 4;
      this.master.connect(comp); comp.connect(this.ctx.destination);
    },
    async load(name, url) {
      const r = await fetch(url);
      const ab = await r.arrayBuffer();
      this.buf[name] = await this.ctx.decodeAudioData(ab);
    },
    // one-shot. opts: vol, pan (-1..1), rate, muffle (0..1 lowpass amount), delay, offset
    play(name, opts) {
      const b = this.buf[name];
      if (!b || !this.ctx) return null;
      opts = opts || {};
      const src = this.ctx.createBufferSource();
      src.buffer = b;
      src.playbackRate.value = opts.rate || 1;
      let node = src;
      if (opts.muffle) {
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 18000 * Math.pow(1 - opts.muffle, 2.2) + 350;
        node.connect(f); node = f;
      }
      const g = this.ctx.createGain();
      g.gain.value = opts.vol == null ? 1 : opts.vol;
      node.connect(g); node = g;
      if (opts.pan) {
        const p = this.ctx.createStereoPanner();
        p.pan.value = Math.max(-1, Math.min(1, opts.pan));
        node.connect(p); node = p;
      }
      node.connect(this.master);
      src.start(this.ctx.currentTime + (opts.delay || 0), opts.offset || 0);
      return { src: src, gain: g };
    },
    // persistent loop that can be faded
    loop(name, vol, opts) {
      opts = opts || {};
      if (this.loops[name]) { this.fade(name, vol, opts.fade || 0.3); return this.loops[name]; }
      const b = this.buf[name];
      if (!b || !this.ctx) return null;
      const src = this.ctx.createBufferSource();
      src.buffer = b; src.loop = true;
      if (opts.rate) src.playbackRate.value = opts.rate;
      const g = this.ctx.createGain();
      g.gain.value = 0;
      let node = src;
      if (opts.pan) {
        const p = this.ctx.createStereoPanner(); p.pan.value = opts.pan;
        node.connect(p); node = p;
      }
      node.connect(g); g.connect(this.master);
      src.start(0, opts.offset || 0);
      const l = { src: src, gain: g };
      this.loops[name] = l;
      g.gain.setTargetAtTime(vol, this.ctx.currentTime, (opts.fade || 0.3) / 3);
      return l;
    },
    fade(name, vol, time) {
      const l = this.loops[name];
      if (!l) return;
      const now = this.ctx.currentTime;
      l.gain.gain.cancelScheduledValues(now);
      l.gain.gain.setValueAtTime(l.gain.gain.value, now);
      l.gain.gain.setTargetAtTime(vol, now, Math.max(0.01, (time == null ? 0.3 : time) / 3));
    },
    stop(name, time) {
      const l = this.loops[name];
      if (!l) return;
      delete this.loops[name];
      const now = this.ctx.currentTime;
      const t = time == null ? 0.2 : time;
      l.gain.gain.cancelScheduledValues(now);
      l.gain.gain.setValueAtTime(l.gain.gain.value, now);
      l.gain.gain.linearRampToValueAtTime(0, now + t);
      try { l.src.stop(now + t + 0.05); } catch (e) { /* already stopped */ }
    },
    stopAll(time) { Object.keys(this.loops).forEach(k => this.stop(k, time)); }
  };
  window.AUD = A;
})();
