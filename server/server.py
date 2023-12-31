import os
import pathlib
import mimetypes
import http.server as http
from furl import furl
import re

def home_page(url : str) -> str:
  return "public/front.html"

def raw_txt(url : str) -> str:
  parsed_url = furl(url)

  return f"server/pages/{parsed_url.args['page']}.txt"

def wiki_page(url : str) -> str:
  return "public/page.html"

def favicon(url : str) -> str:
  return "public/favicon.ico"

site_search = {
  r"\/get_raw\?page=.+" : raw_txt,
  r"\/wiki\?page=.+" : wiki_page,
  r"\/favicon\.ico" : favicon,
  r"\/" : home_page,
}

PORT : int = 8000
HOST_NAME : str = "localhost"

ROOT_DIR = os.curdir
os.chdir(ROOT_DIR)

class Server(http.BaseHTTPRequestHandler):
  def do_GET(self):
    file_path = self.path[1:]

    for url_search, funct in site_search.items():
      matches : bool = len(re.findall(url_search, self.path)) == 1

      if matches:
        file_path = funct(self.path)
        break

    content_type = mimetypes.guess_type(file_path)

    if pathlib.Path(file_path).suffix == "":
      file_path += ".js"
      
    if pathlib.Path(file_path).suffix == ".js":
      content_type = 'application/javascript'


    try:
      with open(file_path, "rb") as f:
        content = f.read()

      self.send_response(200)
    except FileNotFoundError:
      content = bytes()

      self.send_response(404)

    self.send_header("Content-type", content_type) # type: ignore
    self.end_headers()
    self.wfile.write(content)

webServer = http.HTTPServer((HOST_NAME, PORT), Server)

try:
  webServer.serve_forever()
except KeyboardInterrupt:
  pass

webServer.server_close()