"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: an ink dot with a trailing ring. The ring expands and
 * shows a label when hovering elements marked with [data-cursor].
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 35 });
  const ringY = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-root");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, [x, y]);

  if (!enabled) return null;

  const active = label !== null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[299] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/40 bg-ivory/60 backdrop-blur-sm"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: active ? 84 : 32,
          height: active ? 84 : 32,
          backgroundColor: active
            ? "rgba(196, 13, 83, 0.92)"
            : "rgba(250, 246, 240, 0.4)",
          borderColor: active ? "rgba(196,13,83,0)" : "rgba(23,19,16,0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {active ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">
            {label}
          </span>
        ) : null}
      </motion.div>
    </>
  );
}
