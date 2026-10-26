// ============================================================================
// PROTOCOL: DO NOT LOOK (ПРОТОКОЛ: НЕ СМОТРИ)
// Full-Fledged HRTF 3D Spatial Audio & Procedural Horror Sound Engine v2.0
// ============================================================================

class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.voGain = null;
    this.buffers = {};
    this.bgmSource = null;
    this.currentBGMKey = null;

    // Heartbeat state
    this.heartbeatBPM = 0;
    this.nextHeartbeatTime = 0;

    // Fluorescent hum & window rain state
    this.humGain = null;
    this.rainGain = null;

    // Ringing phone state (Act II)
    this.phoneRingInterval = null;
    this.phoneRingActive = false;

    // Alarm pulse state (Act V)
    this.alarmInterval = null;

    // Microphone analyzer (optional system feature)
    this.micStream = null;
    this.micAnalyser = null;
    this.micData = null;
    this.micLevel = 0;
    this.peakMicLevel = 0;
    this.micEnabled = false;

    this.manifest = {
      // Russian Voices
      vo_intro: "assets/audio/vo_intro.mp3",
      vo_error_door: "assets/audio/vo_error_door.mp3",
      vo_phone_call: "assets/audio/vo_phone_call.mp3",
      vo_whisper_outside: "assets/audio/vo_whisper_outside.mp3",
      vo_whisper_mirror: "assets/audio/vo_whisper_mirror.mp3",
      vo_whisper_dark: "assets/audio/vo_whisper_dark.mp3",
      vo_breaker_whisper: "assets/audio/vo_breaker_whisper.mp3",
      vo_whisper_behind: "assets/audio/vo_whisper_behind.mp3",
      vo_whisper_ear: "assets/audio/vo_whisper_ear.mp3",
      vo_whisper_neck: "assets/audio/vo_whisper_neck.mp3",
      vo_whisper_climax: "assets/audio/vo_whisper_climax.mp3",
      vo_tape_log: "assets/audio/vo_tape_log.mp3",
      vo_closet_scare: "assets/audio/vo_closet_scare.mp3",
      vo_cam5_bath: "assets/audio/vo_cam5_bath.mp3",
      vo_outro: "assets/audio/vo_outro.mp3",

      // English Voices
      vo_intro_en: "assets/audio/vo_intro_en.mp3",
      vo_error_door_en: "assets/audio/vo_error_door_en.mp3",
      vo_phone_call_en: "assets/audio/vo_phone_call_en.mp3",
      vo_whisper_outside_en: "assets/audio/vo_whisper_outside_en.mp3",
      vo_whisper_behind_en: "assets/audio/vo_whisper_behind_en.mp3",
      vo_whisper_neck_en: "assets/audio/vo_whisper_neck_en.mp3",
      vo_tape_log_en: "assets/audio/vo_tape_log_en.mp3",
      vo_closet_scare_en: "assets/audio/vo_closet_scare_en.mp3",
      vo_cam5_bath_en: "assets/audio/vo_cam5_bath_en.mp3",
      vo_outro_en: "assets/audio/vo_outro_en.mp3",

      // SFX
      sfx_door_knock: "assets/audio/sfx_door_knock.mp3",
      sfx_door_slam: "assets/audio/sfx_door_slam.mp3",
      sfx_footsteps_wet: "assets/audio/sfx_footsteps_wet.mp3",
      sfx_jumpscare_shriek: "assets/audio/sfx_jumpscare_shriek.mp3",
      sfx_mirror_sting: "assets/audio/sfx_mirror_sting.mp3",
      sfx_power_down: "assets/audio/sfx_power_down.mp3",
      sfx_breathing_behind: "assets/audio/sfx_breathing_behind.mp3",
      sfx_phone_ring: "assets/audio/sfx_phone_ring.mp3",
      sfx_closet_creak: "assets/audio/sfx_closet_creak.mp3",
      sfx_camera_shutter: "assets/audio/sfx_camera_shutter.mp3",
      sfx_alarm_pulse: "assets/audio/sfx_alarm_pulse.mp3",
      sfx_tape_stop: "assets/audio/sfx_tape_stop.mp3",

      // Music
      bgm_dread: "assets/audio/bgm_dread.mp3",
      bgm_chase: "assets/audio/bgm_chase.mp3",
    };
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -10;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 6;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.2;
    this.compressor.connect(this.ctx.destination);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.96;
    this.masterGain.connect(this.compressor);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.3;
    this.bgmGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.92;
    this.sfxGain.connect(this.masterGain);

    this.voGain = this.ctx.createGain();
    this.voGain.gain.value = 1.05;
    this.voGain.connect(this.masterGain);

    this.startRoomHum();
    this.startWindowRain3D();
    await this.loadAllBuffers();
  }

  async loadAllBuffers() {
    const loadOne = async ([key, url]) => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return;
        const arr = await resp.arrayBuffer();
        if (arr.byteLength > 500) {
          this.buffers[key] = await this.ctx.decodeAudioData(arr);
        }
      } catch (e) {}
    };

    const entries = Object.entries(this.manifest);
    const priorityKeys = new Set(["vo_intro", "vo_intro_en", "bgm_dread"]);
    const priority = entries.filter(([k]) => priorityKeys.has(k));
    const rest = entries.filter(([k]) => !priorityKeys.has(k));

    await Promise.all(priority.map(loadOne));

    // Load remaining buffers in batches of 6 in the background
    (async () => {
      for (let i = 0; i < rest.length; i += 6) {
        await Promise.all(rest.slice(i, i + 6).map(loadOne));
      }
    })();
  }

  async requestMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false },
        video: false,
      });
      await this.init();
      this.micStream = stream;
      const src = this.ctx.createMediaStreamSource(stream);
      this.micAnalyser = this.ctx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      src.connect(this.micAnalyser);
      this.micData = new Uint8Array(this.micAnalyser.frequencyBinCount);
      this.micEnabled = true;
      return true;
    } catch (e) {
      this.micEnabled = false;
      return false;
    }
  }

  updateMicrophoneLevel() {
    if (!this.micEnabled || !this.micAnalyser) return 0;
    this.micAnalyser.getByteFrequencyData(this.micData);
    let sum = 0;
    for (let i = 0; i < this.micData.length; i++) sum += this.micData[i];
    const avg = sum / this.micData.length;
    this.micLevel = Math.min(100, Math.round((avg / 90) * 100));
    if (this.micLevel > this.peakMicLevel) this.peakMicLevel = this.micLevel;
    return this.micLevel;
  }

  updateListener(pos, forward, up) {
    if (!this.ctx) return;
    const l = this.ctx.listener;
    const t = this.ctx.currentTime;
    if (l.positionX) {
      l.positionX.setValueAtTime(pos.x, t);
      l.positionY.setValueAtTime(pos.y, t);
      l.positionZ.setValueAtTime(pos.z, t);
      l.forwardX.setValueAtTime(forward.x, t);
      l.forwardY.setValueAtTime(forward.y, t);
      l.forwardZ.setValueAtTime(forward.z, t);
      l.upX.setValueAtTime(up.x, t);
      l.upY.setValueAtTime(up.y, t);
      l.upZ.setValueAtTime(up.z, t);
    } else if (l.setPosition) {
      l.setPosition(pos.x, pos.y, pos.z);
      l.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }

    if (this.heartbeatBPM > 0 && t >= this.nextHeartbeatTime) {
      this.triggerHeartbeatPulse();
      const interval = 60.0 / Math.max(40, Math.min(175, this.heartbeatBPM));
      this.nextHeartbeatTime = t + interval;
    }
  }

  createHRTFPanner(x, y, z, refDist = 1.2, maxDist = 18) {
    const panner = this.ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = refDist;
    panner.maxDistance = maxDist;
    panner.rolloffFactor = 1.35;
    const t = this.ctx.currentTime;
    if (panner.positionX) {
      panner.positionX.setValueAtTime(x, t);
      panner.positionY.setValueAtTime(y, t);
      panner.positionZ.setValueAtTime(z, t);
    } else {
      panner.setPosition(x, y, z);
    }
    panner.connect(this.sfxGain);
    return panner;
  }

  startBGM(key = "bgm_dread", vol = 0.3) {
    if (!this.ctx) return;
    if (this.currentBGMKey === key && this.bgmSource) return;
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
      } catch (e) {}
      this.bgmSource = null;
    }
    this.currentBGMKey = key;
    this.bgmGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    const buf = this.buffers[key] || this.buffers.bgm_dread;
    if (buf) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(this.bgmGain);
      src.start(0);
      this.bgmSource = src;
    } else {
      this.startProceduralDrone();
    }
  }

  switchToChaseBGM() {
    this.startBGM("bgm_chase", 0.38);
  }

  setBGMVolume(vol, ramp = 1.0) {
    if (!this.ctx || !this.bgmGain) return;
    this.bgmGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + ramp);
  }

  startProceduralDrone() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.value = 46.25;
    osc2.type = "triangle";
    osc2.frequency.value = 49.0;
    filter.type = "lowpass";
    filter.frequency.value = 140;
    g.gain.value = 0.18;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(g);
    g.connect(this.bgmGain);
    osc1.start();
    osc2.start();
  }

  startRoomHum() {
    if (!this.ctx) return;
    const humOsc = this.ctx.createOscillator();
    const humOsc2 = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();
    humOsc.type = "sine";
    humOsc.frequency.value = 60;
    humOsc2.type = "sawtooth";
    humOsc2.frequency.value = 120;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 240;
    this.humGain.gain.value = 0.024;
    humOsc.connect(filter);
    humOsc2.connect(filter);
    filter.connect(this.humGain);
    this.humGain.connect(this.masterGain);
    humOsc.start();
    humOsc2.start();
  }

  // Soft spatial rain pattering against the Study window at (-2.25, 1.6, -1.8)
  startWindowRain3D() {
    if (!this.ctx) return;
    const dur = 4.0;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const nBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const out = nBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      out[i] = (Math.random() * 2 - 1) * (Math.random() > 0.96 ? 1.8 : 0.45);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = nBuf;
    src.loop = true;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1850;
    bp.Q.value = 0.9;
    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0.09;
    const panner = this.createHRTFPanner(-2.25, 1.6, -1.8, 0.8, 7.0);
    src.connect(bp);
    bp.connect(this.rainGain);
    this.rainGain.connect(panner);
    src.start(0);
  }

  setLightsHum(on) {
    if (!this.ctx || !this.humGain) return;
    this.humGain.gain.setTargetAtTime(on ? 0.026 : 0.0, this.ctx.currentTime, 0.05);
  }

  playVoice(key, pos3D = null, volume = 1.0, lang = "ru", onEnded = null) {
    if (!this.ctx) return null;
    const localizedKey =
      lang === "en" && this.buffers[key + "_en"] ? key + "_en" : key;
    const buf = this.buffers[localizedKey] || this.buffers[key];
    if (buf) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain();
      g.gain.value = volume;
      if (pos3D) {
        const panner = this.createHRTFPanner(pos3D.x, pos3D.y, pos3D.z, 0.45, 12);
        src.connect(g);
        g.connect(panner);
      } else {
        src.connect(g);
        g.connect(this.voGain);
      }
      if (onEnded) src.onended = onEnded;
      src.start(0);
      return src;
    } else {
      this.playProceduralWhisper(pos3D);
      if (onEnded) setTimeout(onEnded, 3500);
      return null;
    }
  }

  playSFX(key, pos3D = null, volume = 1.0, playbackRate = 1.0) {
    if (!this.ctx) return;
    const buf = this.buffers[key];
    if (buf) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = playbackRate;
      const g = this.ctx.createGain();
      g.gain.value = volume;
      if (pos3D) {
        const panner = this.createHRTFPanner(pos3D.x, pos3D.y, pos3D.z, 1.2, 20);
        src.connect(g);
        g.connect(panner);
      } else {
        src.connect(g);
        g.connect(this.sfxGain);
      }
      src.start(0);
    }

    if (key === "sfx_door_knock") this.synthDoorKnocks(pos3D);
    if (key === "sfx_door_slam") this.synthDoorSlam(pos3D);
    if (key === "sfx_jumpscare_shriek") this.synthJumpscareImpact();
  }

  // Ringing wall telephone in Hallway (Act II)
  startPhoneRing3D(x, y, z) {
    this.stopPhoneRing3D();
    this.phoneRingActive = true;
    const ringOnce = () => {
      if (!this.phoneRingActive || !this.ctx) return;
      if (this.buffers.sfx_phone_ring) {
        this.playSFX("sfx_phone_ring", { x, y, z }, 0.85);
      }
      // Dual-bell rotary ring transient
      const now = this.ctx.currentTime;
      const panner = this.createHRTFPanner(x, y, z, 1.2, 18);
      for (let b = 0; b < 14; b++) {
        const t = now + b * 0.055;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(b % 2 === 0 ? 1180 : 1480, t);
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.048);
        osc.connect(g);
        g.connect(panner);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    };
    ringOnce();
    this.phoneRingInterval = setInterval(ringOnce, 2800);
  }

  stopPhoneRing3D() {
    this.phoneRingActive = false;
    if (this.phoneRingInterval) {
      clearInterval(this.phoneRingInterval);
      this.phoneRingInterval = null;
    }
  }

  startEmergencyAlarm() {
    this.stopEmergencyAlarm();
    const pulse = () => {
      if (!this.ctx) return;
      if (this.buffers.sfx_alarm_pulse) {
        this.playSFX("sfx_alarm_pulse", { x: 0, y: 2.4, z: 4.5 }, 0.65);
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(290, now + 0.45);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.52);
    };
    pulse();
    this.alarmInterval = setInterval(pulse, 1400);
  }

  stopEmergencyAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  async playBinauralTest() {
    await this.init();
    const now = this.ctx.currentTime;
    this.synthTonePanned(-0.9, 440, 0.35, now);
    this.synthWhisperPan(-0.95, now + 0.1);
    this.synthTonePanned(0.9, 330, 0.35, now + 0.75);
    this.synthWhisperPan(0.95, now + 0.85);
  }

  synthTonePanned(panVal, freq, dur, startTime) {
    const osc = this.ctx.createOscillator();
    const pan = this.ctx.createStereoPanner();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    pan.pan.setValueAtTime(panVal, startTime);
    g.gain.setValueAtTime(0.001, startTime);
    g.gain.exponentialRampToValueAtTime(0.25, startTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    osc.connect(g);
    g.connect(pan);
    pan.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.02);
  }

  synthWhisperPan(panVal, startTime) {
    const bufferSize = this.ctx.sampleRate * 0.5;
    const noiseBuf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1600, startTime);
    bp.Q.value = 3.5;
    const pan = this.ctx.createStereoPanner();
    pan.pan.setValueAtTime(panVal, startTime);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, startTime);
    g.gain.linearRampToValueAtTime(0.2, startTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.48);
    src.connect(bp);
    bp.connect(g);
    g.connect(pan);
    pan.connect(this.masterGain);
    src.start(startTime);
  }

  playProceduralWhisper(pos3D = null) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 1.8;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const noiseBuf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      out[i] = (Math.random() * 2 - 1) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1200, now);
    bp.frequency.linearRampToValueAtTime(2200, now + dur * 0.5);
    bp.frequency.linearRampToValueAtTime(900, now + dur);
    bp.Q.value = 4.0;
    const g = this.ctx.createGain();
    g.gain.value = 0.35;
    src.connect(bp);
    bp.connect(g);
    if (pos3D) {
      const panner = this.createHRTFPanner(pos3D.x, pos3D.y, pos3D.z, 0.3, 10);
      g.connect(panner);
    } else {
      g.connect(this.voGain);
    }
    src.start(now);
  }

  playCreak3D(x, y, z) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const panner = this.createHRTFPanner(x, y, z, 0.5, 10);
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.09 + Math.random() * 0.03;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220 - i * 28, t);
      osc.frequency.exponentialRampToValueAtTime(65, t + 0.08);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
      osc.connect(g);
      g.connect(panner);
      osc.start(t);
      osc.stop(t + 0.09);
    }
  }

  playFootstep(stepIndex) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(stepIndex % 2 === 0 ? 85 : 76, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.09);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playWaterDrip3D(x, y, z) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const panner = this.createHRTFPanner(x, y, z, 0.6, 9);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.045);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(g);
    g.connect(panner);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  synthDoorKnocks(pos3D) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const target = pos3D
      ? this.createHRTFPanner(pos3D.x, pos3D.y, pos3D.z, 1.5, 22)
      : this.sfxGain;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.58;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(115, t);
      osc.frequency.exponentialRampToValueAtTime(34, t + 0.18);
      g.gain.setValueAtTime(0.85, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(g);
      g.connect(target);
      osc.start(t);
      osc.stop(t + 0.24);
    }
  }

  synthDoorSlam(pos3D) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const target = pos3D
      ? this.createHRTFPanner(pos3D.x, pos3D.y, pos3D.z, 1.5, 25)
      : this.sfxGain;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 0.35);
    g.gain.setValueAtTime(1.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(g);
    g.connect(target);
    osc.start(now);
    osc.stop(now + 0.4);

    const bufSize = Math.floor(this.ctx.sampleRate * 0.25);
    const nBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = nBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.22));
    }
    const nSrc = this.ctx.createBufferSource();
    nSrc.buffer = nBuf;
    const ng = this.ctx.createGain();
    ng.gain.value = 0.9;
    nSrc.connect(ng);
    ng.connect(target);
    nSrc.start(now);
  }

  playCameraFlash() {
    if (!this.ctx) return;
    if (this.buffers.sfx_camera_shutter) {
      this.playSFX("sfx_camera_shutter", null, 0.85);
    }
    const now = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
    const nBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = nBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.15));
    }
    const nSrc = this.ctx.createBufferSource();
    nSrc.buffer = nBuf;
    const ng = this.ctx.createGain();
    ng.gain.value = 0.55;
    nSrc.connect(ng);
    ng.connect(this.sfxGain);
    nSrc.start(now);

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(5100, now + 2.2);
    g.gain.setValueAtTime(0.001, now + 0.08);
    g.gain.linearRampToValueAtTime(0.06, now + 0.4);
    g.gain.linearRampToValueAtTime(0.01, now + 2.25);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now + 0.08);
    osc.stop(now + 2.3);
  }

  playPowerOutage() {
    if (!this.ctx) return;
    this.setLightsHum(false);
    if (this.buffers.sfx_power_down) {
      this.playSFX("sfx_power_down", null, 0.9);
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.65);
    g.gain.setValueAtTime(0.7, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.72);
  }

  playMirrorSting() {
    if (!this.ctx) return;
    if (this.buffers.sfx_mirror_sting) {
      this.playSFX("sfx_mirror_sting", null, 0.9);
    }
    const now = this.ctx.currentTime;
    const freqs = [55, 58.27, 116.54, 311.13, 659.25];
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 0.96, now + 1.1);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.18, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 1.2);
    });
  }

  synthJumpscareImpact() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [42, 61, 233, 587, 830, 1244];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = idx < 2 ? "sine" : "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(
        f * (idx % 2 === 0 ? 0.75 : 1.18),
        now + 1.4
      );
      g.gain.setValueAtTime(idx < 2 ? 0.55 : 0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 1.55);
    });
  }

  triggerHeartbeatPulse() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.16].forEach((offset, i) => {
      const t = now + offset;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 58 : 48, t);
      osc.frequency.exponentialRampToValueAtTime(24, t + 0.11);
      const vol = Math.min(
        0.45,
        (this.heartbeatBPM / 150) * (i === 0 ? 0.42 : 0.28)
      );
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  playUIBeep(freq = 880, dur = 0.05) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.07, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  }
}

window.HorrorAudioEngine = HorrorAudioEngine;
