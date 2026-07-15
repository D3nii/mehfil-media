"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { reels } from "@/lib/showcase";

const aggregate = [
  ["3.5M+", "likes across generated reels"],
  ["370K+", "shares and saves"],
  ["7", "categories already live"],
] as const;

/** Reels with the strongest numbers, shown as performance cards. */
const featured = [...reels]
  .filter((reel) => reel.product || reel.video)
  .sort(
    (a, b) =>
      parseInt(b.likes.replace(/\D/g, ""), 10) -
      parseInt(a.likes.replace(/\D/g, ""), 10),
  )
  .slice(0, 3);

/**
 * The receipts. Performance cards for real generated campaigns, so the
 * visitor sees outcomes — not just craft — before the deep-dive begins.
 */
export function Proof() {
  return (
    <section aria-label="Results" className="relative bg-ivory pb-[16vh]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <p className="mb-3 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
          <span className="h-px w-10 bg-rani" />
          The receipts
        </p>
        <h2 className="mb-14 max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
          Generated reels that{" "}
          <span className="serif-accent text-rani">actually perform.</span>
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((reel, i) => (
            <motion.article
              key={reel.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_50px_rgba(23,19,16,0.08)]"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {reel.category} · Live
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Generated
                </span>
              </div>

              <div className="flex gap-4 p-5">
                <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-line">
                  <Image
                    src={reel.image}
                    alt={`${reel.category} campaign reel`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between py-1">
                  <p className="line-clamp-2 text-sm leading-snug text-ink-soft">
                    “{reel.caption}”
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-2xl font-medium tracking-tight">
                        {reel.likes}
                      </p>
                      <p className="text-[11px] uppercase tracking-widest text-muted">
                        Likes
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-medium tracking-tight">
                        {reel.shares}
                      </p>
                      <p className="text-[11px] uppercase tracking-widest text-muted">
                        Shares
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-line px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                  {reel.product ? "From 1 product photo" : "Fully synthetic"} ·
                  48h turnaround
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-baseline gap-x-12 gap-y-6 border-t border-ink/15 pt-8">
          {aggregate.map(([stat, label]) => (
            <div key={label}>
              <span className="mr-3 text-3xl font-medium tracking-tight md:text-4xl">
                {stat}
              </span>
              <span className="text-sm text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
