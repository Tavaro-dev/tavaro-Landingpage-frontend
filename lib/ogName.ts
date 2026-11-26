/**
 * The link-preview image name for a page (public/og/, public/og/square/): /resorts/venues is resorts-venues; a page
 * with none of its own takes its nearest parent's (/experiences/x/book → experiences-x), then home.
 */
export function ogName(path: string, exists: (name: string) => boolean): string {
  for (let parts = path.split("/").filter(Boolean); parts.length; parts.pop()) {
    if (exists(parts.join("-"))) return parts.join("-");
  }
  return "home";
}
