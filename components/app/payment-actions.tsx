"use client";

import { useState } from "react";

import {
  approvePaymentAction,
  rejectPaymentAction,
} from "@/app/actions/admin";
import { inputClass, SubmitButton } from "@/components/app/ui";

/** Approve/reject controls for a pending payment request. */
export function PaymentActions({ paymentId }: { paymentId: string }) {
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className={`${inputClass} !w-44 !py-2`}
      />
      <form action={approvePaymentAction}>
        <input type="hidden" name="id" value={paymentId} />
        <input type="hidden" name="note" value={note} />
        <SubmitButton
          className="!bg-emerald-700 !px-4 !py-2 hover:!bg-emerald-800"
          pendingLabel="…"
        >
          Approve
        </SubmitButton>
      </form>
      <form action={rejectPaymentAction}>
        <input type="hidden" name="id" value={paymentId} />
        <input type="hidden" name="note" value={note} />
        <SubmitButton
          className="!bg-rani !px-4 !py-2 hover:!bg-ink"
          pendingLabel="…"
        >
          Reject
        </SubmitButton>
      </form>
    </div>
  );
}
