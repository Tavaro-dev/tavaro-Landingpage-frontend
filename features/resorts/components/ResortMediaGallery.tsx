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
          padding: ${isStandalone ? "clamp(180px, 22vh, 260px) 0 clamp(80px, 10vh, 140px) 0" : "clamp(80px, 12vh, 140px) 0"};
          background: var(--surface);
          ${isStandalone ? "" : "border-top: 1px solid var(--surface-line);"}
        }
        .resort-media-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(40px, 6vh, 64px);
        }
        .resort-media-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(16px, 2.5vw, 32px);
          max-width: 1200px;
          margin: 0 auto;
        }
        .resort-media-grid-item.full-width {
          grid-column: 1 / -1;
        }
        @media (max-width: 768px) {
          .resort-media-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .resort-media-grid-item.full-width {
            grid-column: 1;
          }
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
            {/* 1. RESORT OVERVIEW — Hero Visual Anchor */}
            {overview && (
              <Reveal className="resort-media-grid-item full-width">
                <MediaCategoryCard
                  category={overview}
                  variant="hero"
                  priority
                  onSelect={() => handleSelectCategory(overview)}
                />
              </Reveal>
            )}

            {/* 2. EVENTS */}
            {events && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={events}
                  variant="standard"
                  onSelect={() => handleSelectCategory(events)}
                />
              </Reveal>
            )}

            {/* 3. DINING */}
            {dining && (
              <Reveal className="resort-media-grid-item">
                <MediaCategoryCard
                  category={dining}
                  variant="standard"
                  onSelect={() => handleSelectCategory(dining)}
                />
              </Reveal>
            )}

            {/* 4. ACCOMMODATION — Full-width Lower Card */}
            {accommodation && (
              <Reveal className="resort-media-grid-item full-width">
                <MediaCategoryCard
                  category={accommodation}
                  variant="wide"
                  onSelect={() => handleSelectCategory(accommodation)}
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
