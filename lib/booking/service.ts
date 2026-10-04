import { ROOMS } from "../rooms";
import { ENHANCEMENTS } from "../enhancements";
import type { BookingQuote, QuoteRequest, BookingRequest, BookingResult, BookingSearch, RoomAvailability } from "./types";

export interface BookingService {
  searchAvailability(search: BookingSearch): Promise<readonly RoomAvailability[]>;
  createQuote(req: QuoteRequest): Promise<BookingQuote>;
  createBooking(req: BookingRequest): Promise<BookingResult>;
}

export class MockBookingService implements BookingService {
  async searchAvailability(search: BookingSearch): Promise<readonly RoomAvailability[]> {
    // In the future, this will call the backend to filter ROOMS by availability.
    // For the current mock, we just return the rooms. 
    // We could filter by roomType if we wanted a more realistic mock.
    let availableRooms = [...ROOMS];
    if (search.roomType && search.roomType !== "Any") {
      availableRooms = availableRooms.filter(r => r.name === search.roomType);
    }
    
    // Convert to explicit RoomAvailability domain model
    const availability: RoomAvailability[] = availableRooms.map((room) => ({
      room,
      available: true // This is temporary search-time availability, NOT a lock
    }));
    
    return Promise.resolve(availability);
  }

  async createQuote(req: QuoteRequest): Promise<BookingQuote> {
    // The backend would calculate this pricing, including any dynamic rates.
    const items = req.roomSlugs.map((r) => {
      const room = ROOMS.find((room) => room.slug === r.slug);
      if (!room) throw new Error(`Room not found: ${r.slug}`);
      return {
        slug: room.slug,
        name: room.name,
        pricePerNight: room.pricePerNight,
        nights: r.nights,
        itemTotal: room.pricePerNight * r.nights,
      };
    });

    const enhancements = req.enhancementIds.map((id) => {
      const e = ENHANCEMENTS.find((e) => e.id === id);
      if (!e) throw new Error(`Enhancement not found: ${id}`);
      return {
        id: e.id,
        name: e.name,
        price: e.price,
      };
    });

    const roomSubtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const enhancementsSubtotal = enhancements.reduce((sum, e) => sum + e.price, 0);
    const subtotal = roomSubtotal + enhancementsSubtotal;
    const taxes = Math.round(subtotal * 0.12); // Mock business logic
    const grandTotal = subtotal + taxes;

    return Promise.resolve({
      quoteId: `mock-quote-${Math.random().toString(36).substring(2, 9)}`,
      items,
      enhancements,
      subtotal,
      taxes,
      grandTotal,
      currency: "INR",
    });
  }

  async createBooking(_req: BookingRequest): Promise<BookingResult> {
    // The production backend will re-validate _req.intent (availability and pricing) here.
    // It will calculate authoritative totals and create the booking in the database.
    
    // We generate a mock demo reference here for the UI to display.
    // In production, the backend will generate the authoritative booking reference.
    const reference = `TAV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return Promise.resolve({
      status: "confirmed",
      paymentStatus: "succeeded",
      reference,
    });
  }
}

export const bookingService = new MockBookingService();
