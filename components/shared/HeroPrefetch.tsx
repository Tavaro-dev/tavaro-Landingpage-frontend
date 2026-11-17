"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HERO_BY_ROUTE } from "@/lib/content/heroRoutes";
import { preloadHero } from "./HeroImage";

/** Longest a click waits on the next page's photo before opening the page anyway (with its soft preview). */
const MAX_WAIT_MS = 1500;

const heroOf = (a: Element | null | undefined) => {
  if (!(a instanceof HTMLAnchorElement)) return undefined;
  const url = new URL(a.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return undefined;
  return HERO_BY_ROUTE[url.pathname.replace(/\/$/, "") || "/"];
};

/** Photos downloaded and decoded: a click on a link to their page goes straight through. */
const ready = new Set<string>();
const load = (stem: string) => preloadHero(stem).then(() => void ready.add(stem));

/**
 * Makes a page open with its hero photo already sharp, never a blurred preview:
 * - once the page is idle, downloads the hero of every page it links to (skipped when the visitor saves data);
 * - pointing at, touching or focusing a link starts its photo at once;
 * - a click before that photo is here keeps the current page up until it is (at most MAX_WAIT_MS).
 */
export function HeroPrefetch() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onIntent = (e: Event) => {
      const stem = heroOf((e.target as Element | null)?.closest?.("a[href]"));
      if (stem) load(stem);
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const stem = heroOf(a);
      if (!stem || ready.has(stem) || a!.hasAttribute("download") || (a!.getAttribute("target") ?? "_self") !== "_self") return;
      // Captured on document, before React's own handler, so Link does not navigate yet.
      e.preventDefault();
      e.stopPropagation();
      const href = (a as HTMLAnchorElement).href;
      Promise.race([load(stem), new Promise((r) => setTimeout(r, MAX_WAIT_MS))]).then(() => router.push(href));
    };

    const intents = ["pointerover", "touchstart", "focusin"];
    const opts = { passive: true, capture: true };
    for (const t of intents) document.addEventListener(t, onIntent, opts);
    document.addEventListener("click", onClick, true);
    return () => {
      for (const t of intents) document.removeEventListener(t, onIntent, opts);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  // Each page: once it has loaded and the browser is idle, fetch the photos of the pages it links to.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const ahead = () => {
      const stems = new Set([...document.querySelectorAll("a[href]")].map(heroOf).filter(Boolean) as string[]);
      stems.forEach(load);
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
