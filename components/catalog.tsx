import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/ui";
import {
  aspectClass,
  type CatalogNiche,
} from "@/lib/catalog";
import { DISCORD_INVITE_URL } from "@/lib/links";

function cardLayout(index: number): string {
  switch (index) {
    case 0:
      return "md:col-span-5 mb-20 md:mb-0";
    case 1:
      return "md:col-span-6 md:-mt-24 mb-20 md:mb-0";
    case 2:
      return "md:col-start-4 md:col-span-6 md:mt-16";
    default:
      return "md:col-span-4";
  }
}

type NicheCardProps = {
  niche: CatalogNiche;
  index: number;
};

export function NicheCard({ niche, index }: NicheCardProps) {
  return (
    <Link
      href={niche.href}
      className={`group cursor-pointer ${cardLayout(index)}`}
    >
      <div
        className={`relative mb-8 overflow-hidden rounded-2xl shadow-xl ${aspectClass(niche.aspect)}`}
      >
        <Image
          src={niche.cover.src}
          alt={niche.cover.alt}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
          <span className="rounded-full bg-white px-8 py-3 font-sans text-sm font-semibold tracking-widest text-primary shadow-2xl">
            {niche.cta.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="mb-4 font-display text-3xl font-medium text-primary">
            {niche.title}
          </h4>
          <p className="max-w-md font-sans text-base text-on-surface-variant">
            {niche.description}
          </p>
        </div>
        {niche.icon ? (
          <MaterialIcon
            name={niche.icon}
            className="mt-1 hidden text-4xl text-tertiary/30 lg:block"
          />
        ) : null}
      </div>
    </Link>
  );
}

type HomepageNichesProps = {
  niches: CatalogNiche[];
};

export function HomepageNiches({ niches }: HomepageNichesProps) {
  return (
    <section
      id="niches"
      className="bg-surface-container-low/40 py-[var(--spacing-section-gap)]"
    >
      <div className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="mb-24 flex flex-col items-baseline justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <span className="mb-6 block font-sans text-xs font-medium uppercase tracking-widest text-tertiary">
              The Niche Gallery
            </span>
            <h2 className="font-display text-[32px] font-semibold leading-10 text-primary md:text-[40px] md:leading-[48px]">
              Sector Specialization
            </h2>
          </div>
          <Link
            href="/catalog"
            className="group flex items-center gap-3 font-sans text-sm font-semibold text-primary transition-all hover:gap-6"
          >
            View Full Catalog
            <MaterialIcon
              name="north_east"
              className="transition-transform group-hover:rotate-45"
            />
          </Link>
        </div>

        {niches.length === 0 ? (
          <p className="font-sans text-on-surface-variant">
            Add a folder under{" "}
            <code className="rounded bg-surface-container px-2 py-1 text-sm">
              public/catalog/
            </code>{" "}
            to publish your first niche.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-16">
            {niches.map((niche, index) => (
              <div key={niche.slug} className="contents">
                {index === 1 ? (
                  <div className="hidden md:col-span-1 md:block" />
                ) : null}
                <NicheCard niche={niche} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type CatalogIndexProps = {
  niches: CatalogNiche[];
};

export function CatalogIndex({ niches }: CatalogIndexProps) {
  return (
    <main className="digital-silk-bg pt-32">
      <section className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] pb-24 pt-16 md:px-[var(--spacing-margin-desktop)] md:pb-32">
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-tertiary">
          Sector Specialization
        </p>
        <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary md:text-6xl">
          Full Catalog
        </h1>
        <p className="mb-16 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant">
          Explore our niche galleries. Each sector is a living folder of
          AI-crafted assets — add a new folder under{" "}
          <code className="rounded bg-white/70 px-2 py-1 text-sm text-primary">
            public/catalog/
          </code>{" "}
          to publish another.
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {niches.map((niche) => (
            <Link
              key={niche.slug}
              href={niche.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,53,39,0.08)] transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={niche.cover.src}
                  alt={niche.cover.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-widest text-tertiary">
                  {niche.assets.length} asset
                  {niche.assets.length === 1 ? "" : "s"}
                </p>
                <h2 className="mb-3 font-display text-2xl font-medium text-primary">
                  {niche.title}
                </h2>
                <p className="mb-5 font-sans text-sm leading-relaxed text-on-surface-variant">
                  {niche.description}
                </p>
                <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary">
                  {niche.cta}
                  <MaterialIcon name="arrow_forward" className="text-base" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

type CatalogDetailProps = {
  niche: CatalogNiche;
  related: CatalogNiche[];
};

export function CatalogDetail({ niche, related }: CatalogDetailProps) {
  const gallery = [niche.cover, ...niche.assets.filter((a) => a.src !== niche.cover.src)];

  return (
    <main className="digital-silk-bg pt-32">
      <section className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] pb-24 pt-16 md:px-[var(--spacing-margin-desktop)] md:pb-32">
        <div className="mb-10 flex flex-wrap items-center gap-3 font-sans text-sm text-on-surface-variant">
          <Link href="/catalog" className="hover:text-primary">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-primary">{niche.title}</span>
        </div>

        <div className="mb-16 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-tertiary">
              Niche Gallery
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary md:text-6xl">
              {niche.title}
            </h1>
            <p className="max-w-xl font-sans text-lg leading-relaxed text-on-surface-variant">
              {niche.description}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-8 py-4 text-center font-sans text-sm font-semibold text-on-primary transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              Commission This Niche
            </a>
            <Link
              href="/catalog"
              className="rounded-full border border-outline-variant px-8 py-4 text-center font-sans text-sm font-semibold text-primary transition-colors hover:border-primary"
            >
              All Niches
            </Link>
          </div>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {gallery.map((asset) => (
            <div
              key={`${asset.filename}-${asset.src}`}
              className="mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_rgba(0,53,39,0.08)]"
            >
              {asset.type === "video" ? (
                <video
                  src={asset.src}
                  controls
                  className="h-auto w-full"
                  preload="metadata"
                />
              ) : (
                <div className="relative w-full">
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    width={900}
                    height={1200}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {related.length > 0 ? (
          <div className="mt-24 border-t border-outline-variant/30 pt-16">
            <h2 className="mb-10 font-display text-3xl font-medium text-primary">
              More niches
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={item.href} className="group">
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image
                      src={item.cover.src}
                      alt={item.cover.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <h3 className="font-display text-xl text-primary">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
