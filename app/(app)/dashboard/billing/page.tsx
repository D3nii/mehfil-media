import type { Metadata } from "next";

import { TopUpForm } from "@/components/app/topup-form";
import { Card, SectionTitle, StatusBadge } from "@/components/app/ui";
import { requireUser } from "@/lib/auth";
import { listPaymentRequests, listTransactions } from "@/lib/queries";
import {
  CREDIT_PACKAGES,
  PAYMENT_INSTRUCTIONS,
  PAYMENT_METHODS,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Credits & billing | Mehfil Media",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ requested?: string }>;
}) {
  const user = await requireUser();
  const { requested } = await searchParams;
  const payments = listPaymentRequests({ userId: user.id });
  const transactions = listTransactions(user.id);

  return (
    <>
      <SectionTitle
        title="Credits & billing"
        subtitle={`Current balance: ${user.credits.toLocaleString()} credits`}
      />

      {requested ? (
        <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Top-up request received. Credits will appear once an admin verifies
          your payment.
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <Card>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">
            Buy credits
          </h2>
          <TopUpForm
            packages={CREDIT_PACKAGES}
            methods={PAYMENT_METHODS}
            instructions={PAYMENT_INSTRUCTIONS}
          />
        </Card>

        <div className="space-y-8">
          <Card>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Top-up requests
            </h2>
            {payments.length === 0 ? (
              <p className="text-sm text-muted">No top-up requests yet.</p>
            ) : (
              <ul className="space-y-3">
                {payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {p.credits} credits · PKR {p.amount_pkr.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted">
                        {p.method} · {p.reference} · {formatDate(p.created_at)}
                      </p>
                      {p.admin_note ? (
                        <p className="mt-1 text-xs text-rani">{p.admin_note}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Credit history
            </h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 border-b border-line pb-2 text-sm last:border-0"
                  >
                    <div>
                      <p>{t.reason}</p>
                      <p className="text-xs text-muted">{formatDate(t.created_at)}</p>
                    </div>
                    <span
                      className={`font-semibold ${t.delta > 0 ? "text-emerald-700" : "text-rani"}`}
                    >
                      {t.delta > 0 ? "+" : ""}
                      {t.delta}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
