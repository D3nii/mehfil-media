"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Refreshes server data on an interval while generations are in flight. */
export function AutoRefresh({ intervalMs = 10_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);
  return null;
}
