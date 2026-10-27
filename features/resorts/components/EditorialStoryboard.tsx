"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThingsToDoButton } from "./ThingsToDoButton";

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
      <style>{`
        .editorial-storyboard {
          position: relative;
          background: var(--surface);
          color: var(--on-surface);
        }

        /* Sticky Storyboard Timeline Navigation */
        .storyboard-timeline-nav {
          position: sticky;
          top: 0;
          z-index: 25;
          background: rgba(18, 16, 14, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          padding: 12px 0;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        [data-theme="light"] .storyboard-timeline-nav {
          background: rgba(250, 248, 245, 0.92);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .storyboard-timeline-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .storyboard-timeline-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0;
        }

        .storyboard-timeline-tabs::-webkit-scrollbar {
          display: none;
        }

        .storyboard-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--on-surface-muted, rgba(255, 255, 255, 0.6));
          padding: 7px 14px;
          border-radius: 999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .storyboard-tab-btn:hover {
          color: var(--on-surface);
          background: var(--surface-2, rgba(255, 255, 255, 0.05));
        }

        .storyboard-tab-btn.active {
          color: var(--on-surface);
          background: rgba(197, 160, 89, 0.18);
          border-color: rgba(197, 160, 89, 0.45);
        }

        [data-theme="light"] .storyboard-tab-btn.active {
          background: rgba(197, 160, 89, 0.14);
          border-color: rgba(177, 137, 58, 0.45);
          color: var(--gold-dark, #8f6c24);
        }

        .storyboard-tab-time {
          font-size: 9.5px;
          letter-spacing: 0.08em;
          opacity: 0.8;
          color: var(--gold, #c5a059);
        }

        [data-theme="light"] .storyboard-tab-time {
          color: var(--gold-dark, #8f6c24);
        }

        .storyboard-tab-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.4;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .storyboard-tab-btn.active .storyboard-tab-dot {
          opacity: 1;
          transform: scale(1.3);
          background: var(--gold, #c5a059);
        }

        /* Chapters Layout */
        .storyboard-chapters {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(80px, 12vh, 140px);
          padding: clamp(64px, 10vh, 120px) 0;
        }

        .storyboard-chapter {
          scroll-margin-top: 100px;
          position: relative;
        }

        /* Chapter Layout: Split Asymmetric Grid */
        .storyboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(48px, 6vw, 96px);
          align-items: center;
        }

        .storyboard-grid.reverse {
          grid-template-columns: 1fr 1fr;
        }

        .storyboard-grid.reverse .storyboard-media-col {
          order: 2;
        }

        .storyboard-grid.reverse .storyboard-content-col {
          order: 1;
        }

        /* Cinematic Media Column */
        .storyboard-media-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: var(--radius, 3px);
          overflow: hidden;
          background: var(--surface-2);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.28);
        }

        .storyboard-image {
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .storyboard-media-wrapper:hover .storyboard-image {
          transform: scale(1.035);
        }

        .storyboard-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.55) 100%
          );
          pointer-events: none;
        }

        .storyboard-media-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(15, 13, 10, 0.65);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        /* Content Column & Floating Story Card */
        .storyboard-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .storyboard-chapter-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .storyboard-time-pill {
          font-family: var(--font-sans, sans-serif);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          background: rgba(197, 160, 89, 0.12);
          border: 1px solid rgba(197, 160, 89, 0.3);
          padding: 4px 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        [data-theme="light"] .storyboard-time-pill {
          color: var(--gold-dark, #8f6c24);
          background: rgba(197, 160, 89, 0.12);
          border-color: rgba(177, 137, 58, 0.35);
        }

        .storyboard-location-tag {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--on-surface-muted);
        }

        .storyboard-chapter-title {
          font-family: var(--font-display, serif);
          font-size: clamp(34px, 4.2vw, 56px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: 0.015em;
          color: var(--on-surface);
          margin: 0;
        }

        .storyboard-chapter-tagline {
          font-family: var(--font-display, serif);
          font-size: clamp(17px, 1.8vw, 22px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.4;
          color: var(--gold, #c5a059);
          margin: 0;
        }

        [data-theme="light"] .storyboard-chapter-tagline {
          color: var(--gold-dark, #8f6c24);
        }

        .storyboard-chapter-desc {
          font-family: var(--font-sans, sans-serif);
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.75;
          color: var(--on-surface-muted);
          margin: 0;
        }

        /* Interactive Activity Pill Selectors */
        .storyboard-activities-block {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .storyboard-activities-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--on-surface-muted);
        }

        .storyboard-pills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .storyboard-activity-pill {
          background: var(--surface-2);
          border: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          color: var(--on-surface-muted);
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-align: left;
        }

        .storyboard-activity-pill:hover {
          color: var(--on-surface);
          border-color: rgba(197, 160, 89, 0.4);
          transform: translateY(-1px);
        }

        .storyboard-activity-pill.active {
          color: #ffffff;
          background: rgba(197, 160, 89, 0.22);
          border-color: var(--gold, #c5a059);
          box-shadow: 0 4px 16px rgba(197, 160, 89, 0.2);
        }

        [data-theme="light"] .storyboard-activity-pill.active {
          color: var(--surface);
          background: rgba(197, 160, 89, 0.25);
          border-color: var(--gold-dark, #8f6c24);
          box-shadow: 0 4px 14px rgba(143, 108, 36, 0.16);
        }

        .storyboard-pill-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold, #c5a059);
          opacity: 0.5;
          transition: all 0.2s ease;
        }

        .storyboard-activity-pill.active .storyboard-pill-bullet {
          opacity: 1;
          transform: scale(1.4);
          background: var(--gold, #c5a059);
        }

        /* Interactive Spotlight Drawer */
        .storyboard-spotlight-box {
          background: var(--surface-2);
          border: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          border-left: 3px solid var(--gold, #c5a059);
          border-radius: var(--radius, 2px);
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.3s ease;
          animation: spotlightFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="light"] .storyboard-spotlight-box {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-left: 3px solid var(--gold-dark, #8f6c24);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        @keyframes spotlightFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .storyboard-spotlight-title {
          font-family: var(--font-sans, sans-serif);
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--on-surface);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .storyboard-spotlight-desc {
          font-family: var(--font-sans, sans-serif);
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--on-surface-muted);
          margin: 0;
        }

        .storyboard-spotlight-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 4px;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--gold, #c5a059);
        }

        [data-theme="light"] .storyboard-spotlight-meta {
          color: var(--gold-dark, #8f6c24);
        }

        /* Chapter Actions (For Create on-request experiences) */
        .storyboard-chapter-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .storyboard-enquire-btn {
          background: var(--gold, #c5a059);
          color: #0f0d0a;
          border: none;
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 12px 24px;
          border-radius: var(--radius, 2px);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .storyboard-enquire-btn:hover {
          background: #d4b069;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(197, 160, 89, 0.35);
        }

        .storyboard-request-notice {
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          font-style: italic;
          color: var(--on-surface-muted);
        }

        /* Closing Storyboard Section */
        .storyboard-closing {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(80px, 12vh, 140px) 0;
          overflow: hidden;
          margin-top: 40px;
          border-top: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
        }

        .storyboard-closing-media {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .storyboard-closing-image {
          object-fit: cover;
          object-position: center;
        }

        .storyboard-closing-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.72) 0%,
            rgba(15, 13, 10, 0.88) 100%
          );
        }

        [data-theme="light"] .storyboard-closing-overlay {
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.65) 0%,
            rgba(15, 13, 10, 0.82) 100%
          );
        }

        .storyboard-closing-content {
          position: relative;
          z-index: 3;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
          color: #ffffff;
        }

        .storyboard-closing-eyebrow {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          margin-bottom: 14px;
          display: block;
        }

        .storyboard-closing-title {
          font-family: var(--font-display, serif);
          font-size: clamp(34px, 4.5vw, 56px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: 0.02em;
          margin-bottom: 18px;
        }

        .storyboard-closing-desc {
          font-family: var(--font-sans, sans-serif);
          font-size: clamp(14px, 1.25vw, 17px);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.78);
          margin-bottom: 36px;
        }

        .storyboard-closing-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .storyboard-grid,
          .storyboard-grid.reverse {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .storyboard-grid.reverse .storyboard-media-col {
            order: 0;
          }

          .storyboard-grid.reverse .storyboard-content-col {
            order: 1;
          }

          .storyboard-media-wrapper {
            aspect-ratio: 16 / 10;
          }
        }

        @media (max-width: 640px) {
          .storyboard-timeline-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          .storyboard-pills-grid {
            flex-direction: column;
          }

          .storyboard-activity-pill {
            width: 100%;
          }

          .storyboard-closing-actions {
            flex-direction: column;
            width: 100%;
          }

          .storyboard-closing-actions > * {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

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

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              href="/resorts/things-to-do/create"
              className="storyboard-tab-btn"
              style={{
                border: "1px solid rgba(197, 160, 89, 0.4)",
                color: "var(--gold)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
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
                        <span style={{ color: "var(--gold)" }}>{ch.timeLabel}</span>
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
                          <span style={{ fontSize: "10px", opacity: 0.7 }}>
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
