import type { Metadata } from "next";

import { LabExperience } from "@/components/lab/lab-experience";

import "@/components/lab/lab.css";

export const metadata: Metadata = {
  title: "Mehfil After Dark — Living Ink",
  description:
    "An experimental single-page experience for Mehfil Media: WebGL fluid ink, GPU dissolve morphs and scroll-driven CSS storytelling. One photo in, a campaign out.",
};

export default function LabPage() {
  return <LabExperience />;
}
