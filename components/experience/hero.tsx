"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { DeferredVideo } from "@/components/experience/deferred-video";
import { heroImages } from "@/lib/showcase";

type VariationCardProps = {
  src: string;
  index: number;
  spread: MotionValue<number>;
  position: { x: number; y: number; r: number };
};

function VariationCard({ src, index, spread, position }: VariationCardProps) {
  const x = useTransform(spread, (v) => `${v * position.x * 78}%`);
  const y = useTransform(spread, (v) => `${v * position.y * 42}%`);
  const rotate = useTransform(spread, (v) => v * position.r);
  const scale = useTransform(spread, [0, 1], [0.9, 0.72]);
  const opacity = useTransform(spread, [0, 0.25], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-ivory shadow-[0_30px_60px_rgba(23,19,16,0.18)]"
      style={{ x, y, rotate, scale, opacity }}
    >
      <Image
        src={src}
        alt={`Generated campaign variation ${index + 1}`}
        fill
        className="object-cover"
        sizes="320px"
        loading="lazy"
        fetchPriority="low"
      />
      <div className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur">
        Cut {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

/**
 * Pinned hero (300vh of scroll). One continuous transformation:
 *   scene 1 — a lone product, being "read" by a scan line
 *   scene 2 — the product dissolves into an AI creator holding the story
 *   scene 3 — the creator becomes a live reel and explodes into variations
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [loadHeroVideo, setLoadHeroVideo] = useState(false);
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Spring keeps every transform JS-driven (avoids WAAPI scroll-timeline
  // desync with the sticky container) and adds cinematic lag.
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 400,
    damping: 50,
    restDelta: 0.0005,
  });

  // Defer the hero reel until the creator scene is approaching.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > 0.22) {
        setLoadHeroVideo(true);
      }
    });

    return unsubscribe;
  }, [scrollYProgress]);

  // ── scene 1: product ───────────────────────────────────────
  const productOpacity = useTransform(scrollYProgress, [0.24, 0.34], [1, 0]);
  const productScale = useTransform(scrollYProgress, [0, 0.34], [1, 0.82]);
  const scanY = useTransform(scrollYProgress, [0.04, 0.3], ["0%", "100%"]);
  const scanOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.26, 0.32],
    [0, 1, 1, 0],
  );

  // ── scene 2: creator reveal ────────────────────────────────
  const creatorClip = useTransform(
    scrollYProgress,
    [0.28, 0.46],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const creatorScale = useTransform(
    scrollYProgress,
    [0.46, 0.72],
    [1, 0.92],
  );

  // ── scene 3: reel chrome + variation explosion ─────────────
  const chromeOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const spread = useTransform(scrollYProgress, [0.62, 0.9], [0, 1]);

  const ambientOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  // headline phases
  const h1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.3], [1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0.22, 0.3], ["0%", "-60%"]);
  const h2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.38, 0.54, 0.62],
    [0, 1, 1, 0],
  );
  const h3Opacity = useTransform(scrollYProgress, [0.66, 0.76], [0, 1]);

  // CTA block stays through the whole product scene; only the scroll hint
  // disappears as soon as the visitor commits.
  const ctaOpacity = useTransform(scrollYProgress, [0.2, 0.28], [1, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const variationPositions = [
    { x: -1.15, y: -0.55, r: -9 },
    { x: 1.15, y: -0.45, r: 8 },
    { x: -1.05, y: 0.6, r: 6 },
    { x: 1.05, y: 0.55, r: -7 },
  ];

  return (
    <section ref={ref} aria-label="Hero" className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden">
        {/* ambient accent wash that warms up as the story progresses */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: ambientOpacity,
            background:
              "radial-gradient(circle at 50% 60%, rgba(196,13,83,0.07), transparent 55%)",
          }}
        />

        {/* headlines */}
        <div className="pointer-events-none absolute inset-x-0 top-[11vh] z-20 px-6 text-center">
          <motion.div style={{ opacity: h1Opacity, y: h1Y }}>
            <h1 className="mx-auto max-w-5xl text-[13vw] font-medium leading-[0.95] tracking-tight md:text-[7.5vw]">
              Your product has
              <br />
              <span className="serif-accent text-rani">a voice.</span>
            </h1>
          </motion.div>
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ opacity: h2Opacity }}
          >
            <p className="mx-auto max-w-5xl text-[13vw] font-medium leading-[0.95] tracking-tight md:text-[7.5vw]">
              She gives it
              <br />
              <span className="serif-accent text-rani">a face.</span>
            </p>
          </motion.div>
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ opacity: h3Opacity }}
          >
            <p className="mx-auto max-w-5xl text-[13vw] font-medium leading-[0.95] tracking-tight md:text-[7.5vw]">
              Then it goes
              <br />
              <span className="serif-accent text-rani">everywhere.</span>
            </p>
          </motion.div>
        </div>

        {/* central stage */}
        <div className="relative z-10 mt-[30vh] h-[40vh] w-[min(56vw,270px)] md:h-[42vh]">
          {/* variation cards behind the phone */}
          {heroImages.variations.map((src, i) => (
            <VariationCard
              key={src}
              src={src}
              index={i}
              spread={spread}
              position={variationPositions[i]}
            />
          ))}

          {/* the phone / stage card */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_80px_rgba(23,19,16,0.22)]"
            style={{ scale: creatorScale }}
          >
            {/* scene 1: product */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: productOpacity, scale: productScale }}
            >
              <Image
                src={heroImages.product}
                alt="A gold jhumka earring before transformation"
                fill
                className="object-cover"
                sizes="320px"
                priority
              />
              <div className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory backdrop-blur">
                Input · 1 photo
              </div>
            </motion.div>

            {/* scan line reading the product */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 z-10 h-16 -translate-y-1/2"
              style={{ top: scanY, opacity: scanOpacity }}
            >
              <div className="h-px w-full bg-rani shadow-[0_0_24px_4px_rgba(196,13,83,0.65)]" />
              <div className="h-16 w-full bg-gradient-to-b from-rani/25 to-transparent" />
            </motion.div>

            {/* scene 2/3: creator, then her live reel */}
            <motion.div
              className="absolute inset-0"
              style={{ clipPath: creatorClip }}
            >
              <Image
                src={heroImages.creator}
                alt="Mahnoor, the AI-generated creator, presenting the product"
                fill
                className="object-cover"
                sizes="320px"
                priority
                fetchPriority="high"
              />

              {/* the actual generated reel fades in and plays */}
              {loadHeroVideo ? (
                <motion.div
                  className="absolute inset-0"
                  style={{ opacity: chromeOpacity }}
                >
                  <DeferredVideo
                    src={heroImages.video}
                    poster={heroImages.videoPoster}
                    alt="Generated earring reel"
                    eager
                    className="absolute inset-0"
                  />
                </motion.div>
              ) : null}

              {/* reel chrome */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink/60 via-transparent to-ink/20 p-4"
                style={{ opacity: chromeOpacity }}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-rani px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory">
                    Live reel
                  </span>
                  <span className="text-[10px] font-medium text-ivory/80">
                    0:15
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-ivory">
                    @mahnoor.mehfil
                  </p>
                  <p className="text-xs leading-relaxed text-ivory/85">
                    Unboxing the jhumkas everyone asked about ✨
                  </p>
                  <div className="flex gap-4 text-[11px] font-medium text-ivory/90">
                    <span>Generated from 1 photo</span>
                    <span>Delivered in 48h</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* value prop + CTAs — in flow, right under the stage */}
        <motion.div
          className="z-20 mt-8 flex flex-col items-center gap-4 px-6"
          style={{ opacity: ctaOpacity }}
        >
          <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-muted">
            <span className="font-semibold text-ink">
              One product photo in, a full reel campaign out
            </span>{" "}
            — an AI creator made for your Pakistani audience, delivered in 48
            hours.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/signup"
              data-cursor="Go"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-rani"
            >
              Get your first concept free
            </Link>
            <a
              href="#work"
              data-cursor="Go"
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-rani hover:text-rani"
            >
              See the work
            </a>
          </div>
          <p className="text-xs text-muted/80">
            No shoot. No wait. No card required.
          </p>
        </motion.div>

        {/* scroll hint stays pinned to the bottom edge */}
        <motion.span
          className="absolute bottom-5 z-20 text-[11px] uppercase tracking-[0.3em] text-muted/70"
          style={{ opacity: scrollHintOpacity }}
        >
          Scroll to transform
        </motion.span>
      </div>
    </section>
  );
}
