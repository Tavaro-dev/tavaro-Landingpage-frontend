import Link from "next/link";
import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import { HeroImage } from "@/components/shared/HeroImage";
import { CountUp } from "./CountUp";
import styles from "./ResidenceStory.module.css";

/**
 * The opening of a residence page: its name rising letter by letter, a line about it, and its key figures
 * counting up, over the residence's photo.
 */
export function ResidenceHero({
  name,
  tagline,
  photo,
  photoAlt,
  figures,
  ctas,
}: {
  name: string;
  tagline: string;
  photo: StaticImageData;
  photoAlt: string;
  figures: { value: string; label: string }[];
  ctas: { label: string; href: string; solid?: boolean }[];
}) {
  return (
    <section className={styles.hero}>
      <div className={styles["hero-photo"]}>
        <HeroImage src={photo} alt={photoAlt} fill preload sizes="100vw" />
      </div>
      <div className={`container ${styles["hero-inner"]}`}>
        <p className={styles["hero-kicker"]}>Tavaro Residences</p>
        <h1 aria-label={name}>
          {name.split(" ").map((word, w) => (
            <span className={styles.word} key={word} aria-hidden="true">
              {[...word].map((ch, i) => (
                <span key={i} style={{ "--i": w * 6 + i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className={styles["hero-tagline"]}>{tagline}</p>
        <div className={styles["hero-ctas"]}>
          {ctas.map((c) => (
            <Link key={c.href} href={c.href} className={`btn ${c.solid ? "solid" : ""}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <dl className={styles.figures}>
          {figures.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                <CountUp value={f.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
