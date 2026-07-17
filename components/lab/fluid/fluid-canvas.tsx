"use client";

import { useEffect, useRef } from "react";

import { FluidSim } from "./fluid-sim";

/** Rani-pink / gold / ivory ink palette, in linear-ish dye space. */
const INKS: [number, number, number][] = [
  [0.55, 0.02, 0.16], // rani
  [0.5, 0.3, 0.06], // antique gold
  [0.32, 0.05, 0.2], // magenta-plum
  [0.42, 0.36, 0.28], // warm ivory glow
];

type FluidCanvasProps = {
  className?: string;
  /** Emit gentle autonomous splats when the pointer is idle. */
  ambient?: boolean;
};

/**
 * Full-bleed WebGL2 fluid layer. Pointer movement stirs pigment into the
 * velocity field; when idle, a slow breathing pattern keeps the ink alive.
 * Renders nothing (gracefully) when WebGL2 or motion is unavailable.
 */
export function FluidCanvas({ className, ambient = true }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sim: FluidSim;
    try {
      sim = new FluidSim(canvas, {
        simResolution: 144,
        dyeResolution: 720,
        curl: 26,
        splatRadius: 0.004,
        densityDissipation: 1.05,
      });
    } catch {
      return; // no WebGL2 — the CSS gradient backdrop carries the scene
    }

    let inkIndex = 0;
    let lastX = -1;
    let lastY = -1;
    let lastMove = 0;

    const toSim = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = toSim(e.clientX, e.clientY);
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      if (lastX < 0) {
        lastX = x;
        lastY = y;
      }
      const dx = (x - lastX) * 900;
      const dy = (y - lastY) * 900;
      lastX = x;
      lastY = y;
      lastMove = performance.now();
      if (Math.abs(dx) + Math.abs(dy) < 0.5) return;
      const ink = INKS[inkIndex % INKS.length];
      const speed = 0.35 + Math.min(Math.hypot(dx, dy) / 160, 1);
      sim.splat({
        x,
        y,
        dx,
        dy,
        color: [ink[0] * speed, ink[1] * speed, ink[2] * speed],
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      inkIndex++;
      const { x, y } = toSim(e.clientX, e.clientY);
      const ink = INKS[inkIndex % INKS.length];
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        sim.splat({
          x,
          y,
          dx: Math.cos(angle) * 350,
          dy: Math.sin(angle) * 350,
          color: [ink[0] * 0.9, ink[1] * 0.9, ink[2] * 0.9],
        });
      }
    };

    // ambient breathing: slow figure-eight currents while idle
    let ambientTimer = 0;
    if (ambient) {
      let t = Math.random() * 100;
      ambientTimer = window.setInterval(() => {
        if (performance.now() - lastMove < 2500) return;
        t += 0.55;
        const cx = 0.5 + Math.sin(t * 0.42) * 0.34;
        const cy = 0.42 + Math.sin(t * 0.83) * 0.26;
        const ink = INKS[Math.floor(t * 0.35) % INKS.length];
        sim.splat({
          x: cx,
          y: cy,
          dx: Math.cos(t * 0.9) * 260,
          dy: Math.sin(t * 0.62) * 260,
          color: [ink[0] * 0.5, ink[1] * 0.5, ink[2] * 0.5],
        });
      }, 420);
    }

    // pause when scrolled away or tab hidden
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) sim.start();
        else sim.stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) sim.stop();
      else sim.start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    sim.start();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.clearInterval(ambientTimer);
      sim.destroy();
    };
  }, [ambient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
