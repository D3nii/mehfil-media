"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "motion/react";

declare global {
  interface Window {
    /** Exposed for programmatic scrolling (tests, tooling) */
    __lenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      anchors: true,
    });
    window.__lenis = lenis;

    let raf: number;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-rani"
        style={{ scaleX: progress }}
      />
      {children}
    </>
  );
}
