import type { PaymentStatus } from "../payment/types";

import type { Room } from "../rooms";

export type BookingSearch = {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
};

export type RoomAvailability = {
  room: Room;
  available: boolean;
  // This indicates temporary availability at the time of search. 
  // It is NOT a reservation or a guarantee.
};

export type QuoteRequest = {
  roomSlugs: { slug: string; nights: number }[];
  enhancementIds: string[];
};

export type QuoteItem = {
  slug: string;
  name: string;
  pricePerNight: number;
  nights: number;
  itemTotal: number;
};

export type QuoteEnhancement = {
  id: string;
  name: string;
  price: number;
};

export type BookingQuote = {
  quoteId: string;
  expiresAt?: string;
  items: QuoteItem[];
  enhancements: QuoteEnhancement[];
  subtotal: number;
  taxes: number;
  grandTotal: number;
  currency: string;
};

export type BookingRequest = {
  // Client's booking intent. The backend will re-calculate pricing based on this to ensure authority.
  intent: QuoteRequest;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  // Reference proving payment success, to be verified by backend before confirming booking.
  paymentReference?: string;
};

export type BookingStatus = "pending" | "confirmed" | "failed";

export type ServiceErrorCode =
  | "VALIDATION_ERROR"
  | "UNAVAILABLE"
  | "PAYMENT_FAILED"
  | "BOOKING_FAILED"
  | "UNAUTHORIZED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export type BookingResult = {
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  reference?: string;
  message?: string;
  errorCode?: ServiceErrorCode;
};
