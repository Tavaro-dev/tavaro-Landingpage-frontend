"use client";

import { useState, useRef } from "react";
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={triggerRef}
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
        triggerRef={triggerRef}
      />
    </>
  );
}
