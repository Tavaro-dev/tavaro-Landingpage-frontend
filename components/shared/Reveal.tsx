"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Every Reveal still waiting below the fold, checked by one shared listener.
// A scroll check (not an IntersectionObserver) so a jump past a section, such
// as an anchor link or a restored scroll position, reveals it too; an observer
// only fires for elements that actually pass through the viewport.
const waiting = new Set<Element>();
let frame = 0;

function check() {
  frame = 0;
  const line = window.innerHeight + 80;
  for (const el of waiting) {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("in");
      waiting.delete(el);
    }
  }
  if (!waiting.size) {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  }
}

function schedule() {
  frame ||= requestAnimationFrame(check);
}

function watch(el: Element) {
  if (!waiting.size) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  waiting.add(el);
  return () => {
    waiting.delete(el);
  };
}

/**
 * Fades its content up the first time it scrolls into view. The server HTML is
 * fully visible; only content still below the fold once JS runs is hidden, so
 * nothing the reader has already reached (in view, or above it after a
 * restored scroll position or an anchor jump) ever blanks out.
 */
export function Reveal({
  stagger = false,
  className = "",
  style,
  id,
  children,
}: {
  stagger?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("in");
      return;
    }

    el.classList.add("reveal-init");
    return watch(el);
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={`${stagger ? "reveal-stagger" : "reveal"} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
