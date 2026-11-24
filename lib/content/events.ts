export type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type EventItem = {
  id: string;
  date?: string; // ISO yyyy-mm-dd — the primary date, drives upcoming/past filtering. None: a past event, listed last
  extraDates?: readonly string[]; // further bookable dates for the same event
  times?: readonly string[]; // 24h HH:mm slots, ticketed events only
  ticketTypes?: readonly TicketType[]; // present = bookable
  category: string;
  title: string;
  description: string;
  about: string; // paragraphs separated by a blank line
  placeholder: string;
  src: string;
  alt: string;
  venue?: string;
  duration?: string;
  language?: string;
  ageLimit?: string;
  layout?: string;
  seating?: string;
  stat?: string; // shown on past/recap cards instead of the date badge
  quote?: string; // shown on past/recap cards instead of the description
};

// Past experiences, from the client's "Past Events" document (Nov 2026). Photos are the ones these cards used before.
export const EVENTS: readonly EventItem[] = [
  {
    id: "rituals-of-rain",
    date: "2026-08-09",
    category: "Wellness",
    title: "Rituals of Rain",
    description: "A monsoon-inspired evening of gentle movement, water, sound and seasonal nourishment.",
    about:
      "As part of Rituals at Tavaro, a year-round platform of curated experiences centred around wellbeing, intentional living and human connection, Rituals of Rain explored the relationship between water, movement and rest.\n\n" +
      "Inspired by the monsoon, the evening brought together Tai Chi, a candlelit Sound Bath and a thoughtfully " +
      "curated sattvic dinner. From gentle movement in water to moments of stillness and nourishment, each part of " +
      "the evening offered a way to slow down, unwind and move with the season.",
    placeholder: "ph-green",
    src: "/images/wellness/stillness-retreat.jpg",
    alt: "Guests sitting together in a guided session on the lawn",
  },
  {
    id: "rituals-of-renewal",
    date: "2026-09-05",
    category: "Wellness",
    title: "Rituals of Renewal",
    description: "An evening exploring movement, gut health, fermentation and mindful creativity.",
    about:
      "As part of Rituals at Tavaro, a year-round platform of curated experiences centred around wellbeing, intentional living and human connection, Rituals of Renewal brought together movement, nourishment, transformation and mindful making.\n\n" +
      "An evening that moved through Pilates, gut health, fermentation and Kintsugi-inspired creativity, it offered " +
      "different ways to reconnect with the body, explore new practices, get hands-on and slow down. From movement " +
      "to making, each part of the evening was an invitation to pause, reset and renew.",
    placeholder: "ph-5",
    src: "/images/resorts/monsoon-table.jpg",
    alt: "A table set with seasonal food and a printed menu",
  },
  {
    id: "rituals-of-rising",
    date: "2026-10-10",
    category: "Wellness",
    title: "Rituals of Rising",
    description: "A morning reset bringing together boxing, cold-water immersion and nourishing food.",
    about:
      "As part of Rituals at Tavaro, a year-round platform of curated experiences centred around wellbeing, intentional living and human connection, Rituals of Rising was a morning reset built around movement, breath, cold water and nourishment.\n\n" +
      "The morning began with a beginner-friendly boxing session where participants learnt the fundamentals, tried " +
      "their hand at a few punches and worked up a sweat. This was followed by a pool plunge and a nourishing " +
      "breakfast, bringing together moments of effort, recovery and replenishment.\n\n" +
      "A few hours to wake the body, clear the head and start the day with intention. A ritual to rise into your day.",
    placeholder: "ph-gold",
    src: "/images/mare/rain-rhythm.jpg",
    alt: "A crowd gathered under red lights at an outdoor event",
  },
  {
    id: "solstice",
    date: "2026-06-21",
    category: "Festival",
    title: "Solstice",
    description: "A festival for conscious living.",
    about:
      "An EXP original inspired by the Summer Solstice and the spirit of International Day of Yoga, bringing " +
      "together movement, music, art, nature and meaningful connection. A day-long celebration of conscious living, " +
      "expression and experiencing life fully.",
    placeholder: "ph-green",
    src: "/images/wellness/future-retreat.jpg",
    alt: "A tree on an open lawn, with a circular path around it",
  },
  {
    id: "irl-social",
    date: "2026-08-02",
    category: "Social & Cultural",
    title: "IRL Social",
    description: "Making new friends, minus the awkward introductions and forced small talk.",
    about:
      "A social gathering designed to make adult friendships a little less complicated.\n\n" +
      "Thoughtful questions, fun games, shared activities and a science-backed matching experience to help " +
      "strangers meet, connect and hopefully leave with a new friend or two.",
    placeholder: "ph-gold",
    src: "/images/mare/coffee-house-arch.jpg",
    alt: "The arched glass front of Màre Coffee House",
  },
  {
    id: "morning-mercato",
    category: "Social & Cultural",
    title: "Morning Mercato",
    description: "A Sunday morning market bringing together local makers, fresh finds, coffee, movement and good company.",
    about:
      "A Sunday morning market bringing together movement, flowers, seasonal produce, independent design, coffee " +
      "and brunch. A recurring city ritual designed for discovery, slow mornings, local makers and good company, " +
      "where a morning run can turn into coffee, browsing, brunch and a few hours well spent.",
    placeholder: "ph-gold",
    src: "/images/mare/coffee-house-arch.jpg",
    alt: "The arched glass front of Màre Coffee House",
  },
  {
    id: "countryside",
    category: "Outdoor",
    title: "Countryside",
    description: "Outdoor experiences built around shared passions, thoughtful hospitality and time well spent.",
    about:
      "Countryside is an invitation to step away from the city's usual rhythm and spend a day differently.\n\n" +
      "Set amidst the open spaces of Tavaro Resorts, the experience brings together nature, food, music, movement " +
      "and community creating a day that feels less like an event and more like a journey outdoors.\n\n" +
      "A place to arrive without a schedule, and spend an entire day with communities that share their passions.",
    placeholder: "ph-1",
    src: "/photos/drone-hero.jpg",
    alt: "Tavaro Resorts from above at night",
    venue: "Tavaro Resorts, Kokapet",
  },
] as const;

