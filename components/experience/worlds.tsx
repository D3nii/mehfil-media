"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { categories } from "@/lib/showcase";

/**
 * The categories experience. A typographic index on the left; hovering
 * (or tapping) a category morphs the stage on the right and floods the
 * backdrop with its Urdu name.
 */
export function Worlds() {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <section
      id="worlds"
      className="relative overflow-hidden bg-ivory py-[18vh]"
    >
      {/* giant Urdu watermark that morphs per category */}
      <AnimatePresence mode="wait">
        <motion.span
          key={current.id}
          aria-hidden
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.07, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="urdu pointer-events-none absolute right-[-4vw] top-1/2 -translate-y-1/2 select-none text-[34vw] leading-none text-rani"
        >
          {current.urdu}
        </motion.span>
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-16">
        <p className="mb-3 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
          <span className="h-px w-10 bg-rani" />
          The worlds we speak
        </p>
        <h2 className="mb-16 max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
          From <span className="serif-accent text-rani">chai</span> to couture
          — every shelf in Pakistan.
        </h2>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* typographic index */}
          <ul>
            {categories.map((category, i) => {
              const isActive = i === active;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    data-cursor="Switch"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-baseline justify-between gap-6 border-b border-line py-4 text-left transition-colors"
                    aria-pressed={isActive}
                  >
                    <span className="flex items-baseline gap-5">
                      <span
                        className={`font-mono text-xs transition-colors ${
                          isActive ? "text-rani" : "text-muted/60"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <motion.span
                        animate={{ x: isActive ? 12 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        }}
                        className={`text-3xl font-medium tracking-tight transition-colors md:text-5xl ${
                          isActive ? "text-ink" : "text-muted/50"
                        }`}
                      >
                        {category.name}
                      </motion.span>
                    </span>
                    <span
                      className={`hidden text-xs transition-opacity md:block ${
                        isActive ? "text-rani opacity-100" : "opacity-0"
                      }`}
                    >
                      {category.stat}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* morphing stage */}
          <div className="relative lg:sticky lg:top-[14vh]">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-line shadow-[0_40px_80px_rgba(23,19,16,0.14)] lg:ml-auto">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.08 }}
                  animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.83, 0, 0.17, 1] }}
                >
                  <Image
                    src={current.image}
                    alt={`${current.name} campaign world`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 448px"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-6">
                <div>
                  <p className="urdu mb-1 text-xl text-ivory/90">
                    {current.urdu}
                  </p>
                  <p className="text-lg font-semibold text-ivory">
                    {current.name}
                  </p>
                </div>
                <p className="max-w-[150px] text-right text-[11px] leading-snug text-ivory/80">
                  {current.stat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
