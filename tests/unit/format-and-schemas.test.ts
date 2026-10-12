import { describe, it, expect } from "vitest";
import { formatInr } from "../../lib/format";
import { pageMetadata } from "../../lib/metadata";
import { EnquiryPayloadSchema } from "../../lib/enquiry/types";
import { PaymentRequestSchema } from "../../lib/payment/types";
import { BookingRequestSchema } from "../../lib/booking/types";

describe("Format Utilities", () => {
  it("formats numbers into Indian Rupees currency string", () => {
    expect(formatInr(0)).toBe("₹0");
    expect(formatInr(12500)).toBe("₹12,500");
    expect(formatInr(150000)).toBe("₹1,50,000");
  });
});

describe("Metadata Generation", () => {
  it("generates correct OpenGraph and canonical metadata", () => {
    const meta = pageMetadata({
      title: "Resorts | Tavaro",
      description: "Tavaro Resorts experience",
      path: "/resorts",
    });

    expect(meta.title).toBe("Resorts | Tavaro");
    expect(meta.description).toBe("Tavaro Resorts experience");
    expect(meta.alternates?.canonical).toBe("/resorts");
    expect(meta.openGraph?.title).toBe("Resorts | Tavaro");
  });
});

describe("Validation Schemas", () => {
  it("validates valid enquiry payload", () => {
    const valid = {
      type: "contact",
      data: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543210",
        interest: "Resorts",
        message: "Interested in visiting the resort.",
      },
    };
    const parsed = EnquiryPayloadSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email in enquiry payload", () => {
    const invalid = {
      type: "contact",
      data: {
        name: "John Doe",
        email: "not-an-email",
        phone: "+91 9876543210",
        interest: "Resorts",
      },
    };
    const parsed = EnquiryPayloadSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("validates valid payment request", () => {
    const valid = { quoteId: "mock-quote-12345" };
    const parsed = PaymentRequestSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("validates valid booking request schema", () => {
    const valid = {
      intent: {
        roomSlugs: [{ slug: "the-villa", nights: 2 }],
        enhancementIds: ["spa-treatment"],
      },
      guest: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+91 9876543210",
      },
      paymentReference: "PAY-123",
    };
    const parsed = BookingRequestSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });
});
