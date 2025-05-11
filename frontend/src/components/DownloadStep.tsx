"use client";

import { FC } from "react";
import { PdfIcon } from "@/icons/PdfIcon";
import { useUploadStore } from "@/store/useUploadStore";

const DownloadStep: FC = () => {
  const { reset, pdfUrl } = useUploadStore();

return (
    <div className="space-y-4 bg-white rounded-2xl p-6 shadow text-center">
      {/* 1. Centered PDF icon */}
      <div className="flex justify-center">
        <PdfIcon />
      </div>

      {/* 2. Success message */}
      <p className="text-lg font-medium text-gray-800">
        File converted successfully!
      </p>

      {/* 3 & 4. Buttons row: “Convert another” left, “Download PDF” right with blue styling */}
      <div className="flex gap-4 justify-center">
        <button
          className="flex-1 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          onClick={reset}
        >
          Convert another
        </button>
        <button
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => window.open(pdfUrl!, "_blank")}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default DownloadStep;
