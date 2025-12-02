'use client';

import { useMemo, useRef, useState } from "react";
import useWasm from "./src/hooks/useWasm";

export default function Home() {
    const { ready, change_to_png, change_to_jpeg, change_to_webp, change_to_bmp, change_to_avif, change_to_hdr, change_to_ico } = useWasm();
    const [format, setFormat] = useState<string>("png");
    const [downloadUrl, setDownloadUrl] = useState<string>("");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ready) {
            console.log("WASM is ready, starting conversion...");
        }
        const file = fileRef.current?.files?.[0];
        if (!file) return;

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
        const name = fileRef.current?.files?.[0]?.name || "image";
        const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
        const ext = format === "jpg" ? "jpeg" : format;
        return `${base}.${ext}`;
    }, [format]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 p-4 border-2 border-gray-300 rounded-lg shadow-md w-full max-w-md"
            >
                <input ref={fileRef} type="file" accept="image/*" className="w-full" />

                <div className="flex items-center gap-2 w-full">
                    <label htmlFor="format" className="text-sm font-medium">Output format</label>
                    <select
                        id="format"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                    >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WEBP</option>
                        <option value="bmp">BMP</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={!ready}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    Convert
                </button>
            </form>

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    download={downloadName}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                    Download {downloadName}
                </a>
            )}
        </div>
    );
}
