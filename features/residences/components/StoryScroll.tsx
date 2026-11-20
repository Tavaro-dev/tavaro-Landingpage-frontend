"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./ResidenceStory.module.css";

export type StoryStep = { label: string; title: string; body: string; src: string; alt: string };

/**
 * A story told while scrolling: the photo holds its place while the steps pass beside it, and changes to the
 * step in the middle of the screen. On a phone each step simply carries its own photo.
 */
export function StoryScroll({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = [...(list.current?.children ?? [])];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(items.indexOf(e.target));
      },
      // A thin band across the middle of the screen: the step crossing it is the current one.
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.story}>
      <div className={styles.stage} aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s.src} className={`${styles.frame} ph-2 ${i === active ? styles.on : ""}`}>
            <Image src={s.src} alt="" fill sizes="(min-width: 861px) 55vw, 100vw" />
          </div>
        ))}
        <div className={styles.progress}>
          <span style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
        </div>
      </div>
      <ol ref={list} className={styles.steps}>
        {steps.map((s, i) => (
          <li key={s.title} className={i === active ? styles.on : ""}>
            <span className={styles["step-label"]}>{s.label}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <div className={`${styles["step-photo"]} ph-2`}>
              <Image src={s.src} alt={s.alt} fill sizes="100vw" />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
