"use client";

import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { AMENITIES_DATA, AmenityItem } from "../content/amenitiesData";

export function ResortAmenitiesCarousel() {
  // Split 12 items into 2 rows of 6 items each
  const row1 = AMENITIES_DATA.slice(0, 6);
  const row2 = AMENITIES_DATA.slice(6, 12);

  // Duplicate each row once for a seamless 50% translation loop
  const row1Loop = [...row1, ...row1];
  const row2Loop = [...row2, ...row2];

  return (
    <section className="amenities-carousel-section" id="facilities">
      <style>{`
        .amenities-carousel-section {
          position: relative;
          background: var(--surface);
          color: var(--on-surface);
          padding: clamp(72px, 8vw, 120px) 0 clamp(64px, 7vw, 104px);
          overflow: hidden;
          border-top: 1px solid var(--border-subtle);
          transition: background 0.3s ease, color 0.3s ease;
        }

        [data-theme="light"] .amenities-carousel-section {
          border-top-color: rgba(0, 0, 0, 0.08);
        }

        .amenities-header-row {
          margin-bottom: clamp(36px, 5vw, 60px);
        }

        .amenities-header-content {
          max-width: 720px;
        }

        .amenities-header-eyebrow {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
          display: inline-block;
        }

        [data-theme="light"] .amenities-header-eyebrow {
          color: var(--gold-dark, #9c7c3e);
        }

        .amenities-header-title {
          font-family: var(--font-display, "Playfair Display", Georgia, serif);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--on-surface);
          margin: 0;
        }

        .amenities-header-desc {
          margin-top: 16px;
          font-size: clamp(15px, 1.2vw, 17px);
          line-height: 1.6;
          color: var(--on-surface-muted);
        }

        /* MARQUEE TRACKS */
        .marquee-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: clamp(18px, 2.5vw, 28px);
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
        }

        .marquee-row {
          width: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
        }

        .marquee-track {
          display: flex;
          gap: clamp(16px, 2vw, 24px);
          width: max-content;
          will-change: transform;
        }

        .track-left {
          animation: marqueeScrollLeft 38s linear infinite;
        }

        .track-right {
          animation: marqueeScrollRight 38s linear infinite;
        }

        /* Pause on hover or focus within */
        .marquee-row:hover .marquee-track,
        .marquee-row:focus-within .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marqueeScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes marqueeScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        /* AMENITY CARD */
        .amenity-marquee-card {
          position: relative;
          flex: 0 0 clamp(280px, 25vw, 360px);
          height: clamp(210px, 18vw, 250px);
          border-radius: 6px;
          overflow: hidden;
          background: #141715;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: block;
          outline-offset: 4px;
          cursor: default;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease,
                      box-shadow 0.4s ease;
        }

        [data-theme="light"] .amenity-marquee-card {
          background: #ffffff;
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .amenity-marquee-card:hover {
          transform: translateY(-4px);
          border-color: var(--gold);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(201, 164, 90, 0.2);
        }

        [data-theme="light"] .amenity-marquee-card:hover {
          border-color: var(--gold-dark, #9c7c3e);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12), 0 0 16px rgba(156, 124, 62, 0.18);
        }

        .amenity-card-image-wrap {
          position: absolute;
          inset: 0;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .amenity-marquee-card:hover .amenity-card-image-wrap {
          transform: scale(1.06);
        }

        .amenity-card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(13, 15, 14, 0.1) 0%,
            rgba(13, 15, 14, 0.4) 45%,
            rgba(13, 15, 14, 0.94) 100%
          );
          z-index: 2;
          transition: background 0.3s ease;
        }

        .amenity-marquee-card:hover .amenity-card-scrim {
          background: linear-gradient(
            180deg,
            rgba(13, 15, 14, 0.05) 0%,
            rgba(13, 15, 14, 0.3) 40%,
            rgba(13, 15, 14, 0.97) 100%
          );
        }

        .amenity-card-content {
          position: absolute;
          inset: 0;
          z-index: 3;
          padding: clamp(16px, 1.8vw, 24px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .amenity-card-eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold-light, #e6cf9e);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .amenity-card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .amenity-card-title {
          font-family: var(--font-display, "Playfair Display", Georgia, serif);
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 400;
          color: #f7f4ee !important;
          line-height: 1.25;
        }

        .amenity-card-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.75;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .amenity-marquee-card:hover .amenity-card-indicator {
          opacity: 1;
          transform: scale(1.3);
          box-shadow: 0 0 10px var(--gold);
        }

        /* ACCESSIBILITY: PREFERS-REDUCED-MOTION */
        @media (prefers-reduced-motion: reduce) {
          .track-left,
          .track-right {
            animation: none !important;
          }
          .marquee-row {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 12px;
          }
          .amenity-marquee-card {
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div className="container">
        <Reveal>
          <div className="amenities-header-row">
            <div className="amenities-header-content">
              <span className="amenities-header-eyebrow">Tavaro Hospitality &amp; Facilities</span>
              <h2 className="amenities-header-title">Amenities &amp; Services</h2>
              <p className="amenities-header-desc">
                From morning movement and artisanal coffee to secluded poolside
                relaxation and seamless celebration support, every amenity is shaped
                for effortless comfort.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="marquee-wrapper" aria-label="Continuously moving resort amenities showcase">
        {/* ROW 1: Moves Left */}
        <div className="marquee-row" tabIndex={0} aria-label="Amenities showcase row one">
          <div className="marquee-track track-left">
            {row1Loop.map((item, idx) => (
              <AmenityCard key={`row1-${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Moves Right */}
        <div className="marquee-row" tabIndex={0} aria-label="Amenities showcase row two">
          <div className="marquee-track track-right">
            {row2Loop.map((item, idx) => (
              <AmenityCard key={`row2-${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AmenityCard({ item }: { item: AmenityItem }) {
  return (
    <div
      className="amenity-marquee-card"
      role="group"
      aria-label={`${item.title} — ${item.eyebrow}`}
    >
      <div className="amenity-card-image-wrap">
        <Image
          src={item.heroImage}
          alt={item.heroAlt}
          fill
          sizes="(max-width: 768px) 280px, 360px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="amenity-card-scrim" />
      <div className="amenity-card-content">
        <span className="amenity-card-eyebrow">{item.eyebrow}</span>
        <div className="amenity-card-title-row">
          <span className="amenity-card-title">{item.title}</span>
          <span className="amenity-card-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
