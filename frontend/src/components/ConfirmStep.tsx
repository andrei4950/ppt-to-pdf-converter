"use client";

import { FC } from "react";
import { useUploadStore } from "@/store/useUploadStore";

const API = process.env.NEXT_PUBLIC_API_URL;

const ConfirmStep: FC = () => {
  const { file, setStatus, setJobId, setError , reset} = useUploadStore();
  
  const onConfirm = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API}/convert`, {
        method: "POST",
        body: form,
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      
      setJobId(json.jobId);
      setStatus("processing");
    } catch (err: any) {
      setError(err.message);
    }
  };

return (
    <div className="space-y-4 bg-white rounded-2xl p-6 shadow">
      <p>Selected file: <strong>{file?.name}</strong></p>
      <div className="flex gap-4">
        <button
          className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          onClick={reset}
        >
          Cancel
        </button>
        <button
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={onConfirm}
        >
          Confirm &amp; Convert
        </button>
      </div>
    </div>
  );
};

export default ConfirmStep;
