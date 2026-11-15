import type { GalleryPhoto } from "../../content/galleryPhotos";

/** Pre-sized WebPs with content-hashed names (served as-is, cached for a year). */
export const thumbSrc = (p: GalleryPhoto) => `/gallery/${p.c}/t/${p.f}.webp`;
export const fullSrc = (p: GalleryPhoto) => `/gallery/${p.c}/${p.f}.webp`;

/** On a slow connection, Data Saver or a low-memory phone, the page keeps still and plays nothing on its own. */
export const lite = () => {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  return Boolean(n.connection?.saveData || /2g|3g/.test(n.connection?.effectiveType ?? "") || (n.deviceMemory ?? 8) <= 2);
};
