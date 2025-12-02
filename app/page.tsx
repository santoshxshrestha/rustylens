'use client';

import useWasm from "./src/hooks/useWasm";

export default function Home() {
    const {ready, greet, change_to_png} = useWasm();
    useWasm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ready) {
            greet("santosh from submit");
        }

        const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
            let buff = new Uint8Array(await file.arrayBuffer());
           console.log(change_to_png(buff));

        }
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-4 border-2 border-gray-300 rounded-lg bg-gray-50 shadow-md">
            <input type="file" className="w-12 h-12 cursor-pointer border-none outline-none" />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors">
                Submit
            </button>
        </form>
        </>
    );
}
