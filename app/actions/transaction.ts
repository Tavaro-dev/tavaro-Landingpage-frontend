"use server";

import type { PaymentRequest, PaymentResult } from "../../lib/payment/types";
import type { BookingRequest, BookingResult } from "../../lib/booking/types";
import { paymentService } from "../../lib/payment/service";
import { bookingService } from "../../lib/booking/service";

export async function processPaymentAction(req: PaymentRequest): Promise<PaymentResult> {
  // This executes on the server. The underlying service handles the NODE_ENV check
  // and routes to the UnavailablePaymentService in production, ensuring mock
  // implementations are never executed in production.
  return paymentService.processPayment(req);
}

export async function createBookingAction(req: BookingRequest): Promise<BookingResult> {
  return bookingService.createBooking(req);
}

export async function createTicketBookingAction() {
  if (process.env.NODE_ENV === "production") {
    return {
      success: false,
      error: "Ticket booking is disabled in production. Please contact us directly.",
    };
  }
  return {
    success: true,
    reference: `TAV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  };
}
