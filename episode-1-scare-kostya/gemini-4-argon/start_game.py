"""One-command launcher for PROTOCOL: DO NOT LOOK (Scare Kostya)."""
import functools
import http.server
import os
import socket
import socketserver
import threading
import time
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
GAME_DIR = os.path.join(HERE, "game")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=GAME_DIR, **kwargs)

    def log_message(self, format, *args):
        pass


def find_free_port(preferred=8765):
    for port in [preferred, 8766, 8767, 8080, 0]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return s.getsockname()[1]
            except OSError:
                continue
    return preferred


def main():
    port = find_free_port(8765)
    url = f"http://127.0.0.1:{port}/index.html"
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.request_queue_size = 128
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), QuietHandler) as httpd:
        print(f"============================================================")
        print(f"  PROTOCOL: DO NOT LOOK // ПРОТОКОЛ: НЕ СМОТРИ (APT. 404)")
        print(f"  Running locally at: {url}")
        print(f"  Press Ctrl+C to stop the server.")
        print(f"============================================================")
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down game server.")


if __name__ == "__main__":
    main()
