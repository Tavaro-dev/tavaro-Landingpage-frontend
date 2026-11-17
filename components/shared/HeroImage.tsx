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
export function preloadHero(stem: string): Promise<void> {
  let p = loading.get(stem);
  if (!p) {
    const { srcSet, sizes } = getImageProps({ src: `/${stem}.jpg`, alt: "", fill: true, sizes: "100vw", loader: heroLoader }).props;
    const img = new window.Image();
    img.sizes = sizes ?? "100vw";
    img.srcset = srcSet ?? "";
    p = img.decode().catch(() => {});
    loading.set(stem, p);
  }
  return p;
}

/**
 * next/image for large photos at the top of a page: the ready-made files, and a soft preview while they load.
 * The preview is its own layer under the photo, not Next's placeholder on the photo itself: Next takes that
 * away when the file has loaded, which can be a frame before the photo is painted, and showed one dark frame.
 */
export function HeroImage({ alt, ...props }: ImageProps) {
  const blur = entry(srcOf(props.src))?.blur;
  return (
    <>
      {blur && props.fill && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,${getImageBlurSvg({ blurDataURL: blur, objectFit: "cover" })}")`,
          }}
        />
      )}
      <Image alt={alt} {...props} loader={heroLoader} />
    </>
  );
}
