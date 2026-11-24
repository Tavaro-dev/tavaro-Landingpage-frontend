/**
 * Each brand section lives on its own subdomain: resort.tavaro.in shows /resorts, resort.tavaro.in/venues
 * shows /resorts/venues, and so on. The group pages (home, About, Contact) stay on the root domain.
 * proxy.ts does the routing; the pages themselves keep their paths under app/.
 *
 * Off until NEXT_PUBLIC_ROOT_DOMAIN is set (tavaro.in in production, localhost:3000 to try it locally at
 * resort.localhost:3000): without it every page stays at its plain path, as before.
 */
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

/** Subdomain → the section's path in app/. */
export const SECTIONS = {
  resort: "/resorts",
  residences: "/residences",
  experiences: "/experiences",
  wellness: "/wellness",
  mare: "/mare",
} as const;
export type Section = keyof typeof SECTIONS;

/** Paths any host serves as they are: the checkout reads a cart kept by the subdomain it was filled on. */
const SHARED = ["/checkout"];

const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
const protocol = () => (/^localhost\b|\.localhost\b/.test(ROOT_DOMAIN) ? "http" : "https");

/** The section an app/ path belongs to, if any. */
export function sectionOf(path: string): Section | undefined {
  return (Object.keys(SECTIONS) as Section[]).find((s) => under(path, SECTIONS[s]));
}

/** In the browser: the section of the page being viewed, from the subdomain, or from the path when subdomains are off. */
export function currentSection(): Section | undefined {
  return siteOf(location.host) || sectionOf(location.pathname);
}

export const isShared =(path: string) => SHARED.some((p) => under(path, p));

/**
 * Which site a host is: a section, "" for the root domain (or www.), undefined for any other host
 * (a preview deployment, say), which is served without subdomains.
 */
export function siteOf(host: string): Section | "" | undefined {
  if (!ROOT_DOMAIN) return undefined;
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) return "";
  const sub = host.endsWith(`.${ROOT_DOMAIN}`) ? host.slice(0, -ROOT_DOMAIN.length - 1) : "";
  return sub in SECTIONS ? (sub as Section) : undefined;
}

/**
 * The public address of an app/ path: /resorts/venues#map → https://resort.tavaro.in/venues#map,
 * /contact → https://tavaro.in/contact. With subdomains off, the path itself.
 */
export function siteUrl(path: string): string {
  if (!ROOT_DOMAIN || !path.startsWith("/")) return path;
  const [pathname, rest = ""] = path.split(/(?=[?#])/, 2);
  const section = sectionOf(pathname);
  if (!section) return `${protocol()}://${ROOT_DOMAIN}${path}`;
  const inner = pathname.slice(SECTIONS[section].length) || "/";
  return `${protocol()}://${section}.${ROOT_DOMAIN}${inner}${rest}`;
}
