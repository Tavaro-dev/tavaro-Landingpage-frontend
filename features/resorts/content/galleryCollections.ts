// The gallery's occasions, in page order, following the client's folders. Photos come from
// galleryPhotos.ts (generated); each sub-section's `name` is the `l` value its photos carry.
// The gallery is for the feel of the place: no counts, capacities or prices in its words.

/** Light rooms are the classic, daytime occasions; dark rooms are events after dark. */
export type GalleryTheme = "light" | "dark";

/** A client film: it opens its chapter and is that chapter's soundtrack. */
export type GalleryFilm = {
  title: string;
  theme: GalleryTheme;
  /** Playback volume, evening out the two films' loudness. */
  volume: number;
  src: string;
  poster: string;
  w: number;
  h: number;
};

export type GallerySub = { name: string; note: string };

export type GalleryCollection = {
  id: string;
  title: string;
  /** The name in the occasion bar, short enough for all seven to sit on one line. */
  short: string;
  /** One line under the title: what this occasion covers. */
  line: string;
  /** Sub-sections in the client's order. Empty: the occasion is one set of photos. */
  subs: GallerySub[];
  link?: { label: string; href: string };
  theme: GalleryTheme;
};

const V = "/gallery/videos";

/** The client's two films, one per chapter of the page. */
export const GALLERY_FILMS: GalleryFilm[] = [
  {
    title: "A wedding at Tavaro",
    theme: "light",
    volume: 0.9,
    src: `${V}/wedding-film-5566b35f.mp4`,
    poster: `${V}/wedding-film-e61cdb61.webp`,
    w: 1920,
    h: 1080,
  },
  {
    title: "Reception night",
    theme: "dark",
    volume: 0.55,
    src: `${V}/sanctuary-night-f81b2925.mp4`,
    poster: `${V}/sanctuary-night-54c1d05d.webp`,
    w: 720,
    h: 1280,
  },
];

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  {
    id: "weddings",
    short: "Weddings",
    title: "Weddings & Receptions",
    line: "Pheras under the open sky and receptions under the lights, on our two lawns and in the glass hall.",
    subs: [
      {
        name: "Tavaro Lawn",
        note: "Our largest lawn, dressed with mandaps, lounges and lights.",
      },
      {
        name: "Sanctuary Hall & Lawn",
        note: "The glass hall under its wooden roof, opening onto its own lawn.",
      },
    ],
    link: { label: "See the venues", href: "/resorts/venues" },
    theme: "light",
  },
  {
    id: "ceremonies",
    short: "Sangeet & Haldi",
    title: "Sangeet, Haldi & Mehendi",
    line: "Turmeric mornings around the old tree and sangeet nights on the lawn.",
    subs: [
      { name: "Haldi & Mehendi", note: "Yellow drapes, marigolds and swings around the 250-year-old tree." },
      { name: "Sangeet", note: "A stage, lights, fog and a dance floor under the lit trees." },
    ],
    link: { label: "See the venues", href: "/resorts/venues" },
    theme: "light",
  },
  {
    id: "food-decor",
    short: "Food & Décor",
    title: "Food & Décor",
    line: "What our kitchen serves and what our partner decorators build.",
    subs: [
      {
        name: "Food & Catering",
        note: "Plated dinners, live counters and slow breakfasts from our kitchen.",
      },
      {
        name: "Décor & Partner Decorators",
        note: "Floral chandeliers, entrances, mandaps and lounges by our partner decorators.",
      },
    ],
    theme: "light",
  },
  {
    id: "spaces",
    short: "Spaces",
    title: "Spaces",
    line: "The lawns, hall, decks, villa and rooms you can book, seen before the guests arrive.",
    subs: [
      {
        name: "Tavaro Lawn",
        note: "Open lawn under a wide sky, ready for the biggest nights.",
      },
      {
        name: "Sanctuary Hall & Lawn",
        note: "A cool glass hall that opens onto a private lawn.",
      },
      { name: "Tavaro House", note: "The heritage villa and its backyard, where the couple can stay." },
      { name: "Pool Deck", note: "A chequered deck around the pool, lit for long evenings." },
      { name: "Tree Deck", note: "A deck built around a 250-year-old tree." },
      { name: "Rooms & Stays", note: "Rooms and suites on the grounds, for the family and guests." },
      { name: "Resort & Aerials", note: "The grounds from above and at sunset." },
    ],
    link: { label: "Spaces and capacities", href: "/resorts/venues" },
    theme: "light",
  },
  {
    id: "celebrations",
    short: "Engagements",
    title: "Engagements & Parties",
    line: "Ring ceremonies, proposals, birthdays and Diwali nights, set at the size of the occasion.",
    subs: [
      { name: "Engagements", note: "Monogram backdrops, the ring exchange and fireworks to finish." },
      { name: "Proposals", note: "A canopy of fairy lights over a table for two on the lawn." },
      { name: "Birthdays & dinners", note: "Long tables by the pool under strings of light." },
      { name: "Diwali & festive", note: "Floor seating, marigolds and card games in festive colour." },
    ],
    link: { label: "Plan a celebration", href: "/resorts/things-to-do/create" },
    theme: "dark",
  },
  {
    id: "corporate",
    short: "Corporate",
    title: "Corporate, Offsites & Experiences",
    line: "Offsites, conferences, launches and wellness days for teams and brands.",
    subs: [
      { name: "Team offsites", note: "Team games and group days on the open lawns." },
      { name: "Conferences", note: "Registration, sessions and lunches in the pavilion." },
      { name: "Brand launches", note: "Cars on the lawn, grazing tables and an arrival to remember." },
      { name: "Wellness & rituals", note: "Sound baths with gongs, poolside yoga and quiet rituals." },
      { name: "Curated experiences", note: "Long lunches on the pool deck, plated dinners and garden activities." },
    ],
    link: { label: "Explore experiences", href: "/experiences" },
    theme: "dark",
  },
  {
    id: "tables",
    short: "Tables",
    title: "Tables & Gatherings",
    line: "Long tables on the lawn and candlelit dinners for two by the pool.",
    subs: [],
    link: { label: "Create your experience", href: "/resorts/things-to-do/create" },
    theme: "dark",
  },
];

export const collectionTitle = (id: string) => GALLERY_COLLECTIONS.find((c) => c.id === id)?.title ?? "";
