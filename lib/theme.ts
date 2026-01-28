/**
 * Centralized theme logic. Used by ThemeToggle and any consumer
 * that needs to read or persist theme.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "light" || s === "dark" ? s : null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Resolved theme: stored override or system. */
export function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  setStoredTheme(theme);
}

/** Toggle between light and dark; returns new theme. */
export function toggleTheme(): Theme {
  const current = getEffectiveTheme();
  const next: Theme = current === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
}
