"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { creators, heroImages, reels } from "@/lib/showcase";

const steps = [
  {
    id: "upload",
    kicker: "Step 01",
    title: "You upload one photo",
    body: "A product shot from your phone is enough. No studio, no shoot day, no logistics.",
  },
  {
    id: "casting",
    kicker: "Step 02",
    title: "AI casts your creator",
    body: "From a house of AI-born Pakistani creators, the model picks the face your audience will trust.",
  },
  {
    id: "script",
    kicker: "Step 03",
    title: "The script writes itself",
    body: "Hooks, desi idiom, product truths — drafted in seconds, tuned to how your market actually talks.",
  },
  {
    id: "render",
    kicker: "Step 04",
    title: "The video generates",
    body: "Frame by frame, she performs your product. Lighting, voice, gesture — all synthesized.",
  },
  {
    id: "deliver",
    kicker: "Step 05",
    title: "A campaign arrives",
    body: "Dozens of cuts, ratios and hooks land in your inbox within 48 hours. Ready to post, ready to run.",
  },
] as const;

const scriptLines = [
  "HOOK — “Suno, is se pehle k yeh sold out ho…”",
  "BEAT 1 — Mahnoor opens the box toward the light",
  "BEAT 2 — “Shaadi season sorted. Literally.”",
  "CTA — “Link bio mein. Shukriya baad mein.”",
];

function segment(index: number, count: number): [number, number] {
  return [index / count, (index + 1) / count];
}

type PanelProps = {
  index: number;
  progress: MotionValue<number>;
  children: ReactNode;
};

/** Crossfading visual panel tied to one step's scroll segment. */
function Panel({ index, progress, children }: PanelProps) {
  const [start, end] = segment(index, steps.length);
  const fade = 0.035;
  const opacity = useTransform(
    progress,
    index === 0
      ? [start, end - fade, end]
      : index === steps.length - 1
        ? [start, start + fade, end]
        : [start, start + fade, end - fade, end],
    index === 0
      ? [1, 1, 0]
      : index === steps.length - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start, end], [1.02, 0.99]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

type StepTextProps = {
  index: number;
  progress: MotionValue<number>;
};

function StepText({ index, progress }: StepTextProps) {
  const [start, end] = segment(index, steps.length);
  const fade = 0.03;
  const opacity = useTransform(
    progress,
    index === 0
      ? [start, end - fade, end]
      : index === steps.length - 1
        ? [start, start + fade, end]
        : [start, start + fade, end - fade, end],
    index === 0
      ? [1, 1, 0]
      : index === steps.length - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [24, -24]);
  const step = steps[index];

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-rani">
        {step.kicker}
      </p>
      <h3 className="mb-5 text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
        {step.title}
      </h3>
      <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">
        {step.body}
      </p>
    </motion.div>
  );
}

