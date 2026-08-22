import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const ROUTES = ["/", "/about", "/resorts", "/residences", "/experiences", "/wellness", "/mare", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
