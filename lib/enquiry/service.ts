import type { EnquiryPayload, EnquiryResult } from "./types";
import { CONTACT, LEKVYA } from "../env";
import type { Section } from "../subdomains";

export interface EnquiryService {
  submitEnquiry(payload: EnquiryPayload, site?: Section): Promise<EnquiryResult>;
}

const FORM_NAMES: Record<EnquiryPayload["type"], string> = {
  contact: "Contact",
  dining: "Dining Enquiry",
  plan_event: "Plan an Event",
  offsite: "Offsite Enquiry",
  under_the_sky: "Under the Sky",
};

/** Flatten enquiry fields for Lekvya (arrays → comma-separated strings). */
function flattenFields(data: Record<string, unknown>): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      out[key] = value.map(String).join(", ");
    } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    } else {
      out[key] = String(value);
    }
  }

  // Normalise alternate contact keys so Lekvya always gets name / email / phone when present
  if (!out.phone) {
    const alt = out.contact ?? out.contactNumber ?? out.phoneNumber;
    if (typeof alt === "string" && alt) out.phone = alt;
  }
  if (!out.email && typeof out.emailAddress === "string" && out.emailAddress) {
    out.email = out.emailAddress;
  }

  return out;
}

/** Kept for unit tests that spy on a predictable local success path. */
export class MockEnquiryService implements EnquiryService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async submitEnquiry(_payload: EnquiryPayload): Promise<EnquiryResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Thank you for your enquiry. This is a DEMO response; your request was not delivered to a real system.",
      isDemo: true,
    };
  }
}

export class LekvyaEnquiryService implements EnquiryService {
  async submitEnquiry(payload: EnquiryPayload, site?: Section): Promise<EnquiryResult> {
    const formName = FORM_NAMES[payload.type];
    const publicKey = (site && LEKVYA.siteKeys[site]) || LEKVYA.siteKeys.resort;
    const fields = flattenFields(payload.data as Record<string, unknown>);

    try {
      if (!publicKey) throw new Error("No Lekvya key: set LEKVYA_KEY_RESORT");
      const res = await fetch(LEKVYA.sendFormUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey,
          formName,
          enquiryType: payload.type,
          ...fields,
        }),
      });

      if (!res.ok) {
        return {
          success: false,
          message: `We couldn't send this right now. Please try again, or reach us on ${CONTACT.phone} / ${CONTACT.email}.`,
          isDemo: false,
        };
      }

      return {
        success: true,
        message: "Thank you for your enquiry. We've received your request and will be in touch shortly.",
        isDemo: false,
      };
    } catch (err) {
      console.error("Enquiry not sent:", err);
      return {
        success: false,
        message: `We couldn't send this right now. Please try again, or reach us on ${CONTACT.phone} / ${CONTACT.email}.`,
        isDemo: false,
      };
    }
  }
}

export const enquiryService: EnquiryService = new LekvyaEnquiryService();
