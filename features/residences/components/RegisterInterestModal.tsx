"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import styles from "./RegisterInterestModal.module.css";

// The form loads the first time the window opens, not with every page.
const ResidenceInterestForm = dynamic(() => import("./ResidenceInterestForm"));

/** Any link to this hash opens the register-interest window, on whatever page it is. */
export const REGISTER_INTEREST = "#register-interest";

/** Opened from a residence's own page, the form starts on that residence. */
const RESIDENCE_BY_PATH: Record<string, string> = {
  "/residences/leela": "Leela by Tavaro Residences",
  "/residences/bhairavi-nilayam": "Bhairavi Nilayam",
};

/**
 * Register interest in the Residences, in a window over the current page. Mounted once in the root layout.
 * It opens for any link whose hash is #register-interest on the current page (including Next.js links, which
 * change the address without a hashchange event), and when a page loads with that hash, as the old
 * /residences/register address now does.
 */
export function RegisterInterestModal() {
  const [open, setOpen] = useState(false);
  // A fresh form each time the window opens.
  const [round, setRound] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const show = () => {
      setRound((n) => n + 1);
      setOpen(true);
    };
    const fromHash = () => {
      if (location.hash !== REGISTER_INTEREST) return;
      // Clear the hash, so the same link opens it again and Back does not reopen it.
      history.replaceState(history.state, "", location.pathname + location.search);
      show();
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.hash !== REGISTER_INTEREST || a.pathname !== location.pathname || a.target === "_blank") return;
      // Before the router sees the click: open here instead of navigating.
      e.preventDefault();
      e.stopPropagation();
      show();
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <Modal open={open} onClose={close} labelledBy="register-interest-title" bare>
      <div className={styles.overlay} onClick={close}>
        <div className={styles.card} onClick={(e) => e.stopPropagation()}>
          <header className={styles.head}>
            <div>
              <p className={styles.eyebrow}>Tavaro Residences</p>
              <h2 id="register-interest-title" className={styles.title}>
                Register your interest
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              <Icon name="close" />
            </button>
          </header>
          <div className={styles.body}>
            <p className={styles.lede}>
              Leela or Bhairavi Nilayam: tell us what you&apos;d like to know, and we&apos;ll follow up personally.
              Your details stay with us.
            </p>
            {open && <ResidenceInterestForm key={round} defaultResidence={RESIDENCE_BY_PATH[pathname]} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
