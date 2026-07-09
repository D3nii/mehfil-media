import Image from "next/image";
import Link from "next/link";

import { Container, MaterialIcon } from "@/components/ui";
import { images } from "@/lib/images";
import { DISCORD_INVITE_URL } from "@/lib/links";

export function Niches() {
  return (
    <section
      id="niches"
      className="bg-surface-container-low/40 py-[var(--spacing-section-gap)]"
    >
      <Container>
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
            href="#niches"
            className="group flex items-center gap-3 font-sans text-sm font-semibold text-primary transition-all hover:gap-6"
          >
            View Full Catalog
            <MaterialIcon
              name="north_east"
              className="transition-transform group-hover:rotate-45"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-16">
          <div className="group mb-20 cursor-pointer md:col-span-5 md:mb-0">
            <div className="relative mb-8 aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={images.jewelry}
                alt="Jewelry Detail"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
                <span className="rounded-full bg-white px-8 py-3 font-sans text-sm font-semibold tracking-widest text-primary shadow-2xl">
                  EXPLORE GEMS
                </span>
              </div>
            </div>
            <h4 className="mb-4 font-display text-3xl font-medium text-primary">
              High Jewelry
            </h4>
            <p className="max-w-sm font-sans text-base text-on-surface-variant">
              Mastering the refraction of heritage stones and the luster of 22k
              gold.
            </p>
          </div>

          <div className="hidden md:col-span-1 md:block" />

          <div className="group mb-20 cursor-pointer md:col-span-6 md:-mt-24 md:mb-0">
            <div className="relative mb-8 aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={images.textiles}
                alt="Textile Detail"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
                <span className="rounded-full bg-white px-8 py-3 font-sans text-sm font-semibold tracking-widest text-primary shadow-2xl">
                  EXPLORE WEAVES
                </span>
              </div>
            </div>
            <h4 className="mb-4 font-display text-3xl font-medium text-primary">
              Artisanal Textiles
            </h4>
            <p className="max-w-md font-sans text-base text-on-surface-variant">
              Capturing the delicate drape of chiffon and the complex geometry
              of Block Prints.
            </p>
          </div>

          <div className="group cursor-pointer md:col-span-6 md:col-start-4 md:mt-16">
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={images.fragrance}
                alt="Fragrance Asset"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100">
                <span className="rounded-full bg-white px-8 py-3 font-sans text-sm font-semibold tracking-widest text-primary shadow-2xl">
                  EXPLORE SCENTS
                </span>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="mb-4 font-display text-3xl font-medium text-primary">
                  Luxury Fragrance
                </h4>
                <p className="max-w-md font-sans text-base text-on-surface-variant">
                  Translating olfactory stories into atmospheric, high-fidelity
                  visual narratives.
                </p>
              </div>
              <MaterialIcon
                name="spa"
                className="hidden text-4xl text-tertiary/30 lg:block"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const features = [
  {
    icon: "diamond",
    title: "Culturally Contextual AI",
    body: "Our models are trained on regional textiles, traditional silhouettes, and specific lighting conditions found in Karachi and Lahore architecture.",
  },
  {
    icon: "palette",
    title: "Bespoke Aesthetics",
    body: "From deep emerald velvet textures to the soft translucency of digital chiffon, we master the fabrics that define South Asian luxury.",
  },
  {
    icon: "center_focus_strong",
    title: "High-Fidelity Beauty",
    body: "Precision skin rendering that respects and celebrates diverse South Asian complexions with hyper-realistic detail.",
  },
] as const;

export function Features() {
  return (
    <section className="overflow-hidden bg-surface py-[var(--spacing-section-gap)]">
      <Container>
        <div className="flex flex-col items-center gap-24 lg:flex-row">
          <div className="z-10 lg:w-5/12">
            <h2 className="mb-12 font-display text-[42px] font-semibold leading-tight text-primary md:text-[56px]">
              South Asian Nuance, <br />
              <span className="font-normal italic text-tertiary">
                Global Standards.
              </span>
            </h2>
            <div className="space-y-12">
              {features.map((feature) => (
                <div key={feature.title} className="group flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary/10 transition-colors group-hover:bg-tertiary">
                    <MaterialIcon
                      name={feature.icon}
                      className="text-tertiary group-hover:text-white"
                    />
                  </div>
                  <div>
                    <h4 className="mb-3 font-sans text-lg font-semibold uppercase tracking-wider text-primary">
                      {feature.title}
                    </h4>
                    <p className="leading-relaxed text-on-surface-variant">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:w-7/12">
            <div className="relative z-0 grid grid-cols-2 gap-6">
              <div className="translate-y-12">
                <div className="relative aspect-[3/5] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={images.textiles}
                    alt="Detail 1"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 45vw, 30vw"
                  />
                </div>
              </div>
              <div>
                <div className="relative mt-24 aspect-[3/5] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={images.fragrance}
                    alt="Detail 2"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 45vw, 30vw"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -right-20 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
          </div>
        </div>
      </Container>
    </section>
  );
}

const testimonials = [
  {
    quote:
      '"The level of detail in the fabric rendering—specifically the subtle sheen of silk—was extraordinary. Noor AI delivered assets that actually felt \'premium\' rather than just \'digital\'."',
    initials: "ZA",
    name: "Zara Ahmed",
    role: "Creative Lead, Elan Aesthetics",
    variant: "light" as const,
    offset: "",
  },
  {
    quote:
      '"Reduced our production cycles from 3 weeks to 48 hours. We can now test 10x more creative variants without the overhead of physical shoots."',
    initials: "OM",
    name: "Omar Mansoor",
    role: "Founder, Mansoor Fragrances",
    variant: "dark" as const,
    offset: "lg:-translate-y-10",
  },
  {
    quote:
      '"Finally, an AI agency that understands the Pakistani skin tone and the specific warmth of our golden-hour lighting. Truly groundbreaking work."',
    initials: "SK",
    name: "Sana Khalid",
    role: "Marketing Director, Mehfil Cosmetics",
    variant: "light" as const,
    offset: "",
  },
] as const;

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-surface-container-low/50 py-[var(--spacing-section-gap)]"
    >
      <Container>
        <div className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-[40px] font-semibold leading-[48px] text-primary">
              Success Stories
            </h2>
            <p className="mb-4 text-lg text-on-surface-variant">
              Trusted by leading South Asian brands to redefine digital
              storytelling.
            </p>
          </div>
          <div className="text-right">
            <p className="font-sans text-sm font-bold uppercase tracking-widest text-primary">
              Humaray kamyab saathi kya kehtay hain.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {testimonials.map((item) => {
            const isDark = item.variant === "dark";
            return (
              <div
                key={item.name}
                className={`flex flex-col justify-between rounded-[2rem] p-12 transition-all duration-500 hover:-translate-y-2 ${item.offset} ${
                  isDark
                    ? "bg-primary text-on-primary shadow-2xl shadow-primary/20"
                    : "border border-outline-variant/30 bg-white shadow-xl shadow-primary/5"
                }`}
              >
                <div>
                  <div
                    className={`mb-10 flex ${isDark ? "text-tertiary-fixed" : "text-tertiary"}`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <MaterialIcon
                        key={index}
                        name="star"
                        filled={isDark}
                        className="text-[20px]"
                      />
                    ))}
                  </div>
                  <p
                    className={`mb-12 font-sans text-lg italic leading-[1.6] ${
                      isDark ? "text-white/90" : "text-on-surface-variant"
                    }`}
                  >
                    {item.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                      isDark
                        ? "bg-white/10"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <h5
                      className={`font-sans text-base font-semibold ${
                        isDark ? "" : "text-primary"
                      }`}
                    >
                      {item.name}
                    </h5>
                    <p
                      className={`font-sans text-xs font-medium ${
                        isDark ? "text-white/60" : "text-on-surface-variant"
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

const stats = [
  { value: "500+", label: "Assets Generated" },
  { value: "40%", label: "Cost Reduction" },
  { value: "24h", label: "Avg. Delivery" },
  { value: "12", label: "Luxury Partners" },
] as const;

export function Stats() {
  return (
    <section className="mx-auto max-w-[var(--spacing-container-max)] border-t border-outline-variant/20 px-[var(--spacing-margin-mobile)] py-32 md:px-[var(--spacing-margin-desktop)]">
      <div className="grid grid-cols-2 gap-12 text-center lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-4">
            <p className="font-display text-5xl font-bold text-primary md:text-7xl">
              {stat.value}
            </p>
            <div className="mx-auto h-px w-8 bg-tertiary" />
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section
      id="cta"
      className="mx-auto max-w-[var(--spacing-container-max)] px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)]"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 text-left text-on-primary shadow-2xl md:p-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
          }}
        />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-tertiary/20 blur-[100px]" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="mb-12 font-display text-[32px] font-bold leading-[1.1] md:text-7xl">
              Join the Future of Creative Expression
            </h2>
            <p className="max-w-xl font-sans text-xl text-white/70">
              Apnay brand ko AI ki taqat se agay barhayain. Aaj hi humaray saath
              kaam shuru karain.
            </p>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-16 py-6 text-center font-sans text-lg font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-primary-fixed-dim active:scale-95"
            >
              Start a Project
            </a>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-full border border-white/40 px-16 py-6 font-sans text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              Join Discord
              <MaterialIcon name="forum" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
