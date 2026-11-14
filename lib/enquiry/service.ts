import type { EnquiryPayload, EnquiryResult } from "./types";
import { CONTACT, DEMO_SERVICES } from "../env";

export interface EnquiryService {
  submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult>;
}

export class MockEnquiryService implements EnquiryService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async submitEnquiry(_payload: EnquiryPayload): Promise<EnquiryResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Thank you for your enquiry. This is a DEMO response; your request was not delivered to a real system.",
      isDemo: true,
    };
  }
}

export class UnavailableEnquiryService implements EnquiryService {
  async submitEnquiry(): Promise<EnquiryResult> {
    return {
      success: false,
      message: `We can't send enquiries online just yet. Please call or WhatsApp us on ${CONTACT.phone}, or email ${CONTACT.email}, and we'll take it from there.`,
      isDemo: false,
    };
  }
}

export const enquiryService: EnquiryService = DEMO_SERVICES
  ? new MockEnquiryService()
  : new UnavailableEnquiryService();
