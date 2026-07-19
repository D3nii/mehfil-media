import type { Metadata } from "next";

import { ThreeExperience } from "@/components/three/experience";

import "@/components/three/three.css";

export const metadata: Metadata = {
  title: "Mehfil — Dimension 3",
  description:
    "A WebGL love letter from Mehfil Media. Particle typography, orbit galleries, render-pipeline tunnels and living shader matter — proof that the studio that builds your campaigns can bend a browser too.",
};

export default function ThreeDPage() {
  return <ThreeExperience />;
}
