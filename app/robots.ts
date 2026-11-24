import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SECTIONS, siteOf } from "@/lib/subdomains";
import { publicUrl } from "@/lib/metadata";

/** Each host points to its own sitemap (see app/sitemap.ts). */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = siteOf((await headers()).get("host") ?? "");
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/*/book", "/experiences/*/book"] },
    sitemap: new URL("/sitemap.xml", publicUrl(site ? SECTIONS[site] : "/")).href,
  };
}
