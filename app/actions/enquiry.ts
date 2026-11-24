"use server";

import { EnquiryPayloadSchema, type EnquiryResult } from "../../lib/enquiry/types";
import { enquiryService } from "../../lib/enquiry/service";
import { SECTIONS, type Section } from "../../lib/subdomains";

/** `site`: the brand site the form was sent from (lib/subdomains.ts), which picks the inbox it goes to. */
export async function submitEnquiryAction(payload: unknown, site?: unknown): Promise<EnquiryResult> {
  const result = EnquiryPayloadSchema.safeParse(payload);
  
  if (!result.success) {
    return {
      success: false,
      message: "Invalid enquiry data provided.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  // At this point result.data is fully typed and validated as an EnquiryPayload
  const section = typeof site === "string" && Object.hasOwn(SECTIONS, site) ? (site as Section) : undefined;
  return enquiryService.submitEnquiry(result.data, section);
}
