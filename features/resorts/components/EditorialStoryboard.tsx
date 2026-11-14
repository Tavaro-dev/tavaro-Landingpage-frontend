"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./EditorialStoryboard.module.css";

export interface StoryboardActivity {
  name: string;
  detail: string;
  location?: string;
  timeHint?: string;
}

export interface StoryboardChapter {
  id: string;
  categoryTitle: string;
  timeTag: string;
  timeLabel: string;
  locationTag: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  activities: StoryboardActivity[];
  stats?: { label: string; value: string }[];
}

interface EditorialStoryboardProps {
  mode: "explore" | "create";
  pageTitle: string;
  pageEyebrow: string;
  chapters: StoryboardChapter[];
  closing: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    primaryCtaHref?: string;
    onPrimaryCtaClick?: () => void;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    backgroundImage: string;
  };
  onEnquireCategory?: (categoryTitle: string) => void;
}

export function EditorialStoryboard({
  mode,
  chapters,
  closing,
  onEnquireCategory,
}: EditorialStoryboardProps) {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    chapters[0]?.id || ""
  );
  // Track selected activity per chapter for interactive detail reveal
  const [selectedActivities, setSelectedActivities] = useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {};
    chapters.forEach((ch) => {
      initial[ch.id] = 0; // Default to first activity active
    });
    return initial;
  });

  // Track active chapter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(`chapter-${chapters[i].id}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveChapterId(chapters[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapters]);

  const scrollToChapter = (chapterId: string) => {
    const el = document.getElementById(`chapter-${chapterId}`);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveChapterId(chapterId);
    }
  };

  const handleSelectActivity = (chapterId: string, index: number) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [chapterId]: index,
    }));
  };

  return (
    <div className={styles["editorial-storyboard"]}>

      {/* STICKY TIME-OF-DAY STORYBOARD TIMELINE */}
      <nav
        className={styles["storyboard-timeline-nav"]}
        aria-label="Story chapters timeline navigation"
      >
        <div className={`container ${styles["storyboard-timeline-inner"]}`}>
          <div className={styles["storyboard-timeline-tabs"]}>
            {chapters.map((ch) => {
              const isActive = activeChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`${styles["storyboard-tab-btn"]} storyboard-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => scrollToChapter(ch.id)}
                  aria-label={`Jump to ${ch.categoryTitle} at ${ch.timeTag}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles["storyboard-tab-dot"]} />
                  <span className={styles["storyboard-tab-time"]}>{ch.timeTag}</span>
                  <span>{ch.categoryTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="tw:flex tw:items-center tw:gap-[10px]">
            <Link
              href="/resorts/things-to-do/create"
              className={`${styles["storyboard-tab-btn"]} storyboard-tab-btn tw:border tw:border-solid tw:border-[rgba(197,160,89,0.4)] tw:text-(color:--gold) tw:inline-flex tw:items-center tw:gap-[6px] tw:no-underline`}
            >
              Create your experience <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* STORYBOARD CHAPTERS */}
      <div className="container">
        <div className={styles["storyboard-chapters"]}>
          {chapters.map((ch, idx) => {
            const isReverse = idx % 2 === 1;
            const currentSelectedIdx = selectedActivities[ch.id] ?? 0;
            const activeActivity =
              ch.activities[currentSelectedIdx] || ch.activities[0];

            return (
              <section
                key={ch.id}
                id={`chapter-${ch.id}`}
                className={styles["storyboard-chapter"]}
                aria-label={`${ch.categoryTitle} Story Chapter`}
              >
                <div
                  className={`${styles["storyboard-grid"]} ${isReverse ? "reverse" : ""}`}
                >
                  {/* MEDIA COLUMN */}
                  <div className={styles["storyboard-media-col"]}>
                    <div className={styles["storyboard-media-wrapper"]}>
                      <Image
                        src={ch.image}
                        alt={ch.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className={styles["storyboard-image"]}
                      />
                      <div className={styles["storyboard-media-overlay"]} />
                      <div className={styles["storyboard-media-badge"]}>
                        <span>{ch.locationTag}</span>
                        <span className="tw:text-(color:--gold)">{ch.timeLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT COLUMN */}
                  <div className={styles["storyboard-content-col"]}>
                    <div className={styles["storyboard-card"]}>
                      <div className={styles["storyboard-chapter-eyebrow"]}>
                        <span className={styles["storyboard-time-pill"]}>
                          <span>{ch.timeTag}</span>
                          <span>•</span>
                          <span>{ch.timeLabel}</span>
                        </span>
                        <span className={styles["storyboard-location-tag"]}>
                          {ch.locationTag}
                        </span>
                      </div>

                      <h2 className={styles["storyboard-chapter-title"]}>
                        {ch.categoryTitle}
                      </h2>

                      <p className={styles["storyboard-chapter-tagline"]}>{ch.tagline}</p>

                      <p className={styles["storyboard-chapter-desc"]}>{ch.description}</p>

                      {/* INTERACTIVE ACTIVITY PILL SELECTORS */}
                      <div className={styles["storyboard-activities-block"]}>
                        <div className={styles["storyboard-activities-header"]}>
                          <span>Select an experience to spotlight:</span>
                          <span className="tw:text-[10px] tw:opacity-[0.7]">
                            {ch.activities.length} Curated Moments
                          </span>
                        </div>

                        <div className={styles["storyboard-pills-grid"]}>
                          {ch.activities.map((act, actIdx) => {
                            const isPillActive = currentSelectedIdx === actIdx;
                            return (
                              <button
                                key={act.name}
                                type="button"
                                className={`${styles["storyboard-activity-pill"]} ${
                                  isPillActive ? "active" : ""
                                }`}
                                onClick={() => handleSelectActivity(ch.id, actIdx)}
                                aria-label={`View details for ${act.name}`}
                              >
                                <span className={styles["storyboard-pill-bullet"]} />
                                <span>{act.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* SPOTLIGHT DRAWER */}
                        {activeActivity && (
                          <div
                            key={activeActivity.name}
                            className={styles["storyboard-spotlight-box"]}
                          >
                            <div className={styles["storyboard-spotlight-title"]}>
                              <span>✦</span>
                              <span>{activeActivity.name}</span>
                            </div>
                            <p className={styles["storyboard-spotlight-desc"]}>
                              {activeActivity.detail}
                            </p>
                            <div className={styles["storyboard-spotlight-meta"]}>
                              {activeActivity.location && (
                                <span>📍 {activeActivity.location}</span>
                              )}
                              {activeActivity.timeHint && (
                                <span>⏱ {activeActivity.timeHint}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CHAPTER ACTIONS (FOR CREATE ON-REQUEST) */}
                      {mode === "create" && (
                        <div className={styles["storyboard-chapter-actions"]}>
                          <button
                            type="button"
                            className={`${styles["storyboard-enquire-btn"]} storyboard-enquire-btn`}
                            onClick={() =>
                              onEnquireCategory?.(ch.categoryTitle)
                            }
                          >
                            Enquire About {ch.categoryTitle}
                          </button>
                          <span className={styles["storyboard-request-notice"]}>
                            Arranged on request with our concierge
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* CLOSING STORYBOARD SECTION */}
      <section className={styles["storyboard-closing"]} aria-label="Closing Story Section">
        <div className={styles["storyboard-closing-media"]}>
          <Image
            src={closing.backgroundImage}
            alt={closing.title}
            fill
            sizes="100vw"
            className={styles["storyboard-closing-image"]}
          />
          <div className={styles["storyboard-closing-overlay"]} />
        </div>

        <div className="container">
          <div className={styles["storyboard-closing-content"]}>
            <span className={styles["storyboard-closing-eyebrow"]}>
              {closing.eyebrow}
            </span>
            <h2 className={styles["storyboard-closing-title"]}>{closing.title}</h2>
            <p className={styles["storyboard-closing-desc"]}>{closing.description}</p>

            <div className={styles["storyboard-closing-actions"]}>
              {closing.onPrimaryCtaClick ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closing.onPrimaryCtaClick}
                >
                  {closing.primaryCtaText}
                </button>
              ) : (
                <Link
                  href={closing.primaryCtaHref || "#"}
                  className="btn btn-primary"
                >
                  {closing.primaryCtaText}
                </Link>
              )}

              <Link
                href={closing.secondaryCtaHref}
                className="btn btn-secondary"
              >
                {closing.secondaryCtaText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
