"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { submitEnquiryAction } from "@/app/actions/enquiry";

interface ExperienceEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

const CATEGORY_OPTIONS = [
  { value: "Wellness", label: "Wellness (Yoga, Sound Healing, Retreats)" },
  { value: "Movement", label: "Movement (Animal Flow, Kalari)" },
  { value: "Create", label: "Creative Workshops (Art, Pottery, Cooking)" },
  { value: "Gather", label: "Gathering & Celebrations (Private Dining, Feasts)" },
  { value: "General", label: "Custom Bespoke Experience" },
];

const emptySubscribe = () => () => {};

function normalizeCategory(cat: string) {
  const match = CATEGORY_OPTIONS.find((c) => c.value.toLowerCase() === cat.toLowerCase());
  return match ? match.value : cat;
}

export function ExperienceEnquiryModal({
  isOpen,
  onClose,
  initialCategory = "General",
}: ExperienceEnquiryModalProps) {
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  const [category, setCategory] = useState(() => normalizeCategory(initialCategory));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Synchronize state during render when initialCategory prop changes
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    setCategory(normalizeCategory(initialCategory));
    setSubmitted(false);
    setSubmitError(null);
    setIsDemo(false);
  }

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timeout);
    };
  }, [isOpen]);

  // Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isClient) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const date = String(form.get("date") || "").trim();
    const guests = String(form.get("guests") || "").trim();
    const notes = String(form.get("notes") || "").trim();

    const compiledMessage = `[Experience Request - ${category}] Preferred Date: ${
      date || "Flexible"
    } | Approx. Guests: ${guests || "TBD"} | Preferences: ${notes || "None specified"}`;

    const result = await submitEnquiryAction({
      type: "contact",
      data: {
        name,
        email,
        phone,
        interest: "An Upcoming Experience",
        message: compiledMessage,
      },
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setIsDemo(Boolean(result.isDemo));
    } else {
      setSubmitError(result.message || "Failed to submit enquiry. Please try again.");
    }
  };

  return createPortal(
    <div
      className="event-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <style>{`
        .exp-modal-card {
          width: min(600px, 94vw);
          background: var(--panel, #1a1815);
          color: var(--on-surface, #f7f2e7);
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.35));
          border-radius: var(--radius, 2px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
          position: relative;
          display: flex;
          flex-direction: column;
          animation: modalScaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          max-height: 90vh;
          overflow-y: auto;
        }

        [data-theme="light"] .exp-modal-card {
          background: var(--surface, #f7f2e7);
          color: var(--on-surface, #1c1712);
          border-color: var(--surface-line, rgba(156, 124, 62, 0.45));
          box-shadow: 0 24px 60px rgba(28, 24, 20, 0.2);
        }

        .exp-modal-head {
          padding: 24px 32px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--surface-line, rgba(201, 164, 90, 0.25));
          background: inherit;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .exp-modal-title {
          font-family: var(--font-display, serif);
          font-size: 24px;
          font-weight: 400;
          color: var(--on-surface);
          margin: 0;
        }

        .exp-modal-body {
          padding: 28px 32px;
        }

        .exp-form-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .exp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .exp-label {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--on-surface);
        }

        .exp-input,
        .exp-select,
        .exp-textarea {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--surface-line, rgba(201, 164, 90, 0.3));
          border-radius: var(--radius, 2px);
          font-family: var(--font-sans, sans-serif);
          font-size: 14px;
          color: var(--on-surface);
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s ease;
        }

        [data-theme="light"] .exp-input,
        [data-theme="light"] .exp-select,
        [data-theme="light"] .exp-textarea {
          background: #ffffff;
          border-color: rgba(28, 24, 20, 0.2);
          color: var(--ink, #1c1712);
        }

        .exp-input:focus,
        .exp-select:focus,
        .exp-textarea:focus {
          border-color: var(--gold);
          outline: 1px solid var(--gold);
        }

        .exp-select option {
          background: var(--panel, #1a1815);
          color: var(--on-surface, #f7f2e7);
        }

        [data-theme="light"] .exp-select option {
          background: #ffffff;
          color: var(--ink, #1c1712);
        }

        .exp-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .exp-error {
          color: #e06d60;
          font-size: 13px;
          margin-bottom: 16px;
          padding: 10px;
          background: rgba(201, 59, 43, 0.12);
          border-left: 3px solid #c93b2b;
        }

        .exp-success {
          text-align: center;
          padding: 40px 20px;
        }

        .exp-success-heading {
          font-family: var(--font-display, serif);
          font-size: 28px;
          margin: 0 0 12px;
          color: var(--on-surface);
        }

        .exp-success-text {
          font-size: 15px;
          line-height: 1.6;
          color: var(--on-surface-muted);
          max-width: 440px;
          margin: 0 auto 24px;
        }

        @media (max-width: 600px) {
          .exp-modal-head,
          .exp-modal-body {
            padding: 20px;
          }
          .exp-form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <div
        ref={modalRef}
        className="exp-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-modal-title"
        tabIndex={-1}
      >
        <div className="exp-modal-head">
          <h3 id="exp-modal-title" className="exp-modal-title">
            Arrange an Experience
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            className="event-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="exp-modal-body">
          {submitted ? (
            <div className="exp-success">
              <h4 className="exp-success-heading">Request Received</h4>
              <p className="exp-success-text">
                Thank you for your interest in creating an experience at Tavaro. Our hospitality
                team will review your preferences and contact you shortly.
              </p>
              {isDemo && (
                <p style={{ fontSize: "12px", color: "var(--gold)", marginBottom: "20px" }}>
                  (Demo Mode: Request validated and recorded successfully)
                </p>
              )}
              <button type="button" className="btn solid" onClick={onClose}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError && <div className="exp-error">{submitError}</div>}

              <div className="exp-form-group">
                <label className="exp-label" htmlFor="exp-category">
                  Experience Category
                </label>
                <select
                  id="exp-category"
                  name="category"
                  className="exp-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="exp-form-group">
                <label className="exp-label" htmlFor="exp-name">
                  Full Name *
                </label>
                <input
                  id="exp-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="exp-input"
                />
              </div>

              <div className="exp-form-row">
                <div className="exp-form-group">
                  <label className="exp-label" htmlFor="exp-email">
                    Email Address *
                  </label>
                  <input
                    id="exp-email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="exp-input"
                  />
                </div>
                <div className="exp-form-group">
                  <label className="exp-label" htmlFor="exp-phone">
                    Phone Number *
                  </label>
                  <input
                    id="exp-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91"
                    className="exp-input"
                  />
                </div>
              </div>

              <div className="exp-form-row">
                <div className="exp-form-group">
                  <label className="exp-label" htmlFor="exp-date">
                    Preferred Date (Optional)
                  </label>
                  <input
                    id="exp-date"
                    name="date"
                    type="text"
                    placeholder="e.g. Next month, specific weekend"
                    className="exp-input"
                  />
                </div>
                <div className="exp-form-group">
                  <label className="exp-label" htmlFor="exp-guests">
                    Estimated Group Size (Optional)
                  </label>
                  <input
                    id="exp-guests"
                    name="guests"
                    type="text"
                    placeholder="e.g. 2, 8, 25 guests"
                    className="exp-input"
                  />
                </div>
              </div>

              <div className="exp-form-group">
                <label className="exp-label" htmlFor="exp-notes">
                  Preferences & Special Requests (Optional)
                </label>
                <textarea
                  id="exp-notes"
                  name="notes"
                  placeholder="Tell us about the session, occasion, or any specific requirements..."
                  className="exp-textarea"
                />
              </div>

              <div style={{ marginTop: "24px" }}>
                <button
                  type="submit"
                  className="btn solid"
                  disabled={isSubmitting}
                  style={{ width: "100%", justifyContent: "center" }}
                  suppressHydrationWarning
                >
                  {isSubmitting ? "Submitting..." : "Send Experience Request"}
                  {!isSubmitting && <span className="btn-arrow">→</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
