import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AutoRefresh } from "@/components/app/auto-refresh";
import { Card, SectionTitle, StatusBadge } from "@/components/app/ui";
import { requireUser } from "@/lib/auth";
import { syncPendingJobs } from "@/lib/generation";
import {
  getCampaign,
  listCampaignProducts,
  listJobs,
} from "@/lib/queries";
import { fileUrl } from "@/lib/storage";
import { PRESET_ACTORS } from "@/lib/actors";
import type { Job } from "@/lib/types";

export const metadata: Metadata = {
  title: "Campaign | Mehfil Media",
};

function aspectClass(ratio: string): string {
  if (ratio === "16:9") return "aspect-video";
  if (ratio === "1:1") return "aspect-square";
  return "aspect-[9/16]";
}

function JobResult({ job, ratio }: { job: Job; ratio: string }) {
  if (job.status === "completed" && job.result_url) {
    if (job.kind === "video") {
      return (
        <video
          src={job.result_url}
          controls
          playsInline
          preload="metadata"
          className={`${aspectClass(ratio)} w-full rounded-xl bg-ink object-cover`}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- generated asset URLs are dynamic
      <img
        src={job.result_url}
        alt={`Generated asset ${job.position}`}
        className={`${aspectClass(ratio)} w-full rounded-xl object-cover`}
      />
    );
  }
  return (
    <div
      className={`${aspectClass(ratio)} flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ivory-deep/60 p-4 text-center`}
    >
      {job.status === "failed" ? (
        <>
          <p className="text-sm font-medium text-rani">Generation failed</p>
          {job.error ? (
            <p className="line-clamp-3 text-xs text-muted">{job.error}</p>
          ) : null}
          <p className="text-xs text-muted">Credits refunded.</p>
        </>
      ) : (
        <>
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-rani border-t-transparent" />
          <p className="text-xs text-muted">
            {job.status === "queued" ? "Queued" : "Generating…"}
          </p>
        </>
      )}
    </div>
  );
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign || (campaign.user_id !== user.id && user.role !== "admin")) {
    notFound();
  }

  await syncPendingJobs(campaign.user_id);
  const fresh = getCampaign(id)!;
  const jobs = listJobs(id);
  const products = listCampaignProducts(id);
  const presetActor = PRESET_ACTORS.find((a) => a.id === fresh.actor_preset);
  const actorImage =
    fresh.actor_source === "upload" && fresh.actor_upload_id
      ? fileUrl(fresh.actor_upload_id)
      : presetActor?.image;

  return (
    <>
      {fresh.status === "generating" ? <AutoRefresh /> : null}

      <div className="mb-2 text-sm">
        <Link href="/dashboard" className="text-muted hover:text-rani">
          ← All campaigns
        </Link>
      </div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          title={fresh.name}
          subtitle={`${fresh.product_name} · ${fresh.quantity} ${fresh.output_type}${fresh.quantity > 1 ? "s" : ""} · ${fresh.aspect_ratio} · ${fresh.credits_cost} credits`}
        />
        <StatusBadge status={fresh.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Results</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="!p-3">
                <JobResult job={job} ratio={fresh.aspect_ratio} />
                <div className="mt-3 flex items-center justify-between px-1">
                  <p className="text-xs text-muted">
                    {fresh.output_type === "video" ? "Video" : "Image"} {job.position}
                  </p>
                  {job.status === "completed" && job.result_url ? (
                    <a
                      href={job.result_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-rani hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    <StatusBadge status={job.status} />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Creator
            </h3>
            <div className="flex items-center gap-3">
              {actorImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- mixed local/remote/user-uploaded sources
                <img
                  src={actorImage}
                  alt="Campaign actor"
                  className="h-16 w-16 rounded-xl border border-line object-cover"
                />
              ) : null}
              <p className="text-sm">
                {fresh.actor_source === "preset"
                  ? (presetActor?.name ?? "Mehfil creator")
                  : "Your uploaded actor"}
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Product images
            </h3>
            <div className="flex flex-wrap gap-2">
              {products.map((product) => (
                // eslint-disable-next-line @next/next/no-img-element -- private uploads served via API route
                <img
                  key={product.id}
                  src={fileUrl(product.id)}
                  alt={product.original_name}
                  className="h-20 w-20 rounded-lg border border-line object-cover"
                />
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Storyline
            </h3>
            <p className="whitespace-pre-wrap text-sm text-ink-soft">
              {fresh.storyline}
            </p>
          </Card>

          <Card>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-soft">
              Script
            </h3>
            <p className="serif-accent whitespace-pre-wrap text-base">
              “{fresh.script}”
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
