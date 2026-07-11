import Link from "next/link";
import type { Metadata } from "next";

import { AutoRefresh } from "@/components/app/auto-refresh";
import { Card, SectionTitle, StatusBadge } from "@/components/app/ui";
import { requireUser } from "@/lib/auth";
import { syncPendingJobs } from "@/lib/generation";
import { listCampaigns, listJobs } from "@/lib/queries";
import { CREDIT_COST } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Dashboard | Mehfil Media",
};

export default async function DashboardPage() {
  const user = await requireUser();
  await syncPendingJobs(user.id);
  const campaigns = listCampaigns(user.id);
  const generating = campaigns.some((c) => c.status === "generating");
  const totalAssets = campaigns.reduce(
    (sum, c) => sum + listJobs(c.id).filter((j) => j.status === "completed").length,
    0,
  );

  return (
    <>
      {generating ? <AutoRefresh /> : null}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          title={`Salaam, ${user.name.split(" ")[0]}`}
          subtitle="Your campaigns, credits and generated assets in one place."
        />
        <Link
          href="/dashboard/campaigns/new"
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-rani"
        >
          + New campaign
        </Link>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Credit balance</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {user.credits.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted">
            1 video = {CREDIT_COST.video} · 1 image = {CREDIT_COST.image}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Campaigns</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {campaigns.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            {campaigns.filter((c) => c.status === "generating").length} generating now
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted">Assets delivered</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{totalAssets}</p>
          <p className="mt-1 text-xs text-muted">videos and images ready to post</p>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Campaigns</h2>
      {campaigns.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-14 text-center">
          <p className="serif-accent text-2xl">Your mehfil is empty — for now.</p>
          <p className="max-w-md text-sm text-muted">
            Create your first campaign: pick a creator, upload your product,
            write the story, and let the studio do the rest.
          </p>
          <Link
            href="/dashboard/campaigns/new"
            className="rounded-full bg-rani px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink"
          >
            Create your first campaign
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => {
            const jobs = listJobs(campaign.id);
            const done = jobs.filter((j) => j.status === "completed").length;
            return (
              <Link
                key={campaign.id}
                href={`/dashboard/campaigns/${campaign.id}`}
                className="group"
              >
                <Card className="transition-colors group-hover:border-rani/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold tracking-tight group-hover:text-rani">
                        {campaign.name}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {campaign.product_name} · {campaign.quantity}{" "}
                        {campaign.output_type}
                        {campaign.quantity > 1 ? "s" : ""} · {campaign.aspect_ratio}
                      </p>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ivory-deep">
                    <div
                      className="h-full rounded-full bg-rani transition-all"
                      style={{ width: `${(done / campaign.quantity) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {done}/{campaign.quantity} ready · {campaign.credits_cost} credits
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
