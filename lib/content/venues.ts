export type Venue = {
  key: string;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
  next?: string; // next available date, when unavailable
  note?: string; // shown instead of a price, e.g. "Included with Tavaro Lawn"
};

export const VENUES: readonly Venue[] = [
  { key: "lawn", name: "Tavaro Lawn", capacity: 3000, price: 450000, available: true },
  { key: "sanctuary-lawn", name: "Sanctuary Lawn", capacity: 1000, price: 280000, available: true },
  { key: "sanctuary-hall", name: "Sanctuary Hall", capacity: 400, price: 150000, available: false, next: "12 Nov 2026" },
  { key: "tree", name: "Tree Deck", capacity: 300, price: 180000, available: true },
  { key: "pool", name: "Pool Deck", capacity: 300, price: 160000, available: false, next: "03 Oct 2026" },
  {
    key: "house",
    name: "Tavaro House (exclusive to Lawn bookings)",
    capacity: 0,
    price: 0,
    available: true,
    note: "Included with Tavaro Lawn",
  },
] as const;

export type EnquiryMenuItem = { name: string; price: number };

export const ENQUIRY_MENU_ITEMS: readonly EnquiryMenuItem[] = [
  { name: "Welcome Mocktails", price: 150 },
  { name: "Starters — Veg & Non-Veg", price: 350 },
  { name: "Live Counter — Chaat", price: 250 },
  { name: "Main Course — Regional", price: 500 },
  { name: "Dessert Counter", price: 200 },
] as const;

export const ENQUIRY_GST_RATE = 0.18;
export const ENQUIRY_BASE_PLATE_PRICE = 1899;

export function computeEnquiryTotal({
  venue,
  guestCount,
  withFood,
  selectedItemIndexes,
}: {
  venue: Venue;
  guestCount: number;
  withFood: boolean;
  selectedItemIndexes: ReadonlySet<number>;
}): number {
  const venuePrice = venue.price || 0;
  const venueGst = venuePrice * ENQUIRY_GST_RATE;
  let foodTotal = 0;
  if (withFood) {
    const perPlate =
      ENQUIRY_BASE_PLATE_PRICE +
      [...selectedItemIndexes].reduce((sum, i) => sum + (ENQUIRY_MENU_ITEMS[i]?.price ?? 0), 0);
    foodTotal = perPlate * guestCount * (1 + ENQUIRY_GST_RATE);
  }
  return Math.round(venuePrice + venueGst + foodTotal);
}
