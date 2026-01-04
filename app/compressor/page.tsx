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
    const [{initialSize, outputSize}, setSizes] = useState<{initialSize: number; outputSize: number}>({initialSize: 0, outputSize: 0});

    useEffect(() => {
        let isCancelled = false;
        let currentUrl: string | null = null;

        if (selectedFile && ready) {
            (async () => {
                console.log("WASM is ready, starting compression...");

                const initialFormat = selectedFile.name.split('.').pop() || 'png';
                let currentFormat = format;

                // Set format based on initial format if it's the first time
                if (format === "png" && (initialFormat.toLowerCase() === "jpeg" || initialFormat.toLowerCase() === "jpg")) {
                    currentFormat = "jpeg";
                    setFormat("jpeg");
                }

                const inputBytes = new Uint8Array(await selectedFile.arrayBuffer());
                if (isCancelled) return;

                const outBytes = compress_image(inputBytes, quality, currentFormat);
                if (isCancelled) return;

                console.log("initialsize:", inputBytes.length, "outsize:", outBytes.length, "difference:", inputBytes.length - outBytes.length);
                setSizes({initialSize: inputBytes.length, outputSize: outBytes.length});

                const mime = currentFormat === "jpeg" ? "image/jpeg" : "image/png";
                const blob = new Blob([new Uint8Array(outBytes)], { type: mime });
                const url = URL.createObjectURL(blob);
                currentUrl = url;

                setDownloadName(selectedFile.name.replace(/\.[^/.]+$/, "") + `_compressed.${currentFormat}`);
                setDownloadUrl(url);
            })();
        }

        return () => {
            isCancelled = true;
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [selectedFile, format, ready, quality, compress_image]);

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
                    {initialSize > 0 && (
                        <div className="w-full grid grid-cols-2 gap-4 text-sm sm:text-base border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400">Original Size</span>
                                <span className="font-semibold">{(initialSize / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-gray-500 dark:text-gray-400">Compressed Size</span>
                                <span className={`font-semibold ${outputSize < initialSize ? "text-green-500" : "text-amber-500"}`}>
                                    {(outputSize / 1024).toFixed(2)} KB
                                </span>
                            </div>
                            <div className="col-span-2 text-center text-xs text-gray-400">
                                Reduction: {(((initialSize - outputSize) / initialSize) * 100).toFixed(1)}%
                            </div>
                        </div>
                    )}
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

