"use client";

import { useRef, useState } from "react";
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
    primaryBtnText: string;
    primaryBtnHref?: string;
    onPrimaryBtnClick?: () => void;
    secondaryBtnText: string;
    secondaryBtnHref: string;
  };
}

export function ExpandingPanelsShowcase({
  mode,
  categories,
  onEnquireCategory,
  closing,
}: ExpandingPanelsShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, handleSelectCategory] = useScrollStage(trackRef, categories.length);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  return (
    <div className={styles["expanding-showcase-wrapper"]}>

      {/* DEDICATED OUTER SCROLL TRACK (PINS SHOWCASE BENEATH STICKY HEADER) */}
      <div ref={trackRef} className={styles["showcase-scroll-track"]} id="expanding-showcase-track">
        {/* STICKY VISUAL SHOWCASE STAGE */}
        <div className={styles["showcase-sticky-stage"]}>
          <div
            className="container tw:flex tw:flex-col tw:h-full tw:w-full"
          >
            {/* HEADER CONTROLLER (CATEGORY QUICK NAVIGATION & OPTION BUTTON) */}
            <div className={styles["showcase-header"]}>
              <div className={styles["showcase-title-group"]}>
                <span className={styles["showcase-eyebrow"]}>
                  {mode === "explore"
                    ? "Explore at Your Own Pace"
                    : "Create Your Experience (On Request)"}
                </span>
                <h2 className={styles["showcase-heading"]}>
                  {mode === "explore"
                    ? "Wander, dine, swim, play and unwind — at your own rhythm."
                    : "Arrange something special with our team."}
                </h2>
              </div>

              <div className={styles["showcase-top-controls"]}>
                {/* Manual Selection Tabs */}
                <nav className={styles["showcase-tabs-nav"]} aria-label="Category tabs">
                  {categories.map((cat, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`${styles["showcase-tab-btn"]} showcase-tab-btn ${isActive ? "active" : ""}`}
                        onClick={() => handleSelectCategory(idx)}
                        aria-label={`Select ${cat.title}`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span>{cat.title}</span>
                      </button>
                    );
                  })}
                </nav>

                {mode === "explore" ? (
                  <Link
                    href="/resorts/things-to-do/create"
                    className={`${styles["showcase-change-btn"]} showcase-change-btn`}
                  >
                    Create your experience <span className="btn-arrow" aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link
                    href="/resorts/things-to-do/explore"
                    className={`${styles["showcase-change-btn"]} showcase-change-btn`}
                  >
                    Discover <span className="btn-arrow" aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* THE FOUR EXPANDING PANELS (DRIVEN BY SCROLL, CLICK, & SELECTION) */}
            <div
              className={styles["showcase-panels-container"]}
              role="region"
              aria-label="Experience Categories Showcase"
            >
              {categories.map((cat, idx) => (
                <ShowcasePanel
                  key={cat.id}
                  cat={cat}
                  index={idx}
                  isActive={idx === activeIndex}
                  onSelect={() => handleSelectCategory(idx)}
                  selectedChip={selectedChip}
                  onChip={setSelectedChip}
                  onEnquire={mode === "create" ? () => onEnquireCategory?.(cat.title) : undefined}
                />
              ))}
            </div>

            {/* STAGE FOOTER & STAGE PROGRESS INDICATORS */}
            <div className={styles["showcase-stage-footer"]}>
              <span className={styles["showcase-scroll-hint"]}>
                <span>✦</span>
                <span>Scroll down through all 4 categories, or select directly above</span>
              </span>

              <div className={styles["showcase-progress-dots"]} role="tablist" aria-label="Showcase stage dots">
                {categories.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles["showcase-dot-btn"]} ${isActive ? "active" : ""}`}
                      onClick={() => handleSelectCategory(idx)}
                      aria-label={`Jump to stage ${idx + 1}: ${cat.title}`}
                      aria-selected={isActive}
                      role="tab"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MINIMAL LUXURY CLOSING BAR (Directly below scroll track, releases naturally) */}
      <div className="container">
        <div className={styles["showcase-closing-bar"]}>
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
              <Link
                href={closing.primaryBtnHref || "#"}
                className={`btn solid ${styles["showcase-closing-primary"]}`}
              >
                {closing.primaryBtnText} &rarr;
              </Link>
            )}

            <Link
              href={closing.secondaryBtnHref}
              className={`btn ${styles["showcase-closing-secondary"]}`}
            >
              {closing.secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
