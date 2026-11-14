"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ResortMediaCategory } from "../../content/resortMedia";
import styles from "./MediaViewer.module.css";

interface MediaViewerProps {
  isOpen: boolean;
  category: ResortMediaCategory | null;
  onClose: () => void;
}

export function MediaViewer({ isOpen, category, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Arrow keys step through photos (Escape is handled by the dialog).
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  if (!category || !currentItem) return null;

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="media-viewer-title" bare>
      <div className={styles["media-viewer-backdrop"]}>
        <header className={styles["media-viewer-header"]}>
          <div className={styles["media-viewer-title-group"]}>
            <h2 id="media-viewer-title" className={styles["media-viewer-title"]}>
              {category.title}
            </h2>
            {totalCount > 1 && (
              <span className={styles["media-viewer-count"]}>
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
            )}
          </div>
          <button
            type="button"
            className={styles["media-viewer-close-btn"]}
            onClick={onClose}
            aria-label="Close photo gallery"
          >
            <Icon name="x" />
          </button>
        </header>

        <div className={styles["media-viewer-body"]}>
          {totalCount > 1 && (
            <button
              type="button"
              className={`${styles["media-viewer-nav-btn"]} prev`}
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          <div className={styles["media-viewer-image-container"]}>
            <Image
              src={currentItem.src}
              alt={currentItem.alt}
              fill
              loading="eager"
              sizes="(max-width: 1280px) 100vw, 1200px" className="tw:object-contain"
            />
          </div>

          {totalCount > 1 && (
            <button
              type="button"
              className={`${styles["media-viewer-nav-btn"]} next`}
              onClick={handleNext}
              aria-label="Next photo"
            >
              →
            </button>
          )}
        </div>

        {currentItem.caption && (
          <footer className={styles["media-viewer-footer"]}>
            <p className="tw:m-[0]">{currentItem.caption}</p>
          </footer>
        )}
      </div>
    </Modal>
  );
}
