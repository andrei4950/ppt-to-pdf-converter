"use client";

import ChooseFileStep from "@/components/ChooseFileStep";
import ConfirmStep from "@/components/ConfirmStep";
import ProgressStep from "@/components/ProgressStep";
import DownloadStep from "@/components/DownloadStep";
import { useUploadStore } from "@/store/useUploadStore";

export default function Home() {
  const { status, error } = useUploadStore();

  return (
    <main className="w-full max-w-[420px] mx-auto mt-8 space-y-6">
      {status === "idle" && <ChooseFileStep />}
      {status === "ready" && <ConfirmStep />}
      {(status === "uploading" || status === "processing") && <ProgressStep />}
      {status === "done" && <DownloadStep />}
      {status === "error" && (
        <div className="text-red-600 p-4 bg-red-100 rounded">{error}</div>
      )}
    </main>
  );
}
