"use server";

import { redirect } from "next/navigation";

import {
  endSession,
  ensureAdminAccount,
  hashPassword,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/queries";

export type AuthFormState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  ensureAdminAccount();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 2) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (getUserByEmail(email)) {
    return { error: "An account with this email already exists." };
  }

  const user = createUser({ email, name, passwordHash: hashPassword(password) });
  await startSession(user.id);
  redirect("/dashboard");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  ensureAdminAccount();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Invalid email or password." };
  }

  await startSession(user.id);
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function signOutAction() {
  await endSession();
  redirect("/login");
}
