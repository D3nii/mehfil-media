import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/app/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in | Mehfil Media",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-muted">
        Sign in to manage your campaigns and credits.
      </p>
      <AuthForm mode="login" />
    </>
  );
}
