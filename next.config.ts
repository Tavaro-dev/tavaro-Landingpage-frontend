import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: the dev server blocks its scripts for any host but localhost, so
  // opening http://127.0.0.1:3000 rendered the page without React (no modals,
  // no navbar scroll state).
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
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
      // Gallery files have content-hashed names, so they never change in place.
      {
        source: "/gallery/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
