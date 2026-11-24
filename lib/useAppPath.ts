"use client";

import { useSelectedLayoutSegments } from "next/navigation";

/**
 * The page's path in app/ (route groups left out), for a client component of the root layout: /resorts on
 * resort.tavaro.in, where the address bar and usePathname() say "/". Read from the route itself, so the server
 * and the browser agree on it (lib/subdomains.ts).
 */
export function useAppPath(): string {
  const segments = useSelectedLayoutSegments();
  return `/${segments.filter((s) => !s.startsWith("(") && !s.startsWith("__")).join("/")}`;
}
