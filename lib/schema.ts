import { SITE_URL, publicUrl } from "./metadata";
import { VENUES } from "@/features/resorts/content/venues";
import { GALLERY_FILMS } from "@/features/resorts/content/galleryCollections";
import { getBookingDates, isBookable, type EventItem } from "./content/events";

/**
 * schema.org data (JSON-LD) that tells search engines and AI answers what each brand is.
 * Rendered by components/shared/JsonLd.tsx. Check with https://search.google.com/test/rich-results.
 */
const abs = (path: string) => `${SITE_URL}${path}`;
const ORG_ID = abs("/#organization");
const RESORT_ID = `${publicUrl("/resorts")}#resort`;

const CONTACT = { telephone: "+91-9989983029", email: "celebrate@tavaro.in" };
const SAME_AS = ["https://www.instagram.com/tavaro.resorts", "https://www.facebook.com/p/Tavaro-Resorts-61588547362755/"];
// ponytail: no street address or postcode yet; add streetAddress, postalCode and geo once the client confirms them.
const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Kokapet, Hyderabad",
  addressRegion: "Telangana",
  addressCountry: "IN",
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Tavaro Group",
      alternateName: "Tavaro",
      url: abs("/"),
      logo: abs("/icon.png"),
      description:
        "A hospitality and lifestyle group in Hyderabad creating places and experiences around a more meaningful way of living: Tavaro Resorts, Tavaro Residences, Tavaro Experiences, Wellness at Tavaro and Màre Coffee House.",
      ...CONTACT,
      address: ADDRESS,
      sameAs: SAME_AS,
      brand: ["Tavaro Resorts", "Tavaro Residences", "Tavaro Experiences", "Wellness at Tavaro", "Màre Coffee House"].map(
        (name) => ({ "@type": "Brand", name }),
      ),
    },
    { "@type": "WebSite", "@id": abs("/#website"), name: "Tavaro", url: abs("/"), publisher: { "@id": ORG_ID } },
  ],
};

export const resortSchema = {
  "@context": "https://schema.org",
  "@type": "Resort",
  "@id": RESORT_ID,
  name: "Tavaro Resorts",
  url: publicUrl("/resorts"),
  image: [abs("/og/resorts.jpg"), abs("/og/resorts-venues.jpg"), abs("/og/resorts-accommodations.jpg")],
  description:
    "A 16-acre resort in Kokapet, Hyderabad, with 13 rooms and suites, six wedding and event venues for 50 to 4,000 guests, a restaurant, Màre Coffee House and Sol Pilates Studio.",
  ...CONTACT,
  address: ADDRESS,
  hasMap: "https://www.google.com/maps/search/?api=1&query=Tavaro+Resorts%2C+Kokapet%2C+Hyderabad",
  numberOfRooms: 13,
  amenityFeature: ["Event lawns", "Banquet hall", "Swimming pool", "Restaurant", "Coffee house", "Pilates studio"].map(
    (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
  ),
  priceRange: "₹18,500 to ₹95,000 per night",
  containsPlace: VENUES.map((v) => ({
    "@type": "EventVenue",
    name: v.name,
    description: `${v.kind}. ${v.bestFor}`,
    maximumAttendeeCapacity: v.floating,
    url: `${publicUrl("/resorts/venues")}#spaces`,
  })),
  parentOrganization: { "@id": ORG_ID },
  sameAs: SAME_AS,
};

/** The resort gallery's two films (/resorts/photos), so Google can list them in video results. */
export const galleryVideosSchema = {
  "@context": "https://schema.org",
  "@graph": GALLERY_FILMS.map((film) => ({
    "@type": "VideoObject",
    name: `${film.title} — Tavaro Resorts, Kokapet, Hyderabad`,
    description: `${film.title}: a film from Tavaro Resorts, a wedding and event venue in Kokapet, Hyderabad.`,
    thumbnailUrl: abs(film.poster),
    contentUrl: abs(film.src),
    uploadDate: "2026-11-15T00:00:00+05:30", // when the client's films were added
    width: film.w,
    height: film.h,
    publisher: { "@id": ORG_ID },
  })),
};

export const mareSchema = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Màre Coffee House",
  url: publicUrl("/mare"),
  image: abs("/og/mare.jpg"),
  description:
    "Màre is Tavaro's coffee house at Tavaro Resorts, Kokapet: specialty coffee and single-origin pour overs, artisanal bakery, all-day breakfast and light plates.",
  servesCuisine: ["Coffee", "Bakery", "Breakfast"],
  ...CONTACT,
  address: ADDRESS,
  containedInPlace: { "@id": RESORT_ID },
  parentOrganization: { "@id": ORG_ID },
};

/** One event; times are Hyderabad time (+05:30). */
export function eventSchema(event: EventItem) {
  const dates = getBookingDates(event);
  const at = (date: string, time?: string) => (time ? `${date}T${time}:00+05:30` : date);
  const bookable = isBookable(event);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.about || event.description,
    image: abs(event.src),
    url: publicUrl(`/experiences/${event.id}`),
    startDate: at(dates[0], event.times?.[0]),
    endDate: dates.at(-1),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.venue ?? "Tavaro Resorts, Kokapet", address: ADDRESS },
    organizer: { "@type": "Organization", "@id": ORG_ID, name: "Tavaro Group", url: abs("/") },
    ...(event.ticketTypes?.length ? {
      offers: event.ticketTypes.map((t) => ({
        "@type": "Offer",
        name: t.name,
        price: t.price,
        priceCurrency: "INR",
        availability: bookable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        url: publicUrl(`/experiences/${event.id}/book`),
      })),
    } : {}),
  };
}
