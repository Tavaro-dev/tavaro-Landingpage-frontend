import type { GalleryPhoto } from "../../content/galleryPhotos";

/** Pre-sized WebPs with content-hashed names (served as-is, cached for a year). */
export const thumbSrc = (p: GalleryPhoto) => `/gallery/${p.c}/t/${p.f}.webp`;
export const fullSrc = (p: GalleryPhoto) => `/gallery/${p.c}/${p.f}.webp`;
