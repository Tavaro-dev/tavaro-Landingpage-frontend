"use client";

import { Icon } from "@/components/ui/Icon";

export function GalleryHeroButton() {
  return (
    <a
      href="#gallery"
      className="hero-gallery-square-btn"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span className="hero-quick-icon">
        <Icon name="photos" />
      </span>
      <span className="hero-quick-label">GALLERY</span>
    </a>
  );
}
