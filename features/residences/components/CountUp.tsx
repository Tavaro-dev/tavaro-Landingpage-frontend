"use client";

import { useEffect, useRef } from "react";

/**
 * Counts the number in `value` ("15,000", "3,027 sq. ft.") up from zero when it first comes into view.
 * The server HTML already holds the final text, so nothing is lost without JS or with reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/[\d,]+/);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[0].replace(/,/g, ""));
    const [before, after] = [value.slice(0, match.index), value.slice(match.index! + match[0].length)];
    const show = (n: number) => (el.textContent = before + n.toLocaleString("en-IN") + after);

    let frame = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1600, 1);
        show(Math.round(target * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      show(0);
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
