import type { Metadata } from "next";

// Prefers an explicit custom domain (set NEXT_PUBLIC_SITE_URL once one is
// configured), falls back to Vercel's own deployment URL, then to a
// placeholder for local dev.
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://www.tavarogroup.com";
}
export const SITE_URL = resolveSiteUrl();
const SITE_NAME = "Tavaro Group";

export function pageMetadata({
  title,
  description,
  path,
  image = "/og-image.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
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
