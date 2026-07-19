"use client";

import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";

export type LabTheme = "dark" | "light";

const STORAGE_KEY = "mehfil-lab-theme";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function readStoredTheme(): LabTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* private mode / blocked storage */
  }
  return "dark";
}

function persistTheme(theme: LabTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

type LabThemeToggleProps = {
  theme: LabTheme;
  onThemeChange: (theme: LabTheme) => void;
};

/**
 * Ink-blot theme switch. Clicking pours the opposite mode across the page
 * as a circular flood from the pointer — View Transition API when available,
 * instant swap otherwise.
 */
export function LabThemeToggle({ theme, onThemeChange }: LabThemeToggleProps) {
  const next = theme === "dark" ? "light" : "dark";
  const label =
    theme === "dark" ? "Spill daylight" : "Pour the night";
  const urdu = theme === "dark" ? "دن" : "رات";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    const root = document.documentElement;
    root.style.setProperty("--lab-ink-x", `${x}px`);
    root.style.setProperty("--lab-ink-y", `${y}px`);

    const apply = () => {
      flushSync(() => {
        onThemeChange(next);
      });
      persistTheme(next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as DocumentWithViewTransition;

    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(apply);
      return;
    }

    apply();
  };

  return (
    <button
      type="button"
      className="lab-theme"
      onClick={handleClick}
      aria-label={label}
      title={label}
      data-mode={theme}
    >
      <span className="lab-theme__blot" aria-hidden>
        <span className="lab-theme__core" />
      </span>
      <span className="lab-theme__copy">
        <span className="lab-theme__urdu lab-urdu">{urdu}</span>
        <span className="lab-theme__en">{theme === "dark" ? "Day" : "Night"}</span>
      </span>
    </button>
  );
}

/** Hydrate theme from storage before paint; default remains After Dark. */
export function useLabTheme() {
  const [theme, setTheme] = useState<LabTheme>("dark");

  useLayoutEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  return [theme, setTheme] as const;
}
