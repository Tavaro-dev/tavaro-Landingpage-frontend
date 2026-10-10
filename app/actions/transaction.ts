"use server";

import type { PaymentResult } from "../../lib/payment/types";
import { PaymentRequestSchema } from "../../lib/payment/types";
import type { BookingResult } from "../../lib/booking/types";
import { BookingRequestSchema } from "../../lib/booking/types";
import { paymentService } from "../../lib/payment/service";
import { bookingService } from "../../lib/booking/service";

export async function processPaymentAction(req: unknown): Promise<PaymentResult> {
  const result = PaymentRequestSchema.safeParse(req);
  if (!result.success) {
    return {
      success: false,
      error: "Invalid payment request data.",
      errorCode: "VALIDATION_ERROR",
    };
  }

  // This executes on the server. The underlying service handles the NODE_ENV check
  // and routes to the UnavailablePaymentService in production, ensuring mock
  // implementations are never executed in production.
  return paymentService.processPayment(result.data);
}

export async function createBookingAction(req: unknown): Promise<BookingResult> {
  const result = BookingRequestSchema.safeParse(req);
  if (!result.success) {
    return {
      status: "failed",
      errorCode: "VALIDATION_ERROR",
      message: "Invalid booking request data.",
    };
  }

  return bookingService.createBooking(result.data);
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
