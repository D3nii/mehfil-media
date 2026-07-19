"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks how far a tall section has been scrolled through (0 → 1) without
 * triggering React renders — the value lands in a mutable ref that R3F
 * frame loops read directly.
 */
export function useSectionProgress(
  sectionRef: RefObject<HTMLElement | null>,
): RefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progress.current =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return progress;
}
