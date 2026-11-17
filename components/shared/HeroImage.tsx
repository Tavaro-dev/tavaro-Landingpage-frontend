"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import { HERO_IMAGES } from "@/lib/content/heroImages";

/** "resorts-hero" from "/images/heroes/resorts-hero.jpg" or a static import's "/_next/static/media/resorts-hero.<hash>.jpg". */
const entry = (src: string) => HERO_IMAGES[src.split("/").pop()!.split(".")[0]];
const srcOf = (src: ImageProps["src"]) => (typeof src === "string" ? src : "default" in src ? src.default.src : src.src);

/**
 * Serves the ready-made WebP made by `npm run heroes` (smallest one at least as wide as asked), so a hero never
 * waits on the server converting it. Photos not made yet fall back to the usual optimizer.
 */
export const heroLoader: ImageLoader = ({ src, width, quality }) => {
  const e = entry(src);
  if (!e) return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
  const w = e.w.find((x) => x >= width) ?? e.w[e.w.length - 1];
  return `/heroes/${src.split("/").pop()!.split(".")[0]}-${e.h}-${w}.webp`;
};

/** next/image for large photos at the top of a page: the ready-made files, and a soft preview while they load. */
export function HeroImage({ alt, ...props }: ImageProps) {
  const blur = entry(srcOf(props.src))?.blur;
  const preview = blur ? { placeholder: "blur" as const, blurDataURL: blur } : {};
  return <Image alt={alt} {...props} {...preview} loader={heroLoader} />;
}
