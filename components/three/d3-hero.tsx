"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { HeroParticles } from "@/components/three/hero-particles";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { useSectionProgress } from "@/components/three/use-section-progress";

/**
 * 220vh opening act. Sixteen thousand particles spell the studio's name,
 * collapse into a planet, braid into a knot — and scatter into dust the
 * moment the visitor commits to scrolling.
 */
export function D3Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.35], ["0%", "-45%"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      id="field"
      ref={sectionRef}
      aria-label="Particle field hero"
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SceneCanvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 8.5], fov: 50 }}
        >
          <HeroParticles scrollProgress={progress} />
        </SceneCanvas>

        {/* corner HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-between px-6 md:px-14">
          <p className="d3-label">Mehfil Media / WebGL Division</p>
          <p className="d3-label hidden md:block">16,000 particles · 60fps</p>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[16vh] z-10 px-6 text-center"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h1 className="mx-auto max-w-5xl text-[11vw] font-medium leading-[0.92] tracking-tight md:text-[6.2vw]">
            We don&apos;t make websites.
            <br />
            <span className="serif-accent text-[#e01a68]">
              We bend browsers.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#faf6f0]/55">
            The same studio that generates your campaigns wrote every shader
            on this page by hand. Consider this our business card.
          </p>
        </motion.div>

        <motion.span
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-[#faf6f0]/40"
          style={{ opacity: hintOpacity }}
        >
          Scroll to scatter
        </motion.span>
      </div>
    </section>
  );
}
