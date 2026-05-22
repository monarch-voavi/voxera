"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function readSavedTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem("voxera-theme") === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("voxera-theme", next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-amber-200" /> : <Moon className="h-4 w-4 text-indigo-500" />}
    </button>
  );
}
