"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ResortMediaCategory } from "../../content/resortMedia";
import styles from "./MediaCategoryCard.module.css";

interface MediaCategoryCardProps {
  category: ResortMediaCategory;
  onSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "hero" | "standard" | "wide";
  /** Preload the first image (the card is above the fold). */
  preload?: boolean;
}

export function MediaCategoryCard({
  category,
  onSelect,
  variant = "standard",
  preload = false,
}: MediaCategoryCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (category.items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % category.items.length);
    }, 4000 + Math.random() * 2000); 
    return () => clearInterval(interval);
  }, [category.items.length]);

  return (
    <>
      <button 
        type="button" 
        className={`${styles["media-card"]} media-card ${styles[`variant-${variant}`]}`}
        onClick={onSelect}
        aria-label={`Open ${category.title} gallery (${category.countLabel})`}
      >
        <div className={styles["media-card-bg"]}>
          {category.items.map((item, index) => (
            <Image
              key={item.id}
              src={item.src}
              alt={item.alt}
              fill
              preload={preload && index === 0}
              sizes={
                variant === "hero" || variant === "wide"
                  ? "(max-width: 768px) 100vw, 1200px"
                  : "(max-width: 768px) 100vw, 600px"
              }
              className={`${styles["slideshow-image"]} ${index === activeIndex ? "active" : ""}`}
              style={{
                objectFit: "cover",
                opacity: index === activeIndex ? 1 : 0,
                zIndex: index === activeIndex ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div className={styles["media-card-overlay"]} />
        <div className={styles["media-card-content"]}>
          <div className={styles["media-card-header"]}>
            <span className={styles["media-card-badge"]}>{category.countLabel}</span>
          </div>
          <div className={styles["media-card-body"]}>
            <h3 className={styles["media-card-title"]}>{category.title}</h3>
            <p className={styles["media-card-subtitle"]}>{category.subtitle}</p>
            <div className={styles["media-card-action"]}>
              <span>EXPLORE</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
