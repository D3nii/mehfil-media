import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="digital-silk-bg flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link href="/" className="mb-10 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight">Mehfil</span>
        <span className="urdu text-lg leading-none text-rani">محفل</span>
      </Link>
      <div className="w-full max-w-md rounded-3xl border border-line bg-ivory p-8 shadow-[0_20px_60px_rgba(23,19,16,0.06)]">
        {children}
      </div>
      <p className="mt-8 max-w-sm text-center text-xs text-muted">
        Upload a product. Receive a campaign. AI creators producing
        scroll-stopping UGC for Pakistan&apos;s boldest brands.
      </p>
    </div>
  );
}
