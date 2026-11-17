import type { StaticImageData } from "next/image";
import tavaroLawn from "@/public/images/resorts/venues/tavaro-lawn.jpg";
import sanctuaryLawn from "@/public/images/resorts/venues/sanctuary-lawn.jpg";
import sanctuaryHall from "@/public/images/resorts/venues/sanctuary-hall.jpg";
import poolDeck from "@/public/images/resorts/venues/pool-deck.jpg";
import tavaroHouse from "@/public/images/resorts/venues/tavaro-house.jpg";
import treeDeck from "@/public/images/resorts/venues/tree-deck.jpg";

// Source: the client's "Spaces & Capacities" and "How to Book" sheets (Start Here pack, Nov 2026).
// The older A5 brochure gives different guest ranges; these sheets are the current figures.
// Areas: the A5 brochure, with Sanctuary Lawn from the master plan (160 ft x 150 ft).
// Tree age: 250 years (client confirmed, Nov 2026).

export type Venue = {
  id: string;
  name: string;
  kind: string;
  seated: number;
  /** Standing / cocktail format. */
  floating: number;
  /** Area in square feet, where the client gives one. */
  sqft?: number;
  bestFor: string;
  photo: StaticImageData;
  alt: string;
};

export const VENUES: Venue[] = [
  {
    id: "tavaro-lawn",
    name: "Tavaro Lawn",
    kind: "Outdoor lawn",
    seated: 2500,
    floating: 4000,
    sqft: 60000,
    bestFor: "Weddings and receptions. Our largest lawn.",
    photo: tavaroLawn,
    alt: "Tavaro Lawn at night from above, set for a wedding, with the city skyline beyond",
  },
  {
    id: "sanctuary-lawn",
    name: "Sanctuary Lawn",
    kind: "Outdoor lawn",
    seated: 500,
    floating: 600,
    sqft: 24000,
    bestFor: "Mehendi, sangeet and engagements.",
    photo: sanctuaryLawn,
    alt: "Sanctuary Lawn from above at dusk, lit for an evening celebration",
  },
  {
    id: "sanctuary-hall",
    name: "Sanctuary Hall",
    kind: "Indoor hall, air-conditioned",
    seated: 250,
    floating: 350,
    sqft: 4000,
    bestFor: "Intimate indoor celebrations.",
    photo: sanctuaryHall,
    alt: "Sanctuary Hall lit up at night, a glass hall under a pitched roof",
  },
  {
    id: "pool-deck",
    name: "Pool & Pool Deck",
    kind: "Poolside",
    seated: 100,
    floating: 150,
    sqft: 15000,
    bestFor: "Haldi mornings and poolside evenings.",
    photo: poolDeck,
    alt: "A long dinner table set on the pool deck, seen from above",
  },
  {
    id: "tavaro-house",
    name: "Tavaro House & Backyard",
    kind: "Heritage villa",
    seated: 50,
    floating: 100,
    bestFor: "Rituals, family lunches and photos. The couple can stay here too.",
    photo: tavaroHouse,
    alt: "A guest outside the arched front of Tavaro House",
  },
  {
    id: "tree-deck",
    name: "Tree Deck",
    kind: "Outdoor deck around a 250-year-old tree",
    seated: 120,
    floating: 200,
    sqft: 12000,
    bestFor: "Rituals and photo moments.",
    photo: treeDeck,
    alt: "The Tree Deck: curved lawn terraces beneath the 250-year-old tree",
  },
];

/** In-house catering, per plate, taxes extra. */
export const CATERING_FROM = 2500;

/** Resort facilities, from the A5 brochure. */
export const FACILITIES = [
  "A 40 ft pool, with a baby pool",
  "A 6,000 sq ft catering kitchen",
  "Parking for up to 1,500 cars",
  "Audio equipment on site",
  "Outdoor games equipment",
  "Clean restrooms across the resort",
  "Reliable power and water supply",
];

/** The client's one-page sheet, served from public/downloads. */
export const SPACES_SHEET = { href: "/downloads/tavaro-spaces-and-capacities.pdf", size: "420 KB" };
