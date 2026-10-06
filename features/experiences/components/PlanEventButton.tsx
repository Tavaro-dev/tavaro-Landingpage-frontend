"use client";

import { useState } from "react";
import PlanEventModal from "./PlanEventModal";

interface PlanEventButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function PlanEventButton({ className = "btn", style, children }: PlanEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

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
