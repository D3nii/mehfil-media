"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DISCORD_INVITE_URL } from "@/lib/links";

const navLinks = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#process", id: "process", label: "Process" },
  { href: "#niches", id: "niches", label: "Niches" },
  { href: "#testimonials", id: "testimonials", label: "Stories" },
] as const;

type SectionId = (typeof navLinks)[number]["id"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const offset = 120;
      let current: SectionId = "home";

      for (const link of navLinks) {
        const section = document.getElementById(link.id);
        if (!section) continue;

        if (section.getBoundingClientRect().top - offset <= 0) {
          current = link.id;
        }
      }

      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full bg-surface/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0px_10px_40px_rgba(0,0,0,0.04)]" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-[var(--spacing-container-max)] items-center justify-between px-[var(--spacing-margin-mobile)] py-6 md:px-[var(--spacing-margin-desktop)]">
        <div className="flex items-center">
          <Link
            href="#home"
            className="font-display text-[28px] font-medium leading-9 tracking-tight text-primary"
          >
            Mehfil Media
          </Link>
          <span className="ml-4 hidden border-l border-outline-variant/30 pl-4 font-sans text-xs font-medium uppercase tracking-wider text-tertiary/60 lg:block">
            Jadeed Technology, Purana Virsa
          </span>
        </div>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  isActive
                    ? "border-b border-tertiary-container pb-1 font-sans text-sm font-bold tracking-wide text-primary"
                    : "border-b border-transparent pb-1 font-sans text-sm font-medium tracking-wide text-secondary transition-colors hover:text-primary"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <a
          href={DISCORD_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-8 py-3 font-sans text-sm font-semibold tracking-wide text-on-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 active:scale-95 active:opacity-80"
        >
          Work With Us
        </a>
      </div>
    </nav>
  );
}
