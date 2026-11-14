"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CinematicShowcaseView.module.css";

export interface CinematicCategory {
  id: string;
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  badge: string;
  activities: string[];
}

interface CinematicShowcaseViewProps {
  mode: "explore" | "create";
  pageTitle: string;
  categories: CinematicCategory[];
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

export function CinematicShowcaseView({
  mode,
  categories,
  onEnquireCategory,
  closing,
}: CinematicShowcaseViewProps) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id || "");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  // Scroll spy to highlight active section in the sticky top nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = categories.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${categories[i].id}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  return (
    <div className={styles["cinematic-showcase"]}>

      {/* STICKY CLICK-TO-JUMP CATEGORY NAV */}
      <nav
        className={styles["cinematic-sticky-nav"]}
        aria-label="Category Navigation"
      >
        <div className={`container ${styles["cinematic-nav-inner"]}`}>
          <div className={styles["cinematic-tabs-group"]}>
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles["cinematic-tab-btn"]} cinematic-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => scrollToSection(cat.id)}
                  aria-label={`Jump to ${cat.title}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles["cinematic-tab-num"]}>{cat.number}</span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          <div>
            <Link
              href="/resorts/things-to-do/create"
              className={`${styles["cinematic-change-btn"]} cinematic-change-btn tw:inline-flex tw:items-center tw:gap-[6px] tw:no-underline`}
            >
              Create your experience <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ALL SECTIONS VISIBLE ON SCROLL */}
      <div className="container">
        <div className={styles["cinematic-sections-stack"]}>
          {categories.map((cat, idx) => {
            const isRight = idx % 2 === 1;

            return (
              <section
                key={cat.id}
                id={`section-${cat.id}`}
                className={styles["cinematic-item-wrapper"]}
                aria-label={`${cat.title} Section`}
              >
                <div
                  className={`${styles["cinematic-canvas"]} ${
                    isRight ? `${styles["align-right"]}` : `${styles["align-left"]}`
                  }`}
                >
                  {/* High-Resolution Panoramic Image */}
                  <div className={styles["cinematic-image-layer"]}>
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt}
                      fill
                      sizes="100vw"
                      className={styles["cinematic-photo"]}
                    />
                    <div className={styles["cinematic-canvas-overlay"]} />
                  </div>

                  {/* Floating Frosted Glass Card with Exact Client Activities */}
                  <div className={styles["cinematic-glass-card"]}>
                    <div className={styles["cinematic-card-meta"]}>
                      <span className={styles["cinematic-badge-pill"]}>
                        <span>{cat.number}</span>
                        <span>&bull;</span>
                        <span>{cat.badge}</span>
                      </span>
                      <span className={styles["cinematic-count-tag"]}>
                        {cat.activities.length} Experiences
                      </span>
                    </div>

                    <h2 className={styles["cinematic-card-title"]}>{cat.title}</h2>

                    {/* Interactive Activity Chips (Client Exact Wording) */}
                    <div
                      className={styles["cinematic-chips-tray"]}
                      role="list"
                      aria-label={`${cat.title} activities`}
                    >
                      {cat.activities.map((act) => {
                        const isSelected = selectedChip === act;
                        return (
                          <button
                            key={act}
                            type="button"
                            className={`${styles["cinematic-activity-chip"]} ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() =>
                              setSelectedChip(isSelected ? null : act)
                            }
                            aria-label={act}
                          >
                            <span className={styles["cinematic-chip-dot"]} />
                            <span>{act}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mode-specific actions (Create Your Experience) */}
                    {mode === "create" && (
                      <div className={styles["cinematic-card-actions"]}>
                        <button
                          type="button"
                          className={`${styles["cinematic-enquire-btn"]} cinematic-enquire-btn`}
                          onClick={() => onEnquireCategory?.(cat.title)}
                        >
                          Enquire for {cat.title}
                        </button>
                        <span className={styles["cinematic-action-hint"]}>
                          Arranged on request with our team
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* MINIMAL LUXURY CLOSING BAR */}
        <div className={styles["cinematic-closing-bar"]}>
          <div className={styles["cinematic-closing-text"]}>
            <h3 className={styles["cinematic-closing-title"]}>{closing.title}</h3>
            <p className={styles["cinematic-closing-desc"]}>{closing.tagline}</p>
          </div>

          <div className={styles["cinematic-closing-actions"]}>
            {closing.onPrimaryBtnClick ? (
              <button
                type="button"
                className="btn solid"
                onClick={closing.onPrimaryBtnClick}
              >
                {closing.primaryBtnText}
              </button>
            ) : (
              <Link
                href={closing.primaryBtnHref || "#"}
                className="btn solid"
              >
                {closing.primaryBtnText}
              </Link>
            )}

            <Link href={closing.secondaryBtnHref} className="btn">
              {closing.secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
