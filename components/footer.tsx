import Link from "next/link";

import { MaterialIcon } from "@/components/ui";
import { DISCORD_INVITE_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-low pb-12 pt-32">
      <div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="space-y-8 md:col-span-4">
            <Link
              href="/"
              className="font-display text-3xl font-medium tracking-tight text-primary"
            >
              Mehfil Media
            </Link>
            <p className="max-w-xs font-sans text-lg leading-relaxed text-on-surface-variant">
              Jadeed technology, purana virsa.
              <br />
              Merging heritage with digital precision.
            </p>
            <div className="flex gap-6">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant text-primary transition-all hover:bg-primary hover:text-on-primary"
                aria-label="Join Discord"
              >
                <MaterialIcon name="forum" className="text-xl" />
              </a>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant text-primary transition-all hover:bg-primary hover:text-on-primary"
                aria-label="Get services"
              >
                <MaterialIcon name="mail" className="text-xl" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h5 className="mb-8 font-sans text-sm font-bold uppercase tracking-widest text-primary">
              Company
            </h5>
            <ul className="space-y-5">
              <li>
                <Link
                  href="#"
                  className="font-sans text-[13px] font-medium text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  The Studio
                </Link>
              </li>
              <li>
                <Link
                  href="#niches"
                  className="font-sans text-[13px] font-medium text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  Niches
                </Link>
              </li>
              <li>
                <Link
                  href="#process"
                  className="font-sans text-[13px] font-medium text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="mb-8 font-sans text-sm font-bold uppercase tracking-widest text-primary">
              Programs
            </h5>
            <ul className="space-y-5">
              <li>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] font-medium text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  Creator Program
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] font-medium text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h5 className="mb-8 font-sans text-sm font-bold uppercase tracking-widest text-primary">
              Inspiration
            </h5>
            <p className="border-l-2 border-tertiary/30 pl-4 font-sans text-xs font-medium italic leading-relaxed text-on-surface-variant">
              &ldquo;Creativity is the bridge between the heritage we carry and
              the future we build.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-outline-variant/20 pt-10 md:flex-row">
          <p className="font-sans text-xs font-medium tracking-wider text-on-surface-variant">
            © 2026 Mehfil Media. Redefining South Asian Creative Expression.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="font-sans text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="font-sans text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <p className="font-sans text-xs font-medium text-on-surface-variant">
              Made with Soul in Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
