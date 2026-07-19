"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Holographic creator card. Pure CSS-3D: perspective tilt tracking the
 * pointer, a chromatic sheen that slides across, layered depth via
 * translateZ. The one section that proves 3D doesn't always need a canvas.
 */
export function D3HoloCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 22 });
  const sy = useSpring(py, { stiffness: 180, damping: 22 });

  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const sheenX = useTransform(sx, [0, 1], ["-60%", "160%"]);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <section
      aria-label="The creator"
      className="relative overflow-hidden py-32"
    >
      <div className="d3-aurora" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-14">
        <div>
          <p className="d3-label mb-4">06 / The face</p>
          <h2 className="text-[9vw] font-medium leading-[0.98] tracking-tight md:text-[3.6vw]">
            Meet Mahnoor.
            <br />
            <span className="serif-accent text-[#e01a68]">
              She doesn&apos;t exist.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#faf6f0]/60">
            Every reel on this page is fronted by an AI creator we built for
            Pakistani audiences — consistent face, consistent voice, zero
            scheduling conflicts. Tilt her card. She holds still. She always
            holds still.
          </p>
          <div className="mt-8 flex gap-8 font-mono text-xs text-[#faf6f0]/50">
            <div>
              <p className="text-2xl font-bold text-[#daa54a]">531K</p>
              <p>peak likes, one reel</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#daa54a]">7</p>
              <p>categories covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#daa54a]">0</p>
              <p>reshoots requested</p>
            </div>
          </div>
        </div>

        <div
          className="flex justify-center"
          style={{ perspective: "1200px" }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <motion.div
            ref={cardRef}
            data-cursor="Tilt"
            className="d3-frame relative w-[300px] overflow-hidden rounded-3xl bg-[#14100e] md:w-[340px]"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src="/studio/creator.png"
                alt="Mahnoor, the AI-generated creator"
                fill
                className="object-cover"
                sizes="340px"
              />
              {/* sliding chromatic sheen */}
              <motion.div
                aria-hidden
                className="absolute inset-y-0 w-1/2 skew-x-[-18deg]"
                style={{
                  left: sheenX,
                  background:
                    "linear-gradient(90deg, transparent, rgba(224,26,104,0.18), rgba(218,165,74,0.22), rgba(250,246,240,0.14), transparent)",
                }}
              />
              <div className="d3-scanline" />
            </div>

            <div
              className="flex items-center justify-between p-5"
              style={{ transform: "translateZ(40px)" }}
            >
              <div>
                <p className="text-sm font-semibold">@mahnoor.mehfil</p>
                <p className="text-xs text-[#faf6f0]/50">
                  AI Creator · Lahore (allegedly)
                </p>
              </div>
              <span className="rounded-full bg-[#e01a68] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                Synthetic
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
