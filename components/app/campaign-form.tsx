"use client";

/* eslint-disable @next/next/no-img-element -- object URLs for local file previews */

import { useActionState, useEffect, useMemo, useState } from "react";

import { createCampaignAction } from "@/app/actions/campaigns";
import {
  FormError,
  inputClass,
  labelClass,
  SubmitButton,
} from "@/components/app/ui";
import type { PresetActor } from "@/lib/actors";
import type { OutputType } from "@/lib/types";

const ASPECT_RATIOS = [
  { value: "9:16", label: "9:16 · Reels / TikTok" },
  { value: "1:1", label: "1:1 · Feed" },
  { value: "16:9", label: "16:9 · YouTube" },
];

export function CampaignForm({
  presetActors,
  creditCost,
  maxQuantity,
  balance,
}: {
  presetActors: PresetActor[];
  creditCost: Record<OutputType, number>;
  maxQuantity: number;
  balance: number;
}) {
  const [state, formAction] = useActionState(createCampaignAction, {});
  const [actorSource, setActorSource] = useState<"preset" | "upload">("preset");
  const [actorPreset, setActorPreset] = useState(presetActors[0]?.id ?? "");
  const [actorPreview, setActorPreview] = useState<string | null>(null);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [outputType, setOutputType] = useState<OutputType>("video");
  const [quantity, setQuantity] = useState(3);

  const cost = creditCost[outputType] * quantity;
  const affordable = cost <= balance;

  useEffect(() => {
    return () => {
      if (actorPreview) URL.revokeObjectURL(actorPreview);
      productPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // Intentionally only on unmount; URLs are revoked eagerly on change below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quantities = useMemo(
    () => Array.from({ length: maxQuantity }, (_, i) => i + 1),
    [maxQuantity],
  );

  return (
    <form action={formAction} className="space-y-10">
      <FormError error={state.error} />

      {/* 1 — Basics */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          <span className="mr-2 text-rani">01</span> The basics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Campaign name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={3}
              placeholder="Eid lawn drop — teaser reels"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="productName" className={labelClass}>
              Product name
            </label>
            <input
              id="productName"
              name="productName"
              required
              placeholder="Zainab Lawn Vol. 4"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 2 — Actor */}
      <section>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          <span className="mr-2 text-rani">02</span> Choose your creator
        </h2>
        <p className="mb-4 text-sm text-muted">
          Pick one of our AI creators, or upload a photo of your own actor.
        </p>
        <input type="hidden" name="actorSource" value={actorSource} />
        <div className="mb-4 inline-flex rounded-full border border-line p-1">
          {(["preset", "upload"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setActorSource(source)}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                actorSource === source
                  ? "bg-ink text-ivory"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {source === "preset" ? "Mehfil creators" : "Upload your own"}
            </button>
          ))}
        </div>

        {actorSource === "preset" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {presetActors.map((actor) => (
              <label
                key={actor.id}
                className={`cursor-pointer overflow-hidden rounded-2xl border transition-colors ${
                  actorPreset === actor.id
                    ? "border-rani ring-2 ring-rani/30"
                    : "border-line hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="actorPreset"
                  value={actor.id}
                  checked={actorPreset === actor.id}
                  onChange={() => setActorPreset(actor.id)}
                  className="sr-only"
                />
                <img
                  src={actor.image}
                  alt={actor.name}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold">{actor.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{actor.vibe}</p>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            <div>
              <label htmlFor="actorImage" className={labelClass}>
                Actor photo (clear face, good lighting)
              </label>
              <input
                id="actorImage"
                name="actorImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (actorPreview) URL.revokeObjectURL(actorPreview);
                  setActorPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-rani"
              />
            </div>
            {actorPreview ? (
              <img
                src={actorPreview}
                alt="Actor preview"
                className="h-40 w-32 rounded-2xl border border-line object-cover"
              />
            ) : null}
          </div>
        )}
      </section>

      {/* 3 — Product */}
      <section>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          <span className="mr-2 text-rani">03</span> Your product
        </h2>
        <p className="mb-4 text-sm text-muted">
          Upload 1–5 images of the product. Clean backgrounds work best.
        </p>
        <input
          name="productImages"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => {
            productPreviews.forEach((url) => URL.revokeObjectURL(url));
            const files = Array.from(e.target.files ?? []);
            setProductPreviews(files.map((f) => URL.createObjectURL(f)));
          }}
          className="block text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-rani"
        />
        {productPreviews.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {productPreviews.map((url) => (
              <img
                key={url}
                src={url}
                alt="Product preview"
                className="h-28 w-28 rounded-xl border border-line object-cover"
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* 4 — Story & script */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          <span className="mr-2 text-rani">04</span> Story & script
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="storyline" className={labelClass}>
              Storyline / production direction
            </label>
            <textarea
              id="storyline"
              name="storyline"
              required
              minLength={20}
              rows={4}
              placeholder="Unboxing at golden hour. She opens the box, gasps at the jhumkas, tries them on in front of the mirror, ends with a close-up smile…"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="script" className={labelClass}>
              Script — exactly what the creator says
            </label>
            <textarea
              id="script"
              name="script"
              required
              minLength={10}
              rows={4}
              placeholder="Okay so everyone kept asking about these jhumkas… here's the unboxing. Look at the detailing! Link in bio before they sell out."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 5 — Output & cost */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          <span className="mr-2 text-rani">05</span> Output
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <span className={labelClass}>Format</span>
            <input type="hidden" name="outputType" value={outputType} />
            <div className="flex rounded-xl border border-line p-1">
              {(["video", "image"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOutputType(type)}
                  className={`flex-1 rounded-lg px-3 py-2.5 text-sm capitalize transition-colors ${
                    outputType === type
                      ? "bg-ink text-ivory"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {type}s · {creditCost[type]} cr
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="aspectRatio" className={labelClass}>
              Aspect ratio
            </label>
            <select id="aspectRatio" name="aspectRatio" className={inputClass}>
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className={labelClass}>
              How many?
            </label>
            <select
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={inputClass}
            >
              {quantities.map((n) => (
                <option key={n} value={n}>
                  {n} {outputType}
                  {n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 ${
            affordable ? "border-line bg-ivory-deep/60" : "border-rani/40 bg-rani-soft"
          }`}
        >
          <div>
            <p className="text-sm text-muted">Total cost</p>
            <p className="text-3xl font-semibold tracking-tight">
              {cost} <span className="text-base font-normal text-muted">credits</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Balance: {balance.toLocaleString()} credits
              {!affordable ? " — top up to launch this campaign" : ""}
            </p>
          </div>
          <SubmitButton pendingLabel="Uploading & launching…">
            Launch campaign
          </SubmitButton>
        </div>
      </section>
    </form>
  );
}
