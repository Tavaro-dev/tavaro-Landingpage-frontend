"use client";

import { useEffect, useEffectEvent } from "react";

// A pop-up's button can appear twice on one page (hero and body): only the first one mounted answers its link.
const claimed = new Set<string>();

/**
 * Gives a pop-up its own address to share: `/page#hash` opens it when the page loads, and so does any link
 * to `#hash` on the current page (Next.js links change the address without a hashchange event).
 * The hash is cleared once used, so Back does not reopen it and the same link opens it again.
 */
export function useShareLink(hash: `#${string}`, open: () => void) {
  const show = useEffectEvent(open);

  useEffect(() => {
    if (claimed.has(hash)) return;
    claimed.add(hash);

    const fromHash = () => {
      if (location.hash !== hash) return;
      history.replaceState(history.state, "", location.pathname + location.search);
      show();
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
