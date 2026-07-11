import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/app/actions/auth";
import { CreditsPill } from "@/components/app/ui";
import type { PublicUser } from "@/lib/types";

type NavLink = { href: string; label: string };

const USER_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/campaigns/new", label: "New campaign" },
  { href: "/dashboard/billing", label: "Credits & billing" },
];

const ADMIN_LINKS: NavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/payments", label: "Payment approvals" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/campaigns", label: "Campaigns" },
];

export function AppShell({
  user,
  area,
  children,
}: {
  user: PublicUser;
  area: "user" | "admin";
  children: ReactNode;
}) {
  const links = area === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <div className="digital-silk-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-ivory/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">Mehfil</span>
              <span className="urdu text-sm leading-none text-rani">محفل</span>
              {area === "admin" ? (
                <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ivory">
                  Admin
                </span>
              ) : null}
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              {area === "user" && user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="rounded-full px-4 py-2 text-sm text-rani transition-colors hover:bg-rani-soft"
                >
                  Admin
                </Link>
              ) : null}
              {area === "admin" ? (
                <Link
                  href="/dashboard"
                  className="rounded-full px-4 py-2 text-sm text-rani transition-colors hover:bg-rani-soft"
                >
                  My dashboard
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {area === "user" ? (
              <Link href="/dashboard/billing">
                <CreditsPill credits={user.credits} />
              </Link>
            ) : null}
            <span className="hidden text-sm text-muted sm:block">{user.name}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-5 pb-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
