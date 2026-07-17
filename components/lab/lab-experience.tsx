"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { DissolveMorph } from "@/components/lab/dissolve-morph";
import { FluidCanvas } from "@/components/lab/fluid/fluid-canvas";
import { heroImages, reels, studio } from "@/lib/showcase";
import { DISCORD_INVITE_URL } from "@/lib/links";

/* ── morph scene ─────────────────────────────────────────────── */

function MorphScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      progressRef.current = progress;
      if (labelRef.current) {
        labelRef.current.textContent =
          progress < 0.35
            ? "Input · one product photo"
            : progress < 0.75
              ? "Synthesizing…"
              : "Output · your AI creator";
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="lab-morph" aria-label="Transformation">
      <div className="lab-morph__stage">
        <h2 className="lab-morph__headline">
          Watch a photo become{" "}
          <span className="lab-serif">a person.</span>
        </h2>
        <div className="lab-morph__frame">
          <DissolveMorph
            from={heroImages.product}
            to={heroImages.creator}
            progressRef={progressRef}
          />
        </div>
        <p className="lab-morph__label">
          <span ref={labelRef}>Input · one product photo</span>
          <span>scroll to render</span>
        </p>
      </div>
    </section>
  );
}

/* ── work shelf ──────────────────────────────────────────────── */

function ShelfCard({
  reel,
  index,
}: {
  reel: (typeof reels)[number];
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <article
      className="lab-card"
      style={{ "--i": index } as React.CSSProperties}
    >
      {reel.video ? (
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.image}
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        <Image
          src={reel.image}
          alt={`${reel.creator} — ${reel.caption}`}
          fill
          sizes="300px"
          loading="lazy"
          className="object-cover"
        />
      )}
      <span className="lab-card__tag">{reel.category}</span>
      <div className="lab-card__meta">
        <span className="lab-card__handle">{reel.handle}</span>
        <span className="lab-card__caption">{reel.caption}</span>
      </div>
    </article>
  );
}

/* ── data ────────────────────────────────────────────────────── */

const steps = [
  {
    title: "You upload one photo",
    body: "A product shot from your phone is enough. No studio day, no courier, no call sheet.",
    urdu: "ایک تصویر",
  },
  {
    title: "AI casts your creator",
    body: "From a house of AI-born Pakistani creators, the model picks the face your audience will trust.",
    urdu: "کاسٹنگ",
  },
  {
    title: "The script writes itself",
    body: "Hooks, desi idiom, product truths — drafted in seconds, tuned to how your market actually talks.",
    urdu: "کہانی",
  },
  {
    title: "The video generates",
    body: "Frame by frame, she performs your product. Lighting, voice, gesture — all synthesized.",
    urdu: "تخلیق",
  },
  {
    title: "A campaign arrives",
    body: "Dozens of cuts, ratios and hooks land in your inbox within 48 hours. Ready to post, ready to run.",
    urdu: "مکمل",
  },
] as const;

const stats = [
  { value: 48, suffix: "h", label: "from photo to campaign" },
  { value: 30, suffix: "+", label: "assets per product" },
  { value: 7, suffix: "", label: "categories already live" },
  { value: 3, suffix: "M+", label: "likes across generated reels" },
] as const;

const faqs = [
  {
    q: "Is the creator a real person?",
    a: "No — and that's the point. Mahnoor and the rest of the house are fully AI-generated Pakistani creators. No scheduling conflicts, no usage-rights renegotiation, no cancelled shoots. Every frame, gesture and word is synthesized for your product.",
  },
  {
    q: "What do you need from me?",
    a: "One decent photo of your product, taken on a phone in good light. That's genuinely it. We handle casting, scripting, rendering and cutting into every ratio you need.",
  },
  {
    q: "How fast is 48 hours, really?",
    a: "The clock starts when your upload lands. Concepts arrive first; once you approve a direction, the full campaign — dozens of cuts and hooks — is delivered inside the 48-hour window.",
  },
  {
    q: "What does it cost?",
    a: "About a tenth of one traditional studio day, with unlimited reshoots included. Your first concept is free — send us a product photo and see the work before you spend a rupee.",
  },
  {
    q: "Does synthetic content actually perform?",
    a: "Our generated reels have collected over 3.5 million likes and 370 thousand shares across seven product categories. Audiences respond to the story, the face and the timing — all of which are engineered, not left to chance.",
  },
] as const;

const tickerItems = [
  "48-hour delivery",
  "بولو تو سنے دنیا",
  "No shoot days",
  "One photo in",
  "کہانی آپ کی",
  "A campaign out",
  "Every frame synthetic",
  "محفل میں خوش آمدید",
] as const;

/* ── page ────────────────────────────────────────────────────── */

