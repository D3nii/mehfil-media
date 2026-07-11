"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

import { Magnetic } from "@/components/experience/magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#how", label: "How" },
  { href: "#worlds", label: "Worlds" },
] as const;

/**
 * Floating pill navigation. Sits quietly at the top, condenses into a
 * capsule once the visitor commits to scrolling.
 */
export function ExperienceNav() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 80);
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > 600 && latest > prev);
  });

  useEffect(() => {
    // ensure nav returns when user reaches the very end
    const onEnd = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setHidden(false);
      }
    };
    window.addEventListener("scroll", onEnd, { passive: true });
    return () => window.removeEventListener("scroll", onEnd);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-5 z-[90] flex justify-center px-5"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <motion.nav
        className="flex items-center gap-1 rounded-full border backdrop-blur-xl"
        animate={{
          backgroundColor: condensed
            ? "rgba(250, 246, 240, 0.85)"
            : "rgba(250, 246, 240, 0)",
          borderColor: condensed
            ? "rgba(23, 19, 16, 0.1)"
            : "rgba(23, 19, 16, 0)",
          paddingLeft: condensed ? 20 : 8,
          paddingRight: 8,
          paddingTop: 8,
          paddingBottom: 8,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Link
          href="/"
          data-cursor="Home"
          className="mr-4 flex items-baseline gap-2 pl-3"
        >
          <span className="text-lg font-semibold tracking-tight">Mehfil</span>
          <span className="urdu text-sm leading-none text-rani">محفل</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="Go"
              className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/catalog"
            data-cursor="Go"
            className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Catalog
          </Link>
          <Link
            href="/login"
            data-cursor="Go"
            className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Sign in
          </Link>
        </div>

        <Magnetic strength={0.25}>
          <Link
            href="/signup"
            data-cursor="Go"
            className="ml-2 block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-rani"
          >
            Start a project
          </Link>
        </Magnetic>
      </motion.nav>
    </motion.header>
  );
}
