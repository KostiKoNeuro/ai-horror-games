import os
import sys
import time
import threading
import http.server
import socketserver
from playwright.sync_api import sync_playwright

PORT = 8779
GAME_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "game")
SCREENSHOT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "playtest_shots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=GAME_DIR, **kwargs)

    def log_message(self, format, *args):
        pass


def start_server():
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.request_queue_size = 128
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), QuietHandler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd


def run_playtest():
    httpd = start_server()
    url = f"http://127.0.0.1:{PORT}/index.html"
    console_errors = []
    page_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print("[1/11] Loading Title & Calibration Screen...")
        page.goto(url, wait_until="networkidle")
        time.sleep(0.8)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_title_screen.png"))

        # Test EN/RU toggle and 3D audio test button
        page.click("#lang-en")
        time.sleep(0.2)
        page.click("#lang-ru")
        page.click("#btn-audio-test")
        time.sleep(0.5)

        print("[2/11] Starting Game Session (Act I)...")
        page.click("#btn-start-game")
        time.sleep(1.0)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_act1_study_room.png"))

        # Test Dossier & Reel-to-Reel Tape Log [Q]
        print("[3/11] Inspecting Classified Dossier #404 & Reel-to-Reel Tape Log [Q]...")
        page.keyboard.press("KeyQ")
        time.sleep(0.8)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_dossier_modal.png"))
        page.keyboard.press("KeyQ")
        time.sleep(0.4)

        print("[4/11] Opening Act I 5-Camera Surveillance Terminal [E]...")
        page.keyboard.press("KeyE")
        time.sleep(0.6)
        # Test Baseline comparison toggle [R]
        page.keyboard.press("KeyR")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_act1_terminal_baseline.png"))
        page.keyboard.press("KeyR")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04b_act1_terminal_live.png"))

        # Tag all 5 camera anomalies
        for cam_i in range(5):
            if cam_i == 4:
                # Wait for 1.1s baseline->live glitch on CAM_05
                time.sleep(1.3)
            page.evaluate(
                """() => {
                    const g = window.game;
                    const anom = g.anomalies[g.currentPhotoIdx];
                    g.showingBaseline = false;
                    g.cursorX = anom.x * 640;
                    g.cursorY = anom.y * 360;
                    g.onTerminalAct1Click();
                }"""
            )
            time.sleep(0.4)

        # Wait for Act II transition (1.6s)
        time.sleep(1.8)
        act_now = page.evaluate("window.game.act")
        step_now = page.evaluate("window.game.step")
        print(f"       -> Transitioned to Act {act_now}, step={step_now}")
        assert act_now == 2 and step_now == "act2_phone", f"Expected Act 2 phone, got {act_now}/{step_now}"

        print("[5/11] Walking down Hallway & Answering Ringing Intercom Phone...")
        page.evaluate("window.game.world.camera.position.set(0, 1.62, 7.2); window.game.yaw = Math.PI;")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_act2_hallway_phone.png"))
        page.keyboard.press("KeyE")
        time.sleep(0.5)

        print("[6/11] Looking through Front Door Peephole...")
        page.keyboard.press("KeyE")
        time.sleep(4.0)  # Capture at 4.0s right when Peephole Entity face appears!
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_act2_peephole_entity.png"))
        time.sleep(2.1)  # Wait for peephole to close & bathroom door slam + cursed paintings

        print("[7/11] Opening Bathroom Door, Pulling Shower Curtain & Triggering Mirror Scare...")
        page.evaluate("window.game.world.camera.position.set(0.6, 1.62, 4.4); window.game.yaw = -Math.PI/2;")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "07_act2_cursed_hallway.png"))
        page.keyboard.press("KeyE")  # Open bathroom door
        time.sleep(0.5)
        page.evaluate("window.game.world.camera.position.set(2.5, 1.62, 4.3); window.game.yaw = Math.PI;")
        time.sleep(0.3)
        page.keyboard.press("KeyE")  # Open shower curtain
        time.sleep(0.5)
        page.evaluate("window.game.world.camera.position.set(2.8, 1.62, 3.6); window.game.yaw = 0;")
        time.sleep(0.3)
        page.keyboard.press("KeyE")  # Take fuse key & trigger mirror scare
        time.sleep(0.3)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "08_act2_mirror_scare.png"))
        time.sleep(1.6)  # Wait for total blackout & Act 3 start

        act_now = page.evaluate("window.game.act")
        print(f"       -> Transitioned to Act {act_now} (Blackout)")
        assert act_now == 3, f"Expected Act 3, got {act_now}"

        print("[8/11] Returning to Study, Picking up 3D Polaroid Camera & Flashing Entity...")
        page.evaluate("window.game.world.camera.position.set(0, 1.62, -1.8); window.game.yaw = 0;")
        time.sleep(0.3)
        page.keyboard.press("KeyE")  # Pick up Polaroid Camera
        time.sleep(0.4)
        page.evaluate("window.game.world.camera.position.set(0, 1.62, 2.2); window.game.yaw = Math.PI; window.game.flashCooldown = 0;")
        page.keyboard.press("Space")  # Flash #1 in dark hallway
        time.sleep(0.15)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "09_act3_camera_flash_entity.png"))
        time.sleep(0.7)

        print("[9/11] Flipping 3 Breaker Switches in Utility Alcove...")
        page.evaluate("window.game.world.camera.position.set(-1.65, 1.62, 6.3); window.game.yaw = Math.PI/2;")
        time.sleep(0.3)
        for _ in range(3):
            page.keyboard.press("KeyE")
            time.sleep(0.3)

        act_now = page.evaluate("window.game.act")
        print(f"       -> Transitioned to Act {act_now}")
        assert act_now == 4, f"Expected Act 4, got {act_now}"

        print("[10/11] Returning to Study Terminal for Act IV Dual-Feed Biometric Monitor...")
        page.evaluate("window.game.world.camera.position.set(0, 1.62, -1.8); window.game.yaw = 0;")
        time.sleep(0.3)
        page.keyboard.press("KeyE")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "10_act4_dual_feed.png"))
        # Fast-forward remaining Act 4 timer to 0.01s
        page.evaluate("window.game.act4Timer = 0.01; window.game.updateAct4LiveFeed(0.02);")
        time.sleep(0.4)

        act_now = page.evaluate("window.game.act")
        print(f"       -> Transitioned to Act {act_now} (Crimson Escape)")
        assert act_now == 5, f"Expected Act 5, got {act_now}"

        print("[11/11] Running down Crimson Corridor to Exit & Capturing Climax + Ending Dossier...")
        page.evaluate("window.game.world.camera.position.set(0, 1.62, 4.5); window.game.yaw = Math.PI;")
        time.sleep(0.3)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "11_act5_crimson_corridor.png"))

        page.evaluate("window.game.world.camera.position.set(0, 1.62, 7.3);")
        time.sleep(0.85)  # Capture during 2K Climax Jumpscare!
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "12_act5_climax_jumpscare.png"))

        time.sleep(2.0)  # Wait for Ending Evaluation Dossier & Fear Telemetry Graph
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, "13_ending_report.png"))

        ending_visible = page.evaluate("!document.getElementById('ending-modal').classList.contains('hidden')")
        assert ending_visible, "Ending report modal should be visible!"

        browser.close()
    httpd.shutdown()

    print(f"Playtest finished! Console errors: {len(console_errors)}, Page errors: {len(page_errors)}")
    if console_errors or page_errors:
        print("Console errors:", console_errors)
        print("Page errors:", page_errors)
        sys.exit(1)
    print("ALL 5 ACTS + DOSSIER + BASELINE + ENDING TELEMETRY VERIFIED WITH ZERO ERRORS!")


if __name__ == "__main__":
    run_playtest()
