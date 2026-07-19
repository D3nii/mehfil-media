"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

import { SceneCanvas } from "@/components/three/scene-canvas";
import { SilkPlane } from "@/components/three/silk-plane";

const LINES = [
  ["Most agencies", "rent", "templates."],
  ["We write", "shaders", "before breakfast."],
  ["Your brand deserves", "physics,", "not PowerPoint."],
] as const;

/** Living-silk shader backdrop with a staggered kinetic manifesto */
export function D3Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      aria-label="Manifesto"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <SceneCanvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 1], fov: 50 }}
      >
        <SilkPlane />
      </SceneCanvas>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 md:px-14">
        <p className="d3-label mb-10">01 / The stance</p>
        <div className="space-y-3 md:space-y-5">
          {LINES.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : undefined}
                transition={{
                  duration: 0.9,
                  delay: 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[8.5vw] font-medium leading-[1.02] tracking-tight md:text-[4.6vw]"
              >
                {line[0]}{" "}
                <span className="serif-accent text-[#e01a68]">{line[1]}</span>{" "}
                {line[2]}
              </motion.p>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 max-w-md text-sm leading-relaxed text-[#faf6f0]/60"
        >
          The silk behind this text is not a video. It is domain-warped
          simplex noise, rendered live on your GPU, reacting to your cursor
          right now. Move it. Slowly.
        </motion.p>
      </div>
    </section>
  );
}
