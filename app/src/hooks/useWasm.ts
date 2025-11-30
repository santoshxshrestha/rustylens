"use client";

import init, * as wasm from "../pkgs/wasm";
import { useEffect, useState } from "react";

let initPromise: Promise<unknown> | null = null;

export default function useWasm() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!initPromise) {
            initPromise = init()
                .then(() => {
                    setReady(true);
                })
                .catch((err) => {
                    console.error("Failed to initialize WASM:", err);
                });
        } else {
            initPromise.then(() => {
                setReady(true);
            });
        }
    }, []);
    return { ready, ...wasm };
}
