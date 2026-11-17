"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HERO_BY_ROUTE } from "@/lib/content/heroRoutes";
import { preloadHero } from "./HeroImage";

const heroOf = (a: Element | null | undefined) => {
  if (!(a instanceof HTMLAnchorElement)) return undefined;
  const url = new URL(a.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return undefined;
  return HERO_BY_ROUTE[url.pathname.replace(/\/$/, "") || "/"];
};

/**
 * Makes a page open with its hero photo already sharp rather than a blurred preview:
 * - once the page is idle, downloads the hero of every page it links to (skipped when the visitor saves data);
 * - pointing at, touching or focusing a link starts its photo at once.
 * Clicks are never held back for a photo: waiting made the menu feel dead on a slow connection.
 */
export function HeroPrefetch() {
  const pathname = usePathname();

  useEffect(() => {
    const onIntent = (e: Event) => {
      const stem = heroOf((e.target as Element | null)?.closest?.("a[href]"));
      if (stem) preloadHero(stem, "high");
    };
    const intents = ["pointerover", "touchstart", "focusin"];
    const opts = { passive: true, capture: true };
    for (const t of intents) document.addEventListener(t, onIntent, opts);
    return () => {
      for (const t of intents) document.removeEventListener(t, onIntent, opts);
    };
  }, []);

  // Each page: once it has loaded and the browser is idle, fetch the photos of the pages it links to.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const ahead = () => {
      const stems = new Set([...document.querySelectorAll("a[href]")].map(heroOf).filter(Boolean) as string[]);
      stems.forEach((s) => preloadHero(s, "low"));
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    let id: number | undefined;
    const start = () => (id = idle(ahead) as number);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (id !== undefined) (window.cancelIdleCallback ?? clearTimeout)(id);
    };
  }, [pathname]);

  return null;
}
