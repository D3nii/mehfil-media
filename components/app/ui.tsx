"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/** Shared UI primitives for the SaaS surfaces, matching the Mehfil brand. */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-ivory p-6 shadow-[0_1px_0_rgba(23,19,16,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Working…",
  className = "",
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full bg-ink px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-rani disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="rounded-lg border border-rani/30 bg-rani-soft px-4 py-3 text-sm text-rani">
      {error}
    </p>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-rani";

export const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-soft";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rani-soft text-rani",
  generating: "bg-sky-100 text-sky-800",
  queued: "bg-ivory-deep text-ink-soft",
  processing: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  partial: "bg-amber-100 text-amber-800",
  failed: "bg-rani-soft text-rani",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${STATUS_STYLES[status] ?? "bg-ivory-deep text-ink-soft"}`}
    >
      {status}
    </span>
  );
}

export function CreditsPill({ credits }: { credits: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-3 py-1.5 text-sm font-medium">
      <span className="h-2 w-2 rounded-full bg-rani" />
      {credits.toLocaleString()} credits
    </span>
  );
}
