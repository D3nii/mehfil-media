import "server-only";

import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSession,
  createUser,
  deleteSession,
  getSessionUser,
  getUserByEmail,
  promoteToAdmin,
} from "@/lib/queries";
import type { PublicUser, User } from "@/lib/types";

const SESSION_COOKIE = "mehfil_session";

function authSecret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret";
}

/* ── Password hashing (scrypt, no external deps) ────────────────── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

/* ── Admin bootstrap ────────────────────────────────────────────── */

let adminEnsured = false;

/** Creates/promotes the env-configured admin account once per boot. */
export function ensureAdminAccount() {
  if (adminEnsured) return;
  adminEnsured = true;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = getUserByEmail(email);
  if (existing) {
    if (existing.role !== "admin") promoteToAdmin(existing.id);
    return;
  }
  createUser({
    email,
    name: "Admin",
    passwordHash: hashPassword(password),
    role: "admin",
  });
}

/* ── Session helpers ────────────────────────────────────────────── */

export async function startSession(userId: string) {
  const { token, expiresAt } = createSession(userId);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);
  store.delete(SESSION_COOKIE);
}

function toPublic(user: User): PublicUser {
  const rest: PublicUser & { password_hash?: string } = { ...user };
  delete rest.password_hash;
  return rest;
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  ensureAdminAccount();
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const user = getSessionUser(token);
  return user ? toPublic(user) : null;
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

/* ── Signed file access tokens ──────────────────────────────────── */

/**
 * HMAC signature that lets external services (the Higgsfield API) fetch a
 * specific uploaded file without a session.
 */
export function signFileId(fileId: string): string {
  return createHmac("sha256", authSecret()).update(fileId).digest("hex");
}

export function verifyFileSignature(fileId: string, sig: string): boolean {
  const expected = signFileId(fileId);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}
