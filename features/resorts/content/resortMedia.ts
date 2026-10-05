export type ResortMediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
};

export type ResortMediaCategory = {
  id: "overview" | "events" | "dining" | "accommodation";
  title: string;
  subtitle: string;
  countLabel: string;
  featuredMedia: ResortMediaItem;
  items: ResortMediaItem[];
};

export const RESORT_MEDIA_CATEGORIES: ResortMediaCategory[] = [
  {
    id: "overview",
    title: "RESORT OVERVIEW",
    subtitle: "Grounds, Tavaro House & Serene Vistas",
    countLabel: "4 PHOTOS",
    featuredMedia: {
      id: "overview-1",
      type: "image",
      src: "/photos/resorts-horses.jpg",
      alt: "Horses on the expansive green grounds at Tavaro Resorts, Kokapet",
      caption: "The expansive natural grounds of Tavaro Resorts in Kokapet",
    },
    items: [
      {
        id: "overview-1",
        type: "image",
        src: "/photos/resorts-horses.jpg",
        alt: "Horses on the expansive green grounds at Tavaro Resorts, Kokapet",
        caption: "The expansive natural grounds of Tavaro Resorts in Kokapet",
      },
      {
        id: "overview-2",
        type: "image",
        src: "/images/unsplash/resorts-tavaro-house.jpg",
        alt: "Tavaro House resort courtyard architecture and warm ambient lighting",
        caption: "Tavaro House architecture and central courtyard",
      },
      {
        id: "overview-3",
        type: "image",
        src: "/images/unsplash/resorts-tavaro-house-2.jpg",
        alt: "Lush gardens surrounding the resort pathways",
        caption: "Lush garden pathways and tranquil seating areas",
      },
      {
        id: "overview-4",
        type: "image",
        src: "/photos/drone-hero.jpg",
        alt: "Aerial overview of Tavaro Resorts grounds and surrounding landscape",
        caption: "Aerial view of Tavaro Resorts estate",
      },
    ],
  },
  {
    id: "events",
    title: "EVENTS",
    subtitle: "Weddings, Lawns & Celebrations",
    countLabel: "2 PHOTOS",
    featuredMedia: {
      id: "events-1",
      type: "image",
      src: "/images/unsplash/resorts-wedding-celebration.jpg",
      alt: "A wedding celebration set up across Tavaro Resorts event lawns",
      caption: "Grand wedding celebrations and open-air lawn events",
    },
    items: [
      {
        id: "events-1",
        type: "image",
        src: "/images/unsplash/resorts-wedding-celebration.jpg",
        alt: "A wedding celebration set up across Tavaro Resorts event lawns",
        caption: "Grand wedding celebrations and open-air lawn events",
      },
      {
        id: "events-2",
        type: "image",
        src: "/photos/experiences-cars.jpg",
        alt: "Exclusive gatherings and curated experiences on Tavaro grounds",
        caption: "Curated gatherings and private corporate retreats",
      },
    ],
  },
  {
    id: "dining",
    title: "DINING",
    subtitle: "The Monsoon Table & Màre Coffee House",
    countLabel: "2 PHOTOS",
    featuredMedia: {
      id: "dining-1",
      type: "image",
      src: "/images/unsplash/monsoon-table-culinary.jpg",
      alt: "Culinary presentation at The Monsoon Table, Tavaro Resorts",
      caption: "Bespoke culinary dining at The Monsoon Table",
    },
    items: [
      {
        id: "dining-1",
        type: "image",
        src: "/images/unsplash/monsoon-table-culinary.jpg",
        alt: "Culinary presentation at The Monsoon Table, Tavaro Resorts",
        caption: "Bespoke culinary dining at The Monsoon Table",
      },
      {
        id: "dining-2",
        type: "image",
        src: "/images/unsplash/mare-coffee.jpg",
        alt: "Artisanal coffee brewed at Màre Coffee House",
        caption: "Artisanal coffee and quiet moments at Màre Coffee House",
      },
    ],
  },
  {
    id: "accommodation",
    title: "ACCOMMODATION",
    subtitle: "Suites, Garden Rooms & Restful Retreats",
    countLabel: "4 PHOTOS",
    featuredMedia: {
      id: "accommodation-1",
      type: "image",
      src: "/images/unsplash/resorts-suite.jpg",
      alt: "Restful suite interior with natural materials and garden views",
      caption: "Tavaro Resort Suite designed for quiet rest",
    },
    items: [
      {
        id: "accommodation-1",
        type: "image",
        src: "/images/unsplash/resorts-suite.jpg",
        alt: "Restful suite interior with natural materials and garden views",
        caption: "Tavaro Resort Suite designed for quiet rest",
      },
      {
        id: "accommodation-2",
        type: "image",
        src: "/images/unsplash/resorts-suite-2.jpg",
        alt: "Suite living area opening onto private garden terrace",
        caption: "Suite lounge opening onto private terrace views",
      },
      {
        id: "accommodation-3",
        type: "image",
        src: "/images/unsplash/resorts-executive-room.jpg",
        alt: "Executive room with warm lighting and plush bedding",
        caption: "Executive Garden Room restful atmosphere",
      },
      {
        id: "accommodation-4",
        type: "image",
        src: "/images/unsplash/resorts-executive-room-2.jpg",
        alt: "Executive room seating corner with natural sunlight",
        caption: "Thoughtful in-room seating and reading space",
      },
    ],
  },
];
