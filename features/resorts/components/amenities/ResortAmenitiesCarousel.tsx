"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { AMENITIES_DATA, AmenityItem } from "../../content/amenitiesData";
import styles from "./ResortAmenitiesCarousel.module.css";

// Split 12 items into 2 rows of 6 items each
const ROWS = [AMENITIES_DATA.slice(0, 6), AMENITIES_DATA.slice(6, 12)];

export function ResortAmenitiesCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Once near the screen, load every card image eagerly: cards slide in by transform,
  // which Safari's lazy loading does not count as entering the viewport (cards stayed blank).
  const [near, setNear] = useState(false);

  // Only animate while on screen (saves CPU/battery, especially on phones).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

      <div ref={wrapRef} className={styles["marquee-wrapper"]} data-paused={!inView || undefined}>
        {ROWS.map((row, r) => (
          <div className={styles["marquee-row"]} key={r}>
            {/* Row 1 moves left, row 2 right. The list is rendered twice for a seamless
                -50% loop; the copy is hidden from assistive tech. */}
            <div className={`${styles["marquee-track"]} ${styles[r === 0 ? "track-left" : "track-right"]}`}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={styles["marquee-set"]} aria-hidden={copy === 1 || undefined}>
                  {row.map((item) => (
                    <AmenityCard key={item.slug} item={item} eager={near} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AmenityCard({ item, eager }: { item: AmenityItem; eager: boolean }) {
  return (
    <li className={styles["amenity-marquee-card"]}>
      <div className={styles["amenity-card-image-wrap"]}>
        <Image
          src={item.heroImage}
          alt={item.title}
          fill
          sizes="(max-width: 600px) 200px, (max-width: 1024px) 240px, 280px"
          loading={eager ? "eager" : "lazy"}
          className="tw:object-cover"
        />
      </div>
      <div className={styles["amenity-card-scrim"]} />
      <div className={styles["amenity-card-content"]}>
        <span className={styles["amenity-card-eyebrow"]}>{item.eyebrow}</span>
        <div className={styles["amenity-card-title-row"]}>
          <h3 className={styles["amenity-card-title"]}>{item.title}</h3>
          <span className={styles["amenity-card-indicator"]} aria-hidden="true" />
        </div>
        <p className={styles["amenity-card-summary"]}>{item.summary}</p>
      </div>
    </li>
  );
}
