// The gallery's sections, in page order. Photos come from galleryPhotos.ts (generated);
// each section's groups are the `l` values its photos carry, shown in the order listed here.

export type GalleryFilm = {
  title: string;
  /** Full film with sound, a short silent loop for the tile, and its poster. */
  src: string;
  loop: string;
  poster: string;
  w: number;
  h: number;
};

export type GalleryCollection = {
  id: string;
  title: string;
  /** What Tavaro does for this occasion, in a sentence. */
  blurb: string;
  groups: string[];
  link?: { label: string; href: string };
  films?: GalleryFilm[];
};

const V = "/gallery/videos";

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  {
    id: "weddings",
    title: "Weddings & Receptions",
    blurb:
      "Ceremonies and receptions on the Tavaro Lawn and in the Sanctuary Hall and Lawn, from the mandap at dusk to the last dance.",
    groups: ["Tavaro Lawn", "Sanctuary Hall & Lawn"],
    link: { label: "See the venues", href: "/resorts/venues" },
    films: [
      {
        title: "A wedding film at Tavaro",
        src: `${V}/wedding-film-96ff1083.mp4`,
        loop: `${V}/wedding-film-loop-02537546.mp4`,
        poster: `${V}/wedding-film-e61cdb61.webp`,
        w: 1920,
        h: 1080,
      },
      {
        title: "A reception night in the Sanctuary Hall",
        src: `${V}/sanctuary-night-f81b2925.mp4`,
        loop: `${V}/sanctuary-night-loop-1d391098.mp4`,
        poster: `${V}/sanctuary-night-54c1d05d.webp`,
        w: 720,
        h: 1280,
      },
    ],
  },
  {
    id: "ceremonies",
    title: "Sangeet, Haldi & Mehendi",
    blurb: "Haldi and mehendi mornings under the old trees and in the courtyards, and sangeet nights that run late.",
    groups: ["Haldi & Mehendi", "Sangeet"],
    link: { label: "See the venues", href: "/resorts/venues" },
  },
  {
    id: "celebrations",
    title: "Engagements & Parties",
    blurb: "Engagements, proposals, birthdays and festive nights, from a table for two to a lawn full of guests.",
    groups: ["Engagements", "Proposals", "Birthdays & dinners", "Diwali & festive"],
    link: { label: "Plan a celebration", href: "/resorts/things-to-do/create" },
  },
  {
    id: "corporate",
    title: "Corporate, Offsites & Experiences",
    blurb:
      "Team offsites, conferences, brand launches and wellness sessions, with room to meet, play and eat together.",
    groups: ["Team offsites", "Conferences", "Brand launches", "Wellness & rituals", "Curated experiences"],
    link: { label: "Explore experiences", href: "/experiences" },
  },
  {
    id: "spaces",
    title: "Spaces",
    blurb: "Every lawn, hall, deck and room you can book, seen on its own before the guests arrive.",
    groups: [
      "Tavaro Lawn",
      "Sanctuary Hall & Lawn",
      "Tavaro House",
      "Pool Deck",
      "Tree Deck",
      "Rooms & Stays",
      "Resort & Aerials",
    ],
    link: { label: "Spaces and capacities", href: "/resorts/venues" },
  },
  {
    id: "food-decor",
    title: "Food & Décor",
    blurb: "What our kitchens serve, and what our partner decorators build for each occasion.",
    groups: ["Food & Catering", "Décor"],
  },
  {
    id: "tables",
    title: "Tables & Gatherings",
    blurb: "Long tables, private dinners and supper clubs, set on the lawns, by the pool and under the trees.",
    groups: [],
    link: { label: "Create your experience", href: "/resorts/things-to-do/create" },
  },
];

export const collectionTitle = (id: string) => GALLERY_COLLECTIONS.find((c) => c.id === id)?.title ?? "";
