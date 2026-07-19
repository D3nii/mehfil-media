"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

const anchors = [
  { href: "#field", label: "Field" },
  { href: "#gallery", label: "Gallery" },
  { href: "#forge", label: "Forge" },
  { href: "#pipeline", label: "Pipeline" },
] as const;

/** Dark floating capsule nav for the dimension */
export function D3Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > 700 && latest > prev);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-5 z-[90] flex justify-center px-5"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <nav className="flex items-center gap-1 rounded-full border border-[#faf6f0]/12 bg-[#0b0908]/70 py-2 pl-5 pr-2 backdrop-blur-xl">
        <Link
          href="/"
          data-cursor="Exit"
          className="mr-4 flex items-baseline gap-2"
        >
          <span className="text-lg font-semibold tracking-tight text-[#faf6f0]">
            Mehfil
          </span>
          <span className="d3-label !text-[#daa54a]">3D</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {anchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              data-cursor="Go"
              className="rounded-full px-4 py-2 text-sm text-[#faf6f0]/60 transition-colors hover:bg-[#faf6f0]/5 hover:text-[#faf6f0]"
            >
              {anchor.label}
            </a>
          ))}
        </div>

        <Link
          href="/signup"
          data-cursor="Go"
          className="ml-2 block rounded-full bg-[#e01a68] px-5 py-2.5 text-sm font-medium text-[#faf6f0] transition-colors hover:bg-[#faf6f0] hover:text-[#0b0908]"
        >
          Start a project
        </Link>
      </nav>
    </motion.header>
  );
}
