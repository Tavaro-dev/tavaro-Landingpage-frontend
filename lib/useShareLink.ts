"use client";

import { useEffect, useEffectEvent } from "react";

// A pop-up's button can appear twice on one page (hero and body): only the first one mounted answers its link.
const claimed = new Set<string>();

const setHash = (hash: string) =>
  history.replaceState(history.state, "", location.pathname + location.search + hash);

/**
 * Gives a pop-up its own address to share: `/page#hash` opens it when the page loads, and so does any link
 * to `#hash` on the current page (Next.js links change the address without a hashchange event).
 * While the pop-up is open the address bar shows that link, ready to copy; it goes when the pop-up closes.
 * The address is replaced, not pushed, so Back leaves the page rather than closing the pop-up.
 */
export function useShareLink(hash: `#${string}`, isOpen: boolean, open: () => void) {
  const show = useEffectEvent(open);

  // Any copy of the button shows the link while its pop-up is open, not only the one that answers it.
  useEffect(() => {
    if (!isOpen) return;
    setHash(hash);
    return () => {
      if (location.hash === hash) setHash("");
    };
  }, [isOpen, hash]);

  useEffect(() => {
    if (claimed.has(hash)) return;
    claimed.add(hash);

    const fromHash = () => {
      if (location.hash === hash) show();
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.hash !== hash || a.pathname !== location.pathname || a.target === "_blank") return;
      // Before the router sees the click: open here instead of navigating.
      e.preventDefault();
      e.stopPropagation();
      show();
    };

    fromHash();
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      claimed.delete(hash);
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [hash]);
}
