import Image from "next/image";
import Link from "next/link";

import { Container, MaterialIcon } from "@/components/ui";
import { images } from "@/lib/images";

export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] pb-32 pt-20 md:px-[var(--spacing-margin-desktop)]"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-primary">
            <MaterialIcon name="verified" className="text-[18px]" />
            <span className="font-sans text-xs font-medium uppercase tracking-widest">
              The Next Generation of UGC
            </span>
          </div>

          <p className="mb-6 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-tertiary">
            Hamara AI, Aapki Kahani.
          </p>

          <h1 className="mb-10 font-display text-[44px] font-bold leading-[1.1] tracking-tight text-primary md:text-[80px]">
            The Future of <br />
            <span className="font-normal italic text-tertiary">Authentic</span>{" "}
            Content
          </h1>

          <p className="mb-14 max-w-xl font-sans text-lg leading-relaxed text-on-surface-variant">
            Merging the soul of Pakistani fashion with the precision of AI. We
            create hyper-realistic lifestyle content that resonates, converts,
            and elevates your brand&apos;s digital presence.
          </p>

          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <Link
              href="#niches"
              className="rounded-full bg-primary px-12 py-5 font-sans text-sm font-semibold tracking-wide text-on-primary shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Explore Our Gallery
            </Link>
            <Link
              href="#process"
              className="group flex items-center gap-3 font-sans text-sm font-semibold tracking-wide text-primary"
            >
              View Methodology
              <MaterialIcon
                name="arrow_forward"
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </div>

        <div className="relative hidden h-full lg:col-span-5 lg:block">
          <div className="absolute right-0 top-0 z-0 aspect-[4/5] w-[420px] rotate-3 overflow-hidden rounded-2xl border-8 border-white shadow-2xl">
            <Image
              src={images.heroPortrait}
              alt="AI Creator Portrait"
              fill
              priority
              className="object-cover"
              sizes="420px"
            />
          </div>

          <div className="absolute -left-12 top-40 z-20 w-[300px] -rotate-6 animate-[ambient-float_8s_ease-in-out_infinite] rounded-xl border border-outline-variant/30 bg-white p-6 shadow-2xl">
            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-surface-container-high">
              <Image
                src={images.serum}
                alt="Luxury cosmetic bottle"
                fill
                className="object-cover"
                sizes="252px"
              />
            </div>
            <p className="font-sans text-xs font-medium uppercase tracking-tighter text-tertiary">
              Luminous Pearl Serum
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Preview() {
  return (
    <section className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:pb-32">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Input stack: model + selected asset */}
        <div className="relative h-[360px] w-full max-w-[360px] shrink-0 sm:h-[400px] sm:max-w-[400px]">
          <div className="absolute right-0 top-2 w-[68%] animate-[ambient-float_9s_ease-in-out_infinite] overflow-hidden rounded-2xl bg-white p-3 shadow-[0_20px_50px_rgba(0,53,39,0.12)] [animation-delay:-2.5s]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image
                src={images.serum}
                alt="Selected product asset"
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div className="px-1 pb-2 pt-4">
              <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-tertiary">
                Selected Asset
              </p>
              <h3 className="font-display text-xl font-medium leading-tight text-primary sm:text-2xl">
                Luminous Pearl Serum
              </h3>
            </div>
          </div>

          <div className="absolute bottom-2 left-0 z-10 w-[52%] animate-[ambient-float_7s_ease-in-out_infinite] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_24px_60px_rgba(0,53,39,0.18)] [animation-delay:-1s]">
            <div className="relative aspect-[3/4]">
              <Image
                src={images.heroPortrait}
                alt="Verified creator model"
                fill
                className="object-cover"
                sizes="220px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 pb-3 pt-10">
                <p className="font-sans text-[11px] font-medium leading-snug text-white">
                  Verified Creator
                  <br />
                  Model AI-7
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center justify-center text-tertiary"
          aria-hidden="true"
        >
          <MaterialIcon name="sync_alt" className="text-4xl md:text-5xl" />
        </div>

        {/* Output: composite video player */}
        <div className="group relative w-full min-w-0 flex-1 animate-[ambient-float_10s_ease-in-out_infinite] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,53,39,0.14)] [animation-delay:-4s]">
          <div className="relative aspect-[16/10] cursor-pointer sm:aspect-[16/9]">
            <Image
              src={images.preview}
              alt="Lifestyle transformation composite"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            <div className="absolute left-4 top-4 text-white drop-shadow-md sm:left-5 sm:top-5">
              <p className="font-sans text-xs font-semibold tracking-wide sm:text-sm">
                Mehfil Media
              </p>
              <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/80">
                Light Mode
              </p>
            </div>

            <div className="absolute right-4 top-4 text-right text-white drop-shadow-md sm:right-5 sm:top-5">
              <p className="font-sans text-[10px] font-medium tracking-wide text-white/90 sm:text-xs">
                Pearl Ritual | Ethereal Glow
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/15 backdrop-blur-md transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
                <MaterialIcon
                  name="play_arrow"
                  filled
                  className="text-4xl text-white"
                />
              </div>
            </div>

            <div className="absolute inset-x-3 bottom-10 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:inset-x-4 sm:bottom-12 sm:px-5 sm:py-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h4 className="font-display text-lg font-medium leading-tight text-primary sm:text-2xl">
                    Lifestyle Transformation
                  </h4>
                  <p className="mt-1 font-sans text-[11px] text-on-surface-variant sm:text-xs">
                    Model &amp; Asset Composite Engine v2.4
                  </p>
                </div>
                <div className="mb-0.5 flex shrink-0 items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
                    Live
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/50 to-transparent px-4 pb-2.5 pt-6 text-white">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
              <span className="font-sans text-[10px] tabular-nums text-white/90">
                0:08 / 0:08
              </span>
              <MaterialIcon name="volume_up" className="text-base text-white/90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    title: "Asset Ingestion",
    body: "We begin by cataloging the physical essence of your brand—from the weave of a Jamawar textile to the precise curve of a silver ornament.",
    offset: "",
  },
  {
    number: "02",
    title: "Neural Synthesis",
    body: "Our proprietary models apply cultural nuances and high-fashion lighting protocols, creating a hyper-realistic digital twin with soul.",
    offset: "md:mt-40",
  },
  {
    number: "03",
    title: "Editorial Master",
    body: "Final assets are curated into cinematic vignettes, optimized for high-conversion marketing across global digital ecosystems.",
    offset: "md:-mt-20",
  },
] as const;

