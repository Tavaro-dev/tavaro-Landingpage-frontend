import { describe, it, expect } from 'vitest';
import { bookingService } from '../../lib/booking/service';

describe('Booking Service', () => {
  it('should search availability', async () => {
    const results = await bookingService.searchAvailability({ roomType: 'Any', checkIn: '2026-11-01', checkOut: '2026-11-03', guests: 2 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].available).toBe(true);
  });

  it('should create quote calculating total and taxes correctly', async () => {
    const req = {
      roomSlugs: [{ slug: 'executive-rooms', nights: 2 }],
      enhancementIds: ['airport-pickup']
    };
    
    // royal-villa pricePerNight is likely known (from rooms.ts), I can just check the general structure and logic
    const quote = await bookingService.createQuote(req);
    expect(quote.items.length).toBe(1);
    expect(quote.enhancements.length).toBe(1);
    
    expect(quote.subtotal).toBe(quote.items[0].itemTotal + quote.enhancements[0].price);
    expect(quote.taxes).toBe(Math.round(quote.subtotal * 0.12));
    expect(quote.grandTotal).toBe(quote.subtotal + quote.taxes);
  });

  it('should throw error for invalid room slug', async () => {
    const req = {
      roomSlugs: [{ slug: 'invalid-room', nights: 1 }],
      enhancementIds: []
    };
    
    await expect(bookingService.createQuote(req)).rejects.toThrowError('Room not found: invalid-room');
  });
});
