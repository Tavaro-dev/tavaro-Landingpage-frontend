"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ResortMediaCategory } from "../content/resortMedia";
import "./MediaCategoryCard.css";

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
        className={`media-card variant-${variant}`}
        onClick={onSelect}
        aria-label={`Open ${category.title} gallery (${category.countLabel})`}
      >
        <div className="media-card-bg">
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
              className={`slideshow-image ${index === activeIndex ? "active" : ""}`}
              style={{
                objectFit: "cover",
                opacity: index === activeIndex ? 1 : 0,
                zIndex: index === activeIndex ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div className="media-card-overlay" />
        <div className="media-card-content">
          <div className="media-card-header">
            <span className="media-card-badge">{category.countLabel}</span>
          </div>
          <div className="media-card-body">
            <h3 className="media-card-title">{category.title}</h3>
            <p className="media-card-subtitle">{category.subtitle}</p>
            <div className="media-card-action">
              <span>EXPLORE</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
