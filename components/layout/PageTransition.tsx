"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades the page in after a client-side navigation. The first load is not
 * faded, so content (and the LCP element) is visible at first paint. The
 * wrapper is never remounted; Next already remounts the page that changed.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const shownPath = useRef(pathname);

  useEffect(() => {
    // Same path: first load (or a Strict Mode re-run of the effect).
    if (shownPath.current === pathname) return;
    shownPath.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Opacity only, and no fill: a lingering transform would make this the
    // containing block for every position:fixed descendant.
    const ease = getComputedStyle(document.documentElement).getPropertyValue("--ease").trim() || "ease";
    ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 550, easing: ease });
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
