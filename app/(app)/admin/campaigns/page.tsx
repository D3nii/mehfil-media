import type { Metadata } from "next";
import Link from "next/link";

import { Card, SectionTitle, StatusBadge } from "@/components/app/ui";
import { syncPendingJobs } from "@/lib/generation";
import { getUserById, listCampaigns, listJobs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Campaigns | Mehfil Media Admin",
};

export default async function AdminCampaignsPage() {
  await syncPendingJobs();
  const campaigns = listCampaigns();

  return (
    <>
      <SectionTitle
        title="All campaigns"
        subtitle="Every generation run across the platform."
      />
      {campaigns.length === 0 ? (
        <Card className="py-10 text-center text-sm text-muted">
          No campaigns yet.
        </Card>
      ) : (
        <Card className="overflow-x-auto !p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Output</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Credits</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const owner = getUserById(campaign.user_id);
                const jobs = listJobs(campaign.id);
                const done = jobs.filter((j) => j.status === "completed").length;
                return (
                  <tr
                    key={campaign.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="font-medium hover:text-rani"
                      >
                        {campaign.name}
                      </Link>
                      <p className="text-xs text-muted">{campaign.product_name}</p>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {owner?.email ?? "unknown"}
                    </td>
                    <td className="px-5 py-3">
                      {campaign.quantity} {campaign.output_type}
                      {campaign.quantity > 1 ? "s" : ""} · {campaign.aspect_ratio}
                    </td>
                    <td className="px-5 py-3">
                      {done}/{campaign.quantity}
                    </td>
                    <td className="px-5 py-3">{campaign.credits_cost}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={campaign.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
