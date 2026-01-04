"use client"

import { useEffect, useRef, useState } from "react"
import useWasm from "../src/hooks/useWasm"

export default function Compressor() {
    const {ready,compress_image} = useWasm();
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [format, setFormat] = useState<string>("png")
    const [downloadUrl, setDownloadUrl] = useState<string>("")
    const [downloadName, setDownloadName] = useState<string>("")
    const [quality, setQuality] = useState<number>(80)

    useEffect(() => {
        if (selectedFile && ready) {
            (async () => {
                console.log("WASM is ready, starting compression...");

                // Determine initial format from file extension
                const initialFormat = selectedFile.name.split('.').pop() || 'png';

                // Set format based on initial format
                switch(initialFormat.toLowerCase()) {
                    case "jpeg": setFormat("jpeg"); break;
                    case "jpg": setFormat("jpeg"); break;
                    default:
                        setFormat("png");
                }

                // Set download name
                setDownloadName(selectedFile.name.replace(/\.[^/.]+$/, "") + `_compressed.${format}`);

                const inputBytes = new Uint8Array(await selectedFile.arrayBuffer());
                const outBytes = compress_image(inputBytes,quality,format);

                // Determine MIME type already relolved the jpg to jpeg so no need to check for jpg here
                const mime: string = (() => {
                    switch (format) {
                        case "jpeg":
                            return "image/jpeg";
                        case "png":
                            return "image/png";
                        default:
                            return "image/png";
                    }
                })();

                const bytes = outBytes.slice();
                const blob = new Blob([bytes.buffer], { type: mime });

                if (downloadUrl) URL.revokeObjectURL(downloadUrl);
                const url = URL.createObjectURL(blob);
                setDownloadUrl(url);

                return () => {
                    URL.revokeObjectURL(url);
                };
            })();
        }
    }, [selectedFile, format, ready,quality]);

    return (
        <>
            <main className="grow flex flex-col items-center gap-6 px-4 py-8 sm:py-12">
                <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-xl sm:text-2xl font-bold text-center">
                        Image Compressor
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
                            Quality:
                        </label>
                        <input
                            type="range"
                            id="quality"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            min={1}
                            max={100}
                            className="grow h-2 rounded-lg accent-blue-500 cursor-pointer"
                        />
                        <span className="w-10 text-right text-sm sm:text-base font-medium">{quality}%</span>
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
            </main>
        </>
    );

}

