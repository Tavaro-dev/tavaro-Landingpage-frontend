"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAppPath } from "@/lib/useAppPath";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { useShareLink } from "@/lib/useShareLink";
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
 * Register interest in the Residences, in a window over the current page. Mounted once in the root layout,
 * so #register-interest opens it on any page, as the old /residences/register address now does.
 */
export function RegisterInterestModal() {
  const [open, setOpen] = useState(false);
  // A fresh form each time the window opens.
  const [round, setRound] = useState(0);
  const pathname = useAppPath();

  useShareLink(REGISTER_INTEREST, open, () => {
    setRound((n) => n + 1);
    setOpen(true);
  });

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
            {open && (
              <ResidenceInterestForm
                key={round}
                defaultResidence={RESIDENCE_BY_PATH[pathname]}
                onClose={close}
                intro={
                  <p className={styles.lede}>
                    Leela or Bhairavi Nilayam: tell us what you&apos;d like to know, and we&apos;ll follow up
                    personally. Your details stay with us.
                  </p>
                }
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
