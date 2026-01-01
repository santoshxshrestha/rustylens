"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export default function ThemeToggleHeader() {
    const [dark, setDark] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        setDark(stored==="dark");
    },[])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleToggle = () => {
    setDark((d) => !d);
  };

  return (
    <header
      className={clsx(
        "w-full flex justify-between items-center px-4 py-3 border-b border-theme",
        "bg-surface",
      )}
    >
      <Link
        href="/"
        className="text-3xl border-b font-extrabold
                "
      >
        RustyLens
      </Link>
      <button
        onClick={handleToggle}
        className={clsx("px-3 py-1 rounded text-sm transition-colors", {
          "bg-gray-200 hover:bg-gray-300 text-black border-b": !dark,
          "bg-gray-700 hover:bg-gray-600 text-white border-b": dark,
        })}
        aria-label="Toggle dark mode"
      >
        {dark ? "Light" : "Dark"} Mode
      </button>
    </header>
  );
}
