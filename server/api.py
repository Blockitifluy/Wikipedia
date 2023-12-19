from flask import Flask, jsonify, request 

app = Flask(__name__)

PORT : int = 8050
HOST_NAME : str = "localhost"

@app.route('/get_page', method=['GET'])
def get_page(name : str):
  response = {'message' : name}

  return jsonify(response)

if __name__ == "__main__":
  app.run(port=PORT, host=HOST_NAME)