"use client";

import { Fragment, memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { GALLERY_PHOTOS, type GalleryPhoto } from "../../content/galleryPhotos";
import { GALLERY_COLLECTIONS, GALLERY_FILMS, collectionTitle, type GalleryFilm } from "../../content/galleryCollections";
import { GalleryLightbox } from "./GalleryLightbox";
import { fullSrc, lite, slowNet, thumbSrc } from "./paths";
import styles from "./ResortGallery.module.css";

/** Seconds each photo holds in the large arch. */
const HOLD = 4.5;
/** Seconds the soundtrack takes to fade between films. */
const FADE = 1.2;
/** Photos in the moving columns beside each film. */
const REEL = 30;

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const SECTIONS = GALLERY_COLLECTIONS.map((c) => {
  const photos = GALLERY_PHOTOS.filter((p) => p.c === c.id);
  // An occasion without sub-sections is one set, whose plaque carries the occasion's line.
  const subs = (c.subs.length ? c.subs : [{ name: "", note: c.line }]).map((s) => {
    const own = s.name ? photos.filter((p) => p.l === s.name) : photos;
    if (own.length < 5) throw new Error(`Too few photos for ${c.id} / ${s.name}`);
    // The large arch plays the first photo, then those the three small arches don't show.
    return { ...s, id: `${c.id}-${slug(s.name || "all")}`, photos: own, cycle: [own[0], ...own.slice(4, 14)] };
  });
  return { ...c, subs };
});
type Section = (typeof SECTIONS)[number];
type Sub = Section["subs"][number];
type OnPhoto = (photos: GalleryPhoto[], index: number) => void;
type AlbumOf = { section: Section; sub: Sub } | null;

/**
 * The page in two chapters. Each opens with a stage: one of the client's films, which is also the
 * chapter's soundtrack, beside columns of the chapter's photos drifting past.
 */
const CHAPTERS = GALLERY_FILMS.map((film) => {
  const sections = SECTIONS.filter((s) => s.theme === film.theme);
  // Deal photos from every sub-section in turn, so the columns show the whole chapter.
  const subs = sections.flatMap((s) => s.subs.map((x) => x.photos.slice(4)));
  const reel: GalleryPhoto[] = [];
  for (let i = 0; reel.length < REEL && subs.some((x) => x[i]); i++) subs.forEach((x) => x[i] && reel.push(x[i]));
  return { film, sections, reel: reel.slice(0, REEL) };
});

/** Reduced motion, or a phone or connection too slow for motion: nothing moves or plays on its own. */
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || lite();

/**
 * The large arch's photo, through Next's optimizer (AVIF or WebP at the width the screen needs). The arch is
 * tall and narrow, so a photo covering it is as wide as the arch's height times its own ratio: these sizes
 * follow the arch's height per breakpoint (290px phones, about 48vw tablets, 31vw desktops).
 */
const archSizes = (p: GalleryPhoto) => {
  const r = Math.max(p.w / p.h, 0.75);
  // ponytail: phones under-report by 1.6x, capping sharpness near 1.7x density to save data; drop the divisor if arches look soft.
  return `(max-width: 600px) ${Math.round((290 * r) / 1.6)}px, (max-width: 1024px) ${(48 * r).toFixed(1)}vw, ${(31 * r).toFixed(1)}vw`;
};
const archImage = (p: GalleryPhoto) => ({ src: fullSrc(p), alt: "", fill: true, sizes: archSizes(p) }) as const;

/*
 * Every other photo goes through the optimizer from its 480px-tall thumb (it never enlarges past that), with
 * sizes measured from the page: strip tiles are 72px tall on phones, 104px on tablets and 170px wide columns on
 * desktops; covers are full width on phones and tablets, 446px tall beside the arches on desktops.
 */
const stripSizes = (p: GalleryPhoto) => {
  const r = p.w / p.h;
  return `(max-width: 600px) ${Math.round(72 * r)}px, (max-width: 1024px) ${Math.round(104 * r)}px, ${Math.round(Math.max(170, 170 * r))}px`;
};
const coverSizes = (p: GalleryPhoto) =>
  `(max-width: 600px) 100vw, (max-width: 1024px) 90vw, ${Math.round(Math.max(290, (446 * p.w) / p.h))}px`;

/** Whether the element is on screen now, and whether it has ever been (for one-time reveals). */
function useInView<T extends Element>(rootMargin = "0px 0px -4% 0px") {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ now: false, seen: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setState((s) => ({ now: e.isIntersecting, seen: s.seen || e.isIntersecting })),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, state.now, state.seen] as const;
}

