import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, publicUrl } from "@/lib/metadata";
import { sectionOf, siteOf } from "@/lib/subdomains";
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

/** The main domain's own list: the group pages plus each brand's entry address (these redirect to the brand's subdomain). */
const MAIN = ["/", "/resorts", "/residences", "/experiences", "/wellness", "/mare", "/about", "/contact"];

/** Each subdomain lists only its own pages; tavaro.in lists MAIN. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteOf((await headers()).get("host") ?? "");
  if (site === "") return MAIN.map((path) => ({ url: `${SITE_URL}${path}` }));
  return [...ROUTES, ...EVENTS.map((e) => `/experiences/${e.id}`)]
    .filter((path) => site === undefined || sectionOf(path) === site)
    .map((path) => ({ url: publicUrl(path) }));
}
