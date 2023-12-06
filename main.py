import sass
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

StyleFiles = ["article"]

# This is temporary replace with a compile styles function 
def compile_style():
  for s_file in StyleFiles:
    input_file = f"app\\src\\{s_file}.scss"
    output_file = f"app\\compiled\\{s_file}.css"

    with open(input_file, 'r') as f:
      scss_content = f.read()

    with open(output_file, 'w') as f:
      sass_final = sass.compile(string=scss_content, output_style='compressed')

      f.write(sass_final)

    #try:
    #  sass.compile(filename=input_file, output_style='compressed', output_file=output_file)
    #  print(f"Compiled scss file {s_file} successfully")
    #except TypeError as e:
    #  print(f"Compilation failed on {s_file}: {e}. Dropping all future styles")
    #  break


class MyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Set the appropriate Content-Type header for HTML and CSS files

        path = self.path

        if path.endswith(".html"):
            self.send_header("Content-type", "text/html")
        elif path.endswith(".css"):
            self.send_header("Content-type", "text/css")
        elif path.endswith(".js"):
           self.send_header("Content-type", "text/javascript")

        super().end_headers()

compile_style()

if __name__ == "__main__":
    PORT = 8080
    with TCPServer(("", PORT), MyHandler) as httpd:
        print(f"Serving on port {PORT}")
        httpd.serve_forever()

MyHandler.server_close()