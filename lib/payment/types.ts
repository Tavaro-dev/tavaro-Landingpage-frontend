import { z } from "zod";
import type { ServiceErrorCode } from "../domain/errors";

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed";

export const PaymentRequestSchema = z.object({
  quoteId: z.string().min(1, "Quote ID is required"),
}).strict();

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

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
