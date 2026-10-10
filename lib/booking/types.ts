import { z } from "zod";
import type { PaymentStatus } from "../payment/types";
import type { ServiceErrorCode } from "../domain/errors";

import type { Room } from "../content/rooms";

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

export const QuoteRequestSchema = z.object({
  roomSlugs: z.array(z.object({
    slug: z.string().min(1, "Room slug is required"),
    nights: z.number().int().positive("Nights must be positive"),
  }).strict()),
  enhancementIds: z.array(z.string()),
}).strict();

export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

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

export const BookingRequestSchema = z.object({
  intent: QuoteRequestSchema,
  guest: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
  }).strict(),
  paymentReference: z.string().optional(),
}).strict();

export type BookingRequest = z.infer<typeof BookingRequestSchema>;

export type BookingStatus = "pending" | "confirmed" | "failed";



export type BookingResult = {
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  reference?: string;
  message?: string;
  errorCode?: ServiceErrorCode;
};
