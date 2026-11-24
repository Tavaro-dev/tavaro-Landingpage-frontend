import type { FaqItem } from "@/components/shared/Faq";
import { CONTACT } from "@/lib/env";
import { CATERING_FROM, VENUES } from "./venues";

const n = (x: number) => x.toLocaleString("en-IN");
const largest = VENUES.reduce((a, b) => (b.floating > a.floating ? b : a));
const smallest = VENUES.reduce((a, b) => (b.seated < a.seated ? b : a));
const hall = VENUES.find((v) => v.id === "sanctuary-hall");

/** Answers use only facts published on the site (venues.ts, rooms, location); keep them in step with those. */
export const VENUE_FAQ: FaqItem[] = [
  {
    q: "How many guests can Tavaro Resorts host?",
    a: `Tavaro Resorts in Kokapet, Hyderabad, has ${VENUES.length} event spaces across 16 acres, for ${n(smallest.seated)} to ${n(largest.floating)} guests. The largest, ${largest.name}, seats ${n(largest.seated)} or holds ${n(largest.floating)} standing.`,
  },
  {
    q: "Which venue suits which function?",
    a: VENUES.map((v) => `${v.name} (${v.kind.toLowerCase()}, ${n(v.seated)} seated): ${v.bestFor}`).join(" "),
  },
  ...(hall
    ? [
        {
          q: "Is there an indoor, air-conditioned venue?",
          a: `Yes. ${hall.name} is an air-conditioned indoor hall of ${n(hall.sqft ?? 0)} sq ft that seats ${n(hall.seated)} or holds ${n(hall.floating)} standing.`,
        },
      ]
    : []),
  {
    q: "How much does wedding catering cost at Tavaro?",
    a: `In-house catering starts from ₹${n(CATERING_FROM)} per plate, taxes extra, with live kitchens that cook in front of guests. Outside caterers are welcome too. Venue prices are shared on request.`,
  },
  {
    q: "Can we bring our own decorators and vendors?",
    a: "Yes. Use Tavaro's in-house décor team, or bring your own vendors. The team can also introduce trusted décor, photography, entertainment and planning partners.",
  },
  {
    q: "Can the couple and family stay at the resort?",
    a: "Yes. Tavaro Resorts has 13 rooms: 6 suites and 7 executive rooms. Tavaro House, a four-bedroom heritage villa for up to 8 adults, is reserved for Tavaro Lawn bookings.",
  },
  {
    q: "Is there parking for guests?",
    a: "Yes. The resort has on-site parking for up to 1,500 cars.",
  },
  {
    q: "Where is Tavaro Resorts, and how far is it from the city?",
    a: "Tavaro Resorts is in Kokapet, West Hyderabad, Telangana: about 15 minutes from Gachibowli, 30 minutes from Jubilee Hills Checkpost and 35 minutes from Rajiv Gandhi International Airport.",
  },
  {
    q: "How do I book a venue or a site visit?",
    a: `Send your dates and guest count on WhatsApp or call ${CONTACT.phone}, or email ${CONTACT.email}. The team checks availability and sets up a site visit at a time that suits you.`,
  },
];
