"use client";

import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadIcon from "@/icons/UploadIcon";
import { useUploadStore } from "@/store/useUploadStore";

const ChooseFileStep: FC = () => {
  const setFile = useUploadStore((s) => s.setFile);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] },
  });

  return (
    <div
      className="group cursor-pointer rounded-xl border border-dashed border-gray-400 bg-white px-6 py-16"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className="mb-2 rounded-full bg-gray-100 p-2">
          <div className="rounded-full bg-gray-200 p-2 [&>svg]:w-8 [&>svg]:h-8">
            <UploadIcon />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop your .pptx here…"
            : "Drag & drop a PowerPoint file (.pptx) to convert to PDF."}
        </p>
        <button
          type="button"
          className="rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700 transition-colors group-hover:bg-blue-100"
        >
          Choose file
        </button>
      </div>
    </div>
  );
};

export default ChooseFileStep;
