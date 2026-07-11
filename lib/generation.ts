import "server-only";

import {
  getCampaign,
  listCampaignProducts,
  listJobs,
  listPendingJobs,
  reconcileCampaign,
  updateJob,
} from "@/lib/queries";
import {
  checkStatus,
  higgsfieldConfigured,
  submitImageGeneration,
  submitVideoGeneration,
} from "@/lib/higgsfield";
import { signedFileUrl } from "@/lib/storage";
import { PRESET_ACTORS } from "@/lib/actors";
import type { Campaign, Job } from "@/lib/types";

/**
 * Generation orchestration. Jobs are dispatched to Higgsfield right after
 * a campaign is created and re-synced whenever a dashboard page loads
 * (poll-on-read keeps the stack simple: no queue workers needed).
 *
 * MOCK mode (no Higgsfield credentials): jobs auto-complete ~45 seconds
 * after dispatch using placeholder studio assets, so the entire product
 * flow — credits, campaigns, admin — can be exercised locally.
 */

const MOCK_COMPLETE_AFTER_MS = 45_000;

const MOCK_VIDEO_RESULTS = [
  "/studio/earring-reel.mp4",
  "/studio/clothes-reel.mp4",
  "/studio/chai-reel.mp4",
  "/studio/lipstick-reel.mp4",
  "/studio/perfume-reel.mp4",
  "/studio/skincare-reel.mp4",
  "/studio/icecream-reel.mp4",
];

const MOCK_IMAGE_RESULTS = [
  "/studio/earring-poster.jpg",
  "/studio/clothes-poster.jpg",
  "/studio/chai-poster.jpg",
  "/studio/lipstick-poster.jpg",
  "/studio/perfume-poster.jpg",
  "/studio/skincare-poster.jpg",
  "/studio/icecream-poster.jpg",
];

function buildPrompt(campaign: Campaign): string {
  return [
    `UGC-style ${campaign.output_type} advertisement for "${campaign.product_name}".`,
    `Storyline / production direction: ${campaign.storyline}`,
    `The creator should look natural and authentic, filmed like a phone selfie ad.`,
  ].join("\n");
}

function actorImageUrl(campaign: Campaign): string {
  if (campaign.actor_source === "upload" && campaign.actor_upload_id) {
    return signedFileUrl(campaign.actor_upload_id);
  }
  const preset = PRESET_ACTORS.find((a) => a.id === campaign.actor_preset);
  const base = process.env.APP_URL || "http://localhost:3000";
  return `${base}${preset?.image ?? PRESET_ACTORS[0].image}`;
}

/** Sends every queued job of a campaign to Higgsfield (or marks it processing in mock mode). */
export async function dispatchCampaign(campaignId: string): Promise<void> {
  const campaign = getCampaign(campaignId);
  if (!campaign) return;
  const jobs = listJobs(campaignId).filter((j) => j.status === "queued");

  if (!higgsfieldConfigured()) {
    for (const job of jobs) {
      updateJob(job.id, { status: "processing", provider_request_id: `mock-${job.id}` });
    }
    return;
  }

  const actorUrl = actorImageUrl(campaign);
  const productUrls = listCampaignProducts(campaignId).map((u) =>
    signedFileUrl(u.id),
  );
  const prompt = buildPrompt(campaign);

  for (const job of jobs) {
    try {
      const submission =
        job.kind === "video"
          ? await submitVideoGeneration({
              prompt,
              script: campaign.script,
              actorImageUrl: actorUrl,
              productImageUrls: productUrls,
              aspectRatio: campaign.aspect_ratio,
            })
          : await submitImageGeneration({
              prompt,
              actorImageUrl: actorUrl,
              productImageUrls: productUrls,
              aspectRatio: campaign.aspect_ratio,
            });
      updateJob(job.id, {
        status: "processing",
        provider_request_id: submission.requestId,
        status_url: submission.statusUrl,
      });
    } catch (error) {
      updateJob(job.id, {
        status: "failed",
        error: error instanceof Error ? error.message : "Dispatch failed",
      });
    }
  }
  reconcileCampaign(campaignId);
}

async function syncJob(job: Job): Promise<void> {
  if (job.status !== "processing") return;

  if (job.provider_request_id?.startsWith("mock-")) {
    const age = Date.now() - new Date(job.updated_at).getTime();
    if (!Number.isNaN(age) && age >= MOCK_COMPLETE_AFTER_MS) {
      const pool = job.kind === "video" ? MOCK_VIDEO_RESULTS : MOCK_IMAGE_RESULTS;
      updateJob(job.id, {
        status: "completed",
        result_url: pool[job.position % pool.length],
      });
    }
    return;
  }

  if (!job.status_url) return;
  try {
    const status = await checkStatus(job.status_url);
    if (status.status === "completed") {
      updateJob(job.id, {
        status: "completed",
        result_url: status.resultUrl ?? null,
      });
    } else if (status.status === "failed") {
      updateJob(job.id, { status: "failed", error: status.error ?? "Failed" });
    }
  } catch {
    // Transient polling errors are ignored; the next page load retries.
  }
}

/** Polls all in-flight jobs (optionally scoped to one user) and settles campaigns. */
export async function syncPendingJobs(userId?: string): Promise<void> {
  const jobs = listPendingJobs(userId).filter((j) => j.status === "processing");
  await Promise.all(jobs.map(syncJob));
  const campaignIds = new Set(jobs.map((j) => j.campaign_id));
  for (const id of campaignIds) {
    reconcileCampaign(id);
  }
}
