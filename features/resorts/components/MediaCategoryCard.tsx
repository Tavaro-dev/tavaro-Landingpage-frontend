"use client";

import Image from "next/image";
import { ResortMediaCategory } from "../content/resortMedia";

interface MediaCategoryCardProps {
  category: ResortMediaCategory;
  onSelect: () => void;
  variant?: "hero" | "standard" | "wide";
  priority?: boolean;
}

export function MediaCategoryCard({
  category,
  onSelect,
  variant = "standard",
  priority = false,
}: MediaCategoryCardProps) {
  const getAspectRatio = () => {
    switch (variant) {
      case "hero":
        return "clamp(320px, 45vh, 520px)";
      case "wide":
        return "clamp(280px, 35vh, 420px)";
      case "standard":
      default:
        return "clamp(260px, 32vh, 380px)";
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .media-card {
          position: relative;
          width: 100%;
          border: 1px solid var(--surface-line);
          border-radius: 4px;
          overflow: hidden;
          background: var(--panel);
          cursor: pointer;
          text-align: left;
          display: block;
          padding: 0;
          outline: none;
          transition: border-color 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .media-card:focus-visible {
          box-shadow: 0 0 0 3px var(--gold);
          border-color: var(--gold);
        }
        .media-card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .media-card:hover .media-card-bg,
        .media-card:focus .media-card-bg {
          transform: scale(1.04);
        }
        .media-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10, 9, 8, 0.82) 0%,
            rgba(10, 9, 8, 0.35) 45%,
            rgba(10, 9, 8, 0.15) 100%
          );
          transition: background 0.4s var(--ease);
        }
        .media-card:hover .media-card-overlay,
        .media-card:focus .media-card-overlay {
          background: linear-gradient(
            to top,
            rgba(10, 9, 8, 0.92) 0%,
            rgba(10, 9, 8, 0.5) 50%,
            rgba(10, 9, 8, 0.25) 100%
          );
        }
        .media-card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          padding: clamp(20px, 3vw, 36px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--cream);
        }
        .media-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .media-card-badge {
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          background: rgba(10, 9, 8, 0.55);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--cream);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .media-card-body {
          margin-top: auto;
        }
        .media-card-title {
          font-family: var(--font-display);
          font-size: ${variant === "hero" ? "clamp(26px, 3.2vw, 42px)" : "clamp(20px, 2.2vw, 30px)"};
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0 0 6px 0;
          color: #ffffff;
          line-height: 1.1;
        }
        .media-card-subtitle {
          font-family: var(--font-sans);
          font-size: clamp(12px, 1.2vw, 14px);
          color: rgba(255, 255, 255, 0.78);
          margin: 0;
          font-weight: 400;
        }
        .media-card-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.9;
          transform: translateX(0);
          transition: all 0.3s var(--ease);
        }
        .media-card:hover .media-card-action,
        .media-card:focus .media-card-action {
          opacity: 1;
          transform: translateX(4px);
          color: #ffffff;
        }
      `}} />
      <button
        type="button"
        className="media-card"
        style={{ height: getAspectRatio() }}
        onClick={onSelect}
        aria-label={`Open ${category.title} gallery (${category.countLabel})`}
      >
        <div className="media-card-bg">
          <Image
            src={category.featuredMedia.src}
            alt={category.featuredMedia.alt}
            fill
            priority={priority}
            sizes={
              variant === "hero" || variant === "wide"
                ? "(max-width: 768px) 100vw, 1200px"
                : "(max-width: 768px) 100vw, 600px"
            }
            style={{ objectFit: "cover" }}
          />
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
