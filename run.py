import requests
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urljoin
import webbrowser

PORT = 3000
TARGET_URL = "https://kzmojvriokceqxqj0eb7.lite.vusercontent.net"

class ProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        target_url = urljoin(TARGET_URL, self.path)
        try:
            headers = {
                "User-Agent": self.headers.get("User-Agent", "Mozilla/5.0"),
                "Accept": self.headers.get("Accept", "*/*"),
                "Accept-Language": self.headers.get("Accept-Language", "en-US"),
            }

            response = requests.get(target_url, headers=headers)

            self.send_response(response.status_code)
            for header, value in response.headers.items():
                if header.lower() not in ["content-length", "transfer-encoding", "content-encoding", "connection"]:
                    self.send_header(header, value)
            self.end_headers()

            content_type = response.headers.get("Content-Type", "")
            content = response.content

            if "text/html" in content_type:
                html = content.decode("utf-8", errors="ignore")
                html = html.replace(TARGET_URL, f"http://localhost:{PORT}")
                content = html.encode("utf-8")

            self.wfile.write(content)

            # Clean access log
            print(f"{self.command} {self.path:<30} {response.status_code} {response.reason}")

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"<h1>Internal Server Error</h1><p>{e}</p>".encode())
            print(f"{self.command} {self.path:<30} 500 Internal Server Error")

    def log_message(self, format, *args):
        return  # Disable built-in log

if __name__ == "__main__":
    print(f"Running on : http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}")
    try:
        server = HTTPServer(('localhost', PORT), ProxyHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
