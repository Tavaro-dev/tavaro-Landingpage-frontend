"use client";

import { useState, useRef } from "react";
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={triggerRef}
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
        triggerRef={triggerRef}
      />
    </>
  );
}
