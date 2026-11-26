import { existsSync } from "node:fs";
import type { Metadata } from "next";
import { ROOT_DOMAIN, siteUrl } from "./subdomains";
import { ogName } from "./ogName";

// Prefers an explicit custom domain (set NEXT_PUBLIC_SITE_URL once one is
// configured), falls back to Vercel's own deployment URL, then to a
// placeholder for local dev.
function resolveSiteUrl(): string {
  if (ROOT_DOMAIN) return siteUrl("/").slice(0, -1);
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://www.tavarogroup.com";
}
export const SITE_URL = resolveSiteUrl();
const SITE_NAME = "Tavaro Group";

/** A page's full public address, on its subdomain when those are on. */
export const publicUrl = (path: string) => (ROOT_DOMAIN ? siteUrl(path) : `${SITE_URL}${path}`);

/** The page's own link preview (public/og/, built by scripts/make-og.mjs). */
const ogImage = (path: string) => `/og/${ogName(path, (name) => existsSync(`public/og/${name}.jpg`))}.jpg`;

export function pageMetadata({
  title,
  description,
  path,
  image = ogImage(path),
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: ROOT_DOMAIN ? siteUrl(path) : path },
    openGraph: {
      title,
      description,
      url: ROOT_DOMAIN ? siteUrl(path) : path,
      siteName: SITE_NAME,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
