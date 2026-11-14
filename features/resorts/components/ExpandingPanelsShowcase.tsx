"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import "./ExpandingPanelsShowcase.css";

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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Helper to dynamically get actual sticky header height
  const getHeaderHeight = useCallback(() => {
    if (typeof window === "undefined") return 72;
    const header = document.querySelector(".site-header");
    if (header) {
      const rect = header.getBoundingClientRect();
      if (rect.height > 0) return rect.height;
    }
    return 72;
  }, []);

  // SCROLL-DRIVEN PROGRESS MAPPING (Desktop and Mobile)
  useEffect(() => {
    const handleScroll = () => {
      // Skip if programmatic smooth-scroll is animating
      if (typeof window === "undefined") return;
      if (isProgrammaticScrollRef.current) return;

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const trackTop = rect.top + scrollTop;
      const trackHeight = track.offsetHeight;
      const headerH = getHeaderHeight();
      const viewportH = window.innerHeight;

      // trackStart: when top of sticky stage aligns with bottom of header
      const trackStart = trackTop - headerH;
      // scrollDistance: total distance sticky stage remains pinned
      const scrollDistance = trackHeight - (viewportH - headerH);

      if (scrollDistance <= 0) return;

      // Derive normalized progress strictly from scroll position: [0, 1]
      const currentProgress = (scrollTop - trackStart) / scrollDistance;
      const progress = Math.max(0, Math.min(1, currentProgress));

      // Deterministically map progress to 4 equal, stable intervals
      let newIndex = 0;
      if (progress < 0.25) {
        newIndex = 0;
      } else if (progress < 0.5) {
        newIndex = 1;
      } else if (progress < 0.75) {
        newIndex = 2;
      } else {
        newIndex = 3;
      }

      if (newIndex !== activeIndexRef.current && categories[newIndex]) {
        setActiveIndex(newIndex);
      }
    };

    // User wheel or touch interrupts any programmatic scroll flag immediately
    const handleUserInteraction = () => {
      isProgrammaticScrollRef.current = false;
      if (programmaticScrollTimerRef.current) {
        clearTimeout(programmaticScrollTimerRef.current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchmove", handleUserInteraction, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      document.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);
    };
  }, [categories, getHeaderHeight]);

  // MANUAL SELECTION WITH PRECISE SCROLL SYNCHRONIZATION
  const handleSelectCategory = (index: number) => {
    setActiveIndex(index);

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const trackTop = rect.top + scrollTop;
    const trackHeight = track.offsetHeight;
    const headerH = getHeaderHeight();
    const viewportH = window.innerHeight;

    const trackStart = trackTop - headerH;
    const scrollDistance = trackHeight - (viewportH - headerH);
    if (scrollDistance <= 0) return;

    // Scroll to the exact center of stage `index`
    const targetScrollY = trackStart + (index + 0.5) * (scrollDistance / 4);

    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimerRef.current) {
      clearTimeout(programmaticScrollTimerRef.current);
    }

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    programmaticScrollTimerRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 650);
  };

  return (
    <div className="expanding-showcase-wrapper">

      {/* DEDICATED OUTER SCROLL TRACK (PINS SHOWCASE BENEATH STICKY HEADER) */}
      <div ref={trackRef} className="showcase-scroll-track" id="expanding-showcase-track">
        {/* STICKY VISUAL SHOWCASE STAGE */}
        <div ref={stickyRef} className="showcase-sticky-stage">
          <div
            className="container tw:flex tw:flex-col tw:h-full tw:w-full"
          >
            {/* HEADER CONTROLLER (CATEGORY QUICK NAVIGATION & OPTION BUTTON) */}
            <div className="showcase-header">
              <div className="showcase-title-group">
                <span className="showcase-eyebrow">
                  {mode === "explore"
                    ? "Explore at Your Own Pace"
                    : "Create Your Experience (On Request)"}
                </span>
                <h2 className="showcase-heading">
                  {mode === "explore"
                    ? "Wander, dine, swim, play and unwind — at your own rhythm."
                    : "Arrange something special with our team."}
                </h2>
              </div>

              <div className="showcase-top-controls">
                {/* Manual Selection Tabs */}
                <nav className="showcase-tabs-nav" aria-label="Category tabs">
                  {categories.map((cat, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`showcase-tab-btn ${isActive ? "active" : ""}`}
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
                    className="showcase-change-btn"
                  >
                    Create your experience <span className="btn-arrow" aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link
                    href="/resorts/things-to-do/explore"
                    className="showcase-change-btn"
                  >
                    Discover <span className="btn-arrow" aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* THE FOUR EXPANDING PANELS (DRIVEN BY SCROLL, CLICK, & SELECTION) */}
            <div
              className="showcase-panels-container"
              role="region"
              aria-label="Experience Categories Showcase"
            >
              {categories.map((cat, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={cat.id}
                    data-stage={idx}
                    className={`showcase-panel ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectCategory(idx)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                    aria-label={`${cat.title} Category`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectCategory(idx);
                      }
                    }}
                  >
                    {/* High-Resolution Background Imagery */}
                    <div className="showcase-panel-bg">
                      <Image
                        src={cat.image}
                        alt={cat.imageAlt}
                        fill
                        sizes="(max-width: 900px) 100vw, 70vw"
                        loading={idx === 0 ? "eager" : undefined}
                        className="showcase-panel-image"
                      />
                      <div className="showcase-panel-overlay" />
                    </div>

                    {/* Collapsed State: Narrow Vertical Spine */}
                    <div className="showcase-panel-collapsed">
                      <span className="showcase-collapsed-num">{cat.number}</span>
                      <span className="showcase-collapsed-label">{cat.title}</span>
                      <span className="showcase-collapsed-indicator" />
                    </div>

                    {/* Expanded State: Floating Glass Card */}
                    <div className="showcase-panel-expanded">
                      <div className="showcase-glass-card">
                        <div className="showcase-card-header">
                          <span className="showcase-badge-pill">
                            {cat.number} &bull; {cat.badge}
                          </span>
                          <span className="tw:text-[11px] tw:opacity-[0.65] tw:font-(family-name:--font-sans) tw:tracking-[0.08em]">
                            {cat.activities.length} Experiences
                          </span>
                        </div>

                        <h3 className="showcase-card-title">{cat.title}</h3>

                        {/* Interactive Activity Chips (Strictly Client-Provided Wording) */}
                        <div
                          className="showcase-chips-wrap"
                          role="list"
                          aria-label={`${cat.title} activities`}
                        >
                          {cat.activities.map((act) => {
                            const isSelected = selectedChip === act;
                            return (
                              <button
                                key={act}
                                type="button"
                                tabIndex={isActive ? 0 : -1}
                                className={`showcase-chip ${
                                  isSelected ? "selected" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedChip(isSelected ? null : act);
                                }}
                                aria-pressed={isSelected}
                              >
                                <span className="showcase-chip-dot" />
                                <span>{act}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Action Row for Create Experience */}
                        {mode === "create" && (
                          <div className="showcase-card-actions">
                            <button
                              type="button"
                              tabIndex={isActive ? 0 : -1}
                              className="showcase-enquire-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEnquireCategory?.(cat.title);
                              }}
                            >
                              Enquire for {cat.title} &rarr;
                            </button>
                            <span className="showcase-action-hint">
                              Arranged on request with our team
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STAGE FOOTER & STAGE PROGRESS INDICATORS */}
            <div className="showcase-stage-footer">
              <span className="showcase-scroll-hint">
                <span>✦</span>
                <span>Scroll down through all 4 categories, or select directly above</span>
              </span>

              <div className="showcase-progress-dots" role="tablist" aria-label="Showcase stage dots">
                {categories.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`showcase-dot-btn ${isActive ? "active" : ""}`}
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
        <div className="showcase-closing-bar">
          <div className="showcase-closing-text">
            <h3 className="showcase-closing-title">{closing.title}</h3>
            <p className="showcase-closing-desc">{closing.tagline}</p>
          </div>

          <div className="showcase-closing-actions">
            {closing.onPrimaryBtnClick ? (
              <button
                type="button"
                className="btn solid showcase-closing-primary"
                onClick={closing.onPrimaryBtnClick}
              >
                {closing.primaryBtnText} &rarr;
              </button>
            ) : (
              <Link
                href={closing.primaryBtnHref || "#"}
                className="btn solid showcase-closing-primary"
              >
                {closing.primaryBtnText} &rarr;
              </Link>
            )}

            <Link
              href={closing.secondaryBtnHref}
              className="btn showcase-closing-secondary"
            >
              {closing.secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
