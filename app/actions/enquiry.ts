"use server";

import { EnquiryPayloadSchema, type EnquiryResult } from "../../lib/enquiry/types";
import { enquiryService } from "../../lib/enquiry/service";

export async function submitEnquiryAction(payload: unknown): Promise<EnquiryResult> {
  const result = EnquiryPayloadSchema.safeParse(payload);
  
  if (!result.success) {
    return {
      success: false,
      message: "Invalid enquiry data provided.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  // At this point result.data is fully typed and validated as an EnquiryPayload
  return enquiryService.submitEnquiry(result.data);
}
