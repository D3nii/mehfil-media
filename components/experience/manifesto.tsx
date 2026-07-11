"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const statement = [
  { text: "Traditional" },
  { text: "content" },
  { text: "is" },
  { text: "slow," },
  { text: "expensive," },
  { text: "and" },
  { text: "fragile." },
  { text: "A" },
  { text: "studio" },
  { text: "day" },
  { text: "costs" },
  { text: "lakhs.", accent: true },
  { text: "A" },
  { text: "creator" },
  { text: "cancels." },
  { text: "Your" },
  { text: "launch" },
  { text: "waits." },
  { text: "So" },
  { text: "we" },
  { text: "deleted", accent: true },
  { text: "the" },
  { text: "wait.", accent: true },
];

type WordProps = {
  text: string;
  accent?: boolean;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function Word({ text, accent, index, total, progress }: WordProps) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block ${accent ? "serif-accent text-rani" : ""}`}
    >
      {text}
    </motion.span>
  );
}

/**
 * The problem, told as ink filling into paper. Words wake up one by one
 * as the reader scrolls through the pinned block.
 */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });
  // spring keeps transforms JS-driven (see hero.tsx) and smooths the fill
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 400,
    damping: 50,
    restDelta: 0.0005,
  });

  return (
    <section className="relative bg-ivory py-[24vh]">
      <div className="mx-auto max-w-[1100px] px-6 md:px-16">
        <p className="mb-12 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
          <span className="h-px w-10 bg-rani" />
          The problem
        </p>
        <div
          ref={ref}
          className="flex flex-wrap gap-x-[0.28em] gap-y-3 text-[9.5vw] font-medium leading-[1.08] tracking-tight md:text-[4.6vw]"
        >
          {statement.map((word, i) => (
            <Word
              key={`${word.text}-${i}`}
              text={word.text}
              accent={word.accent}
              index={i}
              total={statement.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
