"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";
import { ThingsToDoButton } from "./ThingsToDoButton";
import styles from "./ThingsToDoSection.module.css";

export function ThingsToDoSection() {
  const { explore, create } = THINGS_TO_DO_DATA;

  return (
    <section className={`offer-block on-dark ${styles["things-to-do-section"]}`} id="things-to-do">

      <div className="container">
        <Reveal className={styles["ttd-header"]}>
          <OfferHead
            num="06 — Discovery & Activities"
            heading="Things to Do at Tavaro"
          />
          <div className="tw:flex tw:justify-between tw:items-baseline tw:flex-wrap tw:gap-[16px] tw:mt-[12px]">
            <p className="tw:text-(color:--on-surface-muted) tw:max-w-[600px] tw:m-[0] tw:text-[15px] tw:leading-[1.6]">
              Whether wandering through quiet mango trails at your own pace or arranging a curated
              experience with our team, discover two distinct ways to experience Tavaro.
            </p>
            <ThingsToDoButton className="btn tw:px-[18px] tw:py-[8px] tw:text-[11.5px]">
              Choose Experience Mode
            </ThingsToDoButton>
          </div>
        </Reveal>

        <div className={styles["ttd-editorial-grid"]}>
          {/* Option 1: Explore at Your Own Pace */}
          <Reveal className={styles["ttd-editorial-card"]}>
            <div className={styles["ttd-editorial-media"]}>
              <Image
                src={explore.modalImage}
                alt={explore.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className={styles["ttd-editorial-img"]}
              />
            </div>
            <div className={styles["ttd-editorial-body"]}>
              <span className={styles["ttd-editorial-tag"]}>{explore.badge}</span>
              <h3 className={styles["ttd-editorial-title"]}>{explore.title}</h3>
              <p className={styles["ttd-editorial-desc"]}>{explore.cardDescription}</p>
              <div className={styles["ttd-editorial-preview"]}>{explore.categoryPreview}</div>
              <div className={styles["ttd-editorial-action"]}>
                <Link href={explore.route} className="btn solid">
                  {explore.ctaLabel} <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Option 2: Create Your Experience */}
          <Reveal className={styles["ttd-editorial-card"]}>
            <div className={styles["ttd-editorial-media"]}>
              <Image
                src={create.modalImage}
                alt={create.modalImageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                className={styles["ttd-editorial-img"]}
              />
            </div>
            <div className={styles["ttd-editorial-body"]}>
              <span className={styles["ttd-editorial-tag"]}>{create.badge}</span>
              <h3 className={styles["ttd-editorial-title"]}>{create.title}</h3>
              <p className={styles["ttd-editorial-desc"]}>{create.cardDescription}</p>
              <div className={styles["ttd-editorial-preview"]}>{create.categoryPreview}</div>
              <div className={styles["ttd-editorial-action"]}>
                <Link href={create.route} className="btn solid">
                  {create.ctaLabel} <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
