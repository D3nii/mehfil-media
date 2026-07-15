"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { preloadImage } from "@/lib/media";
import { heroImages } from "@/lib/showcase";

const words = ["محفل", "Mehfil", "Media"];

/** Opening sequence: three words flash, then the curtain lifts. */
export function Loader() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Use the intro window to warm hero assets before the curtain lifts.
    preloadImage(heroImages.product);
    preloadImage(heroImages.creator);
    preloadImage(heroImages.videoPoster);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const timers = [
      setTimeout(() => setIndex(1), 550),
      setTimeout(() => setIndex(2), 1100),
      setTimeout(() => setDone(true), 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`text-5xl text-ivory md:text-7xl ${
                index === 0 ? "urdu" : "serif-accent"
              }`}
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
          <motion.span
            className="absolute bottom-10 text-[11px] uppercase tracking-[0.3em] text-ivory/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            An AI content house
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
