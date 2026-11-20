"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./ResidenceJourney.module.css";

const STEPS = [
  {
    title: "Register your interest",
    body: "Share your name, mobile number and email, and choose Leela, Bhairavi Nilayam or both.",
  },
  {
    title: "Tell us what you need",
    body: "Ask for the residence brochure, pricing and availability, a private viewing, or a conversation with a representative.",
  },
  {
    title: "A personal follow‑up",
    body: "Our team gets back to you personally and discreetly: a conversation, not a sales call. Your details are never shared.",
  },
  {
    title: "Plans and a private viewing",
    body: "Detailed architectural plans, floor-wise layouts and area information are shared on enquiry, and a private viewing can be arranged.",
  },
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * How registering interest works: all four steps side by side, each on its own stretch of gold rail. While in
 * view a highlight walks from step to step (the rail fills like a timer); pointing at a step moves it there and
 * holds it.
 */
export function ResidenceJourney({ heading, cta }: { heading: ReactNode; cta?: { label: string; href: string } }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Reveal className={styles.head}>
        <span className="offer-num">How it works</span>
        <h2 className="display-2 tw:mt-[18px]">{heading}</h2>
      </Reveal>

      <ol ref={root} className={styles.journey} data-run={inView || undefined}>
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={i < active ? styles.done : i === active ? styles.on : ""}
            onMouseEnter={() => setActive(i)}
          >
            <span className={styles.mark} aria-hidden="true" />
            <span
              className={styles.fill}
              aria-hidden="true"
              onAnimationEnd={() => i === active && setActive((i + 1) % STEPS.length)}
            />
            <span className={styles.num} aria-hidden="true">
              {pad(i)}
            </span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      {cta && (
        <Reveal className={styles.cta}>
          <Link href={cta.href} className="btn solid">
            {cta.label} <span className="btn-arrow">→</span>
          </Link>
        </Reveal>
      )}
    </>
  );
}
