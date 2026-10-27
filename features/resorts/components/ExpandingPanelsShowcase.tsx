"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThingsToDoButton } from "./ThingsToDoButton";

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
  console.log("SHOWCASE RENDERING, categories:", categories.length);
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
      <style>{`
        /* ==========================================================================
           SCROLL-DRIVEN EXPANDING PANELS (Exact Interaction)
           ========================================================================== */

        .expanding-showcase-wrapper {
          position: relative;
          background: var(--surface, #0f0d0a);
          color: var(--on-surface, #f5f2eb);
        }

        .showcase-scroll-track {
          position: relative;
          background: var(--surface, #0f0d0a);
        }

        /* DESKTOP LAYOUT (>= 901px) */
        @media (min-width: 901px) {
          .showcase-scroll-track {
            min-height: 320vh;
          }

          .showcase-sticky-stage {
            position: sticky;
            top: 72px;
            height: calc(100vh - 72px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 16px 0 24px;
            z-index: 10;
            background: var(--surface, #0f0d0a);
            overflow: hidden;
          }

          [data-theme="light"] .showcase-sticky-stage {
            background: var(--surface, #f7f2e7);
          }

          .showcase-panels-container {
            display: flex;
            width: 100%;
            flex: 1;
            min-height: 0;
            gap: 16px;
            border-radius: var(--radius, 4px);
            overflow: hidden;
          }

          .showcase-panel {
            position: relative;
            flex: 1;
            height: 100%;
            border-radius: var(--radius, 4px);
            overflow: hidden;
            cursor: pointer;
            transition: flex 0.75s cubic-bezier(0.2, 0.78, 0.2, 1), transform 0.4s ease, border-color 0.3s ease;
            background: var(--surface-2, #181512);
            border: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
            min-width: 60px;
          }

          .showcase-panel:not(.active):hover {
            border-color: rgba(197, 160, 89, 0.45);
            transform: translateY(-2px);
          }

          .showcase-panel:not(.active):hover .showcase-panel-image {
            filter: brightness(0.85);
          }

          /* Active panel expands horizontally to ~68% width (6.5 / 9.5) */
          .showcase-panel.active {
            flex: 6.5;
            cursor: default;
            border-color: rgba(197, 160, 89, 0.35);
          }

          .showcase-panel-collapsed {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 24px 8px;
            z-index: 3;
            opacity: 1;
            transition: opacity 0.35s cubic-bezier(0.2, 0.78, 0.2, 1);
            pointer-events: none;
          }

          .showcase-panel.active .showcase-panel-collapsed {
            opacity: 0;
            pointer-events: none;
          }

          .showcase-collapsed-label {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-family: var(--font-display, serif);
            font-size: clamp(16px, 1.6vw, 22px);
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.9);
            white-space: nowrap;
            margin: auto 0;
          }

          .showcase-panel-expanded {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: clamp(24px, 3.5vw, 48px);
            z-index: 4;
            opacity: 0;
            transform: translateY(14px);
            pointer-events: none;
            visibility: hidden;
            transition: opacity 0.45s cubic-bezier(0.2, 0.78, 0.2, 1) 0.15s,
                        transform 0.45s cubic-bezier(0.2, 0.78, 0.2, 1) 0.15s,
                        visibility 0.45s ease;
          }

          .showcase-panel.active .showcase-panel-expanded {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            visibility: visible;
          }
        }

        /* HEADER CONTROLLER */
        .showcase-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .showcase-title-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 680px;
        }

        .showcase-eyebrow {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .showcase-eyebrow::before {
          content: "";
          display: inline-block;
          width: 20px;
          height: 1px;
          background: var(--gold, #c5a059);
        }

        .showcase-heading {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 3vw, 36px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: 0.015em;
          color: var(--on-surface);
          margin: 0;
        }

        .showcase-top-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* QUICK CATEGORY TABS */
        .showcase-tabs-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px;
          border-radius: 999px;
        }

        [data-theme="light"] .showcase-tabs-nav {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.08);
        }

        .showcase-tab-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--on-surface-muted, rgba(255, 255, 255, 0.6));
          padding: 7px 15px;
          border-radius: 999px;
          transition: all 0.25s cubic-bezier(0.2, 0.78, 0.2, 1);
          white-space: nowrap;
        }

        .showcase-tab-btn:hover {
          color: var(--on-surface);
          background: rgba(197, 160, 89, 0.14);
        }

        .showcase-tab-btn.active {
          color: #ffffff;
          background: var(--gold, #c5a059);
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(197, 160, 89, 0.3);
        }

        [data-theme="light"] .showcase-tab-btn.active {
          color: #0f0d0a;
        }

        .showcase-change-btn {
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          white-space: nowrap;
        }

        .showcase-change-btn:hover {
          background: rgba(197, 160, 89, 0.22);
          color: #ffffff;
        }

        .showcase-change-btn .btn-arrow {
          transition: transform 0.25s ease;
        }

        .showcase-change-btn:hover .btn-arrow {
          transform: translateX(3px);
        }

        /* PANEL MEDIA & OVERLAYS */
        .showcase-panel-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .showcase-panel-image {
          object-fit: cover;
          object-position: center;
          transition: transform 1.2s cubic-bezier(0.2, 0.78, 0.2, 1), filter 0.6s ease;
          filter: brightness(0.72);
        }

        .showcase-panel.active .showcase-panel-image {
          filter: brightness(0.88);
          transform: scale(1.03);
        }

        .showcase-panel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.2) 0%,
            rgba(15, 13, 10, 0.45) 45%,
            rgba(15, 13, 10, 0.92) 100%
          );
        }

        .showcase-collapsed-num {
          font-family: var(--font-sans, sans-serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--gold, #c5a059);
        }

        .showcase-collapsed-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold, #c5a059);
          opacity: 0.7;
        }

        /* FLOATING FROSTED GLASS CARD */
        .showcase-glass-card {
          background: rgba(18, 16, 13, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: var(--radius, 4px);
          padding: clamp(20px, 2.8vw, 36px);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        [data-theme="light"] .showcase-glass-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
        }

        .showcase-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .showcase-badge-pill {
          font-family: var(--font-sans, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold, #c5a059);
          background: rgba(197, 160, 89, 0.14);
          border: 1px solid rgba(197, 160, 89, 0.35);
          padding: 4px 12px;
          border-radius: 999px;
        }

        [data-theme="light"] .showcase-badge-pill {
          color: var(--gold-dark, #8f6c24);
          background: rgba(197, 160, 89, 0.15);
          border-color: rgba(177, 137, 58, 0.4);
        }

        .showcase-card-title {
          font-family: var(--font-display, serif);
          font-size: clamp(30px, 3.8vw, 48px);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: 0.02em;
          color: var(--on-surface);
          margin: 0;
        }

        /* STRICT CLIENT-PROVIDED ACTIVITIES CHIPS */
        .showcase-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .showcase-chip {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--on-surface);
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 7px 15px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.2, 0.78, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-align: left;
        }

        [data-theme="light"] .showcase-chip {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.09);
          color: var(--on-surface);
        }

        .showcase-chip:hover {
          background: rgba(197, 160, 89, 0.22);
          border-color: var(--gold, #c5a059);
          transform: translateY(-1px);
        }

        .showcase-chip.selected {
          background: var(--gold, #c5a059);
          color: #0f0d0a;
          border-color: var(--gold, #c5a059);
          font-weight: 600;
        }

        .showcase-chip-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold, #c5a059);
        }

        .showcase-chip.selected .showcase-chip-dot {
          background: #0f0d0a;
        }

        /* ACTION ROW FOR CREATE EXPERIENCE */
        .showcase-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        [data-theme="light"] .showcase-card-actions {
          border-top-color: rgba(0, 0, 0, 0.08);
        }

        .showcase-enquire-btn {
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .showcase-enquire-btn:hover {
          background: #d4b069;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(197, 160, 89, 0.35);
        }

        .showcase-action-hint {
          font-family: var(--font-sans, sans-serif);
          font-size: 11.5px;
          color: var(--on-surface-muted);
          font-style: italic;
        }

        /* STAGE FOOTER & PROGRESS INDICATORS */
        .showcase-stage-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          color: var(--on-surface-muted);
        }

        .showcase-scroll-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 10.5px;
        }

        .showcase-progress-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .showcase-dot-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
        }

        .showcase-dot-btn.active {
          width: 24px;
          border-radius: 999px;
          background: var(--gold, #c5a059);
        }

        /* MOBILE STICKY SCROLL & EXPANDING PANELS (< 901px) */
        @media (max-width: 900px) {
          .showcase-scroll-track {
            min-height: 280vh;
            position: relative;
            box-sizing: border-box;
          }

          .showcase-sticky-stage {
            position: sticky;
            top: var(--header-height, 72px);
            height: calc(100vh - var(--header-height, 72px));
            height: calc(100dvh - var(--header-height, 72px));
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px 14px 14px;
            overflow: hidden;
            box-sizing: border-box;
          }

          .showcase-header {
            margin-bottom: 8px;
            gap: 6px;
            flex-shrink: 0;
          }

          .showcase-eyebrow {
            font-size: 10px;
          }

          .showcase-heading {
            font-size: 18px;
            line-height: 1.15;
          }

          .showcase-top-controls {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 2px;
          }

          .showcase-top-controls::-webkit-scrollbar {
            display: none;
          }

          .showcase-tabs-nav {
            gap: 4px;
            padding: 3px;
          }

          .showcase-tab-btn {
            font-size: 9.5px;
            padding: 5px 9px;
            letter-spacing: 0.08em;
          }

          .showcase-panels-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1 1 auto;
            min-height: 0;
            overflow: hidden;
          }

          .showcase-panel {
            position: relative;
            width: 100%;
            border-radius: var(--radius, 4px);
            overflow: hidden;
            cursor: pointer;
            flex: 1 1 0%;
            height: auto;
            min-height: 0;
            transition: flex 0.65s cubic-bezier(0.2, 0.78, 0.2, 1);
          }

          .showcase-panel.active {
            flex: 5.5 1 0%;
            cursor: default;
          }

          /* Collapsed strip on mobile */
          .showcase-panel-collapsed {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 3;
            opacity: 1;
            transition: opacity 0.3s ease;
            pointer-events: auto;
          }

          .showcase-panel.active .showcase-panel-collapsed {
            opacity: 0;
            pointer-events: none;
          }

          .showcase-collapsed-label {
            writing-mode: horizontal-tb;
            transform: none;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .showcase-collapsed-num {
            font-size: 11px;
          }

          /* Expanded card on mobile */
          .showcase-panel-expanded {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 10px;
            z-index: 4;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.4s cubic-bezier(0.2, 0.78, 0.2, 1) 0.1s,
                        visibility 0.4s ease;
          }

          .showcase-panel.active .showcase-panel-expanded {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .showcase-glass-card {
            padding: 12px 14px;
            max-width: 100%;
            gap: 7px;
            border-radius: var(--radius, 4px);
          }

          .showcase-card-header {
            gap: 6px;
          }

          .showcase-badge-pill {
            font-size: 9px;
            padding: 2px 8px;
          }

          .showcase-card-title {
            font-size: clamp(18px, 4.5vw, 22px);
          }

          .showcase-card-tagline {
            font-size: 11px;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .showcase-chips-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            max-height: 75px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .showcase-chip {
            font-size: 10px;
            padding: 4px 8px;
            gap: 5px;
            width: auto;
          }

          .showcase-card-actions {
            margin-top: 4px;
            padding-top: 8px;
            gap: 8px;
          }

          .showcase-enquire-btn {
            font-size: 10px;
            padding: 8px 16px;
          }

          .showcase-action-hint {
            font-size: 9.5px;
          }

          .showcase-stage-footer {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 6px;
            padding-top: 4px;
            flex-shrink: 0;
          }

          .showcase-scroll-hint {
            font-size: 9.5px;
          }

          .showcase-progress-dots {
            gap: 6px;
          }

          .showcase-dot-btn {
            width: 6px;
            height: 6px;
          }

          .showcase-dot-btn.active {
            width: 18px;
          }
        }

        /* MINIMAL LUXURY CLOSING BAR (OUTSIDE THE TRACK) */
        .showcase-closing-bar {
          background: var(--surface-2, #181512);
          border: 1px solid var(--surface-line, rgba(255, 255, 255, 0.08));
          border-radius: var(--radius, 4px);
          padding: clamp(28px, 4vw, 44px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          margin: 60px auto 80px;
        }

        .showcase-closing-text {
          max-width: 580px;
        }

        .showcase-closing-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 300;
          color: var(--on-surface);
          margin: 0 0 8px;
        }

        .showcase-closing-desc {
          font-family: var(--font-sans, sans-serif);
          font-size: 13.5px;
          color: var(--on-surface-muted);
          margin: 0;
        }

        .showcase-closing-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-panel,
          .showcase-panel-collapsed,
          .showcase-panel-expanded,
          .showcase-panel-image,
          .showcase-tab-btn,
          .showcase-dot-btn {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* DEDICATED OUTER SCROLL TRACK (PINS SHOWCASE BENEATH STICKY HEADER) */}
      <div ref={trackRef} className="showcase-scroll-track" id="expanding-showcase-track">
        {/* STICKY VISUAL SHOWCASE STAGE */}
        <div ref={stickyRef} className="showcase-sticky-stage">
          <div
            className="container"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
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
                        priority={idx === 0}
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
                          <span
                            style={{
                              fontSize: "11px",
                              opacity: 0.65,
                              fontFamily: "var(--font-sans, sans-serif)",
                              letterSpacing: "0.08em",
                            }}
                          >
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
                className="btn solid"
                onClick={closing.onPrimaryBtnClick}
                style={{
                  background: "var(--gold, #c5a059)",
                  color: "#0f0d0a",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  padding: "12px 24px",
                }}
              >
                {closing.primaryBtnText} &rarr;
              </button>
            ) : (
              <Link
                href={closing.primaryBtnHref || "#"}
                className="btn solid"
                style={{
                  background: "var(--gold, #c5a059)",
                  color: "#0f0d0a",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  padding: "12px 24px",
                }}
              >
                {closing.primaryBtnText} &rarr;
              </Link>
            )}

            <Link
              href={closing.secondaryBtnHref}
              className="btn"
              style={{
                border: "1px solid var(--surface-line, rgba(255, 255, 255, 0.2))",
                color: "var(--on-surface)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 24px",
              }}
            >
              {closing.secondaryBtnText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
