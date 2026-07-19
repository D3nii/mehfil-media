"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { PipelineTunnel } from "@/components/three/pipeline-tunnel";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { useSectionProgress } from "@/components/three/use-section-progress";

const STATIONS = [
  { at: 0.0, label: "ingest", copy: "photo received · 04:12 PM" },
  { at: 0.22, label: "analysis", copy: "product read · 1.2s" },
  { at: 0.44, label: "generation", copy: "creator rendering · frame 812/1440" },
  { at: 0.68, label: "edit", copy: "hook locked · caption v3" },
  { at: 0.88, label: "delivery", copy: "campaign shipped · 47h 12m" },
] as const;

/**
 * 400vh flythrough of the render pipeline — the camera travels a 90-unit
 * tunnel of gates, dust and real campaign frames as you scroll.
 */
export function D3Tunnel() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(sectionRef);
  const [station, setStation] = useState(0);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      const p = progress.current ?? 0;
      let index = 0;
      for (let i = STATIONS.length - 1; i >= 0; i--) {
        if (p >= STATIONS[i].at) {
          index = i;
          break;
        }
      }
      setStation((prev) => (prev === index ? prev : index));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const active = STATIONS[station];

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      aria-label="Pipeline flythrough"
      className="relative h-[400vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SceneCanvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 70 }}
        >
          <PipelineTunnel progress={progress} />
        </SceneCanvas>

        <div className="pointer-events-none absolute inset-x-0 top-[10vh] z-10 px-6 text-center">
          <p className="d3-label mb-3">04 / The pipeline</p>
          <h2 className="text-[9vw] font-medium leading-none tracking-tight md:text-[4vw]">
            Fly through
            <span className="serif-accent text-[#e01a68]"> 48 hours.</span>
          </h2>
        </div>

        {/* terminal readout pinned bottom-left */}
        <div className="pointer-events-none absolute bottom-[9vh] left-6 z-10 md:left-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-xs text-[#faf6f0]/70"
            >
              <p className="mb-1 text-[#e01a68]">
                ▸ stage://{active.label}
                <span className="d3-caret">_</span>
              </p>
              <p className="text-[#faf6f0]/45">{active.copy}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* progress dial bottom-right */}
        <div className="pointer-events-none absolute bottom-[9vh] right-6 z-10 flex items-center gap-3 md:right-14">
          <div className="flex gap-1.5">
            {STATIONS.map((s, i) => (
              <div
                key={s.label}
                className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                  i <= station ? "bg-[#daa54a]" : "bg-[#faf6f0]/15"
                }`}
              />
            ))}
          </div>
          <span className="d3-label">{active.label}</span>
        </div>
      </div>
    </section>
  );
}
