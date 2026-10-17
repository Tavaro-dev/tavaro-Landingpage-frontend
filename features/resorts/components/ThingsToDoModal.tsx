"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { THINGS_TO_DO_DATA } from "../content/thingsToDoData";

interface ThingsToDoModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const emptySubscribe = () => () => {};

export function ThingsToDoModal({ isOpen, onClose, triggerRef }: ThingsToDoModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timeout);
    };
  }, [isOpen]);

  // Keyboard accessibility: Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef?.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !isClient) return null;

  const handleSelectOption = (route: string) => {
    onClose();
    router.push(route);
  };

  const { explore, create } = THINGS_TO_DO_DATA;

  return createPortal(
    <div
      className="ttd-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <style>{`
        .ttd-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 9, 8, 0.55);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 1300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 2.5vw, 28px);
          overflow: hidden;
          animation: ttdFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        [data-theme="light"] .ttd-modal-backdrop {
          background: rgba(28, 23, 18, 0.45);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        @keyframes ttdFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ttd-modal-container {
          background: var(--panel, #1a1815);
          color: var(--on-surface, #f7f2e7);
          width: min(880px, 92vw);
          height: min(540px, 82vh);
          border-radius: var(--radius, 2px);
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.35));
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: ttdScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        [data-theme="light"] .ttd-modal-container {
          background: var(--surface, #f7f2e7);
          color: var(--on-surface, #1c1712);
          border: 1px solid var(--surface-line, rgba(156, 124, 62, 0.45));
          box-shadow: 0 24px 60px rgba(28, 24, 20, 0.2);
        }

        @keyframes ttdScaleUp {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ttd-modal-backdrop,
          .ttd-modal-container {
            animation: none !important;
          }
        }

        /* Compact, refined centered header */
        .ttd-modal-top {
          padding: 14px 48px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--surface-line, rgba(201, 164, 90, 0.25));
          background: inherit;
          flex-shrink: 0;
          z-index: 10;
          position: relative;
        }

        .ttd-modal-header-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 3px;
        }

        .ttd-modal-eyebrow {
          font-family: var(--font-sans, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold, #c9a45a);
          margin: 0;
          text-align: center;
        }

        [data-theme="light"] .ttd-modal-eyebrow {
          color: var(--gold-dark, #9c7c3e);
        }

        .ttd-modal-heading {
          font-family: var(--font-display, serif);
          font-size: clamp(17px, 2vw, 21px);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: 0.02em;
          color: var(--on-surface, #f7f2e7);
          margin: 0;
          text-align: center;
        }

        .ttd-modal-close-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-2, rgba(255, 255, 255, 0.04));
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.3));
          border-radius: 50%;
          color: var(--on-surface, #f7f2e7);
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        .ttd-modal-close-btn:hover {
          background: var(--gold, #c9a45a);
          color: var(--black, #0a0908);
          border-color: var(--gold, #c9a45a);
          transform: translateY(-50%) scale(1.05);
        }

        [data-theme="light"] .ttd-modal-close-btn:hover {
          background: var(--gold-dark, #9c7c3e);
          color: #ffffff;
        }

        .ttd-modal-close-btn:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        .ttd-modal-close-btn svg {
          width: 14px;
          height: 14px;
          display: block;
          stroke: currentColor;
          stroke-width: 2;
        }

        /* Full-bleed edge-to-edge split panels */
        .ttd-editorial-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          min-height: 0;
          position: relative;
          background: var(--surface-line, rgba(201, 164, 90, 0.25));
          gap: 1px;
        }

        .ttd-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(20px, 3vw, 32px);
          text-decoration: none;
          color: #f7f2e7;
          cursor: pointer;
          outline: none;
        }

        .ttd-panel-img {
          object-fit: cover;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ttd-panel:hover .ttd-panel-img,
        .ttd-panel:focus-visible .ttd-panel-img {
          transform: scale(1.04);
        }

        .ttd-panel-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 9, 8, 0.94) 0%,
            rgba(10, 9, 8, 0.58) 45%,
            rgba(10, 9, 8, 0.2) 80%,
            rgba(10, 9, 8, 0.1) 100%
          );
          transition: background 0.4s ease;
          z-index: 1;
        }

        .ttd-panel:hover .ttd-panel-scrim,
        .ttd-panel:focus-visible .ttd-panel-scrim {
          background: linear-gradient(
            to top,
            rgba(10, 9, 8, 0.96) 0%,
            rgba(10, 9, 8, 0.5) 45%,
            rgba(10, 9, 8, 0.15) 80%,
            rgba(10, 9, 8, 0.05) 100%
          );
        }

        .ttd-panel-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 440px;
        }

        .ttd-panel-number {
          font-family: var(--font-sans, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light, #e6cf9e);
          margin: 0 0 6px;
        }

        .ttd-panel-title {
          font-family: var(--font-display, serif);
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 400;
          line-height: 1.18;
          letter-spacing: 0.02em;
          color: #ffffff;
          margin: 0 0 8px;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.5);
        }

        .ttd-panel-desc {
          font-size: 13px;
          line-height: 1.48;
          color: rgba(247, 242, 231, 0.88);
          margin: 0 0 12px;
          max-width: 360px;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
        }

        .ttd-panel-pillars {
          font-family: var(--font-sans, sans-serif);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold-light, #e6cf9e);
          margin: 0 0 18px;
          opacity: 0.95;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ttd-panel-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ffffff;
          padding: 9px 18px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius, 2px);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .ttd-panel:hover .ttd-panel-cta,
        .ttd-panel:focus-visible .ttd-panel-cta {
          background: var(--gold, #c9a45a);
          color: #0a0908;
          border-color: var(--gold, #c9a45a);
          gap: 12px;
        }

        .ttd-panel-arrow {
          font-size: 13px;
          line-height: 1;
          transition: transform 0.3s ease;
        }

        .ttd-panel:hover .ttd-panel-arrow,
        .ttd-panel:focus-visible .ttd-panel-arrow {
          transform: translateX(4px);
        }

        .ttd-panel:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: -2px;
        }

        /* Mobile stacked layout with vertical scrolling */
        @media (max-width: 860px) {
          .ttd-modal-backdrop {
            padding: 16px 12px;
            overflow-y: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ttd-modal-container {
            width: 100%;
            max-width: 440px;
            height: auto;
            min-height: 0;
            max-height: calc(100vh - 24px);
            margin: auto;
            overflow-y: auto;
            border-radius: var(--radius, 2px);
          }

          .ttd-modal-top {
            padding: 12px 42px 10px;
          }

          .ttd-modal-eyebrow {
            font-size: 9.5px;
            letter-spacing: 0.16em;
          }

          .ttd-modal-heading {
            font-size: clamp(14.5px, 4vw, 17px);
            line-height: 1.25;
          }

          .ttd-editorial-panels {
            grid-template-columns: 1fr;
            flex: none;
            gap: 1px;
          }

          .ttd-panel {
            min-height: 230px;
            padding: 20px 16px 18px;
          }

          .ttd-panel-number {
            font-size: 9.5px;
            margin-bottom: 4px;
          }

          .ttd-panel-title {
            font-size: 19px;
            margin-bottom: 6px;
          }

          .ttd-panel-desc {
            font-size: 12px;
            line-height: 1.4;
            margin-bottom: 8px;
          }

          .ttd-panel-pillars {
            margin-bottom: 12px;
            font-size: 9.5px;
            letter-spacing: 0.1em;
          }

          .ttd-panel-cta {
            padding: 7px 15px;
            font-size: 10.5px;
            letter-spacing: 0.1em;
          }
        }
      `}</style>

      <div
        ref={modalRef}
        className="ttd-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ttd-modal-heading"
        tabIndex={-1}
      >
        <div className="ttd-modal-top">
          <div className="ttd-modal-header-text">
            <p className="ttd-modal-eyebrow">THE TAVARO EXPERIENCE</p>
            <h2 id="ttd-modal-heading" className="ttd-modal-heading">
              How would you like to spend your time?
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="ttd-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="ttd-editorial-panels">
          {/* Panel 1 — Explore at Your Own Pace */}
          <Link
            href={explore.route}
            className="ttd-panel"
            onClick={(e) => {
              e.preventDefault();
              handleSelectOption(explore.route);
            }}
            aria-label={`${explore.title}: ${explore.cardDescription}`}
          >
            <Image
              src={explore.modalImage}
              alt={explore.modalImageAlt}
              fill
              sizes="(max-width: 860px) 100vw, 600px"
              priority
              className="ttd-panel-img"
            />
            <div className="ttd-panel-scrim" />
            <div className="ttd-panel-content">
              <span className="ttd-panel-number">01 — EXPLORE AT YOUR OWN PACE</span>
              <h3 className="ttd-panel-title">{explore.title}</h3>
              <p className="ttd-panel-desc">{explore.cardDescription}</p>
              <div className="ttd-panel-pillars">{explore.categoryPreview}</div>
              <div className="ttd-panel-cta">
                <span>{explore.ctaLabel}</span>
                <span className="ttd-panel-arrow" aria-hidden="true">→</span>
              </div>
            </div>
          </Link>

          {/* Panel 2 — Create Your Experience */}
          <Link
            href={create.route}
            className="ttd-panel"
            onClick={(e) => {
              e.preventDefault();
              handleSelectOption(create.route);
            }}
            aria-label={`${create.title}: ${create.cardDescription}`}
          >
            <Image
              src={create.modalImage}
              alt={create.modalImageAlt}
              fill
              sizes="(max-width: 860px) 100vw, 600px"
              priority
              className="ttd-panel-img"
            />
            <div className="ttd-panel-scrim" />
            <div className="ttd-panel-content">
              <span className="ttd-panel-number">02 — CREATE YOUR EXPERIENCE</span>
              <h3 className="ttd-panel-title">{create.title}</h3>
              <p className="ttd-panel-desc">{create.cardDescription}</p>
              <div className="ttd-panel-pillars">{create.categoryPreview}</div>
              <div className="ttd-panel-cta">
                <span>{create.ctaLabel}</span>
                <span className="ttd-panel-arrow" aria-hidden="true">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
