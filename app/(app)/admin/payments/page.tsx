import type { Metadata } from "next";

import { PaymentActions } from "@/components/app/payment-actions";
import { Card, SectionTitle, StatusBadge } from "@/components/app/ui";
import { getUserById, listPaymentRequests } from "@/lib/queries";
import { fileUrl } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Payment approvals | Mehfil Media",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPaymentsPage() {
  const pending = listPaymentRequests({ status: "pending" });
  const resolved = listPaymentRequests().filter((p) => p.status !== "pending");

  return (
    <>
      <SectionTitle
        title="Payment approvals"
        subtitle="Verify the transfer against your bank statement, then approve to grant credits."
      />

      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        Pending ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <Card className="mb-10 py-10 text-center text-sm text-muted">
          Nothing waiting on you. Shabash.
        </Card>
      ) : (
        <div className="mb-10 space-y-4">
          {pending.map((payment) => {
            const buyer = getUserById(payment.user_id);
            return (
              <Card key={payment.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {payment.credits} credits · PKR{" "}
                      {payment.amount_pkr.toLocaleString()}
                      <span className="ml-2 text-sm font-normal text-muted">
                        ({payment.package_id})
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {buyer ? `${buyer.name} · ${buyer.email}` : "Unknown user"}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="text-muted">Method:</span> {payment.method}{" "}
                      · <span className="text-muted">Ref:</span>{" "}
                      <span className="font-mono">{payment.reference}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Requested {formatDate(payment.created_at)}
                    </p>
                    {payment.receipt_upload_id ? (
                      <a
                        href={fileUrl(payment.receipt_upload_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-rani hover:underline"
                      >
                        View receipt →
                      </a>
                    ) : null}
                  </div>
                  <PaymentActions paymentId={payment.id} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold tracking-tight">History</h2>
      {resolved.length === 0 ? (
        <p className="text-sm text-muted">No resolved payments yet.</p>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {resolved.map((payment) => {
              const buyer = getUserById(payment.user_id);
              return (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {payment.credits} credits · PKR{" "}
                      {payment.amount_pkr.toLocaleString()} ·{" "}
                      {buyer?.email ?? "unknown"}
                    </p>
                    <p className="text-xs text-muted">
                      {payment.method} · {payment.reference} ·{" "}
                      {payment.resolved_at ? formatDate(payment.resolved_at) : ""}
                      {payment.admin_note ? ` · “${payment.admin_note}”` : ""}
                    </p>
                  </div>
                  <StatusBadge status={payment.status} />
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
