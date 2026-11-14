"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/scrollLock";

const emptySubscribe = () => () => {};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name; or pass labelledBy pointing at the visible title. */
  label?: string;
  labelledBy?: string;
  /** Behaviour only: no backdrop/padding/fade, for components that render their own full-screen overlay. */
  bare?: boolean;
  /** Keep children mounted and close this many ms late, so a CSS exit transition (keyed on `open`) can play. */
  exitMs?: number;
  children: ReactNode;
};

/**
 * Shared modal built on native <dialog>.showModal(): the browser handles
 * Escape, focus trapping, inert background and focus restore on close.
 * `open` stays the source of truth; Escape/backdrop clicks call onClose.
 * Portaled to <body> so section-level theme tokens don't leak into it.
 */
export function Modal({ open, onClose, label, labelledBy, bare = false, exitMs, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    window.clearTimeout(closeTimer.current); // reopened mid-exit
    if (!dialog.open) dialog.showModal();
    const unlockScroll = lockScroll();
    return () => {
      unlockScroll();
      if (exitMs) closeTimer.current = window.setTimeout(() => dialog.close(), exitMs);
      else dialog.close();
    };
  }, [open, mounted, exitMs]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={ref}
      className={bare ? "app-dialog bare" : "app-dialog"}
      aria-label={label}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault(); // let the parent close it via `open`
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // backdrop click
      }}
    >
      {(open || exitMs !== undefined) && children}
    </dialog>,
    document.body
  );
}
