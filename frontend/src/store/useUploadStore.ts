import { create } from "zustand";

export type Status =
  | "idle"       // nothing selected
  | "ready"      // file selected, waiting for confirm
  | "uploading"  // sending to backend
  | "processing" // backend converting
  | "done"       // conversion finished
  | "error";     // something went wrong

interface UploadState {
  file: File | null;
  jobId: string | null;
  status: Status;
  pdfUrl: string | null;
  error: string | null;

  setFile: (file: File) => void;
  setJobId: (id: string) => void;
  setStatus: (s: Status) => void;
  setPdfUrl: (url: string) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  jobId: null,
  status: "idle",
  pdfUrl: null,
  error: null,

  setFile: (file) => set({ file, status: "ready", error: null }),
  setJobId: (jobId) => set({ jobId }),
  setStatus: (status) => set({ status }),
  setPdfUrl: (pdfUrl) => set({ pdfUrl, status: "done" }),
  setError: (error) => set({ error, status: "error" }),
  reset: () => set({
    file: null,
    jobId: null,
    status: "idle",
    pdfUrl: null,
    error: null,
  }),
}));
