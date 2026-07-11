"use client";

import { useActionState, useState } from "react";

import { requestTopUpAction } from "@/app/actions/billing";
import {
  FormError,
  inputClass,
  labelClass,
  SubmitButton,
} from "@/components/app/ui";
import type { CreditPackage } from "@/lib/pricing";

export function TopUpForm({
  packages,
  methods,
  instructions,
}: {
  packages: CreditPackage[];
  methods: readonly string[];
  instructions: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
}) {
  const [state, formAction] = useActionState(requestTopUpAction, {});
  const [selected, setSelected] = useState(packages[0]?.id ?? "");
  const pkg = packages.find((p) => p.id === selected);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state.error} />

      <div>
        <span className={labelClass}>Choose a package</span>
        <div className="grid gap-3 sm:grid-cols-3">
          {packages.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                selected === p.id
                  ? "border-rani bg-rani-soft"
                  : "border-line bg-white/60 hover:border-ink/30"
              }`}
            >
              <input
                type="radio"
                name="package"
                value={p.id}
                checked={selected === p.id}
                onChange={() => setSelected(p.id)}
                className="sr-only"
              />
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {p.credits}
                <span className="text-sm font-normal text-muted"> credits</span>
              </p>
              <p className="mt-1 text-sm font-medium text-rani">
                PKR {p.amountPkr.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-muted">{p.blurb}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-ivory-deep/60 p-4 text-sm">
        <p className="mb-2 font-medium">
          Transfer {pkg ? `PKR ${pkg.amountPkr.toLocaleString()}` : "the amount"} to:
        </p>
        <dl className="grid gap-1 text-muted sm:grid-cols-2">
          <div>
            <dt className="inline font-medium text-ink-soft">Bank: </dt>
            <dd className="inline">{instructions.bankName}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink-soft">Title: </dt>
            <dd className="inline">{instructions.accountTitle}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink-soft">Account: </dt>
            <dd className="inline">{instructions.accountNumber}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink-soft">IBAN: </dt>
            <dd className="inline">{instructions.iban}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted">
          After transferring, submit the reference below. Credits are added as
          soon as our team verifies the payment (usually within a few hours).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="method" className={labelClass}>
            Payment method
          </label>
          <select id="method" name="method" className={inputClass} required>
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reference" className={labelClass}>
            Transaction reference
          </label>
          <input
            id="reference"
            name="reference"
            required
            minLength={4}
            placeholder="e.g. TRX-8842019"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="receipt" className={labelClass}>
          Receipt screenshot (optional)
        </label>
        <input
          id="receipt"
          name="receipt"
          type="file"
          accept="image/*,application/pdf"
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-rani"
        />
      </div>

      <SubmitButton pendingLabel="Submitting…">
        Submit for approval
      </SubmitButton>
    </form>
  );
}
