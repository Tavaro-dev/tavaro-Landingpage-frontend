"use client";

import { useState } from "react";
import { useShareLink } from "@/lib/useShareLink";
import PlanEventModal from "./PlanEventModal";

interface PlanEventButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function PlanEventButton({ className = "btn", style, children }: PlanEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  useShareLink("#plan-event", isOpen, () => setIsOpen(true));

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setIsOpen(true)} suppressHydrationWarning>
        {children || (
          <>
            Plan Your Event <span className="btn-arrow">→</span>
          </>
        )}
      </button>
      <PlanEventModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
