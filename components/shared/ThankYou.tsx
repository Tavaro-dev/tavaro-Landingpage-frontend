"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import styles from "./ThankYou.module.css";

type ThankYouProps = {
  eyebrow?: string;
  heading?: string;
  children?: ReactNode;
  /** The enquiry went nowhere (no CRM configured): say so. */
  isDemo?: boolean;
  onClose: () => void;
  headingId?: string;
};

const DEFAULT_BODY =
  "We're delighted to hear from you. Your enquiry has been received, and our team will be in touch with you shortly to help bring your plans to life. We look forward to welcoming you to Tavaro.";

/** What every enquiry form shows once it is sent, in place of the form. */
export function ThankYou({
  eyebrow = "Enquiry Received",
  heading = "Thank You for Reaching Out",
  children = DEFAULT_BODY,
  isDemo,
  onClose,
  headingId,
}: ThankYouProps) {
  return (
    <div className={styles.box} role="status">
      <p className="eyebrow center no-line">{eyebrow}</p>
      <h4 id={headingId} className={styles.heading}>
        {heading}
      </h4>
      <p className={styles.body}>{children}</p>
      {isDemo && (
        <p className="order-summary-muted tw:mt-[16px] tw:text-(color:--gold-dark)">
          (Demo: No real enquiry was delivered.)
        </p>
      )}
      <button type="button" className="btn solid tw:mt-[28px]" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

/** The same thank-you as a pop-up, for a form that sits on the page rather than in a pop-up. */
export function ThankYouModal({ open, ...props }: ThankYouProps & { open: boolean }) {
  return (
    <Modal open={open} onClose={props.onClose} labelledBy="thank-you-title" bare>
      <div className={`${styles.overlay} sheet-overlay`} onClick={props.onClose}>
        <div className="event-modal-card sheet-card" onClick={(e) => e.stopPropagation()}>
          <div className="event-modal-head">
            <span />
            <button type="button" className="event-modal-close" onClick={props.onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <div className="event-modal-body">
            <ThankYou {...props} headingId="thank-you-title" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
