"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { ResortMediaCategory } from "../content/resortMedia";

interface MediaViewerProps {
  isOpen: boolean;
  category: ResortMediaCategory | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const emptySubscribe = () => () => {};

export function MediaViewer({ isOpen, category, onClose, triggerRef }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const items = category?.items ?? [];
  const currentItem = items[currentIndex];
  const totalCount = items.length;

  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Lock body scroll and focus close button on open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button
    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timeout);
    };
  }, [isOpen]);

  // Handle keyboard events (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, triggerRef]);

  const handleClose = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  if (!isClient || !isOpen || !category || !currentItem) return null;

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .media-viewer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(10, 9, 8, 0.94);
          backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .media-viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px clamp(20px, 4vw, 40px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--cream);
          z-index: 10;
        }
        .media-viewer-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .media-viewer-title {
          font-family: var(--font-display);
          font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 0;
          color: #ffffff;
        }
        .media-viewer-count {
          font-family: var(--font-sans);
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--gold);
          font-weight: 600;
        }
        .media-viewer-close-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--cream);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        .media-viewer-close-btn:hover,
        .media-viewer-close-btn:focus-visible {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--black);
        }
        .media-viewer-body {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px clamp(20px, 4vw, 40px);
          overflow: hidden;
        }
        .media-viewer-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 1200px;
          max-height: 75vh;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        .media-viewer-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(10, 9, 8, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--cream);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s var(--ease);
          outline: none;
        }
        .media-viewer-nav-btn:hover,
        .media-viewer-nav-btn:focus-visible {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--black);
        }
        .media-viewer-nav-btn.prev {
          left: clamp(10px, 3vw, 30px);
        }
        .media-viewer-nav-btn.next {
          right: clamp(10px, 3vw, 30px);
        }
        .media-viewer-footer {
          padding: 16px clamp(20px, 4vw, 40px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: rgba(255, 255, 255, 0.75);
          font-family: var(--font-sans);
          font-size: 13px;
          letter-spacing: 0.03em;
        }
      `}} />
      <div
        className="media-viewer-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-viewer-title"
      >
        <header className="media-viewer-header">
          <div className="media-viewer-title-group">
            <h2 id="media-viewer-title" className="media-viewer-title">
              {category.title}
            </h2>
            {totalCount > 1 && (
              <span className="media-viewer-count">
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
            )}
          </div>
          <button
            type="button"
            ref={closeBtnRef}
            className="media-viewer-close-btn"
            onClick={handleClose}
            aria-label="Close photo gallery"
          >
            <Icon name="x" />
          </button>
        </header>

        <div className="media-viewer-body">
          {totalCount > 1 && (
            <button
              type="button"
              className="media-viewer-nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          <div className="media-viewer-image-container">
            <Image
              src={currentItem.src}
              alt={currentItem.alt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              style={{ objectFit: "contain" }}
            />
          </div>

          {totalCount > 1 && (
            <button
              type="button"
              className="media-viewer-nav-btn next"
              onClick={handleNext}
              aria-label="Next photo"
            >
              →
            </button>
          )}
        </div>

        {currentItem.caption && (
          <footer className="media-viewer-footer">
            <p style={{ margin: 0 }}>{currentItem.caption}</p>
          </footer>
        )}
      </div>
    </>,
    document.body
  );
}
