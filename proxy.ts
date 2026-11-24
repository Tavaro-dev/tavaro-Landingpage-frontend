import { NextResponse, type NextRequest } from "next/server";
import { SECTIONS, isShared, sectionOf, siteOf, siteUrl } from "./lib/subdomains";

/**
 * Routes each brand subdomain to its section (lib/subdomains.ts): resort.tavaro.in/venues shows /resorts/venues.
 * Every path has one public address, so the old ones redirect permanently: tavaro.in/resorts/venues and
 * resort.tavaro.in/resorts/venues both go to resort.tavaro.in/venues, and resort.tavaro.in/contact goes to
 * tavaro.in/contact. Links inside the site can keep their app/ paths; this sends them where they belong.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const site = siteOf(host);
  if (site === undefined) return; // subdomains off, or a host they do not cover
  const { pathname, search } = request.nextUrl;

  if (isShared(pathname)) return;

  if (site === "") {
    return sectionOf(pathname) ? goTo(request, siteUrl(pathname) + search) : undefined;
  }

  const prefix = SECTIONS[site];
  // resort.tavaro.in/resorts/venues: the section's own path, written in full.
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return goTo(request, siteUrl(pathname) + search);
  }

  // A path that belongs to another section or to the root domain.
  const first = `/${pathname.split("/")[1]}`;
  if (pathname !== "/" && (sectionOf(pathname) || ROOT_ONLY.has(first))) {
    return goTo(request, siteUrl(pathname) + search);
  }

  const url = request.nextUrl.clone();
  url.pathname = prefix + (pathname === "/" ? "" : pathname);
  return NextResponse.rewrite(url);
}

/** Pages of the root domain, other than the home page. */
const ROOT_ONLY = new Set(["/about", "/contact"]);

/**
 * A permanent redirect, its address written out in full: NextResponse.redirect would swap a "localhost" in it for
 * the host the request came in on. A client-side navigation fetches the page in the background (the browser marks
 * it Sec-Fetch-Dest: empty, as Next.js hides its own RSC header from here), and that fetch cannot follow a redirect
 * to another host; an empty answer makes the router load the address in full instead, which then gets this.
 */
function goTo(request: NextRequest, url: string) {
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return new NextResponse(null, { status: 204 });
  return new NextResponse(null, { status: 308, headers: { Location: url } });
}

export const config = {
  // Pages only: not Next.js's own files, the image optimizer, or files in public/ (anything with a dot).
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
