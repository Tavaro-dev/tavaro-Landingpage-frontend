"use client";

import { useState, useRef } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { RESORT_MEDIA_CATEGORIES, ResortMediaCategory } from "../content/resortMedia";
import { MediaCategoryCard } from "./MediaCategoryCard";
import { MediaViewer } from "./MediaViewer";

interface ResortMediaGalleryProps {
  isStandalone?: boolean;
}

export function ResortMediaGallery({ isStandalone = false }: ResortMediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResortMediaCategory | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const overview = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "overview");
  const events = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "events");
  const dining = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "dining");
  const accommodation = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "accommodation");

  const handleSelectCategory = (
    category: ResortMediaCategory | undefined,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!category) return;
    if (e) {
      activeTriggerRef.current = e.currentTarget;
    }
    setSelectedCategory(category);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .resort-media-section {
          padding: ${isStandalone ? "clamp(120px, 20vh, 260px) 0 clamp(60px, 10vh, 140px) 0" : "clamp(60px, 10vh, 140px) 0"};
          background: var(--surface);
          ${isStandalone ? "" : "border-top: 1px solid var(--surface-line);"}
        }
        .resort-media-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(32px, 5vh, 64px);
        }
        
        /* Desktop Asymmetric Grid (> 1024px) */
        .resort-media-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto auto;
          gap: clamp(16px, 2vw, 24px);
          max-width: 1360px;
          margin: 0 auto;
        }
        .resort-media-grid-item:nth-child(1) { grid-column: 1 / span 2; grid-row: 1 / span 2; }
        .resort-media-grid-item:nth-child(2) { grid-column: 3; grid-row: 1; }
        .resort-media-grid-item:nth-child(3) { grid-column: 3; grid-row: 2; }
        .resort-media-grid-item:nth-child(4) { grid-column: 1 / span 3; grid-row: 3; }
        
        /* Tablet & Mobile Grid (< 1024px) */
        @media (max-width: 1024px) {
          .resort-media-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .resort-media-grid-item:nth-child(1) { grid-column: 1 / span 2; grid-row: auto; }
          .resort-media-grid-item:nth-child(2) { grid-column: 1; grid-row: auto; }
          .resort-media-grid-item:nth-child(3) { grid-column: 2; grid-row: auto; }
          .resort-media-grid-item:nth-child(4) { grid-column: 1 / span 2; grid-row: auto; }
        }
      `}} />
      <section className="section resort-media-section" id="gallery">
        <div className="container">
          <Reveal className="resort-media-header">
            <span className="eyebrow center">PHOTOS & VIDEOS</span>
            <h2 className="display-2" style={{ marginTop: 12, marginBottom: 16 }}>
              A visual glimpse of Tavaro
            </h2>
            <p className="lede" style={{ color: "var(--muted-on-light)" }}>
              Explore the expansive grounds, grand celebration venues, bespoke dining experiences and peaceful accommodation retreats.
            </p>
          </Reveal>

          <div className="resort-media-grid">
            {overview && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={overview}
                  variant="hero"
                  priority
                  onSelect={(e) => handleSelectCategory(overview, e)}
                />
              </Reveal>
            )}

            {events && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={events}
                  variant="standard"
                  onSelect={(e) => handleSelectCategory(events, e)}
                />
              </Reveal>
            )}

            {dining && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={dining}
                  variant="standard"
                  onSelect={(e) => handleSelectCategory(dining, e)}
                />
              </Reveal>
            )}

            {accommodation && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={accommodation}
                  variant="wide"
                  onSelect={(e) => handleSelectCategory(accommodation, e)}
                />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Accessible Media Lightbox Viewer Modal */}
      <MediaViewer
        key={selectedCategory?.id || "none"}
        isOpen={!!selectedCategory}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        triggerRef={activeTriggerRef}
      />
    </>
  );
}
