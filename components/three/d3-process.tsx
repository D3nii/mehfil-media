"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CrystalProcess } from "@/components/three/crystal-process";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { useSectionProgress } from "@/components/three/use-section-progress";

const STEPS = [
  {
    id: "01",
    title: "Raw matter",
    body: "You upload one product photo. That's the entire brief — a formless cloud of possibility.",
  },
  {
    id: "02",
    title: "The read",
    body: "Our pipeline studies texture, light and audience. The noise starts to find its edges.",
  },
  {
    id: "03",
    title: "The face",
    body: "Mahnoor — our AI creator — picks it up. Script, voice, gesture. The form sharpens.",
  },
  {
    id: "04",
    title: "The cut",
    body: "Edit, grade, caption, hook. Every facet polished for the first half-second of a scroll.",
  },
  {
    id: "05",
    title: "The gem",
    body: "48 hours after upload: a campaign, cut clean, ready to go everywhere at once.",
  },
] as const;

/**
 * 500vh pinned act. A blob of raw shader noise is scrubbed, step by step,
 * into a cut gem — while the five-step studio process narrates alongside.
 */
export function D3Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      const index = Math.min(
        Math.floor((progress.current ?? 0) * STEPS.length),
        STEPS.length - 1,
      );
      setStep((prev) => (prev === index ? prev : index));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const active = STEPS[step];

  return (
    <section
      id="forge"
      ref={sectionRef}
      aria-label="Process"
      className="relative h-[500vh]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <SceneCanvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 5.5], fov: 45 }}
        >
          <CrystalProcess progress={progress} />
        </SceneCanvas>

        <div className="pointer-events-none absolute inset-x-0 top-[10vh] z-10 px-6 text-center md:px-14 md:text-left">
          <p className="d3-label mb-3">03 / The forge</p>
          <h2 className="text-[9vw] font-medium leading-none tracking-tight md:text-[4vw]">
            One photo in.
            <span className="serif-accent text-[#e01a68]">
              {" "}
              A gem out.
            </span>
          </h2>
        </div>

        {/* narration panel */}
        <div className="pointer-events-none absolute bottom-[10vh] left-6 right-6 z-10 md:bottom-auto md:left-auto md:right-14 md:top-1/2 md:w-[340px] md:-translate-y-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="d3-frame rounded-2xl bg-[#0b0908]/60 p-6 backdrop-blur-md"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-mono text-4xl font-bold text-[#e01a68]">
                  {active.id}
                </span>
                <span className="d3-label">{`step ${step + 1} of ${STEPS.length}`}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight">
                {active.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#faf6f0]/60">
                {active.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* step rail */}
          <div className="mt-4 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  i <= step ? "bg-[#e01a68]" : "bg-[#faf6f0]/15"
                }`}
              />
            ))}
          </div>
        </div>

        <span className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-[#faf6f0]/30 md:block">
          Keep scrolling — the cut isn&apos;t finished
        </span>
      </div>
    </section>
  );
}
