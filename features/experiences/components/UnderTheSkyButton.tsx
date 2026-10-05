"use client";

import { useState, useRef } from "react";
import { UnderTheSkyModal } from "./UnderTheSkyModal";

interface UnderTheSkyButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function UnderTheSkyButton({
  className = "btn solid",
  style,
  children,
}: UnderTheSkyButtonProps) {
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
            Under the Sky <span className="btn-arrow">→</span>
          </>
        )}
      </button>
      <UnderTheSkyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}
