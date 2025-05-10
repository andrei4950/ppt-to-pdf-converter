from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok")

# You’ll add your /convert, /status, /download routes here later…

if __name__ == "__main__":
    # Only used when running `python app.py` locally,
    # not by Gunicorn in Docker.
    app.run(host="0.0.0.0", port=5000, debug=True)
    