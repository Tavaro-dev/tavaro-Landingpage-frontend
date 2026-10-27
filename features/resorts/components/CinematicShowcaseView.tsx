"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThingsToDoButton } from "./ThingsToDoButton";

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
    <div className="cinematic-showcase">
      <style>{`
        .cinematic-showcase {
          position: relative;
          background: var(--surface, #0f0d0a);
          color: var(--on-surface, #f5f2eb);
        }

        /* STICKY QUICK-JUMP CATEGORY NAV */
        .cinematic-sticky-nav {
          position: sticky;
          top: 0;
          z-index: 25;
          background: rgba(18, 16, 14, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          padding: 12px 0;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        [data-theme="light"] .cinematic-sticky-nav {
          background: rgba(250, 248, 245, 0.94);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .cinematic-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cinematic-tabs-group {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0;
        }

        .cinematic-tabs-group::-webkit-scrollbar {
          display: none;
        }

        .cinematic-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--on-surface-muted, rgba(255, 255, 255, 0.6));
          padding: 8px 16px;
          border-radius: 999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cinematic-tab-btn:hover {
          color: var(--on-surface);
          background: var(--surface-2, rgba(255, 255, 255, 0.05));
        }

        .cinematic-tab-btn.active {
          color: #ffffff;
          background: rgba(197, 160, 89, 0.22);
          border-color: var(--gold, #c5a059);
        }

        [data-theme="light"] .cinematic-tab-btn.active {
          color: var(--gold-dark, #8f6c24);
          background: rgba(197, 160, 89, 0.16);
          border-color: rgba(177, 137, 58, 0.5);
        }

        .cinematic-tab-num {
          font-size: 9.5px;
          letter-spacing: 0.1em;
          color: var(--gold, #c5a059);
        }

        .cinematic-change-btn {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid rgba(197, 160, 89, 0.35);
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cinematic-change-btn:hover {
          background: rgba(197, 160, 89, 0.2);
          color: #ffffff;
        }

        /* ALL SECTIONS ON SCROLL */
        .cinematic-sections-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(48px, 8vh, 88px);
          padding: clamp(48px, 8vh, 96px) 0;
        }

        .cinematic-item-wrapper {
          scroll-margin-top: 90px;
          position: relative;
        }

        /* Full-Bleed Panorama Canvas */
        .cinematic-canvas {
          position: relative;
          width: 100%;
          min-height: clamp(520px, 68vh, 740px);
          border-radius: var(--radius, 4px);
          overflow: hidden;
          background: var(--surface-2, #181512);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: flex-end;
          padding: clamp(24px, 4vw, 56px);
        }

        .cinematic-canvas.align-right {
          justify-content: flex-end;
        }

        .cinematic-canvas.align-left {
          justify-content: flex-start;
        }

        .cinematic-image-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .cinematic-photo {
          object-fit: cover;
          object-position: center;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cinematic-canvas:hover .cinematic-photo {
          transform: scale(1.025);
        }

        .cinematic-canvas-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.2) 0%,
            rgba(15, 13, 10, 0.45) 50%,
            rgba(15, 13, 10, 0.9) 100%
          );
        }

        /* Floating Frosted Glass Card */
        .cinematic-glass-card {
          position: relative;
          z-index: 3;
          background: rgba(18, 16, 13, 0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius, 4px);
          padding: clamp(24px, 3.5vw, 44px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          max-width: 640px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        [data-theme="light"] .cinematic-glass-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.14);
        }

        .cinematic-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cinematic-badge-pill {
          font-family: var(--font-sans, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          background: rgba(197, 160, 89, 0.15);
          border: 1px solid rgba(197, 160, 89, 0.4);
          padding: 4px 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        [data-theme="light"] .cinematic-badge-pill {
          color: var(--gold-dark, #8f6c24);
          background: rgba(197, 160, 89, 0.16);
          border-color: rgba(177, 137, 58, 0.45);
        }

        .cinematic-count-tag {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--on-surface-muted, rgba(255, 255, 255, 0.6));
        }

        .cinematic-card-title {
          font-family: var(--font-display, serif);
          font-size: clamp(34px, 4.5vw, 54px);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: 0.02em;
          color: var(--on-surface);
          margin: 0;
        }

        /* Interactive Activity Chips (Strictly Client Provided Items) */
        .cinematic-chips-tray {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cinematic-activity-chip {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--on-surface);
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 7px 15px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-align: left;
        }

        [data-theme="light"] .cinematic-activity-chip {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.09);
          color: var(--on-surface);
        }

        .cinematic-activity-chip:hover {
          background: rgba(197, 160, 89, 0.22);
          border-color: var(--gold, #c5a059);
          transform: translateY(-1px);
        }

        .cinematic-activity-chip.selected {
          background: var(--gold, #c5a059);
          color: #0f0d0a;
          border-color: var(--gold, #c5a059);
          font-weight: 600;
        }

        .cinematic-chip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold, #c5a059);
          transition: background 0.2s ease;
        }

        .cinematic-activity-chip.selected .cinematic-chip-dot {
          background: #0f0d0a;
        }

        /* Mode-Specific Actions (Create Your Experience) */
        .cinematic-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        [data-theme="light"] .cinematic-card-actions {
          border-top-color: rgba(0, 0, 0, 0.08);
        }

        .cinematic-enquire-btn {
          background: var(--gold, #c5a059);
          color: #0f0d0a;
          border: none;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 11px 24px;
          border-radius: var(--radius, 2px);
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .cinematic-enquire-btn:hover {
          background: #d4b069;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(197, 160, 89, 0.35);
        }

        .cinematic-action-hint {
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          color: var(--on-surface-muted);
          font-style: italic;
        }

        /* MINIMAL LUXURY CLOSING BAR */
        .cinematic-closing-bar {
          margin-top: clamp(48px, 8vh, 80px);
          background: var(--surface-2, #181512);
          border: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius, 4px);
          padding: clamp(28px, 4vw, 44px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .cinematic-closing-text {
          max-width: 580px;
        }

        .cinematic-closing-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 300;
          color: var(--on-surface);
          margin: 0 0 8px;
        }

        .cinematic-closing-desc {
          font-family: var(--font-sans, sans-serif);
          font-size: 13.5px;
          color: var(--on-surface-muted);
          margin: 0;
        }

        .cinematic-closing-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .cinematic-canvas {
            min-height: 480px;
            padding: 16px;
          }

          .cinematic-glass-card {
            padding: 20px;
          }

          .cinematic-chips-tray {
            flex-direction: column;
          }

          .cinematic-activity-chip {
            width: 100%;
          }

          .cinematic-closing-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .cinematic-closing-actions {
            width: 100%;
            flex-direction: column;
          }

          .cinematic-closing-actions > * {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      {/* STICKY CLICK-TO-JUMP CATEGORY NAV */}
      <nav
        className="cinematic-sticky-nav"
        aria-label="Category Navigation"
      >
        <div className="container cinematic-nav-inner">
          <div className="cinematic-tabs-group">
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cinematic-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => scrollToSection(cat.id)}
                  aria-label={`Jump to ${cat.title}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="cinematic-tab-num">{cat.number}</span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          <div>
            <Link
              href="/resorts/things-to-do/create"
              className="cinematic-change-btn"
              style={{
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

      {/* ALL SECTIONS VISIBLE ON SCROLL */}
      <div className="container">
        <div className="cinematic-sections-stack">
          {categories.map((cat, idx) => {
            const isRight = idx % 2 === 1;

            return (
              <section
                key={cat.id}
                id={`section-${cat.id}`}
                className="cinematic-item-wrapper"
                aria-label={`${cat.title} Section`}
              >
                <div
                  className={`cinematic-canvas ${
                    isRight ? "align-right" : "align-left"
                  }`}
                >
                  {/* High-Resolution Panoramic Image */}
                  <div className="cinematic-image-layer">
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt}
                      fill
                      sizes="100vw"
                      className="cinematic-photo"
                    />
                    <div className="cinematic-canvas-overlay" />
                  </div>

                  {/* Floating Frosted Glass Card with Exact Client Activities */}
                  <div className="cinematic-glass-card">
                    <div className="cinematic-card-meta">
                      <span className="cinematic-badge-pill">
                        <span>{cat.number}</span>
                        <span>&bull;</span>
                        <span>{cat.badge}</span>
                      </span>
                      <span className="cinematic-count-tag">
                        {cat.activities.length} Experiences
                      </span>
                    </div>

                    <h2 className="cinematic-card-title">{cat.title}</h2>

                    {/* Interactive Activity Chips (Client Exact Wording) */}
                    <div
                      className="cinematic-chips-tray"
                      role="list"
                      aria-label={`${cat.title} activities`}
                    >
                      {cat.activities.map((act) => {
                        const isSelected = selectedChip === act;
                        return (
                          <button
                            key={act}
                            type="button"
                            className={`cinematic-activity-chip ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() =>
                              setSelectedChip(isSelected ? null : act)
                            }
                            aria-label={act}
                          >
                            <span className="cinematic-chip-dot" />
                            <span>{act}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mode-specific actions (Create Your Experience) */}
                    {mode === "create" && (
                      <div className="cinematic-card-actions">
                        <button
                          type="button"
                          className="cinematic-enquire-btn"
                          onClick={() => onEnquireCategory?.(cat.title)}
                        >
                          Enquire for {cat.title}
                        </button>
                        <span className="cinematic-action-hint">
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
        <div className="cinematic-closing-bar">
          <div className="cinematic-closing-text">
            <h3 className="cinematic-closing-title">{closing.title}</h3>
            <p className="cinematic-closing-desc">{closing.tagline}</p>
          </div>

          <div className="cinematic-closing-actions">
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
