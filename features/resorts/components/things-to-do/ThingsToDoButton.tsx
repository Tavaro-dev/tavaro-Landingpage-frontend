"use client";

import { useState } from "react";
import { useShareLink } from "@/lib/useShareLink";
import { ThingsToDoModal } from "./ThingsToDoModal";

interface ThingsToDoButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ThingsToDoButton({
  className = "btn",
  style,
  children,
}: ThingsToDoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  useShareLink("#things-to-do-options", () => setIsOpen(true));

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setIsOpen(true)}
        suppressHydrationWarning
      >
        {children || (
          <>
            Things to do <span className="btn-arrow">→</span>
          </>
        )}
      </button>
      <ThingsToDoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
