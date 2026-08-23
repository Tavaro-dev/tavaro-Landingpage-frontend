export type UpcomingEvent = {
  id: string;
  day: string;
  month: string;
  category: string;
  title: string;
  description: string;
  placeholder: string;
  src: string;
  alt: string;
};

export type PastEvent = {
  id: string;
  stat: string;
  title: string;
  quote: string;
  placeholder: string;
  src: string;
  alt: string;
};

export const UPCOMING_EVENTS: readonly UpcomingEvent[] = [
  {
    id: "stillness-project",
    day: "12",
    month: "OCT",
    category: "Wellness",
    title: "The Stillness Project",
    description: "A one-day retreat of movement, breathwork and quiet, held across the grounds.",
    placeholder: "ph-green",
    src: "/images/unsplash/stillness-retreat.jpg",
    alt: "The Stillness Project retreat",
  },
  {
    id: "monsoon-table",
    day: "28",
    month: "SEP",
    category: "Culinary",
    title: "Monsoon Table",
    description: "A seasonal dining experience celebrating the last of the monsoon harvest.",
    placeholder: "ph-5",
    src: "/images/unsplash/monsoon-table-culinary.jpg",
    alt: "Monsoon Table dining experience",
  },
  {
    id: "rain-rhythm",
    day: "05",
    month: "OCT",
    category: "Social & Cultural",
    title: "Rain & Rhythm",
    description: "Music, chai and conversation at Màre Coffee House.",
    placeholder: "ph-gold",
    src: "/images/unsplash/rain-rhythm-mare.jpg",
    alt: "Rain and Rhythm at Màre",
  },
] as const;

export const PAST_EVENTS: readonly PastEvent[] = [
  {
    id: "founders-night",
    stat: "~800 Guests",
    title: "Founders' Night",
    quote: "Nothing in Kokapet felt like that night.",
    placeholder: "ph-1",
    src: "/photos/drone-hero.jpg",
    alt: "An aerial view of Founders' Night at Tavaro",
  },
  {
    id: "live-at-mare",
    stat: "Sold Out",
    title: "Live at Màre",
    quote: "An evening that didn't need an encore.",
    placeholder: "ph-gold",
    src: "/images/unsplash/mare-community-coffee-house.jpg",
    alt: "A live evening at Màre Coffee House",
  },
  {
    id: "stillness-retreat-recap",
    stat: "Fully Booked",
    title: "The Stillness Retreat",
    quote: "Curated in a way that actually felt curated.",
    placeholder: "ph-green",
    src: "/images/unsplash/wellness-future-retreat.jpg",
    alt: "Guests at The Stillness Retreat",
  },
] as const;