export function LabExperience() {
  return (
    <div className="lab">
      <div className="lab-progress" aria-hidden />

      <div className="lab-bar">
        <Link href="/">
          Mehfil <span className="lab-urdu">محفل</span>
        </Link>
        <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
          Start a project
        </a>
      </div>

      {/* act 1 — the ink room */}
      <header className="lab-hero">
        <div className="lab-hero__fluid">
          <FluidCanvas />
        </div>
        <div className="lab-hero__content">
          <p className="lab-hero__kicker">Mehfil Media — an AI content house</p>
          <h1 className="lab-hero__title">
            One photo in.
            <br />
            <span className="lab-hero__burn">A campaign out.</span>
          </h1>
          <p className="lab-hero__sub">
            Kahani aap ki, awaaz hamari. An AI creator turns your product
            photo into scroll-stopping reels for your Pakistani audience —
            delivered in 48 hours, no shoot required.
          </p>
        </div>
        <span className="lab-hero__hint">Scroll — the story pours</span>
      </header>

      {/* act 2 — the manifesto develops like film */}
      <section className="lab-section lab-manifesto" aria-label="Manifesto">
        <p className="lab-kicker">The problem</p>
        <p>Traditional content is slow, expensive and fragile.</p>
        <p>A studio day costs lakhs. A creator cancels. Your launch waits.</p>
        <p>
          So we <span className="lab-serif">deleted the wait.</span>
        </p>
      </section>

      {/* act 3 — the GPU morph */}
      <MorphScene />

      {/* ticker */}
      <div className="lab-ticker" aria-hidden>
        {[0, 1].map((copy) => (
          <div className="lab-ticker__track" key={copy}>
            {tickerItems.map((item) => (
              <span
                key={item}
                className={/[\u0600-\u06FF]/.test(item) ? "lab-urdu" : ""}
              >
                {item} <em>✦</em>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* act 4 — pipeline as a sticky deck */}
      <section className="lab-section" aria-label="How it works" id="how">
        <p className="lab-kicker">The pipeline</p>
        <h2 className="lab-h2">
          Five steps for us.{" "}
          <span className="lab-serif">One upload for you.</span>
        </h2>
        <div className="lab-steps" style={{ marginTop: "8vh" }}>
          {steps.map((step, i) => (
            <div
              className="lab-step"
              key={step.title}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="lab-step__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <span className="lab-step__urdu lab-urdu">{step.urdu}</span>
            </div>
          ))}
        </div>
      </section>

      {/* act 5 — the shelf of generated work */}
      <section className="lab-shelf" aria-label="The work" id="work">
        <div className="lab-shelf__pin">
          <div className="lab-shelf__head">
            <p className="lab-kicker">The work</p>
            <h2 className="lab-h2">
              Every frame here is{" "}
              <span className="lab-serif">synthetic.</span>
            </h2>
          </div>
          <div className="lab-shelf__track">
            {studio.campaigns.map((campaign, i) => (
              <ShelfCard
                key={campaign.id}
                index={i}
                reel={{
                  id: campaign.id,
                  creator: "Mahnoor",
                  handle: campaign.handle,
                  category: campaign.category,
                  caption: campaign.caption,
                  image: campaign.poster,
                  video: campaign.video,
                  likes: campaign.likes,
                  shares: campaign.shares,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* act 6 — receipts */}
      <section className="lab-section" aria-label="Results">
        <p className="lab-kicker">The receipts</p>
        <h2 className="lab-h2 lab-reveal">
          Numbers that <span className="lab-serif">scroll themselves.</span>
        </h2>
        <div className="lab-stats" style={{ marginTop: "6vh" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                className="lab-stat__value"
                data-suffix={stat.suffix}
                style={{ "--lab-count": stat.value } as React.CSSProperties}
              />
              <p className="lab-stat__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* act 7 — FAQ */}
      <section className="lab-section" aria-label="Questions">
        <p className="lab-kicker">Before you ask</p>
        <h2 className="lab-h2 lab-reveal">
          Fair <span className="lab-serif">questions.</span>
        </h2>
        <div className="lab-faq" style={{ marginTop: "5vh" }}>
          {faqs.map((faq) => (
            <details key={faq.q} name="lab-faq">
              <summary>{faq.q}</summary>
              <div className="lab-faq__body">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* act 9 — finale in the ink room again */}
      <footer className="lab-finale">
        <div className="lab-finale__fluid">
          <FluidCanvas ambient />
        </div>
        <div className="lab-finale__content">
          <p className="lab-finale__urdu lab-urdu">محفل میں خوش آمدید</p>
          <h2 className="lab-finale__title">
            Join the <span className="lab-serif">mehfil.</span>
          </h2>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lab-cta"
          >
            Send us your product <span aria-hidden>↗</span>
          </a>
          <p className="lab-footnote">
            First concept free. No shoot. No wait. We&apos;re on Discord —
            drop your photo in and we take it from there.
          </p>
        </div>
      </footer>
    </div>
  );
}
