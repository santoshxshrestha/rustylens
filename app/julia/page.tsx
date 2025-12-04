"use client";

import { useState,useEffect } from "react";
import useWasm from "../src/hooks/useWasm";

export default function JuliaPage() {
    const {ready, generate_fractals} = useWasm();
    const [dimension, setDimension] = useState("800x800");
    const [format, setFormat] = useState("png");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!ready) return;
        console.log("WASM is ready, generating fractal...");
        const [width, height] = dimension.split("x").map(Number);
        const fractalBytes = generate_fractals(width, height, format);

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
              case "avif":
                return "image/avif";
              case "hdr":
                return "image/vnd.radiance";
              case "ico":
                return "image/x-icon";
              default:
                return "application/octet-stream";
            }
          })();

        const bytes = fractalBytes.slice();
        const blob = new Blob([bytes.buffer], { type: mime });

        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
    }, [dimension, format]);


    return (
    <>
      <main className="grow flex flex-col items-center gap-6 px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-center">Julia</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <label htmlFor="dimension" className="text-sm sm:text-base font-medium whitespace-nowrap">
                            Output dimension
            </label>
            <select
              id="dimension"
              onChange={(e) => setDimension(e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm sm:text-base"
            >
                <option value="800x800">800 x 800</option>
                <option value="1024x1024">1024 x 1024</option>
                <option value="1280x720">1280 x 720</option>
                <option value="1920x1080">1920 x 1080</option>
                <option value="3840x2160">3840 x 2160</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <label htmlFor="format" className="text-sm sm:text-base font-medium whitespace-nowrap">
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
            download="julia_fractal"
            className="flex items-center justify-center gap-2 w-full max-w-md px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold bg-linear-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download
          </a>
        )}
        </main>
    </>
    );
}
