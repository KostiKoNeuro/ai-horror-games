"""Start Night Shift at Pumpkin Pete's: serves the game on http://127.0.0.1:8765 and opens it in the browser.

usage: python run.py              (add --no-browser to only start the server)
"""
import functools
import http.server
import os
import sys
import threading
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
PORT = 8765
ALLOWED = ("/index.html", "/js/", "/css/", "/assets/")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0]
        if path != "/" and not path.startswith(ALLOWED):
            self.send_error(404)
            return
        super().do_GET()

    def log_message(self, *args):
        pass


def main():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Handler, directory=HERE))
    url = "http://127.0.0.1:%d/" % PORT
    print("Night Shift at Pumpkin Pete's is running at " + url + "   (Ctrl+C to quit)")
    if "--no-browser" not in sys.argv:
        threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
