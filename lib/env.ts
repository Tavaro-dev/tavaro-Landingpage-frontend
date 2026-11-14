// No backend exists yet. Outside production the app runs against mock
// services (demo cart, checkout, enquiries); in production those flows are
// replaced by third-party booking links and direct-contact fallbacks.
export const DEMO_SERVICES = process.env.NODE_ENV !== "production";

export const CONTACT = {
  phone: "+91 998 998 3029",
  phoneHref: "tel:+919989983029",
  whatsappHref: "https://wa.me/919989983029",
  email: "celebrate@tavaro.in",
} as const;
