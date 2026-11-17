"use client";

import Image, { getImageProps, type ImageLoader, type ImageProps } from "next/image";
import { getImageBlurSvg } from "next/dist/shared/lib/image-blur-svg";
import { HERO_IMAGES } from "@/lib/content/heroImages";

/** "resorts-hero" from "/images/heroes/resorts-hero.jpg" or a static import's "/_next/static/media/resorts-hero.<hash>.jpg". */
const stemOf = (src: string) => src.split("/").pop()!.split(".")[0];
const entry = (src: string) => HERO_IMAGES[stemOf(src)];
const srcOf = (src: ImageProps["src"]) => (typeof src === "string" ? src : "default" in src ? src.default.src : src.src);

/**
 * Serves the ready-made WebP made by `npm run heroes` (smallest one at least as wide as asked), so a hero never
 * waits on the server converting it. Photos not made yet fall back to the usual optimizer.
 */
export const heroLoader: ImageLoader = ({ src, width, quality }) => {
  const e = entry(src);
  if (!e) return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
  const w = e.w.find((x) => x >= width) ?? e.w[e.w.length - 1];
  return `/heroes/${stemOf(src)}-${e.h}-${w}.webp`;
};

const loading = new Map<string, Promise<void>>();

/**
 * Downloads and decodes a full-width hero (the same file the page's HeroImage with sizes="100vw" will pick), so
 * the page opens with it sharp. Resolves when it is ready (or failed); repeat calls share one download.
 */
export function preloadHero(stem: string, priority: "high" | "low"): Promise<void> {
  let p = loading.get(stem);
  if (!p) {
    const { srcSet, sizes } = getImageProps({ src: `/${stem}.jpg`, alt: "", fill: true, sizes: "100vw", loader: heroLoader }).props;
    const img = new window.Image();
    // Low for fetching ahead, so it never slows the page or a navigation the visitor is waiting on.
    img.fetchPriority = priority;
    img.sizes = sizes ?? "100vw";
    img.srcset = srcSet ?? "";
    p = img.decode().catch(() => {});
    loading.set(stem, p);
  }
  return p;
}

/**
 * next/image for large photos at the top of a page: the ready-made files, and a soft preview while they load.
 * The preview is the photo element's own background, kept for good: the photo covers it once painted. (Next's
 * placeholder is removed when the file has loaded, a frame before the photo paints, and showed one dark frame;
 * a separate layer under the photo got drawn over it where the photo has a negative z-index.)
 */
export function HeroImage({ alt, style, ...props }: ImageProps) {
  const blur = entry(srcOf(props.src))?.blur;
  const preview = blur && {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${getImageBlurSvg({ blurDataURL: blur, objectFit: "cover" })}")`,
  };
  return <Image alt={alt} {...props} style={{ ...preview, ...style }} loader={heroLoader} />;
}
