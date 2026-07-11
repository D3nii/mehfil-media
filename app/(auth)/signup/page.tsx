import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/app/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create account | Mehfil Media",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Create your studio
      </h1>
      <p className="mb-6 text-sm text-muted">
        Start generating UGC campaigns in minutes.
      </p>
      <AuthForm mode="signup" />
    </>
  );
}
