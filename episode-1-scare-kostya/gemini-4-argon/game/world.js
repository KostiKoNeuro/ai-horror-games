// ============================================================================
// PROTOCOL: DO NOT LOOK (ПРОТОКОЛ: НЕ СМОТРИ)
// Full-Fledged Three.js 3D Apartment 404, PBR Bump Maps, Viewmodels & Entity v2.0
// ============================================================================

class ApartmentWorld {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020305);
    this.scene.fog = new THREE.FogExp2(0x020305, 0.125);

    this.camera = new THREE.PerspectiveCamera(
      68,
      window.innerWidth / window.innerHeight,
      0.06,
      30
    );
    this.camera.position.set(0, 1.62, -2.1);
    this.scene.add(this.camera);

    // Ceiling CCTV camera in Study looking at the back of the player's chair
    this.securityCam = new THREE.PerspectiveCamera(62, 16 / 9, 0.1, 20);
    this.securityCam.position.set(-1.85, 2.55, -0.1);
    this.securityCam.lookAt(0.1, 1.15, -1.65);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    container.appendChild(this.renderer.domElement);

    this.cctvTarget = new THREE.WebGLRenderTarget(480, 270, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    });

    this.textureLoader = new THREE.TextureLoader();
    this.textures = {};
    this.colliders = [];

    this.lights = {};
    this.props = {};

    // Animated doors & curtains
    this.bathroomDoorPivot = null;
    this.bathroomDoorAngle = 0.68;
    this.targetBathroomDoorAngle = 0.68;

    this.frontDoorPivot = null;
    this.frontDoorAngle = 0.0;
    this.targetFrontDoorAngle = 0.0;

    this.curtainTargetX = 2.95;

    // Camera Flash light (Act 3+)
    this.flashIntensity = 0;
    this.polaroidEjectProgress = 0;

    // Entity 3D rig
    this.entityGroup = null;
    this.entityPlane = null;
    this.entityVisible = false;

    this.loadTextures();
    this.buildArchitecture();
    this.buildLighting();
    this.buildProps();
    this.buildViewmodels();
    this.buildEntity();
    this.buildDustParticles();

    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  makeFallbackTexture(bgHex, noiseAmt = 25, grid = 0) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 256, 256);
    const img = ctx.getImageData(0, 0, 256, 256);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * noiseAmt;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
    if (grid > 0) {
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 2;
      for (let x = 0; x < 256; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(256, x);
        ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  loadTiledTexture(path, repeatX, repeatY, fallbackColor, grid = 0) {
    const tex = this.makeFallbackTexture(fallbackColor, 28, grid);
    tex.repeat.set(repeatX, repeatY);
    this.textureLoader.load(
      path,
      (loaded) => {
        loaded.wrapS = THREE.RepeatWrapping;
        loaded.wrapT = THREE.RepeatWrapping;
        loaded.repeat.set(repeatX, repeatY);
        loaded.colorSpace = THREE.SRGBColorSpace;
        tex.image = loaded.image;
        tex.needsUpdate = true;
      },
      undefined,
      () => {}
    );
    return tex;
  }

  loadTextures() {
    this.textures.wallpaper = this.loadTiledTexture(
      "assets/images/tex_wallpaper.png",
      3.5,
      1.4,
      "#23211e"
    );
    this.textures.woodFloor = this.loadTiledTexture(
      "assets/images/tex_wood_floor.png",
      3.5,
      4.5,
      "#261a12",
      32
    );
    this.textures.bathTile = this.loadTiledTexture(
      "assets/images/tex_bathroom_tile.png",
      2.5,
      1.6,
      "#27312e",
      24
    );
    this.textures.ceiling = this.loadTiledTexture(
      "assets/images/tex_ceiling.png",
      3,
      4,
      "#191817"
    );
    this.textures.rug = this.loadTiledTexture(
      "assets/images/tex_rug.png",
      1,
      2.5,
      "#361414"
    );
    this.textures.doorHeavy = this.loadTiledTexture(
      "assets/images/tex_door_heavy.png",
      1,
      1,
      "#291811"
    );
    this.textures.posterAnatomy = this.loadTiledTexture(
      "assets/images/poster_anatomy.png",
      1,
      1,
      "#2a261d"
    );
    this.textures.paintingNormal = this.loadTiledTexture(
      "assets/images/painting_normal.png",
      1,
      1,
      "#2a221b"
    );
    this.textures.paintingCursed = this.loadTiledTexture(
      "assets/images/painting_cursed.png",
      1,
      1,
      "#1f0909"
    );
    this.textures.painting2Normal = this.loadTiledTexture(
      "assets/images/painting_2_normal.png",
      1,
      1,
      "#24201b"
    );
    this.textures.painting2Cursed = this.loadTiledTexture(
      "assets/images/painting_2_cursed.png",
      1,
      1,
      "#1c0707"
    );
    this.textures.dossierScan = this.loadTiledTexture(
      "assets/images/dossier_scan.png",
      1,
      1,
      "#362b1c"
    );

    // Entity cutouts & mirror scare image
    this.textures.entityStanding = new THREE.TextureLoader().load(
      "assets/images/entity_standing.png"
    );
    this.textures.entityCloser = new THREE.TextureLoader().load(
      "assets/images/entity_closer.png"
    );
    this.textures.entityPeeking = new THREE.TextureLoader().load(
      "assets/images/entity_peeking.png"
    );
    this.textures.entityCrawling = new THREE.TextureLoader().load(
      "assets/images/entity_crawling.png"
    );

    this.mirrorScareImg = new Image();
    this.mirrorScareImg.src = "assets/images/mirror_scare_bathroom.png";
  }

  addWall(x, y, z, w, h, d, mat, collide = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    if (collide) {
      this.colliders.push({
        minX: x - w / 2 - 0.25,
        maxX: x + w / 2 + 0.25,
        minZ: z - d / 2 - 0.25,
        maxZ: z + d / 2 + 0.25,
      });
    }
    return mesh;
  }

  buildArchitecture() {
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.textures.wallpaper,
      bumpMap: this.textures.wallpaper,
      bumpScale: 0.025,
      roughness: 0.85,
      metalness: 0.05,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.textures.woodFloor,
      bumpMap: this.textures.woodFloor,
      bumpScale: 0.03,
      roughness: 0.65,
      metalness: 0.08,
    });
    const bathMat = new THREE.MeshStandardMaterial({
      map: this.textures.bathTile,
      bumpMap: this.textures.bathTile,
      bumpScale: 0.025,
      roughness: 0.45,
      metalness: 0.15,
    });
    const ceilMat = new THREE.MeshStandardMaterial({
      map: this.textures.ceiling,
      bumpMap: this.textures.ceiling,
      bumpScale: 0.02,
      roughness: 0.92,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x1b110b,
      roughness: 0.65,
    });

    const H = 2.85;

    // 1. Main Floor & Ceiling
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 2.5);
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, H, 2.5);
    this.scene.add(ceil);

    // Hallway Persian Runner Rug
    const rugMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 6.2),
      new THREE.MeshStandardMaterial({
        map: this.textures.rug,
        bumpMap: this.textures.rug,
        bumpScale: 0.015,
        roughness: 0.9,
      })
    );
    rugMesh.rotation.x = -Math.PI / 2;
    rugMesh.position.set(0, 0.006, 4.3);
    rugMesh.receiveShadow = true;
    this.scene.add(rugMesh);

    // Bathroom tiled floor
    const bathFloor = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), bathMat);
    bathFloor.rotation.x = -Math.PI / 2;
    bathFloor.position.set(2.9, 0.005, 4.4);
    bathFloor.receiveShadow = true;
    this.scene.add(bathFloor);

    // --- STUDY ROOM (x: -2.3 to 2.3, z: -3.5 to 0.5) ---
    this.addWall(0, H / 2, -3.5, 4.8, H, 0.2, wallMat);
    this.addWall(-2.3, H / 2, -1.5, 0.2, H, 4.2, wallMat);
    this.addWall(2.3, H / 2, -1.5, 0.2, H, 4.2, wallMat);

    // Partition Wall between Study and Hallway at z = 0.5 (central doorway x: -0.6 to 0.6)
    this.addWall(-1.45, H / 2, 0.5, 1.7, H, 0.2, wallMat);
    this.addWall(1.45, H / 2, 0.5, 1.7, H, 0.2, wallMat);
    this.addWall(0, 2.52, 0.5, 1.2, 0.66, 0.24, darkWoodMat, false);
    // Doorframe pillars
    this.addWall(-0.62, H / 2, 0.5, 0.08, H, 0.25, darkWoodMat, false);
    this.addWall(0.62, H / 2, 0.5, 0.08, H, 0.25, darkWoodMat, false);

    // --- MAIN HALLWAY (x: -1.3 to 1.3, z: 0.5 to 8.5) ---
    this.addWall(-1.3, H / 2, 2.95, 0.2, H, 4.9, wallMat);
    this.addWall(-1.3, H / 2, 7.75, 0.2, H, 1.5, wallMat);

    // Breaker Alcove Walls (x: -2.35 to -1.3, z: 5.4 to 7.0)
    this.addWall(-1.85, H / 2, 5.4, 1.1, H, 0.2, wallMat);
    this.addWall(-1.85, H / 2, 7.0, 1.1, H, 0.2, wallMat);
    this.addWall(-2.35, H / 2, 6.2, 0.2, H, 1.8, wallMat);

    // East Hallway Wall
    this.addWall(1.3, H / 2, 2.17, 0.2, H, 3.35, wallMat);
    this.addWall(1.3, H / 2, 6.72, 0.2, H, 3.55, wallMat);
    this.addWall(1.3, 2.52, 4.4, 0.24, 0.66, 1.1, darkWoodMat, false);

    // South End Wall (Front Door Wall at z = 8.5)
    this.addWall(0, H / 2, 8.5, 2.8, H, 0.2, wallMat);

    // --- BATHROOM (x: 1.3 to 4.2, z: 2.8 to 6.0) ---
    this.addWall(2.75, H / 2, 2.8, 2.9, H, 0.2, bathMat);
    this.addWall(2.75, H / 2, 6.0, 2.9, H, 0.2, bathMat);
    this.addWall(4.2, H / 2, 4.4, 0.2, H, 3.4, bathMat);

    // Baseboards along Hallway walls for architectural depth
    this.addWall(-1.19, 0.06, 2.95, 0.04, 0.12, 4.8, darkWoodMat, false);
    this.addWall(1.19, 0.06, 2.17, 0.04, 0.12, 3.3, darkWoodMat, false);
    this.addWall(1.19, 0.06, 6.72, 0.04, 0.12, 3.5, darkWoodMat, false);
  }

  buildLighting() {
    this.lights.ambient = new THREE.AmbientLight(0x181e29, 0.36);
    this.scene.add(this.lights.ambient);

    // 1. Study Desk Lamp
    this.lights.deskLamp = new THREE.PointLight(0xffaa55, 1.75, 6.8, 1.5);
    this.lights.deskLamp.position.set(-0.65, 1.38, -2.75);
    this.lights.deskLamp.castShadow = true;
    this.scene.add(this.lights.deskLamp);

    // 2. CRT Monitor Glow
    this.lights.crtGlow = new THREE.PointLight(0x44ffaa, 0.9, 3.5, 1.8);
    this.lights.crtGlow.position.set(0, 1.18, -2.65);
    this.scene.add(this.lights.crtGlow);

    // 3. Cold Moonlight through Rain-Streaked Study Window
    this.lights.windowLight = new THREE.PointLight(0x4466aa, 0.65, 4.5, 1.6);
    this.lights.windowLight.position.set(-1.95, 1.65, -1.65);
    this.scene.add(this.lights.windowLight);

    // 4. Hallway Overhead Fluorescent Bulb
    this.lights.hallLight = new THREE.PointLight(0xd8f0e0, 1.35, 8.8, 1.45);
    this.lights.hallLight.position.set(0, 2.68, 4.4);
    this.lights.hallLight.castShadow = true;
    this.scene.add(this.lights.hallLight);

    // 5. Bathroom Sconce Light
    this.lights.bathLight = new THREE.PointLight(0xcce8ff, 1.15, 5.8, 1.5);
    this.lights.bathLight.position.set(2.8, 2.35, 3.15);
    this.scene.add(this.lights.bathLight);

    // 6. Breaker Box Red Emergency LED
    this.lights.breakerLED = new THREE.PointLight(0xff1111, 0.75, 3.4, 1.8);
    this.lights.breakerLED.position.set(-2.1, 1.48, 6.2);
    this.scene.add(this.lights.breakerLED);

    // 7. Hallway Intercom Phone Red Blinking Light (near Front Door)
    this.lights.phoneLED = new THREE.PointLight(0xff2222, 0.0, 2.8, 1.8);
    this.lights.phoneLED.position.set(-1.05, 1.5, 7.65);
    this.scene.add(this.lights.phoneLED);

    // 8. Player Flashlight
    this.lights.flashlight = new THREE.SpotLight(
      0xfff6e5,
      0.0,
      14.5,
      Math.PI / 5.0,
      0.52,
      1.35
    );
    this.lights.flashlight.castShadow = true;
    this.lights.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.lights.flashlight);
    this.scene.add(this.lights.flashlightTarget);
    this.lights.flashlight.target = this.lights.flashlightTarget;

    // 9. Camera Xenon Flash Light
    this.lights.cameraFlash = new THREE.PointLight(0xeef6ff, 0.0, 16.5, 1.05);
    this.scene.add(this.lights.cameraFlash);

    // 10. Outer Stairwell Exit Light (Act 5)
    this.lights.exitLight = new THREE.PointLight(0xe8f4ff, 0.0, 9.0, 1.3);
    this.lights.exitLight.position.set(0.2, 1.65, 8.85);
    this.scene.add(this.lights.exitLight);
  }

  buildViewmodels() {
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x33383e,
      roughness: 0.3,
      metalness: 0.85,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x15171a,
      roughness: 0.5,
    });

    // 1. Right-Hand 3D Flashlight Viewmodel attached to camera
    this.viewmodelFlashlight = new THREE.Group();
    const flBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.022, 0.22, 12),
      metalMat
    );
    flBody.rotation.x = Math.PI / 2;
    const flHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.026, 0.06, 12),
      metalMat
    );
    flHead.rotation.x = Math.PI / 2;
    flHead.position.z = -0.12;
    const flLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.032, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff8e0 })
    );
    flLens.rotation.y = Math.PI;
    flLens.position.z = -0.151;

    // Subtle volumetric light cone on flashlight tip
    const coneGeo = new THREE.ConeGeometry(0.24, 0.95, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xfff6dd,
      transparent: true,
      opacity: 0.015,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.flCone = new THREE.Mesh(coneGeo, coneMat);
    this.flCone.rotation.x = -Math.PI / 2;
    this.flCone.position.z = -0.64;

    this.viewmodelFlashlight.add(flBody, flHead, flLens, this.flCone);
    this.viewmodelFlashlight.position.set(0.26, -0.23, -0.34);
    this.viewmodelFlashlight.visible = false;
    this.camera.add(this.viewmodelFlashlight);

    // 2. Left/Center 3D Polaroid Flash Camera Viewmodel (Act III+)
    this.viewmodelCamera = new THREE.Group();
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.1), darkMat);
    const camTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.04, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x2a353c })
    );
    camTop.position.set(0, 0.075, -0.01);
    const camLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.036, 0.05, 14),
      metalMat
    );
    camLens.rotation.x = Math.PI / 2;
    camLens.position.set(0, -0.01, -0.06);

    // Ready LED indicator on back of camera
    this.camLedMat = new THREE.MeshBasicMaterial({ color: 0x22ff66 });
    const camLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), this.camLedMat);
    camLed.position.set(0.05, 0.032, 0.052);

    // Ejecting Polaroid film card
    this.ejectCard = new THREE.Mesh(
      new THREE.PlaneGeometry(0.09, 0.09),
      new THREE.MeshBasicMaterial({ color: 0x3a3832, side: THREE.DoubleSide })
    );
    this.ejectCard.rotation.x = -Math.PI / 2 + 0.15;
    this.ejectCard.position.set(0, -0.045, -0.04);
    this.ejectCard.visible = false;

    this.viewmodelCamera.add(camBody, camTop, camLens, camLed, this.ejectCard);
    this.viewmodelCamera.scale.set(0.62, 0.62, 0.62);
    this.viewmodelCamera.position.set(-0.27, -0.24, -0.36);
    this.viewmodelCamera.rotation.y = -0.12;
    this.viewmodelCamera.visible = false;
    this.camera.add(this.viewmodelCamera);
  }

  buildProps() {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x2a1b12,
      roughness: 0.65,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x555a60,
      roughness: 0.35,
      metalness: 0.8,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x151618,
      roughness: 0.5,
    });

    // --- 1. STUDY DESK & CRT WORKSTATION (z = -2.9) ---
    this.addWall(0, 0.76, -2.9, 1.9, 0.08, 0.9, woodMat, true);
    this.addWall(-0.85, 0.38, -2.9, 0.1, 0.76, 0.82, woodMat, false);
    this.addWall(0.85, 0.38, -2.9, 0.1, 0.76, 0.82, woodMat, false);

    const crtBox = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.52, 0.48), darkMat);
    crtBox.position.set(0, 1.08, -2.92);
    crtBox.castShadow = true;
    this.scene.add(crtBox);

    this.crtCanvas = document.createElement("canvas");
    this.crtCanvas.width = 256;
    this.crtCanvas.height = 192;
    this.crtCtx = this.crtCanvas.getContext("2d");
    this.crtTexture = new THREE.CanvasTexture(this.crtCanvas);
    const screenPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.52, 0.4),
      new THREE.MeshBasicMaterial({ map: this.crtTexture })
    );
    screenPlane.position.set(0, 1.09, -2.675);
    this.scene.add(screenPlane);
    this.props.crtMonitor = crtBox;

    // Keyboard in front of CRT monitor
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.15), metalMat);
    kb.position.set(0, 0.81, -2.55);
    this.scene.add(kb);

    // Reel-to-Reel Tape Recorder on Desk (left of monitor)
    const tapeDeck = new THREE.Group();
    const deckBox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.16), darkMat);
    this.reel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 12), metalMat);
    this.reel1.rotation.x = Math.PI / 2;
    this.reel1.position.set(-0.065, 0.03, 0.085);
    this.reel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 12), metalMat);
    this.reel2.rotation.x = Math.PI / 2;
    this.reel2.position.set(0.065, 0.03, 0.085);
    tapeDeck.add(deckBox, this.reel1, this.reel2);
    tapeDeck.position.set(-0.52, 0.91, -2.82);
    tapeDeck.rotation.y = 0.25;
    this.scene.add(tapeDeck);

    // Classified Dossier Folder lying open on Study Desk (left-front of monitor)
    const dossierPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.22),
      new THREE.MeshStandardMaterial({
        map: this.textures.dossierScan,
        roughness: 0.78,
      })
    );
    dossierPlane.rotation.x = -Math.PI / 2;
    dossierPlane.rotation.z = 0.14;
    dossierPlane.position.set(-0.46, 0.806, -2.56);
    this.scene.add(dossierPlane);

    // Desk Lamp
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.04, 12), metalMat);
    lampBase.position.set(-0.78, 0.82, -2.85);
    this.scene.add(lampBase);
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.18, 14, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x2c3e35,
        emissive: 0x331800,
        side: THREE.DoubleSide,
      })
    );
    lampShade.position.set(-0.78, 1.38, -2.75);
    this.scene.add(lampShade);

    // Polaroid Flash Camera prop sitting on right side of Desk
    const camGroup = new THREE.Group();
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.14), darkMat);
    const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), metalMat);
    camLens.rotation.x = Math.PI / 2;
    camLens.position.set(0, -0.01, 0.09);
    const camFlash = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.07, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xddeeff, emissive: 0x223344 })
    );
    camFlash.position.set(0, 0.11, 0.04);
    camGroup.add(camBody, camLens, camFlash);
    camGroup.position.set(0.58, 0.88, -2.72);
    camGroup.rotation.y = -0.35;
    this.scene.add(camGroup);
    this.props.polaroidCamera = camGroup;

    // Desk Chair
    const chairGroup = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.52), darkMat);
    seat.position.y = 0.48;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 0.06), darkMat);
    back.position.set(0, 0.82, 0.23);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.48, 8), metalMat);
    leg.position.y = 0.24;
    chairGroup.add(seat, back, leg);
    chairGroup.position.set(0, 0, -2.05);
    this.scene.add(chairGroup);
    this.props.deskChair = chairGroup;

    // --- RAIN-STREAKED STUDY WINDOW (West wall at x = -2.18, z = -1.65) ---
    this.winCanvas = document.createElement("canvas");
    this.winCanvas.width = 256;
    this.winCanvas.height = 320;
    this.winCtx = this.winCanvas.getContext("2d");
    this.winTexture = new THREE.CanvasTexture(this.winCanvas);
    this.rainDrops = Array.from({ length: 42 }, () => ({
      x: Math.random() * 256,
      y: Math.random() * 320,
      len: 12 + Math.random() * 22,
      spd: 120 + Math.random() * 140,
    }));

    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.45, 1.15), woodMat);
    winFrame.position.set(-2.19, 1.65, -1.65);
    this.scene.add(winFrame);
    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 1.35),
      new THREE.MeshBasicMaterial({ map: this.winTexture })
    );
    winGlass.rotation.y = Math.PI / 2;
    winGlass.position.set(-2.155, 1.65, -1.65);
    this.scene.add(winGlass);

    // --- SOVIET MEDICAL POSTER & BOOKSHELF IN STUDY (East wall at x = 2.18) ---
    const posterPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 1.0),
      new THREE.MeshStandardMaterial({
        map: this.textures.posterAnatomy,
        roughness: 0.75,
      })
    );
    posterPlane.rotation.y = -Math.PI / 2;
    posterPlane.position.set(2.18, 1.68, -1.9);
    this.scene.add(posterPlane);

    // Bookshelf / Filing Cabinet in Study corner (x = 1.9, z = -0.35)
    this.addWall(1.92, 0.95, -0.4, 0.5, 1.9, 1.1, woodMat, true);

    // --- 2. HALLWAY PAINTINGS #1 & #2 ---
    // Painting #1 (West wall at z = 3.1)
    const paintingGroup = new THREE.Group();
    paintingGroup.position.set(-1.18, 1.65, 3.1);
    paintingGroup.rotation.y = Math.PI / 2;
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.98, 0.05), woodMat);
    paintingGroup.add(frameMesh);
    this.paintingMat = new THREE.MeshStandardMaterial({
      map: this.textures.paintingNormal,
      roughness: 0.6,
    });
    const paintingPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.88), this.paintingMat);
    paintingPlane.position.z = 0.028;
    paintingGroup.add(paintingPlane);
    this.scene.add(paintingGroup);
    this.props.paintingGroup = paintingGroup;

    // Painting #2 (East wall at z = 2.1)
    const painting2Group = new THREE.Group();
    painting2Group.position.set(1.18, 1.65, 2.1);
    painting2Group.rotation.y = -Math.PI / 2;
    const frame2Mesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.92, 0.05), woodMat);
    painting2Group.add(frame2Mesh);
    this.painting2Mat = new THREE.MeshStandardMaterial({
      map: this.textures.painting2Normal,
      roughness: 0.6,
    });
    const painting2Plane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 0.82),
      this.painting2Mat
    );
    painting2Plane.position.z = 0.028;
    painting2Group.add(painting2Plane);
    this.scene.add(painting2Group);
    this.props.painting2Group = painting2Group;

    // --- LOUVERED CLOSET DOOR IN HALLWAY (West wall at z = 1.55) ---
    const closetFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.15, 0.85), woodMat);
    closetFrame.position.set(-1.18, 1.07, 1.55);
    this.scene.add(closetFrame);
    // Glowing pale eyes peeking inside the dark closet slats!
    this.closetEyes = new THREE.Group();
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xddeeff });
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
    eye1.position.set(-1.13, 1.52, 1.51);
    eye2.position.set(-1.13, 1.52, 1.59);
    this.closetEyes.add(eye1, eye2);
    this.closetEyes.visible = false;
    this.scene.add(this.closetEyes);

    // --- HALLWAY WALL TELEPHONE / INTERCOM (West wall near Front Door at z = 7.65) ---
    const phoneGroup = new THREE.Group();
    const phoneBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.2), darkMat);
    const handset = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.06), metalMat);
    handset.position.set(0.05, 0, 0.06);
    this.phoneLedMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.016, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x330505 })
    );
    this.phoneLedMesh.position.set(0.055, 0.09, -0.04);
    phoneGroup.add(phoneBox, handset, this.phoneLedMesh);
    phoneGroup.position.set(-1.16, 1.46, 7.65);
    this.scene.add(phoneGroup);
    this.props.wallPhone = phoneGroup;

    // --- 3. FRONT DOOR & PEEPHOLE (South end of Hallway at z = 8.38) ---
    const frontDoorMat = new THREE.MeshStandardMaterial({
      map: this.textures.doorHeavy,
      bumpMap: this.textures.doorHeavy,
      bumpScale: 0.03,
      roughness: 0.72,
    });
    this.frontDoorPivot = new THREE.Group();
    this.frontDoorPivot.position.set(-0.55, 0, 8.38);
    const frontDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 2.25, 0.08),
      frontDoorMat
    );
    frontDoorMesh.position.set(0.56, 1.125, 0);
    this.frontDoorPivot.add(frontDoorMesh);

    const peepholeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    peepholeMesh.rotation.x = Math.PI / 2;
    peepholeMesh.position.set(0.56, 1.58, 0);
    this.frontDoorPivot.add(peepholeMesh);
    this.scene.add(this.frontDoorPivot);
    this.props.frontDoor = frontDoorMesh;

    // --- 4. HINGED BATHROOM DOOR (x = 1.3, z = 3.88) ---
    this.bathroomDoorPivot = new THREE.Group();
    this.bathroomDoorPivot.position.set(1.3, 0, 3.88);
    const bathDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 2.2, 1.04),
      woodMat
    );
    bathDoorMesh.position.set(0, 1.1, 0.52);
    bathDoorMesh.castShadow = true;
    this.bathroomDoorPivot.add(bathDoorMesh);
    this.bathroomDoorPivot.rotation.y = this.bathroomDoorAngle;
    this.scene.add(this.bathroomDoorPivot);
    this.props.bathroomDoor = bathDoorMesh;

    // --- 5. BATHROOM SINK, MIRROR & SHOWER (x: 1.3 to 4.1, z: 2.8 to 6.0) ---
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xd8ddd8,
      roughness: 0.25,
    });
    const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.48), porcelainMat);
    sinkBasin.position.set(2.8, 0.88, 3.14);
    this.scene.add(sinkBasin);
    const sinkPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.82, 12),
      porcelainMat
    );
    sinkPedestal.position.set(2.8, 0.41, 3.14);
    this.scene.add(sinkPedestal);
    this.props.bathroomSink = sinkBasin;

    // Brass Fuse Key sitting in the sink
    const keyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.03, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x553300,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    keyMesh.position.set(2.8, 0.99, 3.16);
    keyMesh.visible = false;
    this.scene.add(keyMesh);
    this.props.fuseKey = keyMesh;

    // Bathroom Mirror above Sink
    this.mirrorCanvas = document.createElement("canvas");
    this.mirrorCanvas.width = 512;
    this.mirrorCanvas.height = 384;
    this.mirrorCtx = this.mirrorCanvas.getContext("2d");
    this.mirrorTexture = new THREE.CanvasTexture(this.mirrorCanvas);
    this.drawBathroomMirror(false, false);

    const mirrorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.84, 0.7),
      new THREE.MeshStandardMaterial({
        map: this.mirrorTexture,
        roughness: 0.15,
        metalness: 0.65,
      })
    );
    mirrorMesh.position.set(2.8, 1.62, 2.91);
    this.scene.add(mirrorMesh);

    // Bathtub & Interactive Shower Curtain on South side of Bathroom
    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 0.85), porcelainMat);
    tub.position.set(3.1, 0.28, 5.45);
    this.scene.add(tub);

    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0x778882,
      roughness: 0.6,
      transparent: true,
      opacity: 0.84,
      side: THREE.DoubleSide,
    });
    const curtain = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.85), curtainMat);
    curtain.position.set(2.95, 1.45, 5.02);
    this.scene.add(curtain);
    this.props.showerCurtain = curtain;

    // --- 6. BREAKER BOX & REFRIGERATOR IN ALCOVE (x: -2.35 to -1.3, z: 5.4 to 7.0) ---
    const breakerBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.46), metalMat);
    breakerBox.position.set(-2.2, 1.45, 6.35);
    this.scene.add(breakerBox);
    this.props.breakerBox = breakerBox;

    this.props.breakerLevers = [];
    for (let i = 0; i < 3; i++) {
      const lever = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xcc2222 })
      );
      lever.position.set(-2.12, 1.56 - i * 0.12, 6.35);
      this.scene.add(lever);
      this.props.breakerLevers.push(lever);
    }

    // Old White Refrigerator in Alcove corner
    const fridgeMat = new THREE.MeshStandardMaterial({
      color: 0x9aa39e,
      roughness: 0.45,
      metalness: 0.25,
    });
    this.addWall(-1.85, 0.92, 5.72, 0.58, 1.84, 0.52, fridgeMat, true);
  }

  drawBathroomMirror(showCondensationText, showEntityBehind) {
    const ctx = this.mirrorCtx;
    const w = 512,
      h = 384;

    if (
      showEntityBehind &&
      this.mirrorScareImg &&
      this.mirrorScareImg.complete &&
      this.mirrorScareImg.naturalWidth > 0
    ) {
      ctx.drawImage(this.mirrorScareImg, 0, 0, w, h);
      this.mirrorTexture.needsUpdate = true;
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#141d21");
    grad.addColorStop(0.5, "#1f2c30");
    grad.addColorStop(1, "#0d1316");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(180,210,200,0.08)";
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(8, 10, 12, 0.78)";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.45, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 75, h * 0.58, 150, h * 0.45);

    if (showEntityBehind) {
      const entImg =
        this.textures.entityCloser && this.textures.entityCloser.image
          ? this.textures.entityCloser.image
          : null;
      if (entImg && entImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.drawImage(entImg, w * 0.08, h * 0.02, w * 0.62, h * 0.96);
        ctx.restore();
      }
    }

    if (showCondensationText) {
      ctx.save();
      ctx.fillStyle = "rgba(190, 25, 25, 0.85)";
      ctx.font = "bold 40px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText("НЕ СМОТРИ", w / 2, h * 0.32);
      ctx.fillText("НАЗАД", w / 2, h * 0.46);
      ctx.restore();
    }

    const rad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, 290);
    rad.addColorStop(0, "rgba(0,0,0,0)");
    rad.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);

    this.mirrorTexture.needsUpdate = true;
  }

  updateRainWindow(dt, time) {
    const ctx = this.winCtx;
    ctx.fillStyle = "#060b14";
    ctx.fillRect(0, 0, 256, 320);

    // Distant blurred city streetlight bokeh
    ctx.fillStyle = "rgba(255, 170, 80, 0.14)";
    ctx.beginPath();
    ctx.arc(70, 210, 28, 0, Math.PI * 2);
    ctx.arc(185, 240, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sliding raindrops
    ctx.strokeStyle = "rgba(150, 190, 235, 0.45)";
    ctx.lineWidth = 1.5;
    for (const r of this.rainDrops) {
      r.y += r.spd * dt;
      if (r.y > 320) {
        r.y = -20;
        r.x = Math.random() * 256;
      }
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 2, r.y + r.len);
      ctx.stroke();
    }

    // Window pane crossbars
    ctx.fillStyle = "#120d09";
    ctx.fillRect(124, 0, 8, 320);
    ctx.fillRect(0, 156, 256, 8);
    this.winTexture.needsUpdate = true;
  }

  updateCRTScreen(textLines, alertMode = false) {
    const ctx = this.crtCtx;
    ctx.fillStyle = alertMode ? "#1c0404" : "#04140c";
    ctx.fillRect(0, 0, 256, 192);

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    for (let y = 0; y < 192; y += 4) {
      ctx.fillRect(0, y, 256, 2);
    }

    ctx.fillStyle = alertMode ? "#ff3333" : "#33ff88";
    ctx.font = "bold 14px 'Courier New', monospace";
    textLines.forEach((ln, i) => {
      ctx.fillText(ln, 14, 34 + i * 24);
    });
    this.crtTexture.needsUpdate = true;
  }

  buildEntity() {
    this.entityGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      map: this.textures.entityStanding,
      transparent: true,
      alphaTest: 0.12,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    this.entityPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 2.26), mat);
    this.entityPlane.position.y = 1.13;
    this.entityGroup.add(this.entityPlane);
    this.entityGroup.visible = false;
    this.scene.add(this.entityGroup);
  }

  setEntityPose(pose = "standing") {
    if (!this.entityPlane) return;
    const mapLookup = {
      standing: this.textures.entityStanding,
      closer: this.textures.entityCloser,
      peeking: this.textures.entityPeeking || this.textures.entityStanding,
      crawling: this.textures.entityCrawling || this.textures.entityCloser,
    };
    const chosen = mapLookup[pose] || this.textures.entityStanding;
    this.entityPlane.material.map =
      chosen && chosen.image ? chosen : this.textures.entityStanding;
    this.entityPlane.position.y = pose === "crawling" ? 0.78 : 1.13;
    this.entityPlane.material.needsUpdate = true;
  }

  placeEntity(x, z, lookAtPlayer = true, pose = "standing") {
    this.setEntityPose(pose);
    this.entityGroup.position.set(x, 0, z);
    this.entityGroup.visible = true;
    this.entityVisible = true;
    if (lookAtPlayer) {
      this.entityGroup.lookAt(this.camera.position.x, 0, this.camera.position.z);
    }
  }

  hideEntity() {
    if (this.entityGroup) this.entityGroup.visible = false;
    this.entityVisible = false;
  }

  buildDustParticles() {
    const count = 240;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = Math.random() * 2.7;
      pos[i * 3 + 2] = -3.2 + Math.random() * 11.5;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x99aaaa,
      size: 0.024,
      transparent: true,
      opacity: 0.35,
    });
    this.dust = new THREE.Points(geo, mat);
    this.scene.add(this.dust);
  }

  triggerCameraFlash() {
    this.flashIntensity = 6.8;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.lights.cameraFlash.position.copy(this.camera.position).addScaledVector(dir, 0.55);
    this.lights.cameraFlash.intensity = this.flashIntensity;
    this.polaroidEjectProgress = 1.0;
    if (this.ejectCard) {
      this.ejectCard.visible = true;
      this.ejectCard.position.z = -0.04;
    }
  }

  canMoveTo(nx, nz) {
    for (const box of this.colliders) {
      if (nx > box.minX && nx < box.maxX && nz > box.minZ && nz < box.maxZ) {
        return false;
      }
    }
    if (this.bathroomDoorAngle < 0.25 && nx > 1.02 && nz > 3.75 && nz < 5.05) {
      return false;
    }
    return true;
  }

  update(dt, time, walkBob = 0, flashReady = true) {
    const camPos = this.camera.position;
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.lights.flashlight.position.copy(camPos);
    this.lights.flashlightTarget.position.copy(camPos).add(dir);

    // Animate 3D Viewmodels (Flashlight & Polaroid Camera)
    if (this.viewmodelFlashlight && this.viewmodelFlashlight.visible) {
      this.viewmodelFlashlight.position.y = -0.23 + Math.sin(walkBob) * 0.01;
      this.viewmodelFlashlight.position.x = 0.26 + Math.cos(walkBob * 0.5) * 0.007;
      if (this.flCone) {
        this.flCone.visible = this.lights.flashlight.intensity > 0.1;
      }
    }
    if (this.viewmodelCamera && this.viewmodelCamera.visible) {
      this.viewmodelCamera.position.y = -0.24 + Math.sin(walkBob + 1.0) * 0.01;
      this.camLedMat.color.setHex(flashReady ? 0x22ff66 : 0xff3322);
      if (this.polaroidEjectProgress > 0) {
        this.polaroidEjectProgress = Math.max(0, this.polaroidEjectProgress - dt * 0.7);
        this.ejectCard.position.z = -0.04 - (1 - this.polaroidEjectProgress) * 0.09;
        if (this.polaroidEjectProgress <= 0) this.ejectCard.visible = false;
      }
    }

    // Spin Reel-to-Reel tape recorder on Study desk
    if (this.reel1 && this.reel2) {
      this.reel1.rotation.z -= dt * 1.4;
      this.reel2.rotation.z -= dt * 1.4;
    }

    // Update rain window canvas
    this.updateRainWindow(dt, time);

    // Decay camera xenon flash
    if (this.flashIntensity > 0.01) {
      this.flashIntensity *= Math.exp(-dt * 7.2);
      if (this.flashIntensity < 0.02) this.flashIntensity = 0;
      this.lights.cameraFlash.intensity = this.flashIntensity;
    }

    // Animate doors & shower curtain
    this.bathroomDoorAngle +=
      (this.targetBathroomDoorAngle - this.bathroomDoorAngle) * Math.min(1, dt * 14);
    if (this.bathroomDoorPivot) {
      this.bathroomDoorPivot.rotation.y = this.bathroomDoorAngle;
    }

    this.frontDoorAngle +=
      (this.targetFrontDoorAngle - this.frontDoorAngle) * Math.min(1, dt * 12);
    if (this.frontDoorPivot) {
      this.frontDoorPivot.rotation.y = this.frontDoorAngle;
    }

    if (this.props.showerCurtain) {
      this.props.showerCurtain.position.x +=
        (this.curtainTargetX - this.props.showerCurtain.position.x) * Math.min(1, dt * 8);
    }

    // Entity billboard orientation & micro-twitch
    if (this.entityVisible && this.entityGroup) {
      this.entityGroup.lookAt(camPos.x, 0, camPos.z);
      const twitch = Math.sin(time * 37) * 0.022 * (Math.random() > 0.74 ? 2.5 : 0.2);
      this.entityPlane.rotation.z = twitch;
    }

    if (this.dust) {
      this.dust.rotation.y = time * 0.015;
    }
  }

  renderMain() {
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }
}

window.ApartmentWorld = ApartmentWorld;
