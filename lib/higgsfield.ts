import "server-only";

/**
 * Thin client for the Higgsfield generation API (platform.higgsfield.ai).
 *
 * Endpoints follow Higgsfield's async pattern: POST a generation request,
 * receive a request id plus a status URL, then poll until the job reaches
 * a terminal state.
 *
 * When no API credentials are configured the app runs in MOCK mode
 * (see lib/generation.ts) so the full product flow works locally.
 */

export type HiggsfieldSubmission = {
  requestId: string;
  statusUrl: string;
};

export type HiggsfieldStatus = {
  status: "queued" | "in_progress" | "completed" | "failed";
  resultUrl?: string;
  error?: string;
};

export function higgsfieldConfigured(): boolean {
  return Boolean(
    process.env.HIGGSFIELD_API_KEY && process.env.HIGGSFIELD_API_SECRET,
  );
}

function baseUrl(): string {
  return process.env.HIGGSFIELD_BASE_URL || "https://platform.higgsfield.ai";
}

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "hf-api-key": process.env.HIGGSFIELD_API_KEY ?? "",
    "hf-secret": process.env.HIGGSFIELD_API_SECRET ?? "",
  };
}

async function submit(
  endpoint: string,
  params: Record<string, unknown>,
): Promise<HiggsfieldSubmission> {
  const response = await fetch(`${baseUrl()}${endpoint}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ params }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Higgsfield ${endpoint} failed (${response.status}): ${body}`);
  }
  const data = (await response.json()) as {
    request_id?: string;
    id?: string;
    status_url?: string;
  };
  const requestId = data.request_id ?? data.id;
  if (!requestId) {
    throw new Error("Higgsfield response missing request id");
  }
  return {
    requestId,
    statusUrl:
      data.status_url ?? `${baseUrl()}/requests/${requestId}/status`,
  };
}

/** Submits a UGC video generation (actor speaks the script over the product). */
export async function submitVideoGeneration(input: {
  prompt: string;
  script: string;
  actorImageUrl: string;
  productImageUrls: string[];
  aspectRatio: string;
}): Promise<HiggsfieldSubmission> {
  return submit("/v1/image2video/ugc", {
    prompt: input.prompt,
    speech: input.script,
    input_image: { type: "image_url", image_url: input.actorImageUrl },
    product_images: input.productImageUrls.map((url) => ({
      type: "image_url",
      image_url: url,
    })),
    aspect_ratio: input.aspectRatio,
    duration: 8,
  });
}

/** Submits a UGC still-image generation (actor holding/using the product). */
export async function submitImageGeneration(input: {
  prompt: string;
  actorImageUrl: string;
  productImageUrls: string[];
  aspectRatio: string;
}): Promise<HiggsfieldSubmission> {
  return submit("/v1/text2image/soul", {
    prompt: input.prompt,
    input_images: [input.actorImageUrl, ...input.productImageUrls].map(
      (url) => ({ type: "image_url", image_url: url }),
    ),
    aspect_ratio: input.aspectRatio,
    quality: "1080p",
    batch_size: 1,
  });
}

export async function checkStatus(statusUrl: string): Promise<HiggsfieldStatus> {
  const response = await fetch(statusUrl, { headers: headers() });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Higgsfield status check failed (${response.status}): ${body}`);
  }
  const data = (await response.json()) as {
    status?: string;
    results?: { url?: string; raw?: { url?: string } }[];
    output_url?: string;
    error?: string;
  };
  const status = (data.status ?? "queued").toLowerCase();
  const resultUrl =
    data.output_url ??
    data.results?.[0]?.url ??
    data.results?.[0]?.raw?.url;
  if (status === "completed" || status === "succeeded") {
    return { status: "completed", resultUrl };
  }
  if (status === "failed" || status === "canceled" || status === "nsfw") {
    return { status: "failed", error: data.error ?? `Generation ${status}` };
  }
  if (status === "in_progress" || status === "processing") {
    return { status: "in_progress" };
  }
  return { status: "queued" };
}
