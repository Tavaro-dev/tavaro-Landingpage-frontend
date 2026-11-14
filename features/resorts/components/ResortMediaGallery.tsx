"use client";

import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { RESORT_MEDIA_CATEGORIES, ResortMediaCategory } from "../content/resortMedia";
import { MediaCategoryCard } from "./MediaCategoryCard";
import { MediaViewer } from "./MediaViewer";
import styles from "./ResortMediaGallery.module.css";

interface ResortMediaGalleryProps {
  isStandalone?: boolean;
}

export function ResortMediaGallery({ isStandalone = false }: ResortMediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResortMediaCategory | null>(null);

  const overview = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "overview");
  const events = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "events");
  const dining = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "dining");
  const accommodation = RESORT_MEDIA_CATEGORIES.find((c) => c.id === "accommodation");

  const handleSelectCategory = (category: ResortMediaCategory | undefined) => {
    if (category) setSelectedCategory(category);
  };

  return (
    <>
      <section className={`section ${styles["resort-media-section"]}${isStandalone ? ` ${styles.standalone}` : ""}`} id="gallery">
        <div className="container">
          <Reveal className={styles["resort-media-header"]}>
            <span className="eyebrow center">PHOTOS & VIDEOS</span>
            <h2 className="display-2 tw:mt-[12px] tw:mb-[16px]">
              A visual glimpse of Tavaro
            </h2>
            <p className="lede tw:text-(color:--muted-on-light)">
              Explore the expansive grounds, grand celebration venues, bespoke dining experiences and peaceful accommodation retreats.
            </p>
          </Reveal>

          <div className={styles["resort-media-grid"]}>
            {overview && (
              <Reveal className={styles["resort-media-grid-item"]}>
                <MediaCategoryCard
                  category={overview}
                  variant="hero"
                  preload
                  onSelect={() => handleSelectCategory(overview)}
                />
              </Reveal>
            )}

            {events && (
              <Reveal className={styles["resort-media-grid-item"]}>
                <MediaCategoryCard
                  category={events}
                  variant="standard"
                  onSelect={() => handleSelectCategory(events)}
                />
              </Reveal>
            )}

            {dining && (
              <Reveal className={styles["resort-media-grid-item"]}>
                <MediaCategoryCard
                  category={dining}
                  variant="standard"
                  onSelect={() => handleSelectCategory(dining)}
                />
              </Reveal>
            )}

            {accommodation && (
              <Reveal className={styles["resort-media-grid-item"]}>
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
      />
    </>
  );
}
