'use client';

import useWasm from "./src/hooks/useWasm";

export default function Home() {
    const {ready, greet} = useWasm();
    useWasm();

    const handleClick = () => {
        if (ready) {
            greet("santosh");
        }
    };
    return (
        <>
            <p className="antialiased text-lg"></p>
            <button
                className="bg-blue-500 text-white font-semibold rounded-lg px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={handleClick}
                aria-label="Click me"
            >
                Click Me
            </button>
        </>
    );
}
