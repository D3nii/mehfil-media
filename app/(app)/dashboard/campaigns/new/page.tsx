import type { Metadata } from "next";
import Link from "next/link";

import { CampaignForm } from "@/components/app/campaign-form";
import { SectionTitle } from "@/components/app/ui";
import { requireUser } from "@/lib/auth";
import { PRESET_ACTORS } from "@/lib/actors";
import { CREDIT_COST, MAX_QUANTITY } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "New campaign | Mehfil Media",
};

export default async function NewCampaignPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle
        title="New campaign"
        subtitle="Five steps. A few minutes. A full UGC campaign."
      />
      {user.credits === 0 ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have no credits yet.{" "}
          <Link href="/dashboard/billing" className="font-medium underline">
            Buy a credit package
          </Link>{" "}
          before launching a campaign.
        </p>
      ) : null}
      <CampaignForm
        presetActors={PRESET_ACTORS}
        creditCost={CREDIT_COST}
        maxQuantity={MAX_QUANTITY}
        balance={user.credits}
      />
    </div>
  );
}
