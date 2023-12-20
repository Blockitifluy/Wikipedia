import os
import mimetypes
import http.server as http

PORT : int = 8000
HOST_NAME : str = "localhost"

ROOT_DIR = os.curdir
os.chdir(ROOT_DIR)

class Server(http.BaseHTTPRequestHandler):
  def do_GET(self):
    file_path = self.path[1:]

    match self.path:
      case "/favicon.ico":
        file_path = "public/favicon.ico"
      case "/":
        file_path = "public/front.html"

    if self.path.startswith("/wiki?page="):
      file_path = "public/page.html"

    content_type = mimetypes.guess_type(file_path)

    try:
      with open(file_path, "rb") as f:
        content = f.read()

      self.send_response(200)
    except FileNotFoundError:
      content = bytes()

      self.send_response(404)

    self.send_header("Content-type", content_type)
    self.end_headers()
    self.wfile.write(content)


def load_server():
  webServer = http.HTTPServer((HOST_NAME, PORT), Server)

  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass

  webServer.server_close()

def compile_f():
  import compile

  compile.scss_to_css()
  compile.ts_to_js()

  print("Finished compiling sass stylesheets")

global choice_broken
choice_broken : bool = False

while not choice_broken:
  choice = input("compile, start or quit (c, s, q): ")

  match choice:
    case "c":
      print("Compiling Scripts and Stylesheets")

      compile_f()
    case "s":
      print("Starting Servers")

      load_server()
      choice_broken = True
    case other:
      print("Quiting")
      choice_broken = True
    