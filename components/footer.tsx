import Link from "next/link";

import { DISCORD_INVITE_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="bg-ivory px-6 pb-10 pt-20 md:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-3 flex items-baseline gap-3 text-3xl font-semibold tracking-tight">
              Mehfil Media
              <span className="urdu text-xl text-rani">محفل میڈیا</span>
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              AI-generated creators for Pakistani brands. Made in Pakistan,
              rendered in the future.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a
              href="#work"
              className="text-ink-soft transition-colors hover:text-rani"
            >
              Work
            </a>
            <a
              href="#how"
              className="text-ink-soft transition-colors hover:text-rani"
            >
              How
            </a>
            <a
              href="#worlds"
              className="text-ink-soft transition-colors hover:text-rani"
            >
              Worlds
            </a>
            <Link
              href="/catalog"
              className="text-ink-soft transition-colors hover:text-rani"
            >
              Catalog
            </Link>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-rani"
            >
              Discord
            </a>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center">
          <p>© 2026 Mehfil Media. All creators are AI-generated.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