/** Upcoming until the end of its last date, so multi-date events stay bookable. An undated event is past. */
function isUpcoming(event: EventItem, now: Date) {
  const lastDate = getBookingDates(event).at(-1);
  return Boolean(lastDate) && new Date(`${lastDate}T23:59:59`) >= now;
}

export const isPast = (event: EventItem, now = new Date()) => !isUpcoming(event, now);

export function getUpcomingEvents(now = new Date()): EventItem[] {
  return EVENTS.filter((e) => isUpcoming(e, now)).sort((a, b) => a.date!.localeCompare(b.date!));
}

export function getPastEvents(now = new Date()): EventItem[] {
  // Newest first; undated ones last.
  return EVENTS.filter((e) => !isUpcoming(e, now)).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getEvent(id: string): EventItem | undefined {
  return EVENTS.find((e) => e.id === id);
}

/** An event is bookable when it has ticket types and hasn't happened yet. */
export function isBookable(event: EventItem, now = new Date()): boolean {
  return Boolean(event.ticketTypes?.length) && isUpcoming(event, now);
}

/** Every date this event can be booked on, earliest first. */
export function getBookingDates(event: EventItem): string[] {
  return [...(event.date ? [event.date] : []), ...(event.extraDates ?? [])].sort();
}

/** Lowest ticket price, for "from ₹X" copy. */
export function getFromPrice(event: EventItem): number | undefined {
  if (!event.ticketTypes?.length) return undefined;
  return Math.min(...event.ticketTypes.map((t) => t.price));
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatEventBadge(date: string) {
  const [, month, day] = date.split("-").map(Number);
  return { day: String(day).padStart(2, "0"), month: MONTHS[month - 1] };
}

/** "18:00" → "6:00 PM" */
export function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${period}`;
}

/** "Sat, 05 Sep 2026" */
export function formatEventDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  const month = MONTHS[d.getMonth()];
  const monthTitleCase = month[0] + month.slice(1).toLowerCase();
  return `${WEEKDAYS[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} ${monthTitleCase} ${d.getFullYear()}`;
}

/** "Sat, 05 Sep 2026 · 6:00 PM"; "" for an undated event. */
export function formatEventSchedule(event: Pick<EventItem, "date" | "times">) {
  if (!event.date) return "";
  const datePart = formatEventDate(event.date);
  const first = event.times?.[0];
  return first ? `${datePart} · ${formatTime(first)}` : datePart;
}
