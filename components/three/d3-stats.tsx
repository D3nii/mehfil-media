"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const STATS = [
  { value: 16000, suffix: "", label: "particles in the hero, live" },
  { value: 7, suffix: "", label: "hand-written GLSL shaders on this page" },
  { value: 48, suffix: "h", label: "from product photo to campaign" },
  { value: 60, suffix: "fps", label: "target frame rate, even on laptops" },
] as const;

function Counter({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1600;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  return (
    <span className="font-mono tabular-nums">
      {display.toLocaleString("en-US")}
      <span className="text-[#e01a68]">{suffix}</span>
    </span>
  );
}

/** Receipts — counted up live the moment they enter the viewport */
export function D3Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });

  return (
    <section
      ref={ref}
      aria-label="Numbers"
      className="relative border-y border-[#faf6f0]/10 py-24"
    >
      <div className="d3-aurora" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-14">
        <p className="d3-label mb-12">05 / The receipts</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="border-l border-[#e01a68]/40 pl-5"
            >
              <p className="text-5xl font-semibold tracking-tight md:text-6xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  start={inView}
                />
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#faf6f0]/55">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
