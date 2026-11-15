"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_PHOTOS, type GalleryPhoto } from "../../content/galleryPhotos";
import { GALLERY_COLLECTIONS, type GalleryCollection, type GalleryFilm } from "../../content/galleryCollections";
import { FilmLightbox, GalleryLightbox } from "./GalleryLightbox";
import { fullSrc, thumbSrc } from "./paths";
import styles from "./ResortGallery.module.css";

/** Photos each section shows before "Show all". */
const PREVIEW = 14;
/** Columns in the opening photo wall (CSS hides the outer ones on smaller screens). */
const WALL_COLUMNS = 5;
const WALL_PER_COLUMN = 8;

/** Deals lists out round-robin, so the first rows show the full range. */
function deal(lists: GalleryPhoto[][]) {
  const out: GalleryPhoto[] = [];
  const total = lists.reduce((n, l) => n + l.length, 0);
  for (let i = 0; out.length < total; i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
}

const SECTIONS = GALLERY_COLLECTIONS.map((c) => {
  const photos = GALLERY_PHOTOS.filter((p) => p.c === c.id);
  const byGroup = c.groups.map((g) => photos.filter((p) => p.l === g));
  return { ...c, photos: c.groups.length ? deal(byGroup) : photos, byGroup };
});
const FILMS = SECTIONS.flatMap((s) => s.films ?? []);

const WALL = (() => {
  const all = deal(SECTIONS.map((s) => s.photos));
  return Array.from({ length: WALL_COLUMNS }, (_, c) =>
    Array.from({ length: WALL_PER_COLUMN }, (_, r) => all[r * WALL_COLUMNS + c]),
  );
})();

/** Tile shape from the photo's orientation and its place in the list; dense grid packing fills the gaps. */
function shape(p: GalleryPhoto, i: number) {
  const ar = p.w / p.h;
  if (ar < 0.85) return styles.tall;
  if (ar > 1.2 && i % 9 === 0) return styles.big;
  if (ar > 1.2 && i % 4 === 2) return styles.wide;
  return "";
}

type Viewer = { photos: GalleryPhoto[]; index: number } | null;

export function ResortGallery() {
  const [viewer, setViewer] = useState<Viewer>(null);
  const [film, setFilm] = useState<GalleryFilm | null>(null);
  const [current, setCurrent] = useState(SECTIONS[0].id);
  const chips = useRef<HTMLUListElement>(null);

  // The bar follows the section in the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Keep the current occasion's chip in view on narrow screens.
  useEffect(() => {
    const list = chips.current;
    const chip = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (list && chip) list.scrollTo({ left: chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [current]);

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
            {GALLERY_PHOTOS.length} photographs and {FILMS.length} films of weddings, sangeets, offsites and long
            dinners in Kokapet, grouped by occasion so you can see what each one looks like here.
          </p>
          <div className={styles.cta}>
            <a href={`#${SECTIONS[0].id}`} className={styles.jump}>
              Browse by occasion
            </a>
            {FILMS[0] && (
              <button type="button" className={styles.watch} onClick={() => setFilm(FILMS[0])}>
                <PlayIcon />
                Watch the wedding film
              </button>
            )}
          </div>
        </div>
      </section>

      <nav className={styles.bar} aria-label="Occasions">
        <ul ref={chips} className={styles.chips}>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={styles.chip} aria-current={current === s.id ? "true" : undefined}>
                {s.title} <span>{s.photos.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {SECTIONS.map((s) => (
        <Chapter
          key={s.id}
          section={s}
          onPhoto={(photos, index) => setViewer({ photos, index })}
          onFilm={setFilm}
        />
      ))}

      <GalleryLightbox
        photos={viewer?.photos ?? []}
        index={viewer?.index ?? null}
        onIndex={(index) => setViewer((v) => v && { ...v, index })}
        onClose={() => setViewer(null)}
      />
      <FilmLightbox film={film} onClose={() => setFilm(null)} />
    </div>
  );
}

type Section = GalleryCollection & { photos: GalleryPhoto[]; byGroup: GalleryPhoto[][] };

/** One occasion: what it is, its groups, its films and a mosaic of its photos. */
function Chapter({
  section: s,
  onPhoto,
  onFilm,
}: {
  section: Section;
  onPhoto: (photos: GalleryPhoto[], index: number) => void;
  onFilm: (f: GalleryFilm) => void;
}) {
  const [group, setGroup] = useState("");
  const [all, setAll] = useState(false);
  const grid = useRef<HTMLUListElement>(null);
  const top = useRef<HTMLElement>(null);

  const photos = useMemo(() => (group ? s.photos.filter((p) => p.l === group) : s.photos), [s.photos, group]);
  const films = group ? [] : (s.films ?? []);
  const shown = all ? photos : photos.slice(0, PREVIEW);

  // Reveal each tile once as it scrolls into view; films play only while on screen.
  useEffect(() => {
    const list = grid.current;
    if (!list) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const video = e.target.querySelector("video");
          if (video) {
            if (e.isIntersecting && !still) video.play().catch(() => {});
            else video.pause();
          }
          if (e.isIntersecting) e.target.setAttribute("data-in", "");
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    list.querySelectorAll("li").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [photos, all]);

  const counts = `${s.photos.length} photos${s.films?.length ? ` and ${s.films.length} films` : ""}`;

  return (
    <section ref={top} id={s.id} className={styles.chapter} aria-labelledby={`${s.id}-title`}>
      <header className={styles.head}>
        <div>
          <h2 id={`${s.id}-title`} className={styles.h2}>
            {s.title}
          </h2>
          <p className={styles.blurb}>{s.blurb}</p>
        </div>
        <div className={styles.meta}>
          <span className={styles.count}>{counts}</span>
          {s.link && (
            <Link href={s.link.href} className={styles.more}>
              {s.link.label}
            </Link>
          )}
        </div>
      </header>

      {s.groups.length > 1 && (
        <div className={styles.groups} role="group" aria-label={`${s.title}: show`}>
          <button type="button" aria-pressed={!group} onClick={() => setGroup("")}>
            Everything
          </button>
          {s.groups.map((g, i) =>
            s.byGroup[i].length ? (
              <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}>
                {g} <span>{s.byGroup[i].length}</span>
              </button>
            ) : null,
          )}
        </div>
      )}

      {/* key: a new group remounts the grid so its tiles reveal afresh */}
      <ul ref={grid} key={group} className={styles.grid}>
        {films.map((f) => (
          <li
            key={f.src}
            className={`${styles.tile} ${f.h > f.w ? styles.tall : styles.big}`}
            style={{ "--k": "#000" } as CSSProperties}
          >
            <button type="button" onClick={() => onFilm(f)} aria-label={`Play film: ${f.title}`}>
              <video
                className={styles["tile-img"]}
                src={f.loop}
                poster={f.poster}
                muted
                loop
                playsInline
                preload="none"
              />
              <span className={styles.play} aria-hidden="true">
                <PlayIcon />
                Play film
              </span>
            </button>
          </li>
        ))}
        {shown.map((p, i) => {
          const cls = shape(p, i + films.length);
          const label = p.l || s.title;
          return (
            <li key={p.f} className={`${styles.tile} ${cls}`} style={{ "--k": p.k } as CSSProperties}>
              <button
                type="button"
                onClick={() => onPhoto(photos, i)}
                aria-label={`View photo ${i + 1} of ${photos.length}: ${label}`}
              >
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

      {photos.length > PREVIEW && (
        <div className={styles.foot}>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={all}
            onClick={() => {
              setAll(!all);
              if (all) top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {all ? "Show fewer" : `Show all ${photos.length} photos`}
          </button>
        </div>
      )}
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}
