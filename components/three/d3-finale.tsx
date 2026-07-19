"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

import { FinaleBlob } from "@/components/three/finale-blob";
import { SceneCanvas } from "@/components/three/scene-canvas";

/** Bloomed heart-of-the-machine finale with the only ask on the page */
export function D3Finale() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });

  return (
    <section
      ref={ref}
      aria-label="Finale"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <SceneCanvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <FinaleBlob />
      </SceneCanvas>

      <div className="pointer-events-none relative z-10 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8 }}
          className="d3-label mb-6"
        >
          07 / The ask
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-[11vw] font-medium leading-[0.95] tracking-tight md:text-[5.4vw]"
        >
          If we do this
          <span className="serif-accent text-[#e01a68]"> for free,</span>
          <br />
          imagine what we do
          <span className="serif-accent text-[#daa54a]"> for you.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            data-cursor="Go"
            className="rounded-full bg-[#faf6f0] px-8 py-4 text-sm font-medium text-[#0b0908] transition-colors hover:bg-[#e01a68] hover:text-[#faf6f0]"
          >
            Get your first concept free
          </Link>
          <Link
            href="/"
            data-cursor="Exit"
            className="rounded-full border border-[#faf6f0]/25 px-8 py-4 text-sm font-medium text-[#faf6f0] transition-colors hover:border-[#e01a68] hover:text-[#e01a68]"
          >
            Back to daylight
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
