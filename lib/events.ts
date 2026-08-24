export type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type EventItem = {
  id: string;
  date: string; // ISO yyyy-mm-dd — the primary date, drives upcoming/past filtering
  extraDates?: readonly string[]; // further bookable dates for the same event
  times?: readonly string[]; // 24h HH:mm slots, ticketed events only
  ticketTypes?: readonly TicketType[]; // present = bookable
  category: string;
  title: string;
  description: string;
  about: string;
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

export const EVENTS: readonly EventItem[] = [
  {
    id: "stillness-project",
    date: "2026-10-12",
    times: ["07:00"],
    category: "Wellness",
    title: "The Stillness Project",
    description: "A one-day retreat of movement, breathwork and quiet, held across the grounds.",
    about:
      "The Stillness Project is a day-long retreat moving through guided breathwork, slow movement and quiet " +
      "sitting practice, held across the resort grounds from sunrise. Come as you are — no experience needed.",
    placeholder: "ph-green",
    src: "/images/unsplash/stillness-retreat.jpg",
    alt: "The Stillness Project retreat",
    venue: "Tavaro Resorts, Kokapet",
    duration: "6 Hours",
    language: "English",
    ageLimit: "16 and above",
    layout: "Outdoor",
    seating: "Mat seating",
    ticketTypes: [
      { id: "day-pass", name: "Day Pass", price: 2500, description: "Full access to all sessions, plus tea service." },
      {
        id: "day-pass-lunch",
        name: "Day Pass + Lunch",
        price: 3400,
        description: "Everything in the Day Pass, with a seasonal lunch at the estate.",
      },
      {
        id: "partner-pass",
        name: "Partner Pass",
        price: 4500,
        description: "Two Day Passes with adjacent mats, for practising together.",
      },
    ],
  },
  {
    id: "monsoon-table",
    date: "2026-09-28",
    times: ["19:30"],
    category: "Culinary",
    title: "Monsoon Table",
    description: "A seasonal dining experience celebrating the last of the monsoon harvest.",
    about:
      "Monsoon Table is a seasonal tasting menu built around the last of the monsoon harvest, served family-style " +
      "under the estate's canopy with pairings chosen by our resident chef.",
    placeholder: "ph-5",
    src: "/images/unsplash/monsoon-table-culinary.jpg",
    alt: "Monsoon Table dining experience",
    venue: "Tavaro Resorts, Kokapet",
    duration: "2 Hours 30 Minutes",
    language: "English, Telugu",
    ageLimit: "All ages",
    layout: "Outdoor",
    seating: "Seated",
    ticketTypes: [
      {
        id: "communal-table",
        name: "Communal Table",
        price: 4500,
        description: "A seat at the long table, with the full tasting menu.",
      },
      {
        id: "chefs-counter",
        name: "Chef's Counter",
        price: 6500,
        description: "A counter seat beside the kitchen, with extra courses and pairings.",
      },
    ],
  },
  {
    id: "rain-rhythm",
    date: "2026-09-05",
    extraDates: ["2026-09-12", "2026-09-19"],
    times: ["18:00", "20:30"],
    category: "Social & Cultural",
    title: "Rain & Rhythm",
    description: "Music, chai and conversation at Màre Coffee House.",
    about:
      "Rain & Rhythm brings live acoustic sets, hand-brewed chai and unhurried conversation to Màre Coffee House " +
      "for a monsoon evening built for slowing down.",
    placeholder: "ph-gold",
    src: "/images/unsplash/rain-rhythm-mare.jpg",
    alt: "Rain and Rhythm at Màre",
    venue: "Màre Coffee House",
    duration: "3 Hours",
    language: "English, Hindi",
    ageLimit: "All ages",
    layout: "Indoor",
    seating: "Seated",
    ticketTypes: [
      { id: "early-bird", name: "Early Bird", price: 800, description: "One seat, with a cup of the evening's brew." },
      { id: "couple", name: "Couple Ticket", price: 1400, description: "Two seats together, with a shared chai board." },
      { id: "group-5", name: "For 5 People", price: 3200, description: "A reserved table for five, with a chai board." },
    ],
  },
  {
    id: "founders-night",
    date: "2026-06-14",
    category: "Social & Cultural",
    title: "Founders' Night",
    description: "An evening marking the opening of Tavaro Resorts, Kokapet.",
    about: "Founders' Night marked the opening of Tavaro Resorts, Kokapet, with an evening of music and celebration.",
    placeholder: "ph-1",
    src: "/photos/drone-hero.jpg",
    alt: "An aerial view of Founders' Night at Tavaro",
    venue: "Tavaro Resorts, Kokapet",
    stat: "~800 Guests",
    quote: "Nothing in Kokapet felt like that night.",
  },
  {
    id: "live-at-mare",
    date: "2026-07-19",
    category: "Social & Cultural",
    title: "Live at Màre",
    description: "A live evening of music at Màre Coffee House.",
    about: "Live at Màre was an evening of live music at Màre Coffee House, running from dusk into a full house.",
    placeholder: "ph-gold",
    src: "/images/unsplash/mare-community-coffee-house.jpg",
    alt: "A live evening at Màre Coffee House",
    venue: "Màre Coffee House",
    stat: "Sold Out",
    quote: "An evening that didn't need an encore.",
  },
  {
    id: "stillness-retreat-recap",
    date: "2026-08-02",
    category: "Wellness",
    title: "The Stillness Retreat",
    description: "A retreat of movement, breathwork and quiet.",
    about: "The Stillness Retreat moved guests through breathwork, slow movement and quiet sitting practice.",
    placeholder: "ph-green",
    src: "/images/unsplash/wellness-future-retreat.jpg",
    alt: "Guests at The Stillness Retreat",
    venue: "Tavaro Resorts, Kokapet",
    stat: "Fully Booked",
    quote: "Curated in a way that actually felt curated.",
  },
] as const;

function isUpcoming(event: EventItem, now: Date) {
  return new Date(`${event.date}T23:59:59`) >= now;
}

export function getUpcomingEvents(now = new Date()): EventItem[] {
  return EVENTS.filter((e) => isUpcoming(e, now)).sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(now = new Date()): EventItem[] {
  return EVENTS.filter((e) => !isUpcoming(e, now)).sort((a, b) => b.date.localeCompare(a.date));
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
  return [event.date, ...(event.extraDates ?? [])].sort();
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

/** "Sat, 05 Sep 2026 · 6:00 PM" */
export function formatEventSchedule(event: Pick<EventItem, "date" | "times">) {
  const datePart = formatEventDate(event.date);
  const first = event.times?.[0];
  return first ? `${datePart} · ${formatTime(first)}` : datePart;
}
