import "server-only";

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { UPLOADS_DIR } from "@/lib/db";
import { createUpload, getUpload } from "@/lib/queries";
import { signFileId } from "@/lib/auth";
import type { UploadKind } from "@/lib/types";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
]);

const ALLOWED_RECEIPT_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
]);

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export async function saveUpload(
  file: File,
  userId: string,
  kind: UploadKind,
): Promise<string> {
  const allowed = kind === "receipt" ? ALLOWED_RECEIPT_TYPES : ALLOWED_IMAGE_TYPES;
  if (!allowed.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size === 0 || file.size > MAX_FILE_BYTES) {
    throw new Error("File must be between 1 byte and 15 MB");
  }
  const id = randomUUID();
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, id), buffer);
  createUpload({
    id,
    userId,
    kind,
    originalName: file.name || "upload",
    mime: file.type,
    size: file.size,
  });
  return id;
}

export function uploadFilePath(id: string): string {
  return path.join(UPLOADS_DIR, id);
}

/** Session-scoped URL for rendering uploads in the app UI. */
export function fileUrl(id: string): string {
  return `/api/files/${id}`;
}

/** Signed URL that external services (Higgsfield) can fetch without a session. */
export function signedFileUrl(id: string): string {
  const base = process.env.APP_URL || "http://localhost:3000";
  return `${base}/api/files/${id}?sig=${signFileId(id)}`;
}

export function uploadExists(id: string): boolean {
  return Boolean(getUpload(id));
}
