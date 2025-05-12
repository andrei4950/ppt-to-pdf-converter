import os
import uuid
import shutil
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from converter import convert_pptx_to_pdf
import boto3

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# Simple in-memory store; TODO: for production use a real DB
jobs = {}

S3_BUCKET = os.environ["S3_BUCKET"]
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    region_name=os.environ.get("AWS_REGION", "us-east-1"),
)

@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok")

@app.route("/convert", methods=["POST"])
def convert():
    # 1. Accept file
    if "file" not in request.files:
        return jsonify(error="No file part"), 400
    file = request.files["file"]
    if file.filename == "" or not file.filename.lower().endswith(".pptx"):
        return jsonify(error="Invalid file"), 400

    # 2. Job setup
    job_id = str(uuid.uuid4())
    job_dir = os.path.join("tmp", job_id)
    os.makedirs(job_dir, exist_ok=True)
    input_path = os.path.join(job_dir, "input.pptx")
    output_path = os.path.join(job_dir, "output.pdf")
    file.save(input_path)

    # 3. Mark as processing
    jobs[job_id] = { "status": "processing", "pdf_url": None }

    try:
        # 4. Convert PPTX → PDF
        convert_pptx_to_pdf(input_path, output_path)

        # 5. Upload PDF to S3
        key = f"{job_id}.pdf"
        s3.upload_file(output_path, S3_BUCKET, key)
        presigned_url = s3.generate_presigned_url(
            "get_object",
            Params={ "Bucket": S3_BUCKET, "Key": key },
            ExpiresIn=3600  # 1 hour
        )

        # 6. Update job status
        jobs[job_id] = { "status": "done", "pdf_url": presigned_url }

        # 7. Clean up temp files
        shutil.rmtree(job_dir)

        # 8. Respond
        return jsonify(jobId=job_id, status="processing")
    except Exception as e:
        jobs[job_id]["status"] = "error"
        return jsonify(error=str(e)), 500
    
@app.route("/status/<job_id>", methods=["GET"])
def status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify(error="Unknown jobId"), 404
    return jsonify(jobId=job_id, status=job["status"])

@app.route("/download/<job_id>", methods=["GET"])
def download(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify(error="Unknown jobId"), 404
    if job["status"] != "done":
        return jsonify(error="Not ready"), 400
    # Either redirect or return the URL JSON; front-end can open it directly
    return redirect(job["pdf_url"], code=302)
    # Or: return jsonify(url=job["pdf_url"])


if __name__ == "__main__":
    # Only used when running `python app.py` locally,
    # not by Gunicorn in Docker.
    app.run(host="0.0.0.0", port=5000, debug=True)
