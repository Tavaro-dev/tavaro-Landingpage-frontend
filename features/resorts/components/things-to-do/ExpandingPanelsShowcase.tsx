"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ExpandingPanelsShowcase.module.css";
import { ShowcasePanel } from "./showcase/ShowcasePanel";
import { useScrollStage } from "./showcase/useScrollStage";

export interface ShowcaseCategory {
  id: string;
  number: string;
  title: string;
  tagline?: string;
  image: string;
  imageAlt: string;
  badge: string;
  activities: string[];
}

interface ExpandingPanelsShowcaseProps {
  mode: "explore" | "create";
  pageTitle: string;
  categories: ShowcaseCategory[];
  onEnquireCategory?: (categoryTitle: string) => void;
  closing: {
    title: string;
    tagline: string;
    /** Backdrop of the closing band: a glimpse of where the primary button leads. */
    image: string;
    primaryBtnText: string;
    primaryBtnHref?: string;
    onPrimaryBtnClick?: () => void;
    secondaryBtnText: string;
    secondaryBtnHref: string;
  };
}

/**
 * A pinned stage that plays the categories as moments while the visitor scrolls past it:
 * the scroll distance is split into one band per category (see useScrollStage).
 */
export function ExpandingPanelsShowcase({
  mode,
  categories,
  onEnquireCategory,
  closing,
}: ExpandingPanelsShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, handleSelectCategory] = useScrollStage(trackRef, categories.length);
  // The stage sits below the hero: its photos wait for the page (and the hero photo) to finish loading.
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const done = () => setPageLoaded(true);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, []);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  return (
    <div className={styles["expanding-showcase-wrapper"]}>
      <div ref={trackRef} className={styles["showcase-scroll-track"]} id="expanding-showcase-track">
        <div className={styles["showcase-sticky-stage"]}>
          <div className={`container ${styles["showcase-inner"]}`}>
            <div className={styles["showcase-header"]}>
              <div className={styles["showcase-title-group"]}>
                <span className={styles["showcase-eyebrow"]}>
                  {mode === "explore" ? "Explore at Your Own Pace" : "Create Your Experience (On Request)"}
                </span>
                <h2 className={styles["showcase-heading"]}>
                  {mode === "explore"
                    ? "Wander, dine, swim, play and unwind — at your own rhythm."
                    : "Arrange something special with our team."}
                </h2>
              </div>

              <div className={styles["showcase-top-controls"]}>
                <nav className={styles["showcase-tabs-nav"]} aria-label="Categories">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles["showcase-tab-btn"]} showcase-tab-btn`}
                      data-active={idx === activeIndex}
                      onClick={() => handleSelectCategory(idx)}
                      aria-current={idx === activeIndex ? "true" : undefined}
                    >
                      {cat.title}
                    </button>
                  ))}
                </nav>

                <Link
                  href={mode === "explore" ? "/resorts/things-to-do/create" : "/resorts/things-to-do/explore"}
                  className={`${styles["showcase-change-btn"]} showcase-change-btn`}
                >
                  {mode === "explore" ? "Create your experience" : "Explore at your own pace"}{" "}
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={styles["showcase-panels-container"]} role="region" aria-label="Experience categories">
              {categories.map((cat, idx) => (
                <ShowcasePanel
                  key={cat.id}
                  cat={cat}
                  index={idx}
                  isActive={idx === activeIndex}
                  near={pageLoaded && (idx === activeIndex || idx === activeIndex + 1)}
                  selectedChip={selectedChip}
                  onChip={setSelectedChip}
                  onEnquire={mode === "create" ? () => onEnquireCategory?.(cat.title) : undefined}
                />
              ))}

              {/* Film strip of every moment: shows what is coming and jumps to it. */}
              <div className={styles["showcase-strip"]}>
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={styles["showcase-strip-btn"]}
                    data-active={idx === activeIndex}
                    onClick={() => handleSelectCategory(idx)}
                    aria-label={`Show ${cat.title}`}
                    tabIndex={-1}
                  >
                    <Image src={cat.image} alt="" fill sizes="132px" className={styles["showcase-strip-img"]} />
                    <span className={styles["showcase-strip-label"]}>{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles["showcase-stage-footer"]}>
              <span className={styles["showcase-scroll-hint"]}>
                <span className={styles["showcase-hint-line"]} aria-hidden="true" />
                Scroll to drift between moments
              </span>
              <span
                className={styles["showcase-progress"]}
                style={{ "--p": (activeIndex + 1) / categories.length } as CSSProperties}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles["showcase-closing-bar"]}>
          <Image src={closing.image} alt="" fill sizes="(max-width: 1360px) 100vw, 1360px" className={styles["showcase-closing-img"]} />
          <div className={styles["showcase-closing-text"]}>
            <h3 className={styles["showcase-closing-title"]}>{closing.title}</h3>
            <p className={styles["showcase-closing-desc"]}>{closing.tagline}</p>
          </div>

          <div className={styles["showcase-closing-actions"]}>
            {closing.onPrimaryBtnClick ? (
              <button
                type="button"
                className={`btn solid ${styles["showcase-closing-primary"]}`}
                onClick={closing.onPrimaryBtnClick}
              >
                {closing.primaryBtnText} &rarr;
              </button>
            ) : (
              <Link href={closing.primaryBtnHref || "#"} className={`btn solid ${styles["showcase-closing-primary"]}`}>
                {closing.primaryBtnText} &rarr;
              </Link>
            )}

            <Link href={closing.secondaryBtnHref} className={`btn ${styles["showcase-closing-secondary"]}`}>
              {closing.secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
