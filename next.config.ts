import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: the dev server blocks its scripts for any host but localhost, so
  // opening http://127.0.0.1:3000 rendered the page without React (no modals,
  // no navbar scroll state).
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 for full-bleed heroes, where 75 visibly softens detail; 75 everywhere else.
    qualities: [75, 90],
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
    ];
  },
};

export default nextConfig;
