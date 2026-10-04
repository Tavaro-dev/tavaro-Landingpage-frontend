import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { EVENTS } from "@/lib/events";

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/experiences",
  "/mare",
  "/residences",
  "/resorts",
  "/resorts/accommodations",
  "/wellness",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const dynamicRoutes = EVENTS.map((event) => ({
    url: `${SITE_URL}/experiences/${event.id}`,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
