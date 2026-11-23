"use client";

import { useState, type ReactNode } from "react";
import { useShareLink } from "@/lib/useShareLink";
import { ThirdPartyBookingModal } from "./ThirdPartyBookingModal";

/** A "Book Your Stay" button that opens the same booking modal as "Check Availability". */
export function BookStayButton({ className = "btn", children }: { className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useShareLink("#book-stay", () => setOpen(true));
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <ThirdPartyBookingModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
