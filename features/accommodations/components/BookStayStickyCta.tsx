"use client";

import { useState } from "react";
import { useShareLink } from "@/lib/useShareLink";
import StickyCta from "@/components/shared/StickyCta";
import { ThirdPartyBookingModal } from "./ThirdPartyBookingModal";

/** The resort page's sticky bar: "Book Your Stay" opens the same booking modal as "Check Availability". */
export function BookStayStickyCta() {
  const [open, setOpen] = useState(false);
  useShareLink("#book-stay", () => setOpen(true));
  return (
    <>
      <StickyCta
        text="Ready to plan your stay at Tavaro Resorts?"
        ctaLabel="Book Your Stay"
        ctaHref="#availability"
        onCtaClick={() => setOpen(true)}
      />
      <ThirdPartyBookingModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
