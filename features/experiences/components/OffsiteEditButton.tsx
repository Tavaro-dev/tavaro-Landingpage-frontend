"use client";

import { useState } from "react";
import { OffsiteEditModal } from "./OffsiteEditModal";

interface OffsiteEditButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function OffsiteEditButton({
  className = "btn solid",
  style,
  children,
}: OffsiteEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <>
            The Offsite Edit <span className="btn-arrow">→</span>
          </>
        )}
      </button>
      <OffsiteEditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
