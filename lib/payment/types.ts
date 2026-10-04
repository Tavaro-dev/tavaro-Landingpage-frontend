import type { ServiceErrorCode } from "../booking/types";

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed";

export type PaymentRequest = {
  quoteId: string;
};

export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
};

export type PaymentResult = {
  success: boolean;
  paymentReference?: string;
  error?: string;
  errorCode?: ServiceErrorCode;
};
