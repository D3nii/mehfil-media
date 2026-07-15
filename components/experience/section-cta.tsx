"use client";

import Link from "next/link";
import { motion } from "motion/react";

type SectionCtaProps = {
  /** Line of copy that earns the click, e.g. "Your product could be next." */
  headline: string;
  label?: string;
  tone?: "light" | "dark";
};

/**
 * A quiet conversion beat between experience sections — catches visitors
 * at moments of peak conviction instead of making them scroll to the finale.
 */
export function SectionCta({
  headline,
  label = "Get your first concept free",
  tone = "light",
}: SectionCtaProps) {
  const dark = tone === "dark";

  return (
    <section
      className={`relative py-[10vh] ${dark ? "bg-ink" : "bg-ivory"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left"
      >
        <p
          className={`max-w-lg text-2xl font-medium leading-snug tracking-tight md:text-3xl ${
            dark ? "text-ivory" : "text-ink"
          }`}
        >
          {headline}
        </p>
        <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
          <Link
            href="/signup"
            data-cursor="Go"
            className={`rounded-full px-7 py-3.5 text-sm font-medium transition-colors ${
              dark
                ? "bg-ivory text-ink hover:bg-rani hover:text-ivory"
                : "bg-ink text-ivory hover:bg-rani"
            }`}
          >
            {label}
          </Link>
          <span
            className={`text-[11px] ${dark ? "text-ivory/50" : "text-muted/80"}`}
          >
            No shoot. No wait. No card required.
          </span>
        </div>
      </motion.div>
    </section>
  );
}
