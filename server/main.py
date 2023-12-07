import json
import pathlib
import compile
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import os

with open('server\\header.json', 'r') as f:
  header_json : dict[str, str] = json.load(f)

def use_header(fileDir : str) -> str | None:
  extension : str = pathlib.Path(fileDir).suffix
  final : str | None = None

  for key, value in header_json:
    if extension != key:
      continue

    final = value
    break

  return final

class MyHandler(SimpleHTTPRequestHandler):
  def end_header(self):
    # Set the appropriate Content-Type header for HTML and CSS files

    path : str = self.path

    header = use_header(path)

    if header != None:
      self.send_header("Content-type", header)

    super().end_headers()


print("Current Working Directory:", os.getcwd())
compile.scss_to_css()
compile.ts_to_js()


print("Finished compiling sass stylesheets")

PORT : int = 8080
with TCPServer(("", PORT), MyHandler) as httpd:
  print(f"Serving on port {PORT}")
  httpd.serve_forever()

MyHandler.server_close() # type: ignore