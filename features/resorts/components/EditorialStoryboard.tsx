"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./EditorialStoryboard.css";

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
    <div className="editorial-storyboard">

      {/* STICKY TIME-OF-DAY STORYBOARD TIMELINE */}
      <nav
        className="storyboard-timeline-nav"
        aria-label="Story chapters timeline navigation"
      >
        <div className="container storyboard-timeline-inner">
          <div className="storyboard-timeline-tabs">
            {chapters.map((ch) => {
              const isActive = activeChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`storyboard-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => scrollToChapter(ch.id)}
                  aria-label={`Jump to ${ch.categoryTitle} at ${ch.timeTag}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="storyboard-tab-dot" />
                  <span className="storyboard-tab-time">{ch.timeTag}</span>
                  <span>{ch.categoryTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="tw:flex tw:items-center tw:gap-[10px]">
            <Link
              href="/resorts/things-to-do/create"
              className="storyboard-tab-btn tw:border tw:border-solid tw:border-[rgba(197,160,89,0.4)] tw:text-(color:--gold) tw:inline-flex tw:items-center tw:gap-[6px] tw:no-underline"
            >
              Create your experience <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* STORYBOARD CHAPTERS */}
      <div className="container">
        <div className="storyboard-chapters">
          {chapters.map((ch, idx) => {
            const isReverse = idx % 2 === 1;
            const currentSelectedIdx = selectedActivities[ch.id] ?? 0;
            const activeActivity =
              ch.activities[currentSelectedIdx] || ch.activities[0];

            return (
              <section
                key={ch.id}
                id={`chapter-${ch.id}`}
                className="storyboard-chapter"
                aria-label={`${ch.categoryTitle} Story Chapter`}
              >
                <div
                  className={`storyboard-grid ${isReverse ? "reverse" : ""}`}
                >
                  {/* MEDIA COLUMN */}
                  <div className="storyboard-media-col">
                    <div className="storyboard-media-wrapper">
                      <Image
                        src={ch.image}
                        alt={ch.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="storyboard-image"
                      />
                      <div className="storyboard-media-overlay" />
                      <div className="storyboard-media-badge">
                        <span>{ch.locationTag}</span>
                        <span className="tw:text-(color:--gold)">{ch.timeLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT COLUMN */}
                  <div className="storyboard-content-col">
                    <div className="storyboard-card">
                      <div className="storyboard-chapter-eyebrow">
                        <span className="storyboard-time-pill">
                          <span>{ch.timeTag}</span>
                          <span>•</span>
                          <span>{ch.timeLabel}</span>
                        </span>
                        <span className="storyboard-location-tag">
                          {ch.locationTag}
                        </span>
                      </div>

                      <h2 className="storyboard-chapter-title">
                        {ch.categoryTitle}
                      </h2>

                      <p className="storyboard-chapter-tagline">{ch.tagline}</p>

                      <p className="storyboard-chapter-desc">{ch.description}</p>

                      {/* INTERACTIVE ACTIVITY PILL SELECTORS */}
                      <div className="storyboard-activities-block">
                        <div className="storyboard-activities-header">
                          <span>Select an experience to spotlight:</span>
                          <span className="tw:text-[10px] tw:opacity-[0.7]">
                            {ch.activities.length} Curated Moments
                          </span>
                        </div>

                        <div className="storyboard-pills-grid">
                          {ch.activities.map((act, actIdx) => {
                            const isPillActive = currentSelectedIdx === actIdx;
                            return (
                              <button
                                key={act.name}
                                type="button"
                                className={`storyboard-activity-pill ${
                                  isPillActive ? "active" : ""
                                }`}
                                onClick={() => handleSelectActivity(ch.id, actIdx)}
                                aria-label={`View details for ${act.name}`}
                              >
                                <span className="storyboard-pill-bullet" />
                                <span>{act.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* SPOTLIGHT DRAWER */}
                        {activeActivity && (
                          <div
                            key={activeActivity.name}
                            className="storyboard-spotlight-box"
                          >
                            <div className="storyboard-spotlight-title">
                              <span>✦</span>
                              <span>{activeActivity.name}</span>
                            </div>
                            <p className="storyboard-spotlight-desc">
                              {activeActivity.detail}
                            </p>
                            <div className="storyboard-spotlight-meta">
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
                        <div className="storyboard-chapter-actions">
                          <button
                            type="button"
                            className="storyboard-enquire-btn"
                            onClick={() =>
                              onEnquireCategory?.(ch.categoryTitle)
                            }
                          >
                            Enquire About {ch.categoryTitle}
                          </button>
                          <span className="storyboard-request-notice">
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
      <section className="storyboard-closing" aria-label="Closing Story Section">
        <div className="storyboard-closing-media">
          <Image
            src={closing.backgroundImage}
            alt={closing.title}
            fill
            sizes="100vw"
            className="storyboard-closing-image"
          />
          <div className="storyboard-closing-overlay" />
        </div>

        <div className="container">
          <div className="storyboard-closing-content">
            <span className="storyboard-closing-eyebrow">
              {closing.eyebrow}
            </span>
            <h2 className="storyboard-closing-title">{closing.title}</h2>
            <p className="storyboard-closing-desc">{closing.description}</p>

            <div className="storyboard-closing-actions">
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
