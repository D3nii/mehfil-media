import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import type {
  Campaign,
  CampaignStatus,
  CreditTransaction,
  Job,
  JobStatus,
  OutputType,
  PaymentRequest,
  Upload,
  UploadKind,
  User,
} from "@/lib/types";

/* ── Users ──────────────────────────────────────────────────────── */

export function getUserByEmail(email: string): User | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | User
    | undefined;
}

export function createUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  role?: "user" | "admin";
}): User {
  const id = randomUUID();
  getDb()
    .prepare(
      "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    )
    .run(id, input.email, input.name, input.passwordHash, input.role ?? "user");
  return getUserById(id)!;
}

export function listUsers(): User[] {
  return getDb()
    .prepare("SELECT * FROM users ORDER BY created_at DESC")
    .all() as User[];
}

export function promoteToAdmin(userId: string) {
  getDb().prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(userId);
}

/* ── Sessions ───────────────────────────────────────────────────── */

export function createSession(userId: string, ttlDays = 30): {
  token: string;
  expiresAt: Date;
} {
  const token = randomUUID() + randomUUID().replaceAll("-", "");
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  getDb()
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .run(token, userId, expiresAt.toISOString());
  return { token, expiresAt };
}

export function getSessionUser(token: string): User | undefined {
  const row = getDb()
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
    )
    .get(token) as User | undefined;
  return row;
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/* ── Uploads ────────────────────────────────────────────────────── */

export function createUpload(input: {
  id: string;
  userId: string;
  kind: UploadKind;
  originalName: string;
  mime: string;
  size: number;
}) {
  getDb()
    .prepare(
      "INSERT INTO uploads (id, user_id, kind, original_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      input.id,
      input.userId,
      input.kind,
      input.originalName,
      input.mime,
      input.size,
    );
}

export function getUpload(id: string): Upload | undefined {
  return getDb().prepare("SELECT * FROM uploads WHERE id = ?").get(id) as
    | Upload
    | undefined;
}

/* ── Credits ────────────────────────────────────────────────────── */

/**
 * Atomically applies a credit delta and records it in the ledger.
 * Throws if the balance would go negative.
 */
export function applyCredits(input: {
  userId: string;
  delta: number;
  reason: string;
  refType?: string;
  refId?: string;
}) {
  const db = getDb();
  const apply = db.transaction(() => {
    const result = db
      .prepare(
        "UPDATE users SET credits = credits + ? WHERE id = ? AND credits + ? >= 0",
      )
      .run(input.delta, input.userId, input.delta);
    if (result.changes === 0) {
      throw new Error("Insufficient credits");
    }
    db.prepare(
      "INSERT INTO credit_transactions (id, user_id, delta, reason, ref_type, ref_id) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(
      randomUUID(),
      input.userId,
      input.delta,
      input.reason,
      input.refType ?? null,
      input.refId ?? null,
    );
  });
  apply();
}

export function listTransactions(userId: string, limit = 50): CreditTransaction[] {
  return getDb()
    .prepare(
      "SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    )
    .all(userId, limit) as CreditTransaction[];
}

/* ── Payment requests ───────────────────────────────────────────── */

export function createPaymentRequest(input: {
  userId: string;
  packageId: string;
  credits: number;
  amountPkr: number;
  method: string;
  reference: string;
  receiptUploadId?: string;
}): string {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO payment_requests
       (id, user_id, package_id, credits, amount_pkr, method, reference, receipt_upload_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.userId,
      input.packageId,
      input.credits,
      input.amountPkr,
      input.method,
      input.reference,
      input.receiptUploadId ?? null,
    );
  return id;
}

export function getPaymentRequest(id: string): PaymentRequest | undefined {
  return getDb()
    .prepare("SELECT * FROM payment_requests WHERE id = ?")
    .get(id) as PaymentRequest | undefined;
}

export function listPaymentRequests(filter?: {
  userId?: string;
  status?: string;
}): PaymentRequest[] {
  const clauses: string[] = [];
  const params: string[] = [];
  if (filter?.userId) {
    clauses.push("user_id = ?");
    params.push(filter.userId);
  }
  if (filter?.status) {
    clauses.push("status = ?");
    params.push(filter.status);
  }
  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  return getDb()
    .prepare(
      `SELECT * FROM payment_requests ${where} ORDER BY created_at DESC`,
    )
    .all(...params) as PaymentRequest[];
}

/**
 * Approves a pending payment and grants credits, in one transaction.
 * Returns false if the request was not pending (already resolved).
 */
export function approvePayment(id: string, adminNote?: string): boolean {
  const db = getDb();
  const run = db.transaction((): boolean => {
    const request = getPaymentRequest(id);
    if (!request || request.status !== "pending") return false;
    db.prepare(
      `UPDATE payment_requests
       SET status = 'approved', admin_note = ?, resolved_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ?`,
    ).run(adminNote ?? null, id);
    applyCredits({
      userId: request.user_id,
      delta: request.credits,
      reason: `Top-up approved (${request.package_id})`,
      refType: "payment",
      refId: id,
    });
    return true;
  });
  return run();
}

export function rejectPayment(id: string, adminNote?: string): boolean {
  const result = getDb()
    .prepare(
      `UPDATE payment_requests
       SET status = 'rejected', admin_note = ?, resolved_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ? AND status = 'pending'`,
    )
    .run(adminNote ?? null, id);
  return result.changes > 0;
}

/* ── Campaigns & jobs ───────────────────────────────────────────── */

export function createCampaignWithJobs(input: {
  userId: string;
  name: string;
  productName: string;
  actorSource: "upload" | "preset";
  actorUploadId?: string;
  actorPreset?: string;
  productUploadIds: string[];
  storyline: string;
  script: string;
  outputType: OutputType;
  aspectRatio: string;
  quantity: number;
  creditsCost: number;
}): Campaign {
  const db = getDb();
  const campaignId = randomUUID();
  const run = db.transaction(() => {
    applyCredits({
      userId: input.userId,
      delta: -input.creditsCost,
      reason: `Campaign "${input.name}" (${input.quantity} ${input.outputType}s)`,
      refType: "campaign",
      refId: campaignId,
    });
    db.prepare(
      `INSERT INTO campaigns
       (id, user_id, name, product_name, actor_source, actor_upload_id, actor_preset,
        storyline, script, output_type, aspect_ratio, quantity, credits_cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      campaignId,
      input.userId,
      input.name,
      input.productName,
      input.actorSource,
      input.actorUploadId ?? null,
      input.actorPreset ?? null,
      input.storyline,
      input.script,
      input.outputType,
      input.aspectRatio,
      input.quantity,
      input.creditsCost,
    );
    const insertProduct = db.prepare(
      "INSERT INTO campaign_products (campaign_id, upload_id) VALUES (?, ?)",
    );
    for (const uploadId of input.productUploadIds) {
      insertProduct.run(campaignId, uploadId);
    }
    const insertJob = db.prepare(
      "INSERT INTO jobs (id, campaign_id, position, kind) VALUES (?, ?, ?, ?)",
    );
    for (let i = 0; i < input.quantity; i++) {
      insertJob.run(randomUUID(), campaignId, i + 1, input.outputType);
    }
  });
  run();
  return getCampaign(campaignId)!;
}

export function getCampaign(id: string): Campaign | undefined {
  return getDb().prepare("SELECT * FROM campaigns WHERE id = ?").get(id) as
    | Campaign
    | undefined;
}

export function listCampaigns(userId?: string): Campaign[] {
  if (userId) {
    return getDb()
      .prepare("SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Campaign[];
  }
  return getDb()
    .prepare("SELECT * FROM campaigns ORDER BY created_at DESC")
    .all() as Campaign[];
}

export function listCampaignProducts(campaignId: string): Upload[] {
  return getDb()
    .prepare(
      `SELECT u.* FROM campaign_products cp
       JOIN uploads u ON u.id = cp.upload_id
       WHERE cp.campaign_id = ?`,
    )
    .all(campaignId) as Upload[];
}

export function listJobs(campaignId: string): Job[] {
  return getDb()
    .prepare("SELECT * FROM jobs WHERE campaign_id = ? ORDER BY position")
    .all(campaignId) as Job[];
}

export function getJob(id: string): Job | undefined {
  return getDb().prepare("SELECT * FROM jobs WHERE id = ?").get(id) as
    | Job
    | undefined;
}

export function updateJob(
  id: string,
  patch: Partial<
    Pick<
      Job,
      "status" | "provider_request_id" | "status_url" | "result_url" | "error"
    >
  >,
) {
  const fields: string[] = ["updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')"];
  const params: (string | null)[] = [];
  for (const [key, value] of Object.entries(patch)) {
    fields.push(`${key} = ?`);
    params.push(value ?? null);
  }
  getDb()
    .prepare(`UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`)
    .run(...params, id);
}

/**
 * Recomputes a campaign's status from its jobs. Refunds credits for
 * failed jobs exactly once (marked via the ledger ref).
 */
export function reconcileCampaign(campaignId: string) {
  const db = getDb();
  const run = db.transaction(() => {
    const campaign = getCampaign(campaignId);
    if (!campaign) return;
    const jobs = listJobs(campaignId);
    const pending = jobs.filter(
      (j) => j.status === "queued" || j.status === "processing",
    ).length;
    const failed = jobs.filter((j) => j.status === "failed").length;
    const completed = jobs.filter((j) => j.status === "completed").length;

    let status: CampaignStatus = "generating";
    if (pending === 0) {
      if (failed === 0) status = "completed";
      else if (completed > 0) status = "partial";
      else status = "failed";
    }
    db.prepare("UPDATE campaigns SET status = ? WHERE id = ?").run(
      status,
      campaignId,
    );

    // Refund failed jobs once campaign settles.
    if (pending === 0 && failed > 0) {
      const alreadyRefunded = db
        .prepare(
          "SELECT COUNT(*) AS n FROM credit_transactions WHERE ref_type = 'refund' AND ref_id = ?",
        )
        .get(campaignId) as { n: number };
      if (alreadyRefunded.n === 0) {
        const perUnit = campaign.credits_cost / campaign.quantity;
        applyCredits({
          userId: campaign.user_id,
          delta: Math.round(perUnit * failed),
          reason: `Refund for ${failed} failed generation(s) in "${campaign.name}"`,
          refType: "refund",
          refId: campaignId,
        });
      }
    }
  });
  run();
}

export function listPendingJobs(userId?: string): Job[] {
  if (userId) {
    return getDb()
      .prepare(
        `SELECT j.* FROM jobs j
         JOIN campaigns c ON c.id = j.campaign_id
         WHERE c.user_id = ? AND j.status IN ('queued','processing')`,
      )
      .all(userId) as Job[];
  }
  return getDb()
    .prepare("SELECT * FROM jobs WHERE status IN ('queued','processing')")
    .all() as Job[];
}

/* ── Admin metrics ──────────────────────────────────────────────── */

export function adminStats() {
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  return {
    users: count("SELECT COUNT(*) AS n FROM users"),
    campaigns: count("SELECT COUNT(*) AS n FROM campaigns"),
    pendingPayments: count(
      "SELECT COUNT(*) AS n FROM payment_requests WHERE status = 'pending'",
    ),
    approvedRevenuePkr:
      (
        db
          .prepare(
            "SELECT COALESCE(SUM(amount_pkr), 0) AS n FROM payment_requests WHERE status = 'approved'",
          )
          .get() as { n: number }
      ).n,
    assetsGenerated: count(
      "SELECT COUNT(*) AS n FROM jobs WHERE status = 'completed'",
    ),
  };
}

export function updateJobStatusFields(id: string, status: JobStatus) {
  updateJob(id, { status });
}
