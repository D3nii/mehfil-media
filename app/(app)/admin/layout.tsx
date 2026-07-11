import type { ReactNode } from "react";

import { AppShell } from "@/components/app/shell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <AppShell user={admin} area="admin">
      {children}
    </AppShell>
  );
}
