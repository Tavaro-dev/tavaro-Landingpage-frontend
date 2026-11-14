"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { GALLERY_COLLECTIONS, GALLERY_PHOTOS, type GalleryPhoto } from "../../content/galleryPhotos";
import { GalleryLightbox } from "./GalleryLightbox";
import { collectionTitle, fullSrc, thumbSrc } from "./paths";
import styles from "./ResortGallery.module.css";

/** Tiles rendered per step; more mount as the visitor nears the end of the grid. */
const BATCH = 36;
/** Columns in the opening photo wall (CSS hides the outer ones on smaller screens). */
const WALL_COLUMNS = 5;
const WALL_PER_COLUMN = 8;

const COLLECTIONS = GALLERY_COLLECTIONS.map((c) => {
  const photos = GALLERY_PHOTOS.filter((p) => p.c === c.id);
  return { ...c, count: photos.length, locations: [...new Set(photos.map((p) => p.l).filter(Boolean))] };
});

// "All" deals the collections out round-robin, so the first rows show the full range.
const ALL: GalleryPhoto[] = (() => {
  const lists = COLLECTIONS.map((c) => GALLERY_PHOTOS.filter((p) => p.c === c.id));
  const out: GalleryPhoto[] = [];
  for (let i = 0; out.length < GALLERY_PHOTOS.length; i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
})();

const WALL = Array.from({ length: WALL_COLUMNS }, (_, c) =>
  Array.from({ length: WALL_PER_COLUMN }, (_, r) => ALL[r * WALL_COLUMNS + c]),
);

/** Tile shape from the photo's orientation and its place in the list; dense grid packing fills the gaps. */
function shape(p: GalleryPhoto, i: number) {
  const ar = p.w / p.h;
  if (ar < 0.85) return styles.tall;
  if (ar > 1.2 && i % 9 === 0) return styles.big;
  if (ar > 1.2 && i % 4 === 2) return styles.wide;
  return "";
}

export function ResortGallery() {
  const [collection, setCollection] = useState("all");
  const [location, setLocation] = useState("");
  const [shown, setShown] = useState(BATCH);
  const [open, setOpen] = useState<number | null>(null);
  const gridTop = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const active = COLLECTIONS.find((c) => c.id === collection);
  const photos = useMemo(
    () =>
      collection === "all"
        ? ALL
        : GALLERY_PHOTOS.filter((p) => p.c === collection && (!location || p.l === location)),
    [collection, location],
  );

  // Mount the next batch when the end of the grid comes within ~1.5 screens.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= photos.length) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown((s) => s + BATCH), {
      rootMargin: "1200px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, photos.length]);

  // Reveal each tile once as it scrolls into view.
  useEffect(() => {
    const tiles = grid.current?.querySelectorAll("li:not([data-in])");
    if (!tiles?.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [photos, shown]);

  const choose = (c: string, l = "") => {
    setCollection(c);
    setLocation(l);
    setShown(BATCH);
    const top = gridTop.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.page}>
      <section className={styles.wall} aria-labelledby="gallery-title">
        <div className={styles.columns} aria-hidden="true">
          {WALL.map((col, c) => (
            <div key={c} className={styles.column} style={{ "--speed": `${70 + c * 9}s` } as CSSProperties}>
              {/* Each column is listed twice so its loop has no seam. */}
              {[0, 1].map((copy) => (
                <div key={copy} className={styles.set}>
                  {col.map((p) => (
                    <div key={p.f} className={styles.brick} style={{ "--ar": p.w / p.h, "--k": p.k } as CSSProperties}>
                      <Image src={thumbSrc(p)} alt="" fill unoptimized loading="lazy" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.caption}>
          <h1 id="gallery-title" className={styles.title}>
            Celebrations at Tavaro
          </h1>
          <p className={styles.lede}>
            {GALLERY_PHOTOS.length} photographs of weddings, sangeets, offsites and long dinners on our lawns
            and halls in Kokapet.
          </p>
          <a href="#photos" className={styles.jump}>
            Browse the photos
          </a>
        </div>
      </section>

      <section className={styles.browser} aria-label="Photo gallery">
        <div ref={gridTop} className={styles.anchor} id="photos" />
        <div className={styles.bar}>
          <div className={styles.chips} role="group" aria-label="Collections">
            <button type="button" className={styles.chip} aria-pressed={collection === "all"} onClick={() => choose("all")}>
              All <span>{GALLERY_PHOTOS.length}</span>
            </button>
            {COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.chip}
                aria-pressed={collection === c.id}
                onClick={() => choose(c.id)}
              >
                {c.title} <span>{c.count}</span>
              </button>
            ))}
          </div>
          {active && active.locations.length > 1 && (
            <div className={styles.subchips} role="group" aria-label={`${active.title} locations`}>
              <button type="button" aria-pressed={!location} onClick={() => choose(active.id)}>
                Everything
              </button>
              {active.locations.map((l) => (
                <button key={l} type="button" aria-pressed={location === l} onClick={() => choose(active.id, l)}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* key: a new filter remounts the grid so its tiles reveal afresh */}
        <ul ref={grid} key={`${collection}/${location}`} className={styles.grid}>
          {photos.slice(0, shown).map((p, i) => {
            const label = p.l || collectionTitle(p.c);
            const cls = shape(p, i);
            return (
              <li key={p.f} className={`${styles.tile} ${cls}`} style={{ "--k": p.k } as CSSProperties}>
                <button type="button" onClick={() => setOpen(i)} aria-label={`View photo ${i + 1} of ${photos.length}: ${label}`}>
                  <Image
                    src={cls === styles.big ? fullSrc(p) : thumbSrc(p)}
                    alt=""
                    fill
                    unoptimized
                    className={styles["tile-img"]}
                  />
                  <span className={styles["tile-caption"]} aria-hidden="true">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div ref={sentinel} />
        <p className={styles.status} aria-live="polite">
          Showing {Math.min(shown, photos.length)} of {photos.length} photos
        </p>
      </section>

      <GalleryLightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
