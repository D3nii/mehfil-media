import type { OutputType } from "@/lib/types";

/** Credits charged per generated asset. */
export const CREDIT_COST: Record<OutputType, number> = {
  video: 20,
  image: 5,
};

export const MAX_QUANTITY = 10;

export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  amountPkr: number;
  blurb: string;
};

/** Top-up packages paid via manual bank transfer, approved by an admin. */
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    amountPkr: 5000,
    blurb: "5 videos or 20 images. Try the studio.",
  },
  {
    id: "growth",
    name: "Growth",
    credits: 300,
    amountPkr: 13500,
    blurb: "15 videos or 60 images. 10% bonus value.",
  },
  {
    id: "scale",
    name: "Scale",
    credits: 1000,
    amountPkr: 40000,
    blurb: "50 videos or 200 images. Best rate per credit.",
  },
];

export const PAYMENT_METHODS = [
  "Bank transfer",
  "JazzCash",
  "Easypaisa",
  "Raast",
] as const;

/** Shown to users when they request a top-up. */
export const PAYMENT_INSTRUCTIONS = {
  bankName: "Meezan Bank",
  accountTitle: "Mehfil Media (Pvt) Ltd",
  accountNumber: "0123-4567890-123",
  iban: "PK00MEZN0000123456789012",
};

export function getPackage(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.id === id);
}

export function campaignCost(outputType: OutputType, quantity: number): number {
  return CREDIT_COST[outputType] * quantity;
}
