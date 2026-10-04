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
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
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
