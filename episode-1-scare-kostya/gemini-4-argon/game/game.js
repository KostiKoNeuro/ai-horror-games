// ============================================================================
// PROTOCOL: DO NOT LOOK (ПРОТОКОЛ: НЕ СМОТРИ)
// Full-Fledged 5-Act Horror Director, Multi-Cam Terminal & Telemetry v2.0
// ============================================================================

const I18N = {
  ru: {
    title: "ПРОТОКОЛ: НЕ СМОТРИ",
    subtitle: "СИСТЕМА ТЕСТИРОВАНИЯ ИИ // ОБЪЕКТ: КОСТЯ // КВ. 404",
    calibDesc:
      "Для калибровки бинаурального 3D-звука (HRTF) наденьте наушники. При желании подключите камеру и микрофон для биометрической телеметрии страха — все данные остаются строго на вашем устройстве.",
    btnAudioTest: "🔊 ПРОВЕРИТЬ 3D-ЗВУК (ЛЕВОЕ / ПРАВОЕ УХО)",
    btnLinkBio: "📷 ПОДКЛЮЧИТЬ КАМЕРУ И МИКРОФОН (РЕКОМЕНДУЕТСЯ)",
    bioLinked: "✓ БИОМЕТРИЯ АКТИВНА (КАМЕРА / МИКРОФОН)",
    bioFallback: "✓ АВТОНОМНЫЙ РЕЖИМ АКТИВЕН (БЕЗ КАМЕРЫ)",
    btnStart: "▶ НАЧАТЬ СЕАНС ТЕСТИРОВАНИЯ",
    controlsHint:
      "УПРАВЛЕНИЕ: [WASD] Ходьба | [Мышь] Осмотр | [E] Взаимодействие | [Q] Личное дело / Магнитофон | [F] Фонарик | [ЛКМ / Пробел] Фотовспышка",
    objHeader: "ТЕКУЩАЯ ДИРЕКТИВА",
    obj1: "Осмотрите терминал на столе [E] (или досье [Q]) и отметьте аномалии на 5 камерах",
    obj2_phone: "В коридоре звонит селектор! Идите к входной двери и снимите трубку [E]",
    obj2_peephole: "Посмотрите в дверной глазок входной двери [E]",
    obj2_bath: "Дверь ванной захлопнулась! Откройте дверь ванной комнаты [E]",
    obj2_curtain: "Отодвиньте шторку в ванной [E] и осмотрите раковину",
    obj2_key: "Возьмите ключ от электрощитка из раковины [E]",
    obj3_cam: "Пробки выбило! Вернитесь к столу в кабинете и возьмите фотоаппарат [E]",
    obj3_breaker:
      "Освещайте темноту фотовспышкой [ЛКМ / Пробел]. Включите 3 рубильника в щитке в коридоре [E]",
    obj4_term: "Экстренный вызов на терминале! Срочно вернитесь к монитору в кабинете [E]",
    obj4_hold: "НЕ ОБОРАЧИВАЙТЕСЬ! УДЕРЖИВАЙТЕ КУРСОР В КРУГЕ ДЕШИФРОВКИ ЗАМКА",
    obj5_escape: "ЗАМОК ОТКРЫТ! БЕГИТЕ К ВХОДНОЙ ДВЕРИ В КОНЦЕ КОРИДОРА [E]!",
    promptTerminal: "[E] Работать с терминалом | [Q] Личное дело №404 и Магнитофон",
    promptPhone: "[E] Ответить на звонок селектора",
    promptPeephole: "[E] Посмотреть в дверной глазок",
    promptCloset: "[E] Заглянуть в стенной шкаф",
    promptBathDoor: "[E] Открыть дверь ванной",
    promptCurtain: "[E] Отодвинуть шторку ванной",
    promptTakeKey: "[E] Взять ключ от щитка и закрыть кран",
    promptTakeCam: "[E] Взять фотоаппарат Polaroid со вспышкой",
    promptBreaker: "[E] Включить рубильник щитка",
    promptExitDoor: "[E] ОТКРЫТЬ ВХОДНУЮ ДВЕРЬ И ВЫЙТИ!",
    sub_intro:
      "«Запись начата. Испытуемый: Костя. Проверьте снимки с 5 камер наблюдения в терминале и отметьте визуальные аномалии. Не покидайте рабочее место.»",
    sub_cam5_bath:
      "«Камера четыре: санузел. Зафиксирован подъём уровня чёрной воды в ванне при перекрытых трубах. Переключаю на последнюю камеру — твой рабочий кабинет, Костя.»",
    sub_tape_log:
      "«Запись ноль-три... Костя, если ты включил этот магнитофон — слушай внимательно. Камеры на мониторе показывают не запись... они открывают ей проход в квартиру 404. Не открывай шкаф в коридоре!»",
    sub_closet_scare:
      "«Зачем ты заглянул в шкаф, Костя?.. Я уже вышла оттуда.»",
    sub_error_door:
      "«Внимание! Обнаружен посторонний сигнал внутри квартиры. Костя, немедленно подойдите к входной двери и ответьте на селектор.»",
    sub_phone_call:
      "«Костя... не открывай входную дверь! То, что стучит снаружи — это обман. Посмотри в глазок, но не снимай цепочку!»",
    sub_whisper_outside:
      "«Костя... зря ты смотришь наружу... я уже не за дверью... я внутри квартиры...»",
    sub_whisper_mirror:
      "«Не смотри назад, Костя... ты выключил воду... а теперь гаснет свет...»",
    sub_whisper_dark:
      "«Сфотографируй меня ещё раз, Костя... с каждой вспышкой я всё ближе...»",
    sub_breaker_whisper:
      "«Думаешь, электричество спасёт тебя, Костя? Я уже совсем рядом...»",
    sub_whisper_behind:
      "«Костя... не оборачивайся... я стою прямо за твоим креслом... я вижу твоё лицо на экране...»",
    sub_whisper_neck:
      "«Я чувствую, как дрожит твоя рука на мышке, Костя... не смей убирать курсор...»",
    sub_whisper_ear: "«Ну же, Костя... повернись ко мне... посмотри мне в глаза...»",
    sub_whisper_climax: "«Куда же ты бежишь, Костя? Тест ещё не окончен...»",
    sub_outro:
      "«Калибровка страха успешно завершена. Ваша реакция сохранена в архиве. Спасибо за участие в тесте, Костя.»",
    flashReady: "ВСПЫШКА ГОТОВА [ЛКМ / ПРОБЕЛ]",
    flashCharging: "ЗАРЯДКА КОНДЕНСАТОРА ВСПЫШКИ...",
    micLabel: "УРОВЕНЬ ШУМА / ДЫХАНИЕ",
  },
  en: {
    title: "PROTOCOL: DO NOT LOOK",
    subtitle: "AI EVALUATION SYSTEM // SUBJECT: KOSTYA // APT. 404",
    calibDesc:
      "Wear headphones for HRTF 3D spatial audio. Optionally grant webcam and microphone access for live fear telemetry — all data stays 100% local on your machine.",
    btnAudioTest: "🔊 TEST 3D BINAURAL AUDIO (LEFT / RIGHT)",
    btnLinkBio: "📷 LINK WEBCAM & MICROPHONE (RECOMMENDED)",
    bioLinked: "✓ BIOMETRICS LINKED (WEBCAM / MIC ACTIVE)",
    bioFallback: "✓ STANDALONE MODE ACTIVE (NO WEBCAM)",
    btnStart: "▶ BEGIN EVALUATION SESSION",
    controlsHint:
      "CONTROLS: [WASD] Move | [Mouse] Look | [E] Interact | [Q] Dossier / Tape Deck | [F] Flashlight | [LMB / Space] Camera Flash",
    objHeader: "CURRENT DIRECTIVE",
    obj1: "Inspect the desk terminal [E] (or Dossier [Q]) and tag anomalies across 5 surveillance feeds",
    obj2_phone: "The hallway intercom is ringing! Walk to the front door and answer it [E]",
    obj2_peephole: "Look through the front door peephole [E]",
    obj2_bath: "The bathroom door slammed shut! Open the bathroom door [E]",
    obj2_curtain: "Pull back the shower curtain [E] and inspect the sink",
    obj2_key: "Take the fuse box key from the sink [E]",
    obj3_cam: "Power outage! Return to the Study desk and pick up the Flash Camera [E]",
    obj3_breaker:
      "Use Camera Flash [LMB / Space] to see in the dark. Flip 3 switches in the hallway breaker box [E]",
    obj4_term: "Emergency signal on the Study Terminal! Check the desk monitor [E]",
    obj4_hold: "DO NOT TURN AROUND! KEEP CURSOR INSIDE THE LOCK DECRYPTION CIRCLE",
    obj5_escape: "FRONT DOOR UNLOCKED! RUN TO THE EXIT AT THE END OF THE HALLWAY [E]!",
    promptTerminal: "[E] Use Terminal Workstation | [Q] Dossier #404 & Tape Log",
    promptPhone: "[E] Answer Ringing Intercom",
    promptPeephole: "[E] Look through Peephole",
    promptCloset: "[E] Inspect Hallway Closet",
    promptBathDoor: "[E] Open Bathroom Door",
    promptCurtain: "[E] Pull Back Shower Curtain",
    promptTakeKey: "[E] Take Fuse Key & Turn Off Tap",
    promptTakeCam: "[E] Pick up Polaroid Flash Camera",
    promptBreaker: "[E] Flip Breaker Switch",
    promptExitDoor: "[E] OPEN FRONT DOOR & ESCAPE!",
    sub_intro:
      '"Recording initiated. Subject: Kostya. Your task is to inspect the five surveillance cameras on the terminal and tag all anomalies. Do not leave your workstation."',
    sub_cam5_bath:
      '"Camera four: bathroom. Rising black water detected inside bathtub with main valves shut. Switching to the final camera — your study, Kostya."',
    sub_tape_log:
      '"Recording zero-three... Kostya, if you turned on this tape deck, listen carefully. The cameras on that monitor let her inside Apartment 404. Do not open the hallway closet!"',
    sub_closet_scare:
      '"Why did you look inside the closet, Kostya?.. I already stepped out."',
    sub_error_door:
      '"Alert. Unauthorized biological signal detected inside Apartment 404. Kostya, answer the hallway intercom and check the front door peephole immediately."',
    sub_phone_call:
      '"Kostya... do not unlatch the front door... what is knocking outside is a trap. Check the peephole, she is already inside!"',
    sub_whisper_outside:
      '"Kostya... why are you looking outside... I am no longer behind the door... I am inside with you..."',
    sub_whisper_mirror:
      '"Do not look back, Kostya... you turned off the water... and now the lights go out..."',
    sub_whisper_dark:
      '"Take another photo of me, Kostya... with every flash I am closer..."',
    sub_breaker_whisper:
      '"Do you think electricity will save you, Kostya? I am right beside you..."',
    sub_whisper_behind:
      '"Kostya... do not turn around... I am standing right behind your chair... I can see your face in the monitor..."',
    sub_whisper_neck:
      '"I can feel your hand trembling on the mouse, Kostya... do not move the cursor away..."',
    sub_whisper_ear: '"Come on, Kostya... turn to me... look into my eyes..."',
    sub_whisper_climax: '"Where are you running, Kostya? The evaluation is not over..."',
    sub_outro:
      '"Fear response calibration complete. Your biometric reaction has been archived. Thank you for participating in the test, Kostya."',
    flashReady: "CAMERA FLASH READY [LMB / SPACE]",
    flashCharging: "CAPACITOR RECHARGING...",
    micLabel: "NOISE / BREATH LEVEL",
  },
};