export function Methodology() {
  return (
    <section
      id="process"
      className="border-y border-outline-variant/10 bg-surface-container-low/20 py-[var(--spacing-section-gap)]"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="lg:sticky lg:top-40 lg:col-span-4">
            <span className="mb-6 block font-sans text-xs font-medium uppercase tracking-[0.3em] text-tertiary">
              Our Methodology
            </span>
            <h2 className="mb-8 font-display text-[32px] font-semibold leading-10 text-primary md:text-[40px] md:leading-[48px]">
              From Vision to Virtual Reality
            </h2>
            <p className="mb-10 max-w-sm font-sans text-base leading-relaxed text-on-surface-variant">
              A synthesis of traditional craftsmanship and neural rendering,
              designed for the modern brand.
            </p>
            <div className="h-px w-24 bg-tertiary" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:col-span-8 lg:gap-y-32">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`group border-t border-outline-variant/50 pt-8 ${step.offset}`}
              >
                <span className="mb-8 block font-display text-6xl text-primary/10 transition-all duration-500 group-hover:text-tertiary">
                  {step.number}
                </span>
                <h3 className="mb-6 font-display text-3xl font-medium text-primary">
                  {step.title}
                </h3>
                <p className="font-sans text-lg leading-relaxed text-on-surface-variant">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Philosophy() {
  return (
    <section className="relative py-[var(--spacing-section-gap)]">
      <Container>
        <div className="max-w-5xl">
          <h2 className="mb-16 font-display text-[32px] font-bold leading-tight text-primary md:text-[72px]">
            Where <span className="font-normal italic">Heritage</span>
            <br /> Meets the <span className="text-tertiary">Infinite</span>
          </h2>
          <div className="grid grid-cols-1 items-end gap-20 md:grid-cols-2">
            <div>
              <p className="mb-10 border-l-2 border-tertiary pl-6 font-sans text-sm font-semibold uppercase tracking-widest text-tertiary">
                Hamara technology Pakistani saqafat aur jadeed AI ka behtreen
                sangam hai.
              </p>
              <div className="space-y-8 font-sans text-lg leading-relaxed text-on-surface-variant">
                <p>
                  Mehfil Media was born from a singular vision: to bridge the
                  gap between centuries-old South Asian craftsmanship and the
                  limitless potential of artificial intelligence.
                </p>
              </div>
            </div>
            <div className="space-y-8 font-sans text-lg leading-relaxed text-on-surface-variant">
              <p>
                We don&apos;t just generate images; we curate experiences that
                honor the richness of Pakistani culture. Our technology
                understands the specific warmth of a Karachi sunset and the
                intricate shadows cast by Jali architecture.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
