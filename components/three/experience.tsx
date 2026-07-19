"use client";

import Link from "next/link";

import { LenisProvider } from "@/components/experience/lenis-provider";
import { D3Cursor } from "@/components/three/d3-cursor";
import { D3Finale } from "@/components/three/d3-finale";
import { D3Gallery } from "@/components/three/d3-gallery";
import { D3Hero } from "@/components/three/d3-hero";
import { D3HoloCard } from "@/components/three/d3-holo-card";
import { D3Loader } from "@/components/three/d3-loader";
import { D3Manifesto } from "@/components/three/d3-manifesto";
import { D3Marquee } from "@/components/three/d3-marquee";
import { D3Nav } from "@/components/three/d3-nav";
import { D3Process } from "@/components/three/d3-process";
import { D3Stats } from "@/components/three/d3-stats";
import { D3Tunnel } from "@/components/three/d3-tunnel";

function D3Footer() {
  return (
    <footer className="relative border-t border-[#faf6f0]/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-[#faf6f0]/40 md:flex-row md:px-14">
        <p>
          Mehfil Media <span className="urdu text-[#e01a68]">محفل</span> —
          rendered live in your browser. No video files were harmed.
        </p>
        <div className="flex gap-6">
          <Link
            href="/"
            data-cursor="Exit"
            className="transition-colors hover:text-[#faf6f0]"
          >
            Main site
          </Link>
          <Link
            href="/lab"
            data-cursor="Go"
            className="transition-colors hover:text-[#faf6f0]"
          >
            The lab
          </Link>
          <Link
            href="/signup"
            data-cursor="Go"
            className="transition-colors hover:text-[#e01a68]"
          >
            Start a project
          </Link>
        </div>
      </div>
    </footer>
  );
}

/**
 * Mehfil — Dimension 3. Seven acts, seven WebGL scenes, one page.
 * Every canvas lazy-mounts near the viewport and pauses off-screen.
 */
export function ThreeExperience() {
  return (
    <div className="three-root">
      <LenisProvider>
        <D3Loader />
        <D3Cursor />
        <D3Nav />
        <main>
          <D3Hero />
          <D3Marquee />
          <D3Manifesto />
          <D3Gallery />
          <D3Process />
          <D3Tunnel />
          <D3Stats />
          <D3HoloCard />
          <D3Finale />
        </main>
        <D3Footer />
      </LenisProvider>
    </div>
  );
}
