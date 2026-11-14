"use client";

import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { AMENITIES_DATA, AmenityItem } from "../../content/amenitiesData";
import styles from "./ResortAmenitiesCarousel.module.css";

export function ResortAmenitiesCarousel() {
  // Split 12 items into 2 rows of 6 items each
  const row1 = AMENITIES_DATA.slice(0, 6);
  const row2 = AMENITIES_DATA.slice(6, 12);

  // Duplicate each row once for a seamless 50% translation loop
  const row1Loop = [...row1, ...row1];
  const row2Loop = [...row2, ...row2];

  return (
    <section className={styles["amenities-carousel-section"]} id="facilities">

      <div className="container">
        <Reveal>
          <div className={styles["amenities-header-row"]}>
            <div className={styles["amenities-header-content"]}>
              <span className={styles["amenities-header-eyebrow"]}>Tavaro Hospitality &amp; Facilities</span>
              <h2 className={styles["amenities-header-title"]}>Amenities &amp; Services</h2>
              <p className={styles["amenities-header-desc"]}>
                From morning movement and artisanal coffee to secluded poolside
                relaxation and seamless celebration support, every amenity is shaped
                for effortless comfort.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className={styles["marquee-wrapper"]} aria-label="Continuously moving resort amenities showcase">
        {/* ROW 1: Moves Left */}
        <div className={styles["marquee-row"]} tabIndex={0} aria-label="Amenities showcase row one">
          <div className={`${styles["marquee-track"]} ${styles["track-left"]}`}>
            {row1Loop.map((item, idx) => (
              <AmenityCard key={`row1-${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Moves Right */}
        <div className={styles["marquee-row"]} tabIndex={0} aria-label="Amenities showcase row two">
          <div className={`${styles["marquee-track"]} ${styles["track-right"]}`}>
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
      className={styles["amenity-marquee-card"]}
      role="group"
      aria-label={`${item.title} — ${item.eyebrow}`}
    >
      <div className={styles["amenity-card-image-wrap"]}>
        <Image
          src={item.heroImage}
          alt={item.heroAlt}
          fill
          sizes="(max-width: 768px) 280px, 360px" className="tw:object-cover"
        />
      </div>
      <div className={styles["amenity-card-scrim"]} />
      <div className={styles["amenity-card-content"]}>
        <span className={styles["amenity-card-eyebrow"]}>{item.eyebrow}</span>
        <div className={styles["amenity-card-title-row"]}>
          <span className={styles["amenity-card-title"]}>{item.title}</span>
          <span className={styles["amenity-card-indicator"]} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
