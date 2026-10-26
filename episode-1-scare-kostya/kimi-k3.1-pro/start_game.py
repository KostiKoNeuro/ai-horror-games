"""Launch the local game. No third-party packages or network access required."""
import http.server
import os
import socketserver
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8314
os.chdir(ROOT)

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as server:
    threading.Timer(0.6, lambda: webbrowser.open(f"http://127.0.0.1:{PORT}/index.html")).start()
    print(f"СМЕНА: http://127.0.0.1:{PORT}  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
