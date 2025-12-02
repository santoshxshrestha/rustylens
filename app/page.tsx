"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useWasm from "./src/hooks/useWasm";

export default function Home() {
  const {
    ready,
    change_to_png,
    change_to_jpeg,
    change_to_webp,
    change_to_bmp,
    change_to_avif,
    change_to_hdr,
    change_to_ico,
  } = useWasm();
  const [format, setFormat] = useState<string>("png");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const convertFn = useMemo(() => {
    switch (format) {
      case "jpeg":
      case "jpg":
        return change_to_jpeg;
      case "webp":
        return change_to_webp;
      case "bmp":
        return change_to_bmp;
      case "png":
        return change_to_png;
      case "avif":
        return change_to_avif;
      case "hdr":
        return change_to_hdr;
      case "ico":
        return change_to_ico;

      default:
        return change_to_png;
    }
  }, [format, change_to_png, change_to_jpeg, change_to_webp, change_to_bmp]);

  const handleConversion = async (file: File) => {
    if (!ready) return;

    console.log("WASM is ready, starting conversion...");

    const inputBytes = new Uint8Array(await file.arrayBuffer());
    const outBytes = convertFn(inputBytes);

    const resolvedFormat = (format === "jpg" ? "jpeg" : format).toLowerCase();
    const mime: string = (() => {
      switch (resolvedFormat) {
        case "jpeg":
          return "image/jpeg";
        case "png":
          return "image/png";
        case "webp":
          return "image/webp";
        case "bmp":
          return "image/bmp";
        default:
          return "application/octet-stream";
      }
    })();

    const bytes = outBytes.slice();
    const blob = new Blob([bytes.buffer], { type: mime });

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  const downloadName = useMemo(() => {
    const name = selectedFile?.name || "image";
    const base = name.includes(".")
      ? name.slice(0, name.lastIndexOf("."))
      : name;
    const ext = format === "jpg" ? "jpeg" : format;
    return `${base}.${ext}`;
  }, [format, selectedFile]);

  useEffect(() => {
    if (selectedFile && ready) {
      handleConversion(selectedFile);
    }
  }, [selectedFile, format, ready]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-md">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />

        <div className="flex items-center gap-2 w-full">
          <label htmlFor="format" className="text-sm font-medium">
            Output format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
            <option value="ico">ICO</option>
            <option value="bmp">BMP</option>
            <option value="hdr">HDR</option>
            <option value="avif">AVIF</option>
          </select>
        </div>
      </div>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={downloadName}
          className="flex items-center justify-center gap-2 w-full max-w-md px-6 py-4 text-white font-semibold bg-linear-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-b"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download {downloadName}
        </a>
      )}
    </div>
  );
}