function CastingPanel({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = segment(1, steps.length);
  const ringOpacity = useTransform(
    progress,
    [start + (end - start) * 0.45, start + (end - start) * 0.6],
    [0, 1],
  );

  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      {creators.map((creator, i) => (
        <div
          key={creator.name}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl"
        >
          <Image
            src={creator.image}
            alt={`AI creator ${creator.name}`}
            fill
            className="object-cover"
            sizes="220px"
          />
          <div className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur">
            {creator.name}
          </div>
          {i === 0 ? (
            <motion.div
              className="absolute inset-0 rounded-2xl ring-4 ring-inset ring-rani"
              style={{ opacity: ringOpacity }}
            >
              <span className="absolute right-3 top-3 rounded-full bg-rani px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory">
                Cast
              </span>
            </motion.div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ScriptPanel({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = segment(2, steps.length);
  const span = end - start;

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-[0_30px_60px_rgba(23,19,16,0.1)]">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
          script.draft
        </span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-rani" />
      </div>
      <div className="space-y-4">
        {scriptLines.map((line, i) => (
          <ScriptLine
            key={line}
            line={line}
            progress={progress}
            appearAt={start + span * (0.15 + i * 0.18)}
          />
        ))}
      </div>
    </div>
  );
}

type ScriptLineProps = {
  line: string;
  progress: MotionValue<number>;
  appearAt: number;
};

function ScriptLine({ line, progress, appearAt }: ScriptLineProps) {
  const opacity = useTransform(progress, [appearAt, appearAt + 0.02], [0, 1]);
  const x = useTransform(progress, [appearAt, appearAt + 0.02], [12, 0]);

  return (
    <motion.p
      style={{ opacity, x }}
      className="border-l-2 border-rani/30 pl-4 font-mono text-[13px] leading-relaxed text-ink-soft"
    >
      {line}
    </motion.p>
  );
}

function RenderPanel({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = segment(3, steps.length);
  const bar = useTransform(progress, [start + 0.02, end - 0.02], ["4%", "100%"]);
  const blur = useTransform(
    progress,
    [start + 0.02, end - 0.04],
    ["blur(18px) saturate(0.6)", "blur(0px) saturate(1)"],
  );

  return (
    <div className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-3xl border border-line shadow-[0_30px_60px_rgba(23,19,16,0.15)]">
      <motion.div className="absolute inset-0" style={{ filter: blur }}>
        <Image
          src={heroImages.creator}
          alt="AI creator being rendered frame by frame"
          fill
          className="object-cover"
          sizes="320px"
        />
      </motion.div>
      <div className="absolute inset-x-5 bottom-5 rounded-full bg-ink/60 p-1 backdrop-blur">
        <motion.div
          className="h-1.5 rounded-full bg-rani"
          style={{ width: bar }}
        />
      </div>
      <div className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] text-ivory backdrop-blur">
        rendering… 24fps
      </div>
    </div>
  );
}

function DeliverPanel({ progress }: { progress: MotionValue<number> }) {
  const assets = reels.slice(0, 6);

  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3">
      {assets.map((reel, i) => (
        <DeliverThumb key={reel.id} src={reel.image} index={i} progress={progress} />
      ))}
    </div>
  );
}

type DeliverThumbProps = {
  src: string;
  index: number;
  progress: MotionValue<number>;
};

function DeliverThumb({ src, index, progress }: DeliverThumbProps) {
  const [start, end] = segment(4, steps.length);
  const span = end - start;
  const at = start + span * (0.1 + index * 0.09);
  const opacity = useTransform(progress, [at, at + 0.025], [0, 1]);
  const y = useTransform(progress, [at, at + 0.025], [26, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line"
    >
      <Image
        src={src}
        alt={`Delivered asset ${index + 1}`}
        fill
        className="object-cover"
        sizes="140px"
      />
      <span className="absolute bottom-2 left-2 rounded bg-ivory/85 px-1.5 py-0.5 text-[9px] font-semibold text-ink">
        9:16
      </span>
    </motion.div>
  );
}

/**
 * Sticky storytelling: 500vh of scroll drives a single pinned viewport
 * through the five acts of the pipeline.
 */
export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // spring keeps transforms JS-driven (see hero.tsx)
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 400,
    damping: 50,
    restDelta: 0.0005,
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how" ref={ref} className="relative h-[500vh] bg-ivory-deep">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:px-16">
          {/* progress rail */}
          <div
            aria-hidden
            className="absolute left-6 top-1/2 hidden h-56 w-px -translate-y-1/2 bg-line md:block"
          >
            <motion.div
              className="w-px origin-top bg-rani"
              style={{ scaleY: railScale, height: "100%" }}
            />
          </div>

          <div className="relative h-64 md:h-72">
            {steps.map((step, i) => (
              <StepText key={step.id} index={i} progress={scrollYProgress} />
            ))}
          </div>

          <div className="relative h-[46vh] md:h-[64vh]">
            <Panel index={0} progress={scrollYProgress}>
              <div className="relative flex aspect-[3/4] w-full max-w-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-ink/25 bg-white/60">
                <motion.div
                  className="relative h-3/4 w-3/4 overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(23,19,16,0.15)]"
                  initial={{ y: -30, rotate: -4 }}
                  whileInView={{ y: 0, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 14 }}
                >
                  <Image
                    src={heroImages.product}
                    alt="Product photo being uploaded"
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </motion.div>
                <span className="absolute bottom-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
                  Drop product here
                </span>
              </div>
            </Panel>

            <Panel index={1} progress={scrollYProgress}>
              <CastingPanel progress={scrollYProgress} />
            </Panel>

            <Panel index={2} progress={scrollYProgress}>
              <ScriptPanel progress={scrollYProgress} />
            </Panel>

            <Panel index={3} progress={scrollYProgress}>
              <RenderPanel progress={scrollYProgress} />
            </Panel>

            <Panel index={4} progress={scrollYProgress}>
              <DeliverPanel progress={scrollYProgress} />
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
