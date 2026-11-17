// Outside production the app runs against mock services (demo cart, checkout).
// Enquiries go through Lekvya in production; booking/payment stay mock locally.
export const DEMO_SERVICES = process.env.NODE_ENV !== "production";

export const CONTACT = {
  phone: "+91 998 998 3029",
  phoneHref: "tel:+919989983029",
  whatsappHref: "https://wa.me/919989983029",
  email: "celebrate@tavaro.in",
} as const;

/** Lekvya public form API — safe for server-side enquiry submissions. */
export const LEKVYA = {
  publicKey: process.env.LEKVYA_PUBLIC_KEY ?? "pk_live_1250e9bb1ea61424c65438a752a5729f",
  sendFormUrl: "https://api.lekvya.yugminds.org/api/v1/send-form",
} as const;
