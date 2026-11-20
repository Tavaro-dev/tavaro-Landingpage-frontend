import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: the dev server blocks its scripts for any host but localhost, so
  // opening http://127.0.0.1:3000 rendered the page without React (no modals,
  // no navbar scroll state).
  allowedDevOrigins: ["127.0.0.1"],
  // Next.js upgrade reminders during dev/build: only security fixes.
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Register interest is a window over the page now: the old page's address opens it on Residences.
  async redirects() {
    return [{ source: "/residences/register", destination: "/residences#register-interest", permanent: true }];
  },
  // ponytail: baseline headers only; add a CSP once third-party scripts/embeds are settled
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Gallery and hero files have content-hashed names, so they never change in place.
      {
        source: "/:dir(gallery|heroes)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Other public files keep their names when replaced, so a day's cache, then served from the cache while
      // the browser refreshes it in the background. Without this every image (and its optimized copies, which
      // inherit the header) is re-checked with the server on every page view, so photos show late or flicker.
      {
        source: "/:dir(images|photos|icons|brand|videos|downloads)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=2592000" }],
      },
    ];
  },
};

export default nextConfig;
