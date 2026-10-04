"use client";

import { useState, type CSSProperties } from "react";
import { EventEnquiryModal } from "./EventEnquiryModal";

export function EnquireButton({
  label,
  className,
  style,
  showArrow,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
  showArrow?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setOpen(true)}>
        {label} {showArrow && <span className="btn-arrow">→</span>}
      </button>
      <EventEnquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
