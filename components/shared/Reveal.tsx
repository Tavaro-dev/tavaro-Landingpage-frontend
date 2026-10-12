"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

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

    // Accessibility: Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    // Progressive enhancement: If already in initial viewport, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("reveal-init", "in");
      return;
    }

    // Below the fold: activate observer-based reveal
    el.classList.add("reveal-init");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
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
