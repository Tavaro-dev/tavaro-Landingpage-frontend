import { BOOKING_ENGINE_URL } from "./booking";

export type Room = {
  slug: string;
  name: string;
  images: readonly [string, string];
  alt: string;
  placeholder: string;
  bed: string;
  size: string;
  occupancy: string;
  rate: string;
  refundNote: string;
  pricePerNight: number;
  bookHref: string;
};

export const ROOMS: readonly Room[] = [
  {
    slug: "executive-rooms",
    name: "Executive Rooms",
    images: ["/images/unsplash/resorts-executive-room.jpg", "/images/unsplash/resorts-executive-room-2.jpg"],
    alt: "An Executive Room at Tavaro Resorts",
    placeholder: "ph-1",
    bed: "One King Bed. Extra bed(s): one crib on request",
    size: "30 sqm (320 sq. ft.)",
    occupancy: "2 Adults",
    rate: "Bed and Breakfast",
    refundNote: "Partially non-refundable",
    pricePerNight: 18500,
    bookHref: `${BOOKING_ENGINE_URL}?roomType=Executive+Rooms`,
  },
  {
    slug: "suites",
    name: "Suites",
    images: ["/images/unsplash/resorts-suite.jpg", "/images/unsplash/resorts-suite-2.jpg"],
    alt: "A Suite at Tavaro Resorts",
    placeholder: "ph-5",
    bed: "One King Bed. Extra bed(s): one rollaway on request",
    size: "45 sqm (480 sq. ft.)",
    occupancy: "2 Adults",
    rate: "Bed and Breakfast",
    refundNote: "Free cancellation up to 48 hours before check-in",
    pricePerNight: 32000,
    bookHref: `${BOOKING_ENGINE_URL}?roomType=Suites`,
  },
  {
    slug: "tavaro-house",
    name: "Tavaro House",
    images: ["/images/unsplash/resorts-tavaro-house.jpg", "/images/unsplash/resorts-tavaro-house-2.jpg"],
    alt: "Tavaro House, the estate's exclusive villa",
    placeholder: "ph-gold",
    bed: "Four King Beds across four bedrooms",
    size: "260 sqm (2,800 sq. ft.)",
    occupancy: "8 Adults",
    rate: "Room Only, exclusive to Tavaro Lawn bookings",
    refundNote: "Non-refundable",
    pricePerNight: 95000,
    bookHref: "/resorts#celebrate",
  },
] as const;
