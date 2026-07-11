"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { createCampaignWithJobs, getUserById } from "@/lib/queries";
import { campaignCost, MAX_QUANTITY } from "@/lib/pricing";
import { saveUpload } from "@/lib/storage";
import { dispatchCampaign } from "@/lib/generation";
import { PRESET_ACTORS } from "@/lib/actors";
import type { OutputType } from "@/lib/types";

export type CampaignFormState = { error?: string };

const ASPECT_RATIOS = ["9:16", "1:1", "16:9"];

export async function createCampaignAction(
  _prev: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const productName = String(formData.get("productName") ?? "").trim();
  const storyline = String(formData.get("storyline") ?? "").trim();
  const script = String(formData.get("script") ?? "").trim();
  const outputType = String(formData.get("outputType") ?? "") as OutputType;
  const aspectRatio = String(formData.get("aspectRatio") ?? "9:16");
  const quantity = Number(formData.get("quantity") ?? 0);
  const actorSource = String(formData.get("actorSource") ?? "");
  const actorPreset = String(formData.get("actorPreset") ?? "");
  const actorFile = formData.get("actorImage");
  const productFiles = formData
    .getAll("productImages")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (name.length < 3) return { error: "Give your campaign a name (min 3 characters)." };
  if (productName.length < 2) return { error: "Please enter the product name." };
  if (storyline.length < 20) {
    return { error: "Describe the storyline / production direction (min 20 characters)." };
  }
  if (script.length < 10) {
    return { error: "Add the script the creator should speak (min 10 characters)." };
  }
  if (outputType !== "video" && outputType !== "image") {
    return { error: "Choose videos or images as the output." };
  }
  if (!ASPECT_RATIOS.includes(aspectRatio)) {
    return { error: "Choose a valid aspect ratio." };
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return { error: `Quantity must be between 1 and ${MAX_QUANTITY}.` };
  }
  if (productFiles.length < 1) {
    return { error: "Upload at least one product image." };
  }
  if (productFiles.length > 5) {
    return { error: "A maximum of 5 product images is allowed." };
  }

  let actorUploadId: string | undefined;
  let presetId: string | undefined;
  if (actorSource === "upload") {
    if (!(actorFile instanceof File) || actorFile.size === 0) {
      return { error: "Upload an image of your UGC actor, or pick one of ours." };
    }
  } else if (actorSource === "preset") {
    if (!PRESET_ACTORS.some((a) => a.id === actorPreset)) {
      return { error: "Pick one of the preset creators." };
    }
    presetId = actorPreset;
  } else {
    return { error: "Choose an actor for your campaign." };
  }

  const cost = campaignCost(outputType, quantity);
  const freshUser = getUserById(user.id);
  if (!freshUser || freshUser.credits < cost) {
    return {
      error: `This campaign costs ${cost} credits but you have ${freshUser?.credits ?? 0}. Top up first.`,
    };
  }

  let campaignId: string;
  try {
    if (actorSource === "upload" && actorFile instanceof File) {
      actorUploadId = await saveUpload(actorFile, user.id, "actor");
    }
    const productUploadIds: string[] = [];
    for (const file of productFiles) {
      productUploadIds.push(await saveUpload(file, user.id, "product"));
    }

    const campaign = createCampaignWithJobs({
      userId: user.id,
      name,
      productName,
      actorSource: actorSource as "upload" | "preset",
      actorUploadId,
      actorPreset: presetId,
      productUploadIds,
      storyline,
      script,
      outputType,
      aspectRatio,
      quantity,
      creditsCost: cost,
    });
    campaignId = campaign.id;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not create the campaign.",
    };
  }

  await dispatchCampaign(campaignId);
  redirect(`/dashboard/campaigns/${campaignId}`);
}
