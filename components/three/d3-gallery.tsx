"use client";

import { OrbitGallery } from "@/components/three/orbit-gallery";
import { SceneCanvas } from "@/components/three/scene-canvas";

/** The carousel drum — seven real campaigns orbiting in space */
export function D3Gallery() {
  return (
    <section
      id="gallery"
      aria-label="Campaign gallery"
      className="relative h-screen overflow-hidden"
    >
      <SceneCanvas
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        camera={{ position: [0, 1.1, 13.5], fov: 45 }}
      >
        <OrbitGallery />
      </SceneCanvas>

      <div className="pointer-events-none absolute inset-x-0 top-[12vh] z-10 px-6 text-center">
        <p className="d3-label mb-4">02 / The proof</p>
        <h2 className="text-[9vw] font-medium leading-none tracking-tight md:text-[4.5vw]">
          Seven campaigns.
          <span className="serif-accent text-[#e01a68]"> One drum.</span>
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[8vh] z-10 flex flex-col items-center gap-2 px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#faf6f0]/40">
          ← Drag to spin →
        </span>
        <p className="max-w-sm text-xs leading-relaxed text-[#faf6f0]/45">
          Every frame in orbit was generated from a single product photo in
          the Mehfil studio. Real deliverables, mapped onto real geometry.
        </p>
      </div>
    </section>
  );
}
