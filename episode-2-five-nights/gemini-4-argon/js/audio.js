/* ==========================================================================
   NIGHT SHIFT AT PUMPKIN PETE'S — SPATIAL HORROR AUDIO ENGINE
   Uses generated ElevenLabs SFX, ElevenLabs v3 Voice, generated music + WebAudio
   ========================================================================== */

class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.activeLoops = {};
    this.phoneAudio = null;
    this.menuAudio = null;
    this.mutedCall = false;
    this.initialized = false;

    this.soundList = {
      ambience_office: "assets/audio/ambience_office.mp3",
      ambience_late_night: "assets/audio/ambience_late_night.mp3",
      door_slam: "assets/audio/door_slam.mp3",
      door_open: "assets/audio/door_open.mp3",
      hall_light: "assets/audio/hall_light.mp3",
      cam_toggle: "assets/audio/cam_toggle.mp3",
      cam_blip: "assets/audio/cam_blip.mp3",
      cam_reboot: "assets/audio/cam_reboot.mp3",
      audio_decoy: "assets/audio/audio_decoy.mp3",
      poster_honk: "assets/audio/poster_honk.mp3",
      fan_toggle: "assets/audio/fan_toggle.mp3",
      alarm_overheat: "assets/audio/alarm_overheat.mp3",
      music_box_wind: "assets/audio/music_box_wind.mp3",
      music_box_melody: "assets/audio/music_box_melody.mp3",
      footsteps_heavy: "assets/audio/footsteps_heavy.mp3",
      burlap_scrape: "assets/audio/burlap_scrape.mp3",
      hexa_sprint: "assets/audio/hexa_sprint.mp3",
      grimshaw_caw: "assets/audio/grimshaw_caw.mp3",
      grimshaw_sprint: "assets/audio/grimshaw_sprint.mp3",
      vent_crawl: "assets/audio/vent_crawl.mp3",
      vent_slam: "assets/audio/vent_slam.mp3",
      flash_beacon: "assets/audio/flash_beacon.mp3",
      taser_shock: "assets/audio/taser_shock.mp3",
      heartbeat_panic: "assets/audio/heartbeat_panic.mp3",
      clockwork_tick: "assets/audio/clockwork_tick.mp3",
      salvage_servo_tune: "assets/audio/salvage_servo_tune.mp3",
      door_bang: "assets/audio/door_bang.mp3",
      pete_laugh: "assets/audio/pete_laugh.mp3",
      power_down: "assets/audio/power_down.mp3",
      jumpscare_scream: "assets/audio/jumpscare_scream.mp3",
      jumpscare_silas_scream: "assets/audio/jumpscare_silas_scream.mp3",
      chime_6am: "assets/audio/chime_6am.mp3",
      phone_guy_night1: "assets/audio/phone_guy_night1.mp3",
      phone_guy_night2: "assets/audio/phone_guy_night2.mp3",
      phone_guy_night3: "assets/audio/phone_guy_night3.mp3",
      phone_guy_night4: "assets/audio/phone_guy_night4.mp3",
      phone_guy_night5: "assets/audio/phone_guy_night5.mp3",
      phone_guy_night6: "assets/audio/phone_guy_night6.mp3",
      voice_pete_whisper: "assets/audio/voice_pete_whisper.mp3",
      voice_hexa_whisper: "assets/audio/voice_hexa_whisper.mp3",
      voice_stitch_whisper: "assets/audio/voice_stitch_whisper.mp3",
      voice_grimshaw_whisper: "assets/audio/voice_grimshaw_whisper.mp3",
      voice_silas_whisper: "assets/audio/voice_silas_whisper.mp3",
      taunt_pete_1: "assets/audio/taunt_pete_1.mp3",
      taunt_pete_2: "assets/audio/taunt_pete_2.mp3",
      taunt_stitch_1: "assets/audio/taunt_stitch_1.mp3",
      taunt_stitch_2: "assets/audio/taunt_stitch_2.mp3",
      taunt_hexa_1: "assets/audio/taunt_hexa_1.mp3",
      taunt_hexa_2: "assets/audio/taunt_hexa_2.mp3",
      taunt_grimshaw_1: "assets/audio/taunt_grimshaw_1.mp3",
      taunt_grimshaw_2: "assets/audio/taunt_grimshaw_2.mp3",
      taunt_silas_1: "assets/audio/taunt_silas_1.mp3",
      taunt_silas_2: "assets/audio/taunt_silas_2.mp3",
      salvage_briefing: "assets/audio/salvage_briefing.mp3",
      salvage_complete: "assets/audio/salvage_complete.mp3",
      epilogue_voice_1: "assets/audio/epilogue_voice_1.mp3",
      epilogue_voice_2: "assets/audio/epilogue_voice_2.mp3",
      epilogue_voice_3: "assets/audio/epilogue_voice_3.mp3",
      epilogue_voice_4: "assets/audio/epilogue_voice_4.mp3",
      rotary_phone_ring: "assets/audio/rotary_phone_ring.mp3",
      vhs_tape_insert: "assets/audio/vhs_tape_insert.mp3",
      window_glass_scrape: "assets/audio/window_glass_scrape.mp3",
      anomaly_decode_chime: "assets/audio/anomaly_decode_chime.mp3",
      vhs_1987_log_1: "assets/audio/vhs_1987_log_1.mp3",
      vhs_1987_log_2: "assets/audio/vhs_1987_log_2.mp3",
      vhs_1987_log_3: "assets/audio/vhs_1987_log_3.mp3",
      vhs_1987_log_4: "assets/audio/vhs_1987_log_4.mp3",
      vhs_1987_log_5: "assets/audio/vhs_1987_log_5.mp3",
      vhs_1987_log_6: "assets/audio/vhs_1987_log_6.mp3",
      ghost_call_1: "assets/audio/ghost_call_1.mp3",
      ghost_call_2: "assets/audio/ghost_call_2.mp3",
      bgm_menu: "assets/audio/bgm_menu.mp3",
      bgm_victory: "assets/audio/bgm_victory.mp3",
      bgm_extras: "assets/audio/bgm_extras.mp3",
      bgm_custom_night: "assets/audio/bgm_custom_night.mp3",
      bgm_credits: "assets/audio/bgm_credits.mp3",
      bgm_night5_boss: "assets/audio/bgm_night5_boss.mp3",
      bgm_epilogue: "assets/audio/bgm_epilogue.mp3",
      bgm_salvage_workshop: "assets/audio/bgm_salvage_workshop.mp3",
      bgm_overtime_finale: "assets/audio/bgm_overtime_finale.mp3",
      bgm_vhs_1987: "assets/audio/bgm_vhs_1987.mp3",
    };
  }

  async init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (_) {}
    }
    if (!this.initialized) {
      this.initialized = true;
      this.preloadAll();
    }
  }

  async preloadAll() {
    const entries = Object.entries(this.soundList);
    await Promise.allSettled(
      entries.map(async ([key, url]) => {
        try {
          const resp = await fetch(url);
          if (!resp.ok) return;
          const arr = await resp.arrayBuffer();
          const buf = await this.ctx.decodeAudioData(arr);
          this.buffers[key] = buf;
        } catch (_) {
          // Graceful fallback if an asset is still generating
        }
      })
    );
  }

  /**
   * Play a one-shot sound effect with optional stereo pan (-1 left to +1 right) and volume.
   */
  play(name, { volume = 0.8, pan = 0.0, rate = 1.0 } = {}) {
    this.init();
    if (!this.ctx) return null;

    const buf = this.buffers[name];
    if (buf) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = rate;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        if (this.ctx.createStereoPanner) {
          const panner = this.ctx.createStereoPanner();
          panner.pan.value = Math.max(-1, Math.min(1, pan));
          src.connect(panner);
          panner.connect(gain);
        } else {
          src.connect(gain);
        }
        gain.connect(this.ctx.destination);
        src.start(0);
        return src;
      } catch (_) {}
    }

    this.playProceduralFallback(name, volume, pan);
    return null;
  }

  /**
   * Start or update a named looping sound.
   */
  startLoop(name, { volume = 0.45, pan = 0.0 } = {}) {
    this.init();
    if (!this.ctx) return;
    if (this.activeLoops[name]) {
      this.activeLoops[name].gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.08);
      return;
    }

    const buf = this.buffers[name];
    if (buf) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        if (this.ctx.createStereoPanner) {
          const panner = this.ctx.createStereoPanner();
          panner.pan.value = pan;
          src.connect(panner);
          panner.connect(gain);
        } else {
          src.connect(gain);
        }
        gain.connect(this.ctx.destination);
        src.start(0);
        this.activeLoops[name] = { src, gain };
        return;
      } catch (_) {}
    }
  }

  stopLoop(name) {
    const item = this.activeLoops[name];
    if (item) {
      try {
        item.src.stop();
      } catch (_) {}
      delete this.activeLoops[name];
    }
  }

  stopAllLoops() {
    Object.keys(this.activeLoops).forEach((k) => this.stopLoop(k));
    this.stopPhoneCall();
  }

  startMenuMusic() {
    this.stopLoop("bgm_victory");
    this.stopLoop("bgm_extras");
    this.startLoop("bgm_menu", { volume: 0.38, pan: 0 });
  }

  stopMenuMusic() {
    this.stopLoop("bgm_menu");
    this.stopLoop("bgm_extras");
  }

  startPhoneCall(nightNum = 1, onEnded = null) {
    this.stopPhoneCall();
    this.mutedCall = false;
    this.init();
    const clampedNight = Math.max(1, Math.min(6, nightNum || 1));
    const key = `phone_guy_night${clampedNight}`;
    const fallbackKey = "phone_guy_night1";
    const buf = this.buffers[key] || this.buffers[fallbackKey];

    if (buf && this.ctx) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const gain = this.ctx.createGain();
      gain.gain.value = 0.85;
      src.connect(gain);
      gain.connect(this.ctx.destination);
      src.onended = () => {
        this.phoneAudio = null;
        if (onEnded) onEnded();
      };
      src.start(0);
      this.phoneAudio = { src, gain };
    } else {
      const url = this.soundList[key] || this.soundList[fallbackKey];
      const audio = new Audio(url);
      audio.volume = 0.85;
      audio.onended = () => {
        this.phoneAudio = null;
        if (onEnded) onEnded();
      };
      audio.play().catch(() => {});
      this.phoneAudio = { el: audio };
    }
  }

  stopPhoneCall() {
    if (!this.phoneAudio) return;
    try {
      if (this.phoneAudio.src) this.phoneAudio.src.stop();
      if (this.phoneAudio.el) {
        this.phoneAudio.el.pause();
        this.phoneAudio.el.currentTime = 0;
      }
    } catch (_) {}
    this.phoneAudio = null;
    this.mutedCall = true;
  }

  /**
   * Classic FNaF dissonant window-reveal horror stinger!
   */
  playWindowStinger(pan = 0) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [110, 116.54, 233.08, 311.13, 440, 466.16];
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.32, now);
    master.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = pan;
      master.connect(p);
      p.connect(this.ctx.destination);
    } else {
      master.connect(this.ctx.destination);
    }

    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 1.4);
    });
  }

  /**
   * Poster Nose Honk Easter Egg!
   */
  playHonk() {
    this.init();
    if (this.buffers["poster_honk"]) {
      this.play("poster_honk", { volume: 0.85, pan: 0 });
      return;
    }
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(690, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.22);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Harsh mechanical error buzz when door is jammed!
   */
  playJammedBuzz(pan = 0) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(92, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playProceduralFallback(name, volume = 0.5, pan = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (name === "cam_blip" || name === "cam_toggle" || name === "cam_reboot") {
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (name === "door_slam" || name === "door_bang" || name === "vent_slam") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.35);
      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (name === "flash_beacon" || name === "taser_shock") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (name === "jumpscare_scream" || name === "jumpscare_silas_scream") {
      this.playWindowStinger(0);
    }
  }
}

window.audioEngine = new HorrorAudioEngine();
