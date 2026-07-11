"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { createPaymentRequest } from "@/lib/queries";
import { getPackage, PAYMENT_METHODS } from "@/lib/pricing";
import { saveUpload } from "@/lib/storage";

export type BillingFormState = { error?: string };

export async function requestTopUpAction(
  _prev: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  const user = await requireUser();

  const packageId = String(formData.get("package") ?? "");
  const method = String(formData.get("method") ?? "");
  const reference = String(formData.get("reference") ?? "").trim();
  const receipt = formData.get("receipt");

  const pkg = getPackage(packageId);
  if (!pkg) return { error: "Please choose a credit package." };
  if (!(PAYMENT_METHODS as readonly string[]).includes(method)) {
    return { error: "Please choose a payment method." };
  }
  if (reference.length < 4) {
    return { error: "Please enter the transaction reference from your payment." };
  }

  let receiptUploadId: string | undefined;
  if (receipt instanceof File && receipt.size > 0) {
    try {
      receiptUploadId = await saveUpload(receipt, user.id, "receipt");
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Receipt upload failed.",
      };
    }
  }

  createPaymentRequest({
    userId: user.id,
    packageId: pkg.id,
    credits: pkg.credits,
    amountPkr: pkg.amountPkr,
    method,
    reference,
    receiptUploadId,
  });

  redirect("/dashboard/billing?requested=1");
}
