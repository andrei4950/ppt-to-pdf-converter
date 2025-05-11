"use client";

import { FC, useEffect, useState } from "react";
import LoadingIndicatorIcon from "@/icons/LoadingIndicatorIcon";
import { useUploadStore } from "@/store/useUploadStore";

const API = process.env.NEXT_PUBLIC_API_URL;

const ProgressStep: FC = () => {
  const { jobId, file, setPdfUrl, setError, setStatus } = useUploadStore();
  const [uploadedPct, setUploadedPct] = useState(0);

  useEffect(() => {
    if (!file || !jobId) return;

    // 1) Upload with progress
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/convert`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadedPct(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status !== 200) {
        setError(`Upload failed: ${xhr.responseText}`);
        return;
      }
      // Response handled in ConfirmStep; now start polling
    };
    xhr.onerror = () => setError("Network error during upload");

    const form = new FormData();
    form.append("file", file);
    xhr.send(form);

    // 2) Polling for conversion
    const interval = setInterval(async () => {
      const res = await fetch(`${API}/status/${jobId}`);
      const { status } = await res.json();
      if (status === "done") {
        clearInterval(interval);
        setPdfUrl(`${API}/download/${jobId}`);
      } else if (status === "error") {
        clearInterval(interval);
        setError("Conversion failed");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [file, jobId, setPdfUrl, setError, setStatus]);

  return (
    <div className="space-y-4 bg-white rounded-2xl p-6 shadow text-center">
      <LoadingIndicatorIcon className="mx-auto animate-spin" />
      {uploadedPct < 100 ? (
        <p>Uploading… {uploadedPct}%</p>
      ) : (
        <p>Converting… please wait</p>
      )}
    </div>
  );
};

export default ProgressStep;
