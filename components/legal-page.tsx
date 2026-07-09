import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { DISCORD_INVITE_URL } from "@/lib/links";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="digital-silk-bg pt-32">
        <article className="mx-auto max-w-3xl px-[var(--spacing-margin-mobile)] pb-24 pt-16 md:px-[var(--spacing-margin-desktop)] md:pb-32">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-tertiary">
            Legal
          </p>
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {title}
          </h1>
          <p className="mb-4 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant">
            {description}
          </p>
          <p className="mb-16 font-sans text-sm text-on-surface-variant/80">
            Effective date: {effectiveDate}
          </p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={section.title} className="scroll-mt-32">
                <h2 className="mb-4 font-display text-2xl font-medium text-primary">
                  <span className="mr-3 font-sans text-sm font-semibold text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-4 font-sans text-base leading-relaxed text-on-surface-variant [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-tertiary [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-outline-variant/30 pt-8">
            <p className="font-sans text-sm text-on-surface-variant">
              Questions about this page? Reach us on{" "}
              <Link
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-tertiary"
              >
                Discord
              </Link>{" "}
              or return to the{" "}
              <Link
                href="/"
                className="font-medium text-primary underline underline-offset-4 hover:text-tertiary"
              >
                homepage
              </Link>
              .
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
