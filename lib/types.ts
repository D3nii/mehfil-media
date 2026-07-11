export type Role = "user" | "admin";
export type OutputType = "video" | "image";
export type UploadKind = "actor" | "product" | "receipt";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type CampaignStatus = "generating" | "completed" | "partial" | "failed";
export type JobStatus = "queued" | "processing" | "completed" | "failed";

export type User = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: Role;
  credits: number;
  created_at: string;
};

export type PublicUser = Omit<User, "password_hash">;

export type Upload = {
  id: string;
  user_id: string;
  kind: UploadKind;
  original_name: string;
  mime: string;
  size: number;
  created_at: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  delta: number;
  reason: string;
  ref_type: string | null;
  ref_id: string | null;
  created_at: string;
};

export type PaymentRequest = {
  id: string;
  user_id: string;
  package_id: string;
  credits: number;
  amount_pkr: number;
  method: string;
  reference: string;
  receipt_upload_id: string | null;
  status: PaymentStatus;
  admin_note: string | null;
  created_at: string;
  resolved_at: string | null;
};

export type Campaign = {
  id: string;
  user_id: string;
  name: string;
  product_name: string;
  actor_source: "upload" | "preset";
  actor_upload_id: string | null;
  actor_preset: string | null;
  storyline: string;
  script: string;
  output_type: OutputType;
  aspect_ratio: string;
  quantity: number;
  credits_cost: number;
  status: CampaignStatus;
  created_at: string;
};

export type Job = {
  id: string;
  campaign_id: string;
  position: number;
  kind: OutputType;
  status: JobStatus;
  provider_request_id: string | null;
  status_url: string | null;
  result_url: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};
