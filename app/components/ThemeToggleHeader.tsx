"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ThemeToggleHeader() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return (
      document.documentElement.classList.contains("dark") ||
      (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false)
    );
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header
      className={clsx(
        "w-full flex justify-between items-center px-4 py-3 border-b border-theme",
        "bg-surface",
      )}
    >
      <h1 className="text-lg font-semibold">RustyLens</h1>
      <button
        onClick={() => setDark((d) => !d)}
        className={clsx(
          "px-3 py-1 rounded text-sm transition-colors",
          "text-white btn-accent",
        )}
        aria-label="Toggle dark mode"
      >
        {dark ? "Light" : "Dark"} Mode
      </button>
    </header>
  );
}
