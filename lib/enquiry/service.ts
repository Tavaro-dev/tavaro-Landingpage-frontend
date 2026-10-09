import type { EnquiryPayload, EnquiryResult } from "./types";

export interface EnquiryService {
  submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult>;
}

export class MockEnquiryService implements EnquiryService {
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
      message: "Our online enquiry system is currently unavailable in production until a real integration is configured. Please contact us directly.",
      isDemo: false,
    };
  }
}

export const enquiryService = process.env.NODE_ENV === "production"
  ? new UnavailableEnquiryService()
  : new MockEnquiryService();
