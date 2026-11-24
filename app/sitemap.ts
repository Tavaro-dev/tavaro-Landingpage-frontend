import type { MetadataRoute } from "next";
import { publicUrl } from "@/lib/metadata";
import { EVENTS } from "@/lib/content/events";

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/experiences",
  "/mare",
  "/residences",
  "/resorts",
  "/resorts/accommodations",
  "/resorts/location",
  "/resorts/photos",
  "/resorts/venues",
  "/resorts/things-to-do/explore",
  "/resorts/things-to-do/create",
  "/residences/leela",
  "/residences/bhairavi-nilayam",
  "/wellness",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.map((path) => ({
    url: publicUrl(path),
  }));

  const dynamicRoutes = EVENTS.map((event) => ({
    url: publicUrl(`/experiences/${event.id}`),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