class ScareKostyaGame {
  constructor() {
    this.lang = "ru";
    this.audio = new HorrorAudioEngine();
    this.world = new ApartmentWorld(document.getElementById("viewport"));

    this.started = false;
    this.act = 0;
    this.step = "init";
    this.modalOpen = null;

    // Player physics & look
    this.yaw = 0;
    this.pitch = -0.08;
    this.keys = {};
    this.walkTime = 0;
    this.lastFootstepIndex = 0;
    this.flashlightOn = false;
    this.flashlightBroken = false;
    this.hasCamera = false;
    this.hasFuseKey = false;
    this.flashCooldown = 0;
    this.flashesUsed = 0;
    this.breakersFlipped = 0;
    this.closetTriggered = false;

    // Telemetry & Fear History Graph
    this.peakMouseSpeed = 0;
    this.timesLookedBack = 0;
    this.wasLookingBack = false;
    this.sessionStartTime = 0;
    this.fearCurve = [58, 62, 68, 75];
    this.fearSampleTimer = 0;

    // Webcam optional stream
    this.webcamStream = null;
    this.webcamVideo = document.getElementById("webcam-hidden");
    this.webcamEnabled = false;
    this.reactionSnapshotDataUrl = null;

    // Act 1 Multi-Camera Terminal state (5 cameras, each with Baseline 03:00 vs Live 03:14)
    this.currentPhotoIdx = 0;
    this.showingBaseline = false;
    this.photoImages = [];
    this.baselineImages = [];
    this.cursorX = 320;
    this.cursorY = 180;
    this.closetScareUsed = false;
    this.anomalies = [
      {
        src: "assets/images/cctv_room_1.png",
        cleanSrc: "assets/images/cctv_1_clean.png",
        x: 0.72,
        y: 0.45,
        camTitle: "CAM_01 // ПРИХОЖАЯ (ЗЕРКАЛО) // 03:14 AM",
      },
      {
        src: "assets/images/cctv_room_2.png",
        cleanSrc: "assets/images/cctv_2_clean.png",
        x: 0.52,
        y: 0.43,
        camTitle: "CAM_02 // КОРИДОР (ВАННАЯ) // 03:14 AM",
      },
      {
        src: "assets/images/cctv_4_anomaly.png",
        cleanSrc: "assets/images/cctv_4_clean.png",
        x: 0.42,
        y: 0.48,
        altX: 0.78,
        altY: 0.60,
        camTitle: "CAM_03 // ЭЛЕКТРОЩИТОК // 03:14 AM",
      },
      {
        src: "assets/images/cctv_5_anomaly.png",
        cleanSrc: "assets/images/cctv_5_clean.png",
        x: 0.65,
        y: 0.45,
        camTitle: "CAM_04 // САНУЗЕЛ (ВАННА) // 03:14 AM",
      },
      {
        src: "assets/images/cctv_room_3.png",
        cleanSrc: "assets/images/cctv_3_clean.png",
        x: 0.43,
        y: 0.36,
        camTitle: "CAM_05 // КАБИНЕТ (ЗА ВАШЕЙ СПИНОЙ — СЕЙЧАС!)",
      },
    ];

    // Timers
    this.dripTimer = 0;
    this.act4Timer = 11.0;
    this.climaxTriggered = false;

    this.preloadAnomalyImages();
    this.bindUI();
    this.bindControls();
    this.applyLanguage();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  t(key) {
    return I18N[this.lang][key] || key;
  }

  preloadAnomalyImages() {
    this.anomalies.forEach((a, idx) => {
      const img = new Image();
      img.src = a.src;
      this.photoImages[idx] = img;

      const cleanImg = new Image();
      cleanImg.src = a.cleanSrc;
      this.baselineImages[idx] = cleanImg;
    });
  }

  applyLanguage() {
    document.getElementById("title-main").textContent = this.t("title");
    document.getElementById("title-sub").textContent = this.t("subtitle");
    document.getElementById("calib-desc").textContent = this.t("calibDesc");
    document.getElementById("btn-audio-test").textContent = this.t("btnAudioTest");
    if (!this.webcamEnabled && !this.audio.micEnabled) {
      document.getElementById("btn-link-bio").textContent = this.t("btnLinkBio");
    }
    document.getElementById("btn-start-game").textContent = this.t("btnStart");
    document.getElementById("controls-hint").textContent = this.t("controlsHint");
    document.getElementById("obj-header").textContent = this.t("objHeader");
    document.getElementById("mic-label").textContent = this.t("micLabel");
    this.updateObjectiveText();
  }

  bindUI() {
    document.getElementById("lang-ru").addEventListener("click", () => {
      this.lang = "ru";
      document.getElementById("lang-ru").classList.add("active");
      document.getElementById("lang-en").classList.remove("active");
      this.applyLanguage();
    });
    document.getElementById("lang-en").addEventListener("click", () => {
      this.lang = "en";
      document.getElementById("lang-en").classList.add("active");
      document.getElementById("lang-ru").classList.remove("active");
      this.applyLanguage();
    });

    document.getElementById("btn-audio-test").addEventListener("click", () => {
      this.audio.playBinauralTest();
    });

    document.getElementById("btn-link-bio").addEventListener("click", async () => {
      const btn = document.getElementById("btn-link-bio");
      btn.disabled = true;
      await this.audio.requestMicrophone();
      try {
        const vStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 270 },
          audio: false,
        });
        this.webcamStream = vStream;
        this.webcamVideo.srcObject = vStream;
        await this.webcamVideo.play();
        this.webcamEnabled = true;
      } catch (e) {
        this.webcamEnabled = false;
      }
      btn.textContent =
        this.webcamEnabled || this.audio.micEnabled
          ? this.t("bioLinked")
          : this.t("bioFallback");
      btn.classList.add("linked");
    });

    document.getElementById("btn-start-game").addEventListener("click", async () => {
      await this.audio.init();
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
      document.getElementById("start-screen").classList.add("hidden");
      document.getElementById("hud").classList.remove("hidden");
      this.startAct1();
      this.lockPointer();
    });

    document.addEventListener("mousedown", (e) => {
      if (!this.started) return;
      if (this.modalOpen === "dossier") {
        this.closeDossierModal();
        return;
      }
      if (this.modalOpen === "terminal_act1") {
        if (e.target && e.target.id === "btn-toggle-baseline") {
          return;
        }
        if (e.button === 2) {
          this.showingBaseline = !this.showingBaseline;
          this.audio.playUIBeep(520, 0.04);
        } else {
          this.onTerminalAct1Click();
        }
        return;
      }
      if (
        this.modalOpen === "peephole" ||
        this.modalOpen === "closet_scare" ||
        this.modalOpen === "ending"
      ) {
        return;
      }
      if (document.pointerLockElement !== document.body && !this.modalOpen) {
        this.lockPointer();
      }
      if (e.button === 0 && this.hasCamera && !this.modalOpen) {
        this.fireCameraFlash();
      }
    });

    const baseBtn = document.getElementById("btn-toggle-baseline");
    if (baseBtn) {
      baseBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.showingBaseline = !this.showingBaseline;
        this.audio.playUIBeep(520, 0.04);
      });
    }

    const closeDosBtn = document.getElementById("btn-close-dossier");
    if (closeDosBtn) {
      closeDosBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.closeDossierModal();
      });
    }

    document.addEventListener("contextmenu", (e) => e.preventDefault());

    document.getElementById("btn-replay").addEventListener("click", () => {
      window.location.reload();
    });

    document.getElementById("btn-save-photo").addEventListener("click", () => {
      if (!this.reactionSnapshotDataUrl) return;
      const a = document.createElement("a");
      a.href = this.reactionSnapshotDataUrl;
      a.download = "kostya_reaction_apt404.png";
      a.click();
    });
  }

  lockPointer() {
    try {
      if (document.body.requestPointerLock) {
        const res = document.body.requestPointerLock();
        if (res && typeof res.catch === "function") {
          res.catch(() => {});
        }
      }
    } catch (e) {}
  }

  bindControls() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (!this.started) return;

      if (e.code === "KeyE") {
        if (this.modalOpen === "dossier") {
          this.closeDossierModal();
        } else {
          this.handleInteract();
        }
      } else if (e.code === "KeyQ") {
        if (this.modalOpen === "dossier") {
          this.closeDossierModal();
        } else if (!this.modalOpen && this.world.camera.position.z < -0.5) {
          this.openDossierAndPlayTape();
        }
      } else if (e.code === "KeyF") {
        this.toggleFlashlight();
      } else if (e.code === "KeyR" && this.modalOpen === "terminal_act1") {
        this.showingBaseline = !this.showingBaseline;
        this.audio.playUIBeep(520, 0.04);
      } else if (e.code === "Space") {
        if (this.modalOpen === "terminal_act1") {
          this.onTerminalAct1Click();
        } else if (this.hasCamera && !this.modalOpen) {
          this.fireCameraFlash();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.started) return;
      const dx = e.movementX || 0;
      const dy = e.movementY || 0;

      const speed = Math.hypot(dx, dy) * 60;
      if (speed > this.peakMouseSpeed) {
        this.peakMouseSpeed = Math.min(9999, Math.round(speed));
      }

      if (this.modalOpen === "terminal_act1" || this.modalOpen === "terminal_act4") {
        if (document.pointerLockElement === document.body) {
          this.cursorX = Math.max(20, Math.min(620, this.cursorX + dx * 0.85));
          this.cursorY = Math.max(20, Math.min(340, this.cursorY + dy * 0.85));
        } else {
          const canvasId =
            this.modalOpen === "terminal_act1" ? "terminal-canvas" : "act4-cctv-canvas";
          const rect = document.getElementById(canvasId).getBoundingClientRect();
          if (rect.width > 0) {
            this.cursorX = ((e.clientX - rect.left) / rect.width) * 640;
            this.cursorY = ((e.clientY - rect.top) / rect.height) * 360;
          }
        }
        return;
      }

      if (this.modalOpen === "peephole" || this.modalOpen === "ending") {
        return;
      }

      const sens = 0.0022;
      this.yaw -= dx * sens;
      this.pitch = Math.max(-1.25, Math.min(1.25, this.pitch - dy * sens));

      const lookBack = Math.abs(Math.sin(this.yaw / 2)) > 0.85;
      if (lookBack && !this.wasLookingBack) {
        this.timesLookedBack++;
      }
      this.wasLookingBack = lookBack;
    });
  }

  showSubtitle(text, durationMs = 6000) {
    const el = document.getElementById("subtitle-box");
    el.textContent = text;
    el.classList.remove("hidden");
    clearTimeout(this._subTimeout);
    this._subTimeout = setTimeout(() => {
      el.classList.add("hidden");
    }, durationMs);
  }

  updateObjectiveText() {
    const el = document.getElementById("obj-text");
    if (!el) return;
    const map = {
      act1_terminal: "obj1",
      act2_phone: "obj2_phone",
      act2_peephole: "obj2_peephole",
      act2_bathroom: "obj2_bath",
      act2_curtain: "obj2_curtain",
      act2_take_key: "obj2_key",
      act3_get_cam: "obj3_cam",
      act3_breaker: "obj3_breaker",
      act4_return_term: "obj4_term",
      act4_hold_still: "obj4_hold",
      act5_escape: "obj5_escape",
    };
    const key = map[this.step] || "obj1";
    el.textContent = this.t(key);
    if (this.step === "act4_hold_still" || this.step === "act5_escape") {
      el.classList.add("urgent");
    } else {
      el.classList.remove("urgent");
    }
  }

  // ==========================================================================
  // ACT I: THE 4-CAMERA EVALUATION TERMINAL (WITH BASELINE TOGGLE)
  // ==========================================================================
  startAct1() {
    this.started = true;
    this.sessionStartTime = performance.now();
    this.act = 1;
    this.step = "act1_terminal";
    this.updateObjectiveText();
    this.audio.startBGM("bgm_dread", 0.3);
    this.audio.heartbeatBPM = 58;
    document.title = "ПРОТОКОЛ: НЕ СМОТРИ // КВ. 404";

    this.world.updateCRTScreen(
      ["ТЕРМИНАЛ ОЦЕНКИ ИИ", "КАМЕР: 4 (03:14 AM)", "СТАТУС: ОЖИДАНИЕ", "> НАЖМИТЕ [E]"],
      false
    );

    this.showSubtitle(this.t("sub_intro"), 8500);
    this.audio.playVoice("vo_intro", null, 1.0, this.lang);
  }

  openTerminalAct1() {
    this.modalOpen = "terminal_act1";
    this.currentPhotoIdx = 0;
    this.showingBaseline = false;
    this.cursorX = 320;
    this.cursorY = 180;
    document.getElementById("terminal-modal").classList.remove("hidden");
    document.getElementById("terminal-act1-view").classList.remove("hidden");
    document.getElementById("terminal-act4-view").classList.add("hidden");
    this.audio.playUIBeep(960, 0.06);
  }

  renderTerminalAct1() {
    const canvas = document.getElementById("terminal-canvas");
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const anom = this.anomalies[this.currentPhotoIdx];
    const activeImg = this.showingBaseline
      ? this.baselineImages[this.currentPhotoIdx]
      : this.photoImages[this.currentPhotoIdx];
    const fallbackImg = this.photoImages[this.currentPhotoIdx];

    ctx.fillStyle = "#050d08";
    ctx.fillRect(0, 0, w, h);

    if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
      ctx.drawImage(activeImg, 0, 0, w, h);
    } else if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
      ctx.drawImage(fallbackImg, 0, 0, w, h);
    }

    // Subtle green CRT scanline & noise pass
    ctx.fillStyle = "rgba(0, 25, 10, 0.22)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }

    const targetX = anom.x * w;
    const targetY = anom.y * h;
    let dist = Math.hypot(this.cursorX - targetX, this.cursorY - targetY);
    if (anom.altX !== undefined && anom.altY !== undefined) {
      const altDist = Math.hypot(
        this.cursorX - anom.altX * w,
        this.cursorY - anom.altY * h
      );
      dist = Math.min(dist, altDist);
    }
    const proximity = this.showingBaseline
      ? 0
      : Math.max(0, Math.min(100, Math.round((1 - dist / 240) * 100)));

    // Draw HUD header inside CRT
    ctx.fillStyle = "rgba(0, 18, 8, 0.85)";
    ctx.fillRect(0, 0, w, 34);
    ctx.fillStyle = this.currentPhotoIdx >= 3 ? "#ff4444" : "#33ff88";
    ctx.font = "bold 12px 'Courier New', monospace";
    const modeLabel = this.showingBaseline ? "[ЭТАЛОН 03:00]" : "[ПРЯМОЙ ЭФИР 03:14]";
    ctx.fillText(`${anom.camTitle} ${modeLabel}`, 10, 21);
    ctx.fillText(
      `[${this.currentPhotoIdx + 1}/${this.anomalies.length}] СИГНАЛ: ${proximity}%`,
      w - 175,
      21
    );

    // Draw Magnifying Loupe Reticle at cursor
    const isHot = !this.showingBaseline && dist < 110;
    ctx.strokeStyle = isHot ? "#ff3333" : "#33ff88";
    ctx.lineWidth = isHot ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(this.cursorX, this.cursorY, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.cursorX - 48, this.cursorY);
    ctx.lineTo(this.cursorX - 26, this.cursorY);
    ctx.moveTo(this.cursorX + 26, this.cursorY);
    ctx.lineTo(this.cursorX + 48, this.cursorY);
    ctx.moveTo(this.cursorX, this.cursorY - 48);
    ctx.lineTo(this.cursorX, this.cursorY - 26);
    ctx.moveTo(this.cursorX, this.cursorY + 26);
    ctx.lineTo(this.cursorX, this.cursorY + 48);
    ctx.stroke();

    if (isHot) {
      ctx.fillStyle = "#ff3333";
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.fillText(
        "[ЛКМ / ПРОБЕЛ] ЗАФИКСИРОВАТЬ АНОМАЛИЮ",
        Math.max(10, Math.min(w - 280, this.cursorX - 130)),
        this.cursorY + 56
      );
    }
  }

  onTerminalAct1Click() {
    if (this.showingBaseline) {
      this.showingBaseline = false;
      this.audio.playUIBeep(660, 0.05);
      return;
    }
    const canvas = document.getElementById("terminal-canvas");
    const anom = this.anomalies[this.currentPhotoIdx];
    let dist = Math.hypot(
      this.cursorX - anom.x * canvas.width,
      this.cursorY - anom.y * canvas.height
    );
    if (anom.altX !== undefined && anom.altY !== undefined) {
      const altDist = Math.hypot(
        this.cursorX - anom.altX * canvas.width,
        this.cursorY - anom.altY * canvas.height
      );
      dist = Math.min(dist, altDist);
    }

    if (dist < 120) {
      this.audio.playUIBeep(1320, 0.09);
      if (this.currentPhotoIdx < this.anomalies.length - 1) {
        this.currentPhotoIdx++;
        if (this.currentPhotoIdx === 3) {
          // Camera 4 (Bathroom bathtub): Play ominous AI telemetry alert
          this.audio.heartbeatBPM = 78;
          this.showSubtitle(this.t("sub_cam5_bath"), 6500);
          this.audio.playVoice("vo_cam5_bath", null, 1.0, this.lang);
        } else if (this.currentPhotoIdx === 4) {
          // Camera 5 (Study — Behind Kostya's chair): First show the empty 03:00 AM baseline
          // of Kostya's chair for 1.1s, then glitch to 03:14 AM LIVE where the figure stands behind him!
          this.showingBaseline = true;
          this.audio.heartbeatBPM = 96;
          setTimeout(() => {
            if (this.modalOpen === "terminal_act1") {
              this.showingBaseline = false;
              this.audio.playUIBeep(310, 0.12);
            }
          }, 1100);
        }
      } else {
        this.completeAct1();
      }
    } else {
      this.audio.playUIBeep(240, 0.08);
    }
  }

  completeAct1() {
    this.modalOpen = null;
    document.getElementById("terminal-modal").classList.add("hidden");

    // Sudden dead silence + 3D floorboard creak right behind his right shoulder!
    this.audio.setBGMVolume(0.02, 0.1);
    this.audio.playCreak3D(0.45, 0.2, -1.15);
    this.world.updateCRTScreen(
      ["ОШИБКА ПРОТОКОЛА!", "СИГНАЛ ВНУТРИ КВ.", "ОТВЕТЬТЕ НА ЗВОНОК", "КОД: 404-КОСТЯ"],
      true
    );
    this.world.lights.crtGlow.color.setHex(0xff2222);

    // Enable 3D Flashlight viewmodel in hand!
    this.flashlightOn = true;
    this.world.lights.flashlight.intensity = 2.4;
    if (this.world.viewmodelFlashlight) {
      this.world.viewmodelFlashlight.visible = true;
    }
    if (this.world.closetEyes) {
      this.world.closetEyes.visible = true;
    }

    setTimeout(() => {
      this.act = 2;
      this.step = "act2_phone";
      this.updateObjectiveText();
      this.audio.setBGMVolume(0.3, 2.0);
      this.world.lights.phoneLED.intensity = 1.4;
      this.audio.startPhoneRing3D(-1.15, 1.46, 7.65);
      this.showSubtitle(this.t("sub_error_door"), 7500);
      this.audio.playVoice("vo_error_door", null, 1.0, this.lang);
    }, 1500);
  }

  // ==========================================================================
  // ACT II: THE RINGING INTERCOM, PEEPHOLE REVEAL & BATHROOM MIRROR
  // ==========================================================================
  answerHallwayPhone() {
    this.audio.stopPhoneRing3D();
    this.world.lights.phoneLED.intensity = 0.2;
    this.audio.playUIBeep(480, 0.06);
    this.step = "act2_peephole";
    this.updateObjectiveText();

    this.showSubtitle(this.t("sub_phone_call"), 7000);
    this.audio.playVoice(
      "vo_phone_call",
      { x: -1.1, y: 1.46, z: 7.65 },
      1.0,
      this.lang
    );

    // Heavy pounding knocks on the Front Door right beside him!
    setTimeout(() => {
      this.audio.playSFX("sfx_door_knock", { x: 0, y: 1.5, z: 8.35 }, 1.1);
    }, 2200);
  }

  openPeephole() {
    this.modalOpen = "peephole";
    const peepImg = document.getElementById("peephole-img");
    if (peepImg) peepImg.src = "assets/images/peephole_corridor.png";
    document.getElementById("peephole-modal").classList.remove("hidden");
    this.audio.heartbeatBPM = 108;
    document.title = "Я УЖЕ ВНУТРИ, КОСТЯ";

    setTimeout(() => {
      this.showSubtitle(this.t("sub_whisper_outside"), 5000);
      this.audio.playVoice(
        "vo_whisper_outside",
        { x: -0.25, y: 1.6, z: 6.5 },
        1.0,
        this.lang
      );
    }, 1100);

    // At 3.8s: Flash the terrifying Peephole Entity face right outside the glass for 1.05s!
    setTimeout(() => {
      if (peepImg) peepImg.src = "assets/images/peephole_entity.png";
      this.audio.playMirrorSting();
    }, 3800);

    setTimeout(() => {
      document.getElementById("peephole-modal").classList.add("hidden");
      if (peepImg) peepImg.src = "assets/images/peephole_corridor.png";
      this.modalOpen = null;
      this.step = "act2_bathroom";
      this.updateObjectiveText();

      // 0.9s after he pulls away from the peephole:
      // SCARE 1: Bathroom Door mid-hallway VIOLENTLY SLAMS SHUT & Both Hallway Paintings Corrupt!
      setTimeout(() => {
        this.world.targetBathroomDoorAngle = 0.0;
        this.audio.playSFX("sfx_door_slam", { x: 1.3, y: 1.2, z: 4.4 }, 1.25);
        this.triggerScreenShake(0.38);

        this.world.lights.hallLight.intensity = 0.05;
        this.world.paintingMat.map = this.world.textures.paintingCursed;
        this.world.paintingMat.needsUpdate = true;
        if (this.world.painting2Mat && this.world.textures.painting2Cursed) {
          this.world.painting2Mat.map = this.world.textures.painting2Cursed;
          this.world.painting2Mat.needsUpdate = true;
        }
        if (this.world.props.paintingGroup) {
          this.world.props.paintingGroup.rotation.z = 0.08;
        }
        if (this.world.props.painting2Group) {
          this.world.props.painting2Group.rotation.z = -0.07;
        }

        this.world.drawBathroomMirror(true, false);
        this.world.props.fuseKey.visible = true;

        setTimeout(() => {
          this.world.lights.hallLight.intensity = 0.78;
        }, 450);
      }, 900);
    }, 4850);
  }

  openBathroomDoor() {
    this.world.targetBathroomDoorAngle = 0.78;
    this.audio.playCreak3D(1.3, 1.2, 4.4);
    this.step = "act2_curtain";
    this.updateObjectiveText();
  }

  openShowerCurtain() {
    this.world.curtainTargetX = 3.58;
    this.audio.playCreak3D(2.95, 1.4, 5.0);
    this.step = "act2_take_key";
    this.updateObjectiveText();
  }

  takeFuseKeyAndTriggerMirrorScare() {
    this.hasFuseKey = true;
    this.world.props.fuseKey.visible = false;

    // SCARE 2: Photorealistic Bathroom Mirror Reveal + 3D Entity right behind him!
    this.world.drawBathroomMirror(true, true);
    this.world.placeEntity(2.95, 4.75, true, "closer");
    this.audio.playMirrorSting();
    this.triggerScreenShake(0.48);
    this.audio.heartbeatBPM = 126;

    // 1.5s later: Total Power Outage!
    setTimeout(() => {
      this.audio.playPowerOutage();
      this.world.hideEntity();
      this.world.drawBathroomMirror(true, false);

      this.world.lights.hallLight.intensity = 0;
      this.world.lights.bathLight.intensity = 0;
      this.world.lights.deskLamp.intensity = 0.18;
      this.flashlightOn = false;
      this.flashlightBroken = true;
      this.world.lights.flashlight.intensity = 0;
      if (this.world.viewmodelFlashlight) {
        this.world.viewmodelFlashlight.visible = false;
      }

      this.act = 3;
      this.step = "act3_get_cam";
      this.updateObjectiveText();
      document.title = "ТЕМНОТА // КВ. 404";
      this.showSubtitle(this.t("sub_whisper_mirror"), 5500);
      this.audio.playVoice(
        "vo_whisper_mirror",
        { x: 2.9, y: 1.5, z: 4.5 },
        1.0,
        this.lang
      );
    }, 1500);
  }

  // ==========================================================================
  // ACT III: THE 3D POLAROID CAMERA & MULTI-POSE STALKING IN THE DARK
  // ==========================================================================
  pickupPolaroidCamera() {
    this.hasCamera = true;
    this.world.props.polaroidCamera.visible = false;
    if (this.world.viewmodelCamera) {
      this.world.viewmodelCamera.visible = true;
    }
    document.getElementById("flash-hud").classList.remove("hidden");
    this.step = "act3_breaker";
    this.updateObjectiveText();
    this.audio.playUIBeep(1040, 0.08);
    this.fireCameraFlash();

    setTimeout(() => {
      if (this.act === 3) {
        this.showSubtitle(this.t("sub_whisper_dark"), 5500);
        this.audio.playVoice(
          "vo_whisper_dark",
          { x: 0, y: 1.5, z: 2.5 },
          1.0,
          this.lang
        );
      }
    }, 1800);
  }

  fireCameraFlash() {
    if (this.flashCooldown > 0) return;
    this.flashCooldown = 2.25;
    this.flashesUsed++;
    this.audio.playCameraFlash();

    const pz = this.world.camera.position.z;
    let showedEntity = false;
    if (this.act === 3 && pz > -0.8) {
      const cycle = this.flashesUsed % 3;
      if (cycle === 1) {
        // Pose 1: Peeking sideways out of the Bathroom doorway!
        this.world.placeEntity(0.95, 4.35, true, "peeking");
        showedEntity = true;
      } else if (cycle === 2) {
        // Pose 2: Crawling / contorted low in the corridor ahead!
        const ez = Math.min(7.8, Math.max(2.0, pz + 2.6));
        this.world.placeEntity(0.0, ez, true, "crawling");
        this.audio.playMirrorSting();
        showedEntity = true;
      } else {
        // Pose 3: Reaching right toward the player!
        const ez = Math.min(7.8, Math.max(1.8, pz + 2.2));
        this.world.placeEntity(-0.15, ez, true, "closer");
        this.audio.playMirrorSting();
        showedEntity = true;
      }
    }

    this.world.triggerCameraFlash();
    this.world.renderMain();
    this.capturePolaroidPiP();

    if (showedEntity) {
      setTimeout(() => {
        if (this.act === 3) {
          this.world.hideEntity();
          this.audio.playSFX(
            "sfx_footsteps_wet",
            { x: 0, y: 0.2, z: Math.min(7.5, pz + 2.0) },
            0.95
          );
        }
      }, 650);
    }
  }

  capturePolaroidPiP() {
    const pip = document.getElementById("polaroid-pip");
    const pipCanvas = document.getElementById("polaroid-canvas");
    const ctx = pipCanvas.getContext("2d");
    ctx.drawImage(
      this.world.renderer.domElement,
      0,
      0,
      pipCanvas.width,
      pipCanvas.height
    );
    pip.classList.remove("hidden");
    pip.classList.remove("develop");
    void pip.offsetWidth;
    pip.classList.add("develop");
  }

  flipBreakerSwitch() {
    if (this.breakersFlipped >= 3) return;
    const lever = this.world.props.breakerLevers[this.breakersFlipped];
    if (lever) {
      lever.material.color.setHex(0x22ff55);
      lever.position.y += 0.02;
    }
    this.breakersFlipped++;
    this.audio.playUIBeep(620 + this.breakersFlipped * 220, 0.09);

    if (this.breakersFlipped === 2) {
      this.audio.playSFX("sfx_footsteps_wet", { x: -0.2, y: 0.2, z: 4.8 }, 1.0);
      this.showSubtitle(this.t("sub_breaker_whisper"), 4800);
      this.audio.playVoice(
        "vo_breaker_whisper",
        { x: -0.6, y: 1.5, z: 5.5 },
        1.0,
        this.lang
      );
    }

    if (this.breakersFlipped >= 3) {
      this.audio.setLightsHum(true);
      this.world.lights.hallLight.intensity = 1.1;
      this.world.lights.bathLight.intensity = 0.9;
      this.world.lights.deskLamp.intensity = 1.5;
      this.world.lights.breakerLED.color.setHex(0x22ff55);
      this.world.hideEntity();

      this.act = 4;
      this.step = "act4_return_term";
      this.updateObjectiveText();
      this.world.updateCRTScreen(
        ["ЭКСТРЕННЫЙ КАНАЛ!", "КАМЕРА НАБЛЮДЕНИЯ B", "ОБЪЕКТ ЗА СПИНОЙ!", "> ОТКРЫТЬ [E]"],
        true
      );
    }
  }

  // ==========================================================================
  // ACT IV: LIVE DUAL-FEED MONITOR & BIOMETRIC CURSOR HOLD
  // ==========================================================================
  startAct4LiveFeed() {
    this.modalOpen = "terminal_act4";
    this.step = "act4_hold_still";
    this.updateObjectiveText();

    this.world.camera.position.set(0, 1.52, -2.1);
    this.yaw = 0;
    this.pitch = -0.05;
    this.act4Timer = 11.0;

    document.getElementById("terminal-modal").classList.remove("hidden");
    document.getElementById("terminal-act1-view").classList.add("hidden");
    document.getElementById("terminal-act4-view").classList.remove("hidden");

    this.world.placeEntity(0.15, -0.85, true, "standing");
    this.audio.heartbeatBPM = 148;
    this.audio.switchToChaseBGM();
    this.audio.playSFX("sfx_breathing_behind", { x: 0.0, y: 1.52, z: -1.55 }, 0.95);
    document.title = "НЕ ОБОРАЧИВАЙСЯ, КОСТЯ";

    // Whisper 1 behind LEFT ear
    setTimeout(() => {
      if (this.act !== 4) return;
      this.showSubtitle(this.t("sub_whisper_behind"), 4500);
      this.audio.playVoice(
        "vo_whisper_behind",
        { x: -0.38, y: 1.52, z: -1.65 },
        1.0,
        this.lang
      );
    }, 700);

    // Whisper 2 right against NECK ("I can feel your hand trembling on the mouse, Kostya...")
    setTimeout(() => {
      if (this.act !== 4) return;
      this.world.placeEntity(-0.08, -1.25, true, "peeking");
      this.showSubtitle(this.t("sub_whisper_neck"), 4500);
      this.audio.playVoice(
        "vo_whisper_neck",
        { x: 0.25, y: 1.48, z: -1.72 },
        1.0,
        this.lang
      );
    }, 4500);

    // Whisper 3 behind RIGHT ear
    setTimeout(() => {
      if (this.act !== 4) return;
      this.world.placeEntity(-0.12, -1.45, true, "closer");
      this.showSubtitle(this.t("sub_whisper_ear"), 4000);
      this.audio.playVoice(
        "vo_whisper_ear",
        { x: 0.38, y: 1.52, z: -1.65 },
        1.0,
        this.lang
      );
    }, 8000);
  }

  updateAct4LiveFeed(dt) {
    this.act4Timer -= dt;
    const timerEl = document.getElementById("act4-countdown");
    if (timerEl) {
      timerEl.textContent = Math.max(0, this.act4Timer).toFixed(1) + " СЕК";
    }

    // 1. Render Feed A (Live Webcam in Night-Vision OR Atmospheric Subject Silhouette + Live ECG Wave!)
    const camCanvas = document.getElementById("act4-webcam-canvas");
    const cctx = camCanvas.getContext("2d");
    const cw = camCanvas.width;
    const ch = camCanvas.height;

    if (this.webcamEnabled && this.webcamVideo.readyState >= 2) {
      cctx.drawImage(this.webcamVideo, 0, 0, cw, ch);
      const imgD = cctx.getImageData(0, 0, cw, ch);
      const d = imgD.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
        d[i] = lum * 0.35;
        d[i + 1] = Math.min(255, lum * 1.15);
        d[i + 2] = lum * 0.45;
      }
      cctx.putImageData(imgD, 0, 0);
    } else {
      cctx.fillStyle = "#06150c";
      cctx.fillRect(0, 0, cw, ch);
      cctx.fillStyle = "#0e2b18";
      cctx.beginPath();
      cctx.arc(cw / 2, ch * 0.42, 42, 0, Math.PI * 2);
      cctx.fill();
      cctx.strokeStyle = "#2aff77";
      cctx.lineWidth = 4;
      cctx.beginPath();
      cctx.arc(cw / 2, ch * 0.42, 47, Math.PI, 0);
      cctx.stroke();
      cctx.fillRect(cw / 2 - 65, ch * 0.62, 130, ch * 0.4);
    }

    // Live ECG Cardiogram Waveform on Feed A
    const t = performance.now() * 0.008;
    cctx.strokeStyle = "#44ff88";
    cctx.lineWidth = 2;
    cctx.beginPath();
    for (let x = 10; x < cw - 10; x += 4) {
      const phase = (x * 0.08 + t) % (Math.PI * 2);
      const spike =
        phase > 2.8 && phase < 3.2 ? Math.sin((phase - 2.8) * 15) * 22 : 0;
      const y = ch - 36 + spike + Math.sin(x * 0.05 + t) * 2;
      if (x === 10) cctx.moveTo(x, y);
      else cctx.lineTo(x, y);
    }
    cctx.stroke();

    cctx.fillStyle = "rgba(0,0,0,0.35)";
    for (let y = 0; y < ch; y += 4) cctx.fillRect(0, y, cw, 2);
    cctx.fillStyle = "#ff3333";
    cctx.font = "bold 12px 'Courier New', monospace";
    cctx.fillText("● REC // ИСПЫТУЕМЫЙ: КОСТЯ", 10, 20);
    cctx.fillText(`ПУЛЬС: ${Math.round(this.audio.heartbeatBPM)} BPM`, 10, ch - 10);

    // 2. Render Feed B (Live Security Camera behind Kostya's chair + Drifting Decryption Circle)
    const cctvCanvas = document.getElementById("act4-cctv-canvas");
    const bctx = cctvCanvas.getContext("2d");
    const bw = cctvCanvas.width;
    const bh = cctvCanvas.height;

    const progress = Math.min(1, Math.max(0, (11.0 - this.act4Timer) / 11.0));
    const cleanRoomImg = this.baselineImages[4] || this.photoImages[4];
    const anomRoomImg = this.photoImages[4] || this.photoImages[3];

    if (cleanRoomImg && cleanRoomImg.complete && cleanRoomImg.naturalWidth > 0) {
      bctx.drawImage(cleanRoomImg, 0, 0, bw, bh);
    }
    if (anomRoomImg && anomRoomImg.complete && anomRoomImg.naturalWidth > 0) {
      bctx.save();
      bctx.globalAlpha = Math.min(1, 0.25 + progress * 0.85);
      const zoom = 1.0 + progress * 0.14;
      const zw = bw * zoom;
      const zh = bh * zoom;
      const zx = -(zw - bw) * 0.42 + (Math.random() - 0.5) * (progress > 0.6 ? 5 : 1);
      const zy = -(zh - bh) * 0.35;
      bctx.drawImage(anomRoomImg, zx, zy, zw, zh);
      bctx.restore();
    }

    // Draw Drifting Lock-Decryption Target Circle on Feed B
    const ringX = bw * 0.5 + Math.sin(performance.now() * 0.0018) * 55;
    const ringY = bh * 0.55 + Math.cos(performance.now() * 0.0013) * 35;
    bctx.strokeStyle = "rgba(85, 255, 153, 0.85)";
    bctx.lineWidth = 2;
    bctx.beginPath();
    bctx.arc(ringX, ringY, 34, 0, Math.PI * 2);
    bctx.stroke();

    bctx.fillStyle = "rgba(0, 25, 10, 0.22)";
    bctx.fillRect(0, 0, bw, bh);
    bctx.fillStyle = "rgba(0, 0, 0, 0.36)";
    for (let y = 0; y < bh; y += 4) bctx.fillRect(0, y, bw, 1.5);

    const distMeters = Math.max(0.2, 1.5 - progress * 1.3).toFixed(1);
    bctx.fillStyle = "rgba(25, 0, 0, 0.78)";
    bctx.fillRect(0, 0, bw, 28);
    bctx.fillStyle = "#ff3333";
    bctx.font = "bold 12px 'Courier New', monospace";
    bctx.fillText(
      `КАМЕРА B // СПИНА ИСПЫТУЕМОГО | ДИСТАНЦИЯ: ${distMeters} М`,
      10,
      19
    );

    if (this.act4Timer <= 0) {
      this.completeAct4();
    }
  }

  completeAct4() {
    this.modalOpen = null;
    document.getElementById("terminal-modal").classList.add("hidden");
    this.world.hideEntity();
    this.audio.playPowerOutage();
    this.audio.startEmergencyAlarm();

    this.world.lights.hallLight.color.setHex(0xff1818);
    this.world.lights.hallLight.intensity = 1.75;
    this.world.lights.deskLamp.color.setHex(0xff2222);
    this.world.lights.exitLight.intensity = 3.8;
    this.world.targetFrontDoorAngle = 0.45;

    this.act = 5;
    this.step = "act5_escape";
    this.updateObjectiveText();
    document.title = "БЕГИ К ВЫХОДУ!";
  }

  // ==========================================================================
  // ACT V: THE CRIMSON CORRIDOR, 2-FRAME CLIMAX SCARE & FULL DOSSIER
  // ==========================================================================
  triggerClimaxScare() {
    if (this.climaxTriggered) return;
    this.climaxTriggered = true;
    this.audio.stopEmergencyAlarm();

    // 1. Slam the exit door shut inches from his face!
    this.world.targetFrontDoorAngle = 0.0;
    this.world.lights.exitLight.intensity = 0.0;
    this.audio.playSFX("sfx_door_slam", { x: 0, y: 1.4, z: 8.3 }, 1.35);
    this.world.lights.hallLight.intensity = 0.04;
    this.triggerScreenShake(0.42);

    // 2. Eerie 0.55s whisper right behind his back before spinning him 180 degrees!
    this.showSubtitle(this.t("sub_whisper_climax"), 2500);
    this.audio.playVoice(
      "vo_whisper_climax",
      { x: 0, y: 1.6, z: 6.4 },
      1.0,
      this.lang
    );

    setTimeout(() => {
      this.yaw = Math.PI;
      this.pitch = 0.04;
      const cz = this.world.camera.position.z;
      this.world.placeEntity(0, cz - 0.72, true, "closer");
      this.world.triggerCameraFlash();

      const scareEl = document.getElementById("climax-scare-overlay");
      const scareImg = document.getElementById("climax-scare-img");
      if (scareImg) scareImg.src = "assets/images/entity_jumpscare_2k.png";
      scareEl.classList.remove("hidden");
      this.audio.playSFX("sfx_jumpscare_shriek", null, 1.0);
      this.triggerScreenShake(1.3);

      // Frame 2 of the lunge at +380ms (extreme macro jaws!)
      setTimeout(() => {
        if (scareImg) scareImg.src = "assets/images/entity_jumpscare_2.png";
        this.captureReactionSnapshot();
      }, 380);

      // Cut to black with analog tape-stop clunk & open Final Evaluation Report
      setTimeout(() => {
        this.audio.playSFX("sfx_tape_stop", null, 0.95);
        scareEl.classList.add("hidden");
        this.showEndingReport();
      }, 1850);
    }, 580);
  }

  captureReactionSnapshot() {
    const c = document.createElement("canvas");
    c.width = 480;
    c.height = 300;
    const ctx = c.getContext("2d");

    if (this.webcamEnabled && this.webcamVideo.readyState >= 2) {
      ctx.drawImage(this.webcamVideo, 0, 0, c.width, c.height);
    } else if (this.photoImages[4] && this.photoImages[4].complete) {
      ctx.drawImage(this.photoImages[4], 0, 0, c.width, c.height);
    } else if (this.photoImages[3] && this.photoImages[3].complete) {
      ctx.drawImage(this.photoImages[3], 0, 0, c.width, c.height);
    } else {
      ctx.drawImage(this.world.renderer.domElement, 0, 0, c.width, c.height);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    for (let y = 0; y < c.height; y += 4) ctx.fillRect(0, y, c.width, 1.5);
    ctx.strokeStyle = "#ff2222";
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, c.width - 16, c.height - 16);
    ctx.fillStyle = "#ff3333";
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillText("ПИКОВАЯ РЕАКЦИЯ ИСПЫТУЕМОГО // КОСТЯ", 18, 30);
    ctx.fillText("МОДЕЛЬ: GEMINI 4 ARGON // КВ. 404", 18, c.height - 18);

    this.reactionSnapshotDataUrl = c.toDataURL("image/png");
    const imgEl = document.getElementById("reaction-img");
    if (imgEl) imgEl.src = this.reactionSnapshotDataUrl;
  }

  showEndingReport() {
    this.modalOpen = "ending";
    this.audio.heartbeatBPM = 0;
    this.audio.setBGMVolume(0.06, 1.0);
    this.audio.setLightsHum(false);

    if (document.pointerLockElement) {
      try {
        document.exitPointerLock();
      } catch (e) {}
    }

    document.getElementById("ending-modal").classList.remove("hidden");
    this.showSubtitle(this.t("sub_outro"), 7500);
    this.audio.playVoice("vo_outro", null, 1.0, this.lang);

    const elapsedSec = Math.round((performance.now() - this.sessionStartTime) / 1000);
    const min = Math.floor(elapsedSec / 60);
    const sec = String(elapsedSec % 60).padStart(2, "0");

    document.getElementById("stat-time").textContent = `${min}:${sec}`;
    document.getElementById("stat-jerk").textContent = `${this.peakMouseSpeed} °/сек`;
    document.getElementById("stat-mic").textContent = this.audio.micEnabled
      ? `${this.audio.peakMicLevel} дБ`
      : "АВТОНОМНО";
    document.getElementById("stat-flashes").textContent = `${this.flashesUsed}`;
    document.getElementById("stat-lookbacks").textContent = `${this.timesLookedBack}`;

    this.drawFearTelemetryGraph();
  }

  drawFearTelemetryGraph() {
    const c = document.getElementById("fear-graph-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    ctx.fillStyle = "#06110b";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(85, 255, 153, 0.15)";
    for (let y = 15; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const pts = [...this.fearCurve, 138, 156, 172];
    ctx.strokeStyle = "#ff3333";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pts.forEach((v, i) => {
      const x = 10 + (i / (pts.length - 1)) * (w - 20);
      const y = h - 10 - ((v - 50) / 130) * (h - 24);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#55ff99";
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillText("ДИНАМИКА ПУЛЬСА И ПАНИКИ (АКТЫ I — V)", 10, 14);
  }

  // ==========================================================================
  // INTERACTION & MAIN LOOP
  // ==========================================================================
  toggleFlashlight() {
    if (this.flashlightBroken) {
      this.audio.playUIBeep(190, 0.08);
      return;
    }
    this.flashlightOn = !this.flashlightOn;
    this.world.lights.flashlight.intensity = this.flashlightOn ? 2.4 : 0.0;
    if (this.world.viewmodelFlashlight) {
      this.world.viewmodelFlashlight.visible = this.flashlightOn;
    }
    this.audio.playUIBeep(this.flashlightOn ? 720 : 480, 0.04);
  }

  openDossierAndPlayTape() {
    this.modalOpen = "dossier";
    document.getElementById("dossier-modal").classList.remove("hidden");
    this.audio.playUIBeep(640, 0.06);
    this.showSubtitle(this.t("sub_tape_log"), 9500);
    this.audio.playVoice("vo_tape_log", { x: -0.52, y: 0.95, z: -2.8 }, 1.0, this.lang);
  }

  closeDossierModal() {
    document.getElementById("dossier-modal").classList.add("hidden");
    this.modalOpen = null;
    this.audio.playUIBeep(440, 0.05);
  }

  triggerClosetScare() {
    if (this.closetScareUsed) return;
    this.closetScareUsed = true;
    this.modalOpen = "closet_scare";
    const modal = document.getElementById("closet-scare-modal");
    if (modal) modal.classList.remove("hidden");
    this.audio.playMirrorSting();
    this.triggerScreenShake(0.6);
    this.showSubtitle(this.t("sub_closet_scare"), 4800);
    this.audio.playVoice("vo_closet_scare", { x: -1.1, y: 1.5, z: 1.55 }, 1.0, this.lang);
    setTimeout(() => {
      if (modal) modal.classList.add("hidden");
      this.modalOpen = null;
    }, 950);
  }

  getActiveInteraction() {
    if (this.modalOpen) return null;
    const p = this.world.camera.position;

    if (this.step === "act1_terminal" && p.z < -1.1) {
      return { id: "terminal_act1", label: this.t("promptTerminal") };
    }
    if (
      !this.closetScareUsed &&
      this.act >= 2 &&
      this.act <= 3 &&
      Math.hypot(p.x - -1.1, p.z - 1.55) < 1.25
    ) {
      return { id: "closet", label: this.t("promptCloset") };
    }
    if (this.step === "act2_phone" && p.z > 6.2) {
      return { id: "phone", label: this.t("promptPhone") };
    }
    if (this.step === "act2_peephole" && p.z > 6.6) {
      return { id: "peephole", label: this.t("promptPeephole") };
    }
    if (
      this.step === "act2_bathroom" &&
      Math.hypot(p.x - 1.3, p.z - 4.4) < 1.85
    ) {
      return { id: "bath_door", label: this.t("promptBathDoor") };
    }
    if (
      this.step === "act2_curtain" &&
      Math.hypot(p.x - 2.6, p.z - 4.4) < 1.85
    ) {
      return { id: "curtain", label: this.t("promptCurtain") };
    }
    if (
      this.step === "act2_take_key" &&
      Math.hypot(p.x - 2.8, p.z - 3.4) < 1.85
    ) {
      return { id: "take_key", label: this.t("promptTakeKey") };
    }
    if (this.step === "act3_get_cam" && p.z < -1.0) {
      return { id: "take_cam", label: this.t("promptTakeCam") };
    }
    if (
      this.step === "act3_breaker" &&
      Math.hypot(p.x - -1.9, p.z - 6.3) < 1.85
    ) {
      return {
        id: "breaker",
        label: `${this.t("promptBreaker")} (${this.breakersFlipped}/3)`,
      };
    }
    if (this.step === "act4_return_term" && p.z < -1.0) {
      return { id: "terminal_act4", label: this.t("promptTerminal") };
    }
    if (this.step === "act5_escape" && p.z > 6.6) {
      return { id: "exit_door", label: this.t("promptExitDoor") };
    }
    return null;
  }

  handleInteract() {
    const inter = this.getActiveInteraction();
    if (!inter) return;

    switch (inter.id) {
      case "terminal_act1":
        this.openTerminalAct1();
        break;
      case "closet":
        this.triggerClosetScare();
        break;
      case "phone":
        this.answerHallwayPhone();
        break;
      case "peephole":
        this.openPeephole();
        break;
      case "bath_door":
        this.openBathroomDoor();
        break;
      case "curtain":
        this.openShowerCurtain();
        break;
      case "take_key":
        this.takeFuseKeyAndTriggerMirrorScare();
        break;
      case "take_cam":
        this.pickupPolaroidCamera();
        break;
      case "breaker":
        this.flipBreakerSwitch();
        break;
      case "terminal_act4":
        this.startAct4LiveFeed();
        break;
      case "exit_door":
        this.triggerClimaxScare();
        break;
    }
  }

  triggerScreenShake(amount) {
    this.shakeAmount = amount;
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const timeSec = now * 0.001;

    if (this.started && this.modalOpen !== "ending") {
      this.updatePlayer(dt, timeSec);
    }

    this.world.update(dt, timeSec, this.walkTime, this.flashCooldown <= 0);
    this.world.renderMain();

    if (this.modalOpen === "terminal_act1") {
      this.renderTerminalAct1();
    } else if (this.modalOpen === "terminal_act4") {
      this.updateAct4LiveFeed(dt);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  updatePlayer(dt, timeSec) {
    if (this.flashCooldown > 0) {
      this.flashCooldown = Math.max(0, this.flashCooldown - dt);
    }
    if (this.hasCamera) {
      const fText = document.getElementById("flash-status-text");
      const fBar = document.getElementById("flash-bar-fill");
      const pct = Math.round((1 - this.flashCooldown / 2.25) * 100);
      if (fBar) fBar.style.width = `${pct}%`;
      if (fText) {
        fText.textContent =
          this.flashCooldown <= 0 ? this.t("flashReady") : this.t("flashCharging");
      }
    }

    // Sample fear curve every 4 seconds
    this.fearSampleTimer += dt;
    if (this.fearSampleTimer > 4.0) {
      this.fearSampleTimer = 0;
      this.fearCurve.push(Math.round(this.audio.heartbeatBPM || 70));
    }

    const micVal = this.audio.micEnabled
      ? this.audio.updateMicrophoneLevel()
      : Math.round(this.walkSpeedCurrent * 18);
    const micFill = document.getElementById("mic-bar-fill");
    if (micFill) micFill.style.width = `${Math.min(100, micVal)}%`;

    this.walkSpeedCurrent = 0;
    if (!this.modalOpen) {
      let moveForward = 0;
      let moveRight = 0;
      if (this.keys["KeyW"] || this.keys["ArrowUp"]) moveForward += 1;
      if (this.keys["KeyS"] || this.keys["ArrowDown"]) moveForward -= 1;
      if (this.keys["KeyD"] || this.keys["ArrowRight"]) moveRight += 1;
      if (this.keys["KeyA"] || this.keys["ArrowLeft"]) moveRight -= 1;

      if (this.keys["ArrowLeft"]) this.yaw += dt * 1.8;
      if (this.keys["ArrowRight"]) this.yaw -= dt * 1.8;

      const len = Math.hypot(moveForward, moveRight);
      if (len > 0) {
        moveForward /= len;
        moveRight /= len;
        const speed = 2.68;
        this.walkSpeedCurrent = speed;
        const sin = Math.sin(this.yaw);
        const cos = Math.cos(this.yaw);
        const dx = (-sin * moveForward + cos * moveRight) * speed * dt;
        const dz = (-cos * moveForward - sin * moveRight) * speed * dt;

        const pos = this.world.camera.position;
        if (this.world.canMoveTo(pos.x + dx, pos.z)) pos.x += dx;
        if (this.world.canMoveTo(pos.x, pos.z + dz)) pos.z += dz;

        this.walkTime += dt * 7.5;
        const stepIdx = Math.floor(this.walkTime / Math.PI);
        if (stepIdx !== this.lastFootstepIndex) {
          this.lastFootstepIndex = stepIdx;
          this.audio.playFootstep(stepIdx);
        }
        pos.y = 1.62 + Math.sin(this.walkTime) * 0.045;
      } else {
        this.world.camera.position.y +=
          (1.62 - this.world.camera.position.y) * Math.min(1, dt * 8);
      }

      // Closet eyes peek & creak trigger in Hallway (z > 1.8 in Act 2)
      if (
        !this.closetTriggered &&
        this.act === 2 &&
        this.world.camera.position.z > 1.85
      ) {
        this.closetTriggered = true;
        this.audio.playSFX("sfx_closet_creak", { x: -1.2, y: 1.4, z: 1.55 }, 0.85);
        setTimeout(() => {
          if (this.world.closetEyes) this.world.closetEyes.visible = false;
        }, 700);
      }

      if (this.step === "act5_escape" && this.world.camera.position.z > 7.15) {
        this.triggerClimaxScare();
      }
    }

    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    let shakeX = 0,
      shakeY = 0;
    if (this.shakeAmount > 0.005) {
      shakeX = (Math.random() - 0.5) * this.shakeAmount * 0.18;
      shakeY = (Math.random() - 0.5) * this.shakeAmount * 0.18;
      this.shakeAmount *= Math.exp(-dt * 6.5);
    }
    euler.x = this.pitch + shakeX;
    euler.y = this.yaw + shakeY;
    this.world.camera.quaternion.setFromEuler(euler);

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.world.camera.quaternion
    );
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(
      this.world.camera.quaternion
    );
    this.audio.updateListener(this.world.camera.position, forward, up);

    if (this.act <= 2 && this.step !== "act3_get_cam") {
      this.dripTimer += dt;
      if (this.dripTimer > 2.3) {
        this.dripTimer = 0;
        this.audio.playWaterDrip3D(2.8, 0.95, 3.14);
      }
    }

    const inter = this.getActiveInteraction();
    const promptEl = document.getElementById("interact-prompt");
    if (inter) {
      promptEl.textContent = inter.label;
      promptEl.classList.remove("hidden");
    } else {
      promptEl.classList.add("hidden");
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.game = new ScareKostyaGame();
});