type Viewer = { photos: GalleryPhoto[]; index: number } | null;

export function ResortGallery() {
  const [viewer, setViewer] = useState<Viewer>(null);
  const [album, setAlbum] = useState<AlbumOf>(null);
  const [current, setCurrent] = useState(SECTIONS[0].id);
  /** On by default on this page; the visitor can turn it off. */
  const [sound, setSound] = useState(true);
  /** Browsers allow sound only after the visitor has tapped, clicked or pressed a key on the page. */
  const [unlocked, setUnlocked] = useState(false);
  const unlockedAt = useRef(0);
  /** The chapter across the middle of the screen, whose film is the soundtrack. */
  const [zone, setZone] = useState(0);
  const audible = sound && unlocked ? zone : null;
  const [menu, setMenu] = useState(false);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  /** A film stage fills the middle of the screen: the occasion bar steps aside for it. */
  const [onStage, setOnStage] = useState(true);
  /** The welcome that asks about sound before the gallery opens; it parts like a curtain when answered. */
  const [intro, setIntro] = useState<"open" | "leaving" | null>("open");
  /** Set once React has taken over: until then the welcome's buttons and the scroll reveals stay out of the way. */
  const [ready, setReady] = useState<"" | "lite" | null>(null);
  const page = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLUListElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once after hydration, by design
  useEffect(() => setReady(lite() ? "lite" : ""), []);

  // The bar follows the room on screen, and the soundtrack follows the chapter.
  useEffect(() => {
    const rooms = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) rooms.observe(el);
    });
    const zones = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setZone(Number((e.target as HTMLElement).dataset.zone))),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    page.current?.querySelectorAll("[data-zone]").forEach((el) => zones.observe(el));
    const showing = new Set<Element>();
    const stages = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? showing.add(e.target) : showing.delete(e.target)));
        setOnStage(showing.size > 0);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    page.current?.querySelectorAll("[data-stage]").forEach((el) => stages.observe(el));
    return () => {
      rooms.disconnect();
      zones.disconnect();
      stages.disconnect();
    };
  }, []);

  // The site header changes height with the screen; the stages and the bar fit under it.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const el = page.current;
    if (!header || !el) return;
    const ro = new ResizeObserver(() => el.style.setProperty("--header", `${header.offsetHeight}px`));
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // The soundtrack starts at the visitor's first tap, click or key press (at once if they already have).
  useEffect(() => {
    const unlock = (e?: Event) => {
      unlockedAt.current = e?.timeStamp ?? 0;
      setUnlocked(true);
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((t) => window.addEventListener(t, unlock, { once: true, passive: true }));
    // Arriving from another page of the site, the visitor has already interacted.
    const raf = requestAnimationFrame(() => navigator.userActivation?.hasBeenActive && unlock());
    return () => {
      cancelAnimationFrame(raf);
      events.forEach((t) => window.removeEventListener(t, unlock));
    };
  }, []);

  // The page stays still behind the welcome.
  useEffect(() => {
    if (intro !== "open") return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [intro]);

  // The gold rule slides to the current occasion.
  useEffect(() => {
    const place = () => {
      const chip = chips.current?.querySelector<HTMLElement>('[aria-current="true"]');
      if (chip) setPill({ x: chip.offsetLeft, w: chip.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [current]);

  // Stable, so the rooms (most of the page) don't re-render as the visitor scrolls.
  const openPhoto: OnPhoto = useCallback((photos, index) => setViewer({ photos, index }), []);
  const openAlbum = useCallback((section: Section, sub: Sub) => setAlbum({ section, sub }), []);
  /** The visitor's answer is the tap browsers need before a page may play sound. */
  const enter = (withSound: boolean) => {
    setSound(withSound);
    setUnlocked(true);
    setIntro("leaving");
    window.setTimeout(() => setIntro(null), 1600);
  };
  /** The press that unlocked sound only lets it start; it does not also switch it off. */
  const justUnlocked = (t: number) => t - unlockedAt.current < 1000;
  const filmSound = (i: number, t: number) => {
    if (audible === i && !justUnlocked(t)) return setSound(false);
    setZone(i);
    setSound(true);
  };
  const stage = (i: number) => (
    <Stage
      film={CHAPTERS[i].film}
      reel={CHAPTERS[i].reel}
      audible={audible === i}
      held={intro !== null}
      first={i === 0}
      onSound={(t) => filmSound(i, t)}
      onPhoto={openPhoto}
    />
  );

  return (
    <div
      ref={page}
      className={styles.page}
      data-intro={intro ? "" : undefined}
      data-ready={ready !== null ? "" : undefined}
      data-lite={ready === "lite" ? "" : undefined}
    >
      <h1 className={styles.hidden}>Photos &amp; Videos</h1>
      {intro && <Intro leaving={intro === "leaving"} ready={ready !== null} onEnter={enter} />}
      <div className={styles.opening} data-zone="0">
        {stage(0)}
      </div>

      <nav className={styles.bar} aria-label="Occasions" data-hidden={onStage ? "" : undefined}>
        <button
          type="button"
          className={styles.pick}
          aria-expanded={menu}
          aria-controls="gallery-occasions"
          onClick={() => setMenu(!menu)}
        >
          <span key={current} className={styles["pick-text"]}>
            {SECTIONS.find((s) => s.id === current)?.title}
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <ul
          id="gallery-occasions"
          ref={chips}
          className={styles.chips}
          data-open={menu ? "" : undefined}
          style={{ "--px": `${pill.x}px`, "--pw": pill.w } as CSSProperties}
        >
          {SECTIONS.map((s, i) => (
            <li key={s.id} className={i && s.theme !== SECTIONS[i - 1].theme ? styles.split : undefined}>
              <a
                href={`#${s.id}`}
                className={styles.chip}
                aria-current={current === s.id ? "true" : undefined}
                onClick={() => setMenu(false)}
              >
                <span className={styles["chip-short"]}>{s.short}</span>
                <span className={styles["chip-full"]}>{s.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.soundbar}
          aria-pressed={audible !== null}
          onClick={(e) => setSound(audible === null || justUnlocked(e.timeStamp))}
          aria-label={audible !== null ? `Sound on: ${GALLERY_FILMS[zone].title}. Turn it off` : "Turn the sound on"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
            {audible === null && <path d="M16 9.5l5 5M21 9.5l-5 5" />}
          </svg>
          <span className={styles.eq} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </nav>

      {CHAPTERS.map(({ film, sections }, i) => (
        <div key={film.src} className={styles[film.theme]} data-zone={i}>
          {i > 0 && stage(i)}
          {sections.map((s) => (
            <Room key={s.id} section={s} onPhoto={openPhoto} onAlbum={openAlbum} />
          ))}
        </div>
      ))}

      <section className={styles.close} aria-labelledby="gallery-close">
        <h2 id="gallery-close" className={styles["close-title"]}>
          Picture yours here
        </h2>
        <p className={styles["close-text"]}>
          Walk the grounds with us, see the spaces at the hour you would use them, and leave with a plan and a price.
        </p>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.primary}>
            Plan a visit
          </Link>
          <Link href="/resorts/venues" className={styles.secondary}>
            See the venues
          </Link>
        </div>
      </section>

      <Album of={album} onClose={() => setAlbum(null)} onPhoto={openPhoto} />
      <GalleryLightbox
        photos={viewer?.photos ?? []}
        index={viewer?.index ?? null}
        onIndex={(index) => setViewer((v) => v && { ...v, index })}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}

/** Deal photos into `n` lanes in turn. */
const lanes = (photos: GalleryPhoto[], n: number) =>
  Array.from({ length: n }, (_, k) => photos.filter((_, i) => i % n === k));

/** The welcome before the gallery: it says the page plays music and lets the visitor choose. */
function Intro({
  leaving,
  ready,
  onEnter,
}: {
  leaving: boolean;
  /** The buttons are hidden until React can answer them; focus moves to the first once they show. */
  ready: boolean;
  onEnter: (withSound: boolean) => void;
}) {
  const on = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ready) on.current?.focus();
  }, [ready]);
  return (
    <div
      className={styles.intro}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-intro-title"
      aria-describedby="gallery-intro-text"
      data-leaving={leaving ? "" : undefined}
    >
      <span className={styles["intro-half"]} aria-hidden="true" />
      <span className={styles["intro-half"]} aria-hidden="true" />
      <div className={styles["intro-body"]}>
        <span className={styles["intro-eq"]} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
        <span className={`logo-art ${styles["intro-brand"]}`} aria-hidden="true" />
        <h2 id="gallery-intro-title" className={styles["intro-title"]}>
          This gallery plays music
        </h2>
        <p id="gallery-intro-text" className={styles["intro-text"]}>
          Our films carry their own soundtrack as you scroll: the wedding by day, the reception by night. You can
          turn it off at any time with the speaker button.
        </p>
        <div className={styles["intro-actions"]} inert={!ready}>
          <button ref={on} type="button" className={styles["intro-on"]} onClick={() => onEnter(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
              <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
            </svg>
            Enter with sound
          </button>
          <button type="button" className={styles["intro-off"]} onClick={() => onEnter(false)}>
            Enter without sound
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * A film at its own shape beside the chapter's photos drifting past. The wide film takes seven
 * tenths of the width with two columns beside it and rows beneath; the upright film stands between
 * two columns drifting up and down and three rows drifting sideways.
 */
function Stage({
  film,
  reel,
  audible,
  held,
  first,
  onSound,
  onPhoto,
}: {
  film: GalleryFilm;
  reel: GalleryPhoto[];
  audible: boolean;
  /** The welcome is still up: the film waits for it. */
  held: boolean;
  /** The opening stage, on screen at load: its film's poster and first frames load straight away. */
  first: boolean;
  onSound: (t: number) => void;
  onPhoto: OnPhoto;
}) {
  // The drifting photos stop while the stage is off screen. Their files are requested only once the page is
  // interactive and the stage is within a screen and a half, so on a slow connection the script arrives first
  // (colour placeholders until then). They load at once: lazy loading misses photos clipped inside moving lanes.
  const [box, live, near] = useInView<HTMLElement>("150% 0px");
  const wide = film.w > film.h;
  const track = (photos: GalleryPhoto[], dir: "col" | "row", k: number) => (
    <ul key={k} className={styles[dir]} style={{ "--n": photos.length, "--c": k } as CSSProperties}>
      {/* Each lane runs twice over, so it loops without a seam; the copy is hidden from assistive tech. */}
      {[...photos, ...photos].map((p, i) => {
        const copy = i >= photos.length;
        const at = reel.indexOf(p);
        return (
          <li
            key={`${p.f}-${copy}`}
            style={{ "--ar": p.w / p.h, "--k": p.k, "--i": Math.min(i, 8) } as CSSProperties}
            aria-hidden={copy || undefined}
          >
            <button
              type="button"
              tabIndex={copy ? -1 : undefined}
              onClick={() => onPhoto(reel, at)}
              aria-label={`View photo ${at + 1} of ${reel.length}: ${collectionTitle(p.c)}`}
            >
              {near && <Image src={thumbSrc(p)} alt="" fill sizes={stripSizes(p)} loading="eager" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
  // Columns beside the film; the rest run in rows, under the wide film or beside the upright one.
  const side = reel.slice(0, wide ? 14 : 10);
  const rows = lanes(reel.slice(side.length), wide ? 2 : 3);
  return (
    <section
      ref={box}
      className={`${styles.stage} ${styles[film.theme]} ${wide ? styles.wide : styles.upright}`}
      aria-label={film.title}
      data-stage=""
      data-live={live ? "" : undefined}
    >
      <Film film={film} audible={audible} held={held} first={first} near={near} onSound={onSound} />
      <div className={`${styles.reel} ${styles.columns}`}>{lanes(side, 2).map((l, k) => track(l, "col", k))}</div>
      <div className={`${styles.reel} ${styles.rows}`}>{rows.map((l, k) => track(l, "row", k))}</div>
    </section>
  );
}

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * A client film. It plays silently while on screen. While it is the soundtrack it keeps playing
 * off screen too, and its sound fades in and out as the visitor moves between chapters.
 */
function Film({
  film,
  audible,
  held,
  first,
  near,
  onSound,
}: {
  film: GalleryFilm;
  audible: boolean;
  held: boolean;
  first: boolean;
  /** The stage has come near the screen: a later film's poster may load. */
  near: boolean;
  onSound: (t: number) => void;
}) {
  const [box, inView] = useInView<HTMLElement>("0px");
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // A large screen on a slow connection takes the lighter cut too (the <source> media query only knows width).
  // Nothing is fetched before this runs, so the full cut never starts downloading on a slow link.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (slowNet()) v.src = film.mobile;
    if (first) v.preload = "metadata";
  }, [film.mobile, first]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (audible || (inView && !held && !still())) {
      v.play().catch(() => {});
      return;
    }
    // Let the sound fade out before pausing.
    const t = window.setTimeout(() => v.pause(), FADE * 1000);
    return () => window.clearTimeout(t);
  }, [inView, audible, held]);

  useEffect(() => {
    const v = video.current;
    if (!v || (!audible && v.muted)) return;
    // iPhone and iPad ignore `volume` (it always reads 1): there the sound simply switches, with no fade,
    // so two films never play aloud together.
    const was = v.volume;
    v.volume = was > 0.5 ? 0 : 1;
    const fixed = v.volume === was;
    v.volume = was;
    if (fixed) {
      v.muted = !audible;
      return;
    }
    if (audible && v.muted) {
      v.volume = 0;
      v.muted = false;
    }
    const from = v.volume;
    const to = audible ? film.volume : 0;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      // A frame's timestamp can precede `start`; a negative volume would throw.
      const k = Math.min(1, Math.max(0, (t - start) / (FADE * 1000)));
      v.volume = from + (to - from) * k;
      if (k < 1) raf = requestAnimationFrame(step);
      else if (!audible) v.muted = true;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [audible, film.volume]);

  // Native controls only in full screen, where our buttons are out of reach.
  useEffect(() => {
    const v = video.current;
    const sync = () => v && (v.controls = document.fullscreenElement === v);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const fullScreen = () => {
    const v = video.current as FullscreenVideo | null;
    if (!v) return;
    v.play().catch(() => {});
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.();
  };

  return (
    <figure ref={box} className={`${styles.film} ${audible ? styles.on : ""}`}>
      {/* Phones and tablets get the lighter cut; only the opening film fetches more than its first frames early. */}
      <video
        ref={video}
        poster={first || near ? film.poster : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={film.title}
        onTimeUpdate={(e) =>
          bar.current?.style.setProperty("--v", String(e.currentTarget.currentTime / (e.currentTarget.duration || 1)))
        }
      >
        <source src={film.mobile} type="video/mp4" media="(max-width: 1024px)" />
        <source src={film.src} type="video/mp4" />
      </video>
      <span ref={bar} className={styles.progress} aria-hidden="true" />
      <span className={styles.controls}>
        <button
          type="button"
          className={`${styles.ctl} ${styles.sound}`}
          aria-pressed={audible}
          aria-label={`Sound for ${film.title}`}
          onClick={(e) => onSound(e.timeStamp)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
            {audible ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
          </svg>
        </button>
        <button type="button" className={styles.ctl} onClick={fullScreen} aria-label={`Watch ${film.title} full screen`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
          </svg>
        </button>
      </span>
    </figure>
  );
}

/** One occasion: its name and feel, then each sub-section as a plaque beside a row of arches. */
const Room = memo(function Room({
  section: s,
  onPhoto,
  onAlbum,
}: {
  section: Section;
  onPhoto: OnPhoto;
  onAlbum: (section: Section, sub: Sub) => void;
}) {
  const [head, live, seen] = useInView<HTMLElement>();
  return (
    <section id={s.id} className={styles.room} aria-labelledby={`${s.id}-title`}>
      <header
        ref={head}
        className={styles["room-head"]}
        data-in={seen ? "" : undefined}
        data-live={live ? "" : undefined}
      >
        <span className={styles.ghost} aria-hidden="true">
          {[0, 1, 2, 3].map((k) => (
            <span key={k}>{s.title}</span>
          ))}
        </span>
        <h2 id={`${s.id}-title`} className={styles.h2}>
          {s.title.split(" ").map((w, i) => (
            <Fragment key={i}>
              <span className={styles.word}>
                <span style={{ "--w": i } as CSSProperties}>{w}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h2>
        <p className={styles.line}>
          {s.subs[0].name && s.line}
          {s.link && (
            <>
              {" "}
              <Link href={s.link.href} className={styles.more}>
                {s.link.label}
              </Link>
            </>
          )}
        </p>
      </header>
      {s.subs.map((x, i) => (
        <Arches
          key={x.id}
          sub={x}
          flip={i % 2 === 1}
          label={x.name || s.title}
          onPhoto={onPhoto}
          onAlbum={() => onAlbum(s, x)}
        />
      ))}
    </section>
  );
});

/** A sub-section: a title card over one of its photos, a large arch playing through the rest, and three small arches. */
function Arches({
  sub,
  flip,
  label,
  onPhoto,
  onAlbum,
}: {
  sub: Sub;
  flip: boolean;
  label: string;
  onPhoto: OnPhoto;
  onAlbum: () => void;
}) {
  const [box, inView, seen] = useInView<HTMLDivElement>();
  // Photos are requested once the page is interactive and the set is within a screen and a half, and then load at
  // once, so a quick scroll finds them ready; until then each frame shows the photo's average colour.
  const [nearBox, , near] = useInView<HTMLDivElement>("150% 0px");
  const [show, setShow] = useState<{ k: number; prev: number | null }>({ k: 0, prev: null });
  const { photos, cycle } = sub;
  const n = photos.length;

  useEffect(() => {
    if (!inView || cycle.length < 2 || still()) return;
    const t = window.setInterval(() => setShow(({ k }) => ({ prev: k, k: (k + 1) % cycle.length })), HOLD * 1000);
    return () => window.clearInterval(t);
  }, [inView, cycle.length]);
  // Fetch and decode the next photo, at the size this screen will pick, before its turn.
  useEffect(() => {
    if (!inView || cycle.length < 2 || still()) return;
    const { props } = getImageProps(archImage(cycle[(show.k + 1) % cycle.length]));
    const next = new window.Image();
    next.sizes = props.sizes ?? "";
    next.srcset = props.srcSet ?? "";
    next.decode().catch(() => {});
  }, [inView, show.k, cycle]);

  const cur = cycle[show.k];
  // A photo the arches never show, behind the title card.
  const cover = photos[Math.min(14, n - 1)];
  const layers = show.prev === null ? [show.k] : [show.prev, show.k];
  const view = (p: GalleryPhoto) => {
    const i = photos.indexOf(p);
    return { onClick: () => onPhoto(photos, i), "aria-label": `View photo ${i + 1} of ${n}: ${label}` };
  };

  return (
    <div
      ref={box}
      id={sub.id}
      className={`${styles.sub} ${flip ? styles.flip : ""}`}
      data-in={seen ? "" : undefined}
      style={{ "--hold": `${HOLD}s` } as CSSProperties}
    >
      <div className={styles.plaque} style={{ "--k": cover.k } as CSSProperties}>
        {near && (
          <Image
            src={thumbSrc(cover)}
            alt=""
            fill
            sizes={coverSizes(cover)}
            loading="eager"
            className={styles["plaque-photo"]}
          />
        )}
        <div className={styles["plaque-text"]}>
          {sub.name && <h3 className={styles.h3}>{sub.name}</h3>}
          <p className={styles.note}>{sub.note}</p>
          <button type="button" className={styles.all} onClick={onAlbum} aria-label={`See all photos: ${label}`}>
            See all
          </button>
        </div>
      </div>
      <div ref={nearBox} className={styles.arches}>
        <div className={`${styles.arch} ${styles.big}`} style={{ "--d": 0, "--k": cur.k } as CSSProperties}>
          <button type="button" {...view(cur)}>
            {near &&
              layers.map((l) => (
                <Image
                  key={cycle[l].f}
                  {...archImage(cycle[l])}
                  alt=""
                  loading="eager"
                  className={l === show.k ? styles.over : styles.under}
                />
              ))}
          </button>
        </div>
        {photos.slice(1, 4).map((p, j) => (
          <div key={p.f} className={styles.arch} style={{ "--d": j + 1, "--k": p.k } as CSSProperties}>
            <button type="button" {...view(p)}>
              {near && <Image src={thumbSrc(p)} alt="" fill sizes={archSizes(p)} loading="eager" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Every photo of one sub-section, full screen. */
function Album({ of, onClose, onPhoto }: { of: AlbumOf; onClose: () => void; onPhoto: OnPhoto }) {
  if (!of) return null;
  const { section, sub } = of;
  const label = sub.name || section.title;
  return (
    <Modal open onClose={onClose} labelledBy="gallery-album-title" bare>
      <div className={styles.sheet}>
        <header className={styles["sheet-head"]}>
          <h2 id="gallery-album-title" className={styles["sheet-title"]}>
            {label}
            {sub.name && <span>{section.title}</span>}
          </h2>
          <button type="button" className={styles.x} onClick={onClose} aria-label="Close album">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className={styles["sheet-body"]}>
          <Mosaic photos={sub.photos} label={label} onPhoto={onPhoto} />
        </div>
      </div>
    </Modal>
  );
}

/** Tile shape from the photo's orientation and its place in the list; dense grid packing fills the gaps. */
/** Album cells: six columns on desktops, four on tablets, two on phones; large, wide and tall cells span about two. */
const MOSAIC = "(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 17vw";
const MOSAIC_WIDE = "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 34vw";

function shape(p: GalleryPhoto, i: number) {
  const ar = p.w / p.h;
  if (ar < 0.85) return styles.tall;
  if (ar > 1.2 && i % 9 === 0) return styles.large;
  if (ar > 1.2 && i % 4 === 2) return styles.span2;
  return "";
}

/** An edge-to-edge mosaic; each photo opens from its centre as it scrolls in. */
function Mosaic({ photos, label, onPhoto }: { photos: GalleryPhoto[]; label: string; onPhoto: OnPhoto }) {
  const grid = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = grid.current;
    if (!list) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.setAttribute("data-in", "")),
      { rootMargin: "0px 0px -6% 0px" },
    );
    list.querySelectorAll("li").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={grid} className={styles.grid}>
      {photos.map((p, i) => (
        <li key={p.f} className={`${styles.cell} ${shape(p, i)}`} style={{ "--k": p.k } as CSSProperties}>
          <button type="button" onClick={() => onPhoto(photos, i)} aria-label={`View photo ${i + 1} of ${photos.length}: ${label}`}>
            <Image src={thumbSrc(p)} alt="" fill sizes={shape(p, i) ? MOSAIC_WIDE : MOSAIC} />
          </button>
        </li>
      ))}
    </ul>
  );
}
