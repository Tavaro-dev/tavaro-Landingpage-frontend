import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./Residence.module.css";

export type Fact = { label: string; value: string };
export type RuledItem = { label: string; body?: string; meta?: string };
export type MosaicItem = {
  src: string;
  alt: string;
  caption: string;
  /** lead: 4 columns x 2 rows, tall: 2 x 2, third: 2 x 1, half: 3 x 1 (on the 6-column desktop grid). */
  size: "lead" | "tall" | "third" | "half";
  position?: string;
};

/** "At a glance": a ruled strip of label / value facts. */
export function ResidenceFacts({ facts }: { facts: Fact[] }) {
  return (
    <Reveal stagger className={styles.facts}>
      {facts.map((f) => (
        <div className={styles.fact} key={f.label}>
          <span className={styles["fact-label"]}>{f.label}</span>
          <span className={styles["fact-value"]}>{f.value}</span>
        </div>
      ))}
    </Reveal>
  );
}

/** A ruled list with small gold diamond markers; `columns` splits it in two from tablet up. */
export function RuledList({ items, columns = 1 }: { items: RuledItem[]; columns?: 1 | 2 }) {
  return (
    <ul className={`${styles.ruled} ${columns === 2 ? styles.two : ""}`}>
      {items.map((it) => (
        <li key={it.label}>
          <span className={styles.diamond} aria-hidden="true" />
          <span className={styles["ruled-text"]}>
            <span className={styles["ruled-label"]}>{it.label}</span>
            {it.body && <span className={styles["ruled-body"]}>{it.body}</span>}
          </span>
          {it.meta && <span className={styles["ruled-meta"]}>{it.meta}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Photo mosaic: tiles sized to the photos' own landscape shape, captions always visible. */
export function ResidenceMosaic({ items }: { items: MosaicItem[] }) {
  return (
    <Reveal stagger className={styles.mosaic}>
      {items.map((it) => (
        <figure className={`${styles.tile} ${styles[it.size]} ph-2`} key={it.src}>
          <Image
            src={it.src}
            alt={it.alt}
            fill
            sizes={it.size === "lead" ? "(min-width: 861px) 60vw, 100vw" : "(min-width: 861px) 30vw, 50vw"}
            style={it.position ? { objectPosition: it.position } : undefined}
          />
          <figcaption>
            <span className={styles.diamond} aria-hidden="true" />
            {it.caption}
          </figcaption>
        </figure>
      ))}
    </Reveal>
  );
}

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
    title: "A personal follow-up",
    body: "Our team gets back to you personally and discreetly: a conversation, not a sales call. Your details are never shared.",
  },
  {
    title: "Plans and a private viewing",
    body: "Detailed architectural plans, floor-wise layouts and area information are shared on enquiry, and a private viewing can be arranged.",
  },
];

/** How registering interest works, step by step, with a gold rail that draws in on reveal. */
export function ResidenceJourney({
  heading,
  cta,
}: {
  heading: ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <>
      <Reveal className={styles["journey-head"]}>
        <span className="offer-num">How it works</span>
        <h2 className="display-2 tw:mt-[18px]">{heading}</h2>
      </Reveal>
      <Reveal className={styles.journey}>
        <span className={styles.rail} aria-hidden="true" />
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.title} style={{ "--i": i } as CSSProperties}>
              <span className={styles["step-mark"]} aria-hidden="true" />
              <span className={styles["step-num"]}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
      {cta && (
        <Reveal className={styles["journey-cta"]}>
          <Link href={cta.href} className="btn solid">
            {cta.label} <span className="btn-arrow">→</span>
          </Link>
        </Reveal>
      )}
    </>
  );
}
