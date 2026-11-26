"use client";

import { useAppPath } from "@/lib/useAppPath";
import { ogName } from "@/lib/ogName";
import { JsonLd } from "./JsonLd";

/**
 * Tells Google which picture to show beside this page in search: its square, centred link preview
 * (public/og/square/, built by scripts/make-og.mjs), so the crop keeps the logo. Same naming as the
 * page's og:image (lib/ogName.ts).
 */
export function PageImageJsonLd({ base, names }: { base: string; names: string[] }) {
  const path = useAppPath();
  const url = `${base}/og/square/${ogName(path, (name) => names.includes(name))}.jpg`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        primaryImageOfPage: { "@type": "ImageObject", url, width: 1200, height: 1200 },
        thumbnailUrl: url,
      }}
    />
  );
}
