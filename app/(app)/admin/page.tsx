import type { Metadata } from "next";
import Link from "next/link";

import { Card, SectionTitle } from "@/components/app/ui";
import { adminStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admin | Mehfil Media",
};

export default async function AdminPage() {
  const stats = adminStats();

  const tiles = [
    { label: "Users", value: stats.users.toLocaleString(), href: "/admin/users" },
    {
      label: "Pending payments",
      value: stats.pendingPayments.toLocaleString(),
      href: "/admin/payments",
      highlight: stats.pendingPayments > 0,
    },
    {
      label: "Approved revenue",
      value: `PKR ${stats.approvedRevenuePkr.toLocaleString()}`,
      href: "/admin/payments",
    },
    {
      label: "Campaigns",
      value: stats.campaigns.toLocaleString(),
      href: "/admin/campaigns",
    },
    {
      label: "Assets generated",
      value: stats.assetsGenerated.toLocaleString(),
      href: "/admin/campaigns",
    },
  ];

  return (
    <>
      <SectionTitle
        title="Admin overview"
        subtitle="Payments waiting on you appear here first."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card
              className={
                tile.highlight ? "border-rani/50 bg-rani-soft" : undefined
              }
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                {tile.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {tile.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
