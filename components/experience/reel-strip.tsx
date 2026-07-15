"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { useInView } from "@/hooks/use-in-view";
import { reels, type Reel } from "@/lib/showcase";

type ReelCardProps = {
  reel: Reel;
  index: number;
  stripInView: boolean;
};

function ReelCard({ reel, index, stripInView }: ReelCardProps) {
  const { ref, inView } = useInView<HTMLElement>({
    rootMargin: "360px 0px",
    once: true,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoadMedia = stripInView && inView;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadMedia || !reel.video) return;

    void video.play().catch(() => {
      // Autoplay may be blocked until user interaction.
    });
  }, [shouldLoadMedia, reel.video]);

  return (
    <motion.article
      ref={ref}
      data-cursor={reel.video ? "Play" : "View"}
      className="group relative h-[62vh] w-[min(78vw,320px)] shrink-0 overflow-hidden rounded-3xl border border-ivory/10 bg-ink"
      whileHover={{ y: -14 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ rotate: index % 2 === 0 ? -1.2 : 1.4 }}
    >
      {reel.video && shouldLoadMedia ? (
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.image}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <Image
          src={reel.image}
          alt={`${reel.creator} — ${reel.caption}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="320px"
          loading="lazy"
          fetchPriority="low"
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink/75 via-transparent to-ink/25 p-5">
        <div className="flex items-start justify-between">
          <span className="rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
            {reel.category}
          </span>
          {reel.product ? (
            <span className="flex flex-col items-end gap-1.5">
              <span className="relative h-16 w-12 overflow-hidden rounded-lg border-2 border-ivory/80 shadow-lg">
                <Image
                  src={reel.product}
                  alt="Input product photo"
                  fill
                  className="object-cover"
                  sizes="48px"
                  loading="lazy"
                  fetchPriority="low"
                />
              </span>
              <span className="rounded bg-ink/60 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-ivory/90 backdrop-blur">
                From 1 photo
              </span>
            </span>
          ) : (
            <span className="font-mono text-[10px] text-ivory/70">
              #{String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ivory">{reel.handle}</p>
          <p className="text-xs leading-relaxed text-ivory/85">
            {reel.caption}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ivory/60">
            Concept reel · Mehfil studio
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * The examples experience: an ink-dark room where vertical scroll drives
 * a horizontal film strip of generated reels past the viewer.
 */
export function ReelStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [stripInView, setStripInView] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStripInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "520px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const x = useTransform(smooth, [0, 1], ["4%", "-72%"]);
  const ghostX = useTransform(smooth, [0, 1], ["10%", "-40%"]);

  return (
    <section id="work" ref={ref} className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* oversized ghost typography drifting behind the strip */}
        <motion.p
          aria-hidden
          className="text-stroke-rani pointer-events-none absolute top-[8vh] whitespace-nowrap text-[18vw] font-semibold leading-none opacity-30"
          style={{ x: ghostX }}
        >
          Generated. Not shot. Generated. Not shot.
        </motion.p>

        <div className="relative z-10 mb-10 px-6 md:px-16">
          <p className="mb-3 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory/50">
            <span className="h-px w-10 bg-rani" />
            The work
          </p>
          <h2 className="max-w-2xl text-4xl font-medium leading-[1.02] tracking-tight text-ivory md:text-6xl">
            Every frame below is{" "}
            <span className="serif-accent text-rani">synthetic.</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="z-10 flex gap-6 pl-6 md:pl-16">
          {reels.map((reel, i) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              index={i}
              stripInView={stripInView}
            />
          ))}
          {/* end card */}
          <div className="flex h-[62vh] w-[min(78vw,320px)] shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-ivory/25 text-center">
            <span className="urdu text-4xl text-rani">اگلی آپ کی</span>
            <p className="max-w-[200px] text-sm text-ivory/70">
              The next one is yours.
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 mt-10 px-6 md:px-16">
          <div className="h-px w-full bg-ivory/15">
            <motion.div
              className="h-px origin-left bg-rani"
              style={{ scaleX: smooth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
