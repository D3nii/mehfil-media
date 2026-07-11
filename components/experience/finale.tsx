"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { Magnetic } from "@/components/experience/magnetic";
import { DISCORD_INVITE_URL } from "@/lib/links";

const marqueeItems = [
  "48-hour delivery",
  "بولو تو سنے دنیا",
  "No shoot days",
  "Dozens of cuts",
  "کہانی آپ کی",
  "One flat retainer",
];

/** Closing act: numbers, a marquee, and one magnetic invitation. */
export function Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // spring keeps transforms JS-driven (see hero.tsx)
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 400,
    damping: 50,
    restDelta: 0.0005,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <section ref={ref} className="relative bg-ivory pb-6 pt-[16vh]">
      {/* stat line */}
      <div className="mx-auto mb-[14vh] grid max-w-[1440px] grid-cols-2 gap-10 px-6 md:grid-cols-4 md:px-16">
        {[
          ["48h", "from photo to campaign"],
          ["30+", "assets per product"],
          ["1/10th", "the cost of a shoot"],
          ["∞", "reshoots included"],
        ].map(([stat, label]) => (
          <div key={label} className="border-t border-ink/15 pt-5">
            <p className="mb-2 text-5xl font-medium tracking-tight md:text-6xl">
              {stat}
            </p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* the invitation */}
      <motion.div
        style={{ scale, y }}
        className="mx-4 overflow-hidden rounded-[2.5rem] bg-ink py-[12vh] text-center md:mx-8"
      >
        <p className="urdu mb-6 text-2xl text-rani md:text-3xl">
          محفل میں خوش آمدید
        </p>
        <h2 className="mx-auto mb-12 max-w-4xl px-6 text-[11vw] font-medium leading-[0.98] tracking-tight text-ivory md:text-[6.5vw]">
          Join the <span className="serif-accent text-rani">mehfil.</span>
        </h2>

        <Magnetic strength={0.4} className="inline-block">
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Let's go"
            className="group inline-flex items-center gap-4 rounded-full bg-ivory px-10 py-5 text-lg font-medium text-ink transition-colors hover:bg-rani hover:text-ivory"
          >
            Send us your product
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        </Magnetic>

        <p className="mt-8 text-sm text-ivory/50">
          First concept free. No shoot. No wait.
        </p>

        {/* marquee */}
        <div className="mt-[10vh] overflow-hidden border-t border-ivory/10 pt-8">
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className={`flex items-center gap-12 text-xl md:text-2xl ${
                  /[\u0600-\u06FF]/.test(item)
                    ? "urdu text-rani"
                    : "text-ivory/60"
                }`}
              >
                {item}
                <span aria-hidden className="text-rani">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
