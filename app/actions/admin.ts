"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import {
  applyCredits,
  approvePayment,
  getUserById,
  rejectPayment,
} from "@/lib/queries";

export async function approvePaymentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  if (id) approvePayment(id, note);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export async function rejectPaymentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  if (id) rejectPayment(id, note);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export async function adjustCreditsAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const delta = Number(formData.get("delta") ?? 0);
  const reason = String(formData.get("reason") ?? "").trim();

  if (!getUserById(userId) || !Number.isInteger(delta) || delta === 0) return;
  applyCredits({
    userId,
    delta,
    reason: reason || `Manual adjustment by ${admin.email}`,
    refType: "admin",
    refId: admin.id,
  });
  revalidatePath("/admin/users");
}
