"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const BOOT_LINES = [
  "loading shader matter",
  "compiling 16,000 particles",
  "warming the silk",
  "cutting the crystal",
  "dimension ready",
];

/** Terminal-style boot sequence before the dimension opens */
export function D3Loader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let value = 0;
    const tick = () => {
      // ease toward 100 in uneven, machine-like jumps
      value = Math.min(value + Math.random() * 9 + 2, 100);
      setCount(Math.floor(value));
      if (value < 100) {
        timer = window.setTimeout(tick, 60 + Math.random() * 90);
      } else {
        timer = window.setTimeout(() => setDone(true), 420);
      }
    };
    let timer = window.setTimeout(tick, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const lineIndex = Math.min(
    Math.floor((count / 100) * BOOT_LINES.length),
    BOOT_LINES.length - 1,
  );

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center gap-6 bg-[#0b0908]"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tracking-tight text-[#faf6f0]">
              Mehfil
            </span>
            <span className="urdu text-lg text-[#e01a68]">محفل</span>
            <span className="d3-label text-[#daa54a]">/ dimension 3</span>
          </div>

          <div className="font-mono text-[80px] font-bold leading-none tracking-tighter text-[#faf6f0] tabular-nums md:text-[120px]">
            {String(count).padStart(3, "0")}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#faf6f0]/50">
            <span className="text-[#e01a68]">▸</span>
            <span>{BOOT_LINES[lineIndex]}</span>
            <span className="d3-caret text-[#e01a68]">_</span>
          </div>

          <div className="h-px w-56 overflow-hidden bg-[#faf6f0]/10">
            <motion.div
              className="h-full bg-[#e01a68]"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
