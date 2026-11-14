"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import styles from "./ExperienceEnquiryModal.module.css";
import gstyles from "../enquiry.module.css";

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
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  // Synchronize state during render when initialCategory prop changes
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    setCategory(normalizeCategory(initialCategory));
    reset();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    await submit({
      type: "contact",
      data: {
        name,
        email,
        phone,
        interest: "An Upcoming Experience",
        message: compiledMessage,
      },
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="exp-modal-title" bare>
      <div className={gstyles["event-modal-overlay"]} onClick={onClose}>
        <div className={styles["exp-modal-card"]} onClick={(e) => e.stopPropagation()}>
          <div className={styles["exp-modal-head"]}>
            <h3 id="exp-modal-title" className={styles["exp-modal-title"]}>
              Arrange an Experience
            </h3>
            <button
              type="button"
              className="event-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <Icon name="close" />
            </button>
          </div>

          <div className={styles["exp-modal-body"]}>
            {submitted ? (
              <div className={styles["exp-success"]}>
                <h4 className={styles["exp-success-heading"]}>Request Received</h4>
                <p className={styles["exp-success-text"]}>
                  Thank you for your interest in creating an experience at Tavaro. Our hospitality
                  team will review your preferences and contact you shortly.
                </p>
                {isDemo && (
                  <p className="tw:text-[12px] tw:text-(color:--gold) tw:mb-[20px]">
                    (Demo Mode: Request validated and recorded successfully)
                  </p>
                )}
                <button type="button" className="btn solid" onClick={onClose}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {submitError && <div className={styles["exp-error"]}>{submitError}</div>}

                <div className={styles["exp-form-group"]}>
                  <label className={styles["exp-label"]} htmlFor="exp-category">
                    Experience Category
                  </label>
                  <select
                    id="exp-category"
                    name="category"
                    className={styles["exp-select"]}
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

                <div className={styles["exp-form-group"]}>
                  <label className={styles["exp-label"]} htmlFor="exp-name">
                    Full Name *
                  </label>
                  <input
                    id="exp-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className={styles["exp-input"]}
                  />
                </div>

                <div className={styles["exp-form-row"]}>
                  <div className={styles["exp-form-group"]}>
                    <label className={styles["exp-label"]} htmlFor="exp-email">
                      Email Address *
                    </label>
                    <input
                      id="exp-email"
                      name="email"
                      type="email"
                      required
                      placeholder="email@example.com"
                      className={styles["exp-input"]}
                    />
                  </div>
                  <div className={styles["exp-form-group"]}>
                    <label className={styles["exp-label"]} htmlFor="exp-phone">
                      Phone Number *
                    </label>
                    <input
                      id="exp-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91"
                      className={styles["exp-input"]}
                    />
                  </div>
                </div>

                <div className={styles["exp-form-row"]}>
                  <div className={styles["exp-form-group"]}>
                    <label className={styles["exp-label"]} htmlFor="exp-date">
                      Preferred Date (Optional)
                    </label>
                    <input
                      id="exp-date"
                      name="date"
                      type="text"
                      placeholder="e.g. Next month, specific weekend"
                      className={styles["exp-input"]}
                    />
                  </div>
                  <div className={styles["exp-form-group"]}>
                    <label className={styles["exp-label"]} htmlFor="exp-guests">
                      Estimated Group Size (Optional)
                    </label>
                    <input
                      id="exp-guests"
                      name="guests"
                      type="text"
                      placeholder="e.g. 2, 8, 25 guests"
                      className={styles["exp-input"]}
                    />
                  </div>
                </div>

                <div className={styles["exp-form-group"]}>
                  <label className={styles["exp-label"]} htmlFor="exp-notes">
                    Preferences & Special Requests (Optional)
                  </label>
                  <textarea
                    id="exp-notes"
                    name="notes"
                    placeholder="Tell us about the session, occasion, or any specific requirements..."
                    className={styles["exp-textarea"]}
                  />
                </div>

                <div className="tw:mt-[24px]">
                  <button
                    type="submit"
                    className="btn solid tw:w-full tw:justify-center"
                    disabled={isSubmitting}
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
      </div>
    </Modal>
  );
}
