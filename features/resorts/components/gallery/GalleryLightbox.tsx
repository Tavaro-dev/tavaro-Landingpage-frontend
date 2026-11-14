"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { GalleryPhoto } from "../../content/galleryPhotos";
import { collectionTitle, fullSrc, thumbSrc } from "./paths";
import styles from "./GalleryLightbox.module.css";

type Props = {
  photos: GalleryPhoto[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Full-screen viewer: arrows / keyboard / swipe; the cached thumbnail shows instantly under the full image. */
export function GalleryLightbox({ photos, index, onIndex, onClose }: Props) {
  const n = photos.length;
  const p = index === null ? null : photos[index];
  const [loaded, setLoaded] = useState<string | null>(null);
  const swipeX = useRef<number | null>(null);

  const go = (step: number) => index !== null && onIndex((index + step + n) % n);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    // Warm the neighbours so stepping through feels instant.
    [index + 1, index - 1].forEach((i) => {
      const q = photos[(i + n) % n];
      if (q) new window.Image().src = fullSrc(q);
    });
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, photos, onIndex]);

  if (!p || index === null) return null;
  const place = p.l || collectionTitle(p.c);

  return (
    <Modal open onClose={onClose} labelledBy="gallery-lightbox-title" bare>
      <div className={styles.lightbox}>
        <header className={styles.head}>
          <p id="gallery-lightbox-title" className={styles.place}>
            {place}
            {p.l && <span>{collectionTitle(p.c)}</span>}
          </p>
          <span className={styles.count}>
            {index + 1} / {n}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close gallery">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div
          className={styles.stage}
          onPointerDown={(e) => (swipeX.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = swipeX.current === null ? 0 : e.clientX - swipeX.current;
            swipeX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div key={p.f} className={styles.frame} style={{ "--ar": p.w / p.h, "--k": p.k } as CSSProperties}>
            <Image src={thumbSrc(p)} alt="" fill unoptimized className={styles.thumb} draggable={false} />
            <Image
              src={fullSrc(p)}
              alt={`${place}, Tavaro Resorts`}
              fill
              unoptimized
              draggable={false}
              className={`${styles.full} ${loaded === p.f ? styles.ready : ""}`}
              onLoad={() => setLoaded(p.f)}
            />
          </div>
        </div>

        {n > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Next photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
