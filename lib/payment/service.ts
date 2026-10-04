import type { PaymentResult, PaymentRequest } from "./types";

export interface PaymentService {
  processPayment(request: PaymentRequest, forceFailure?: boolean): Promise<PaymentResult>;
}

export class MockPaymentService implements PaymentService {
  async processPayment(_request: PaymentRequest, forceFailure = false): Promise<PaymentResult> {
    // This is a demo payment service.
    // In production, the payment amount authority lies with the backend.
    // The backend derives the amount from the quoteId, and the payment is processed securely.
    return new Promise((resolve) => {
      // Simulate network processing delay
      setTimeout(() => {
        if (forceFailure) {
          resolve({
            success: false,
            error: "Your bank declined the transaction. Please try again.",
            errorCode: "PAYMENT_FAILED",
          });
        } else {
          resolve({
            success: true,
            paymentReference: `mock-payment-${Math.random().toString(36).substring(2, 9)}`,
          });
        }
      }, 1500);
    });
  }
}

export const paymentService = new MockPaymentService();
