"use client";

import { HeroImage } from "@/components/shared/HeroImage";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { THINGS_TO_DO_DATA } from "../../content/thingsToDoData";
import styles from "./ThingsToDoSection.module.css";

export function ThingsToDoSection() {
  const { explore, create } = THINGS_TO_DO_DATA;

  return (
    <section className={`offer-block on-dark ${styles["things-to-do-section"]}`} id="things-to-do">
      <div className="container">
        <Reveal className={styles["ttd-header"]}>
          <OfferHead num="06 — Discovery & Activities" heading="Things to Do at Tavaro" />
          <div className={styles["ttd-header-row"]}>
            <p className={styles["ttd-intro"]}>
              Whether wandering through quiet mango trails at your own pace or arranging a curated
              experience with our team, discover two distinct ways to experience Tavaro.
            </p>
          </div>
        </Reveal>

        <Reveal stagger className={styles["ttd-editorial-grid"]}>
          {[explore, create].map((path, i) => (
            <Link key={path.id} href={path.route} className={styles["ttd-editorial-card"]}>
              <HeroImage
                src={path.modalImage}
                alt={path.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 680px"
                className={styles["ttd-editorial-img"]}
              />
              <span className={styles["ttd-editorial-numeral"]} aria-hidden="true">
                0{i + 1}
              </span>
              <div className={styles["ttd-editorial-body"]}>
                <span className={styles["ttd-editorial-tag"]}>{path.badge}</span>
                <h3 className={styles["ttd-editorial-title"]}>{path.title}</h3>
                <p className={styles["ttd-editorial-desc"]}>{path.cardDescription}</p>
                <span className={styles["ttd-editorial-preview"]}>{path.categoryPreview}</span>
                <span className={styles["ttd-editorial-action"]}>
                  {path.ctaLabel} <span className={styles["ttd-editorial-arrow"]} aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
