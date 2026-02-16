"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEffectiveTheme,
  getStoredTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme";

const LABELS: Record<Theme, { label: string }> = {
  light: { label: "Switch to dark mode" },
  dark: { label: "Switch to light mode" },
};

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getEffectiveTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => {
      if (getStoredTheme() !== null) return;
      setTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [mounted]);

  const handleToggle = useCallback(() => {
    setTheme(toggleTheme());
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary"
        aria-hidden
      >
        …
      </span>
    );
  }

  const { label } = LABELS[theme];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary transition-all duration-200 ease-out hover:bg-bg-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
    >
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
