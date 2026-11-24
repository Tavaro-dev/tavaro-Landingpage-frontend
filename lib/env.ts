import type { Section } from "./subdomains";

// Outside production the app runs against mock services (demo cart, checkout).
// Enquiries go through Lekvya in production; booking/payment stay mock locally.
export const DEMO_SERVICES = process.env.NODE_ENV !== "production";

export const CONTACT = {
  phone: "+91 998 998 3029",
  phoneHref: "tel:+919989983029",
  whatsappHref: "https://wa.me/919989983029",
  email: "celebrate@tavaro.in",
} as const;

/**
 * Lekvya public form API — safe for server-side enquiry submissions. Each key delivers to its own inbox:
 * a form sent from a brand site (lib/subdomains.ts) uses that brand's key. The resort key is the default:
 * it also takes the group pages (home, About, Contact) and any brand without a key of its own.
 * The keys live in .env (and the host's environment variables), never in the code: see .env.example.
 */
export const LEKVYA = {
  siteKeys: {
    resort: process.env.LEKVYA_KEY_RESORT,
    residences: process.env.LEKVYA_KEY_RESIDENCES,
    experiences: process.env.LEKVYA_KEY_EXPERIENCES,
    wellness: process.env.LEKVYA_KEY_WELLNESS,
    mare: process.env.LEKVYA_KEY_MARE,
  } as Record<Section, string | undefined>,
  sendFormUrl: "https://api.lekvya.yugminds.org/api/v1/send-form",
} as const;
