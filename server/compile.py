import os
import sass
import subprocess

STYLE_FILES = ["article"]
TS_FILES = ["script"]

def ts_to_js():
  tsc_path = "C:\\Users\\zurie\\AppData\\Roaming\\npm\\tsc.cmd"

  for ts_file in TS_FILES:
    input_file = os.path.abspath(f"app/src/{ts_file}.ts")
    output_file = os.path.abspath(f"app/resources/{ts_file}.js")

    subprocess.run([tsc_path, input_file, "--outFile", output_file], capture_output=True, text=True) #TODOs

# This is temporary replace with a compile styles function 
def scss_to_css():
  for s_file in STYLE_FILES:
    input_file = f"app/src/{s_file}.scss"
    output_file = f"app/resources/{s_file}.css"

    with open(input_file, 'r') as f:
      scss_content = f.read()

    with open(output_file, 'w') as f:
      sass_final = sass.compile(string=scss_content, output_style='expanded')

      f.write(sass_final)