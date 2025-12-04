"use client";

import { useEffect, useRef, useState } from "react";
import useWasm from "./src/hooks/useWasm";
import { handleConversion } from "@/utils/handleConversion";
import UnleashJulia from "./components/UnleashJulia";

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
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("png");
  const [convertFn, setConvertFn] = useState<(input: Uint8Array) => Uint8Array>(
    () => change_to_png,
  );
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadName, setDownloadName] = useState<string>("");

  useEffect(() => {
    switch (format) {
      case "jpeg":
      case "jpg":
        setConvertFn(() => change_to_jpeg);
        break;
      case "webp":
        setConvertFn(() => change_to_webp);
        break;
      case "bmp":
        setConvertFn(() => change_to_bmp);
        break;
      case "png":
        setConvertFn(() => change_to_png);
        break;
      case "avif":
        setConvertFn(() => change_to_avif);
        break;
      case "hdr":
        setConvertFn(() => change_to_hdr);
        break;
      case "ico":
        setConvertFn(() => change_to_ico);
        break;
      default:
        setConvertFn(() => change_to_png);
    }
  }, [
    format,
    change_to_png,
    change_to_jpeg,
    change_to_webp,
    change_to_bmp,
    change_to_avif,
    change_to_hdr,
    change_to_ico,
  ]);

  useEffect(() => {
    if (selectedFile && ready) {
      handleConversion({
        file: selectedFile,
        format,
        ready,
        convertFn,
        downloadUrl,
        setDownloadUrl,
      });
      const name = selectedFile?.name || "image";
      const base = name.includes(".")
        ? name.slice(0, name.lastIndexOf("."))
        : name;
      const ext = format === "jpg" ? "jpeg" : format;
      setDownloadName(`${base}.${ext}`);
    }
  }, [selectedFile, format, ready]);

  return (
    <>
      <main className="grow flex flex-col items-center gap-6 px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Image Converter
          </h1>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="w-full text-sm sm:text-base"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <label
              htmlFor="format"
              className="text-sm sm:text-base font-medium whitespace-nowrap"
            >
              Output format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm sm:text-base"
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
            className="flex items-center justify-center gap-2 w-full max-w-md px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold bg-linear-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Download {downloadName}
          </a>
        )}
        <UnleashJulia />
      </main>
    </>
  );
}
