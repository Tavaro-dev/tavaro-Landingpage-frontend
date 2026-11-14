"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import {
  type OffsiteEditFormData,
  type OffsiteErrors,
  INITIAL_OFFSITE_FORM_DATA,
  validateOffsiteBrief,
  validateOffsiteContact,
} from "../content/offsiteEditForm";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import { BriefStep } from "./offsite-edit/BriefStep";
import { ContactStep } from "./offsite-edit/ContactStep";
import { styles } from "./offsite-edit/shared";

interface OffsiteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OffsiteEditModal({ isOpen, onClose }: OffsiteEditModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<OffsiteEditFormData>(INITIAL_OFFSITE_FORM_DATA);
  const [errors, setErrors] = useState<OffsiteErrors>({});
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  // Update one field and clear its error.
  const setField = <K extends keyof OffsiteEditFormData>(key: K, value: OffsiteEditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateOffsiteBrief(formData);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateOffsiteContact(formData);
    setErrors(found);
    if (Object.keys(found).length === 0) await submit({ type: "offsite", data: formData });
  };

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="offsite-modal-title" bare>
      <div className={styles["offsite-modal-backdrop"]} onClick={onClose}>
        <div className={styles["offsite-modal-card"]} onClick={(e) => e.stopPropagation()}>
          <header className={styles["offsite-modal-header"]}>
            <div className={styles["offsite-modal-header-text"]}>
              <span className="eyebrow no-line tw:text-[10px]">
                The Offsite Edit
              </span>
              <h2 id="offsite-modal-title">Create your day</h2>
              <p className={styles["offsite-subtitle"]}>For corporate gatherings, offsites, launches &amp; brand activations</p>
              <p className={styles["offsite-desc"]}>
                Tell us what you’re building. From team days to brand moments, give us the brief and we’ll help shape the experience around it.
              </p>
            </div>
            <button
              type="button"
              className={styles["offsite-modal-close-btn"]}
              onClick={onClose}
              aria-label="Close enquiry form"
            >
              <Icon name="close" />
            </button>
          </header>

          <div className={styles["offsite-modal-body"]}>
            {submitted ? (
              <div className={styles["offsite-success-box"]}>
                <span className="eyebrow center no-line">Brief Submitted</span>
                <h3 className="display-3 tw:mt-[12px] tw:mb-[16px] tw:text-(color:--on-surface)">
                  Thank You for Your Brief
                </h3>
                <p className="lede tw:text-(color:--on-surface-muted) tw:max-w-[500px] tw:my-[0] tw:mx-auto">
                  We&apos;ve received your requirements for <strong>{formData.company || "your team"}</strong>.
                  Our experiences curation team will review the details and reach out shortly to help shape the experience.
                </p>
                {isDemo && (
                  <p className="order-summary-muted tw:mt-[16px] tw:text-(color:--gold-dark)">
                    (Demo: No real enquiry was delivered.)
                  </p>
                )}
                <button
                  type="button"
                  className="btn solid tw:mt-[32px]"
                  onClick={() => {
                    reset();
                    setStep(1);
                    setFormData(INITIAL_OFFSITE_FORM_DATA);
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                <div className={styles["offsite-step-bar"]}>
                  <span>Step {step} of 2 — {step === 1 ? "Event Brief & Concept" : "Your Details"}</span>
                </div>

                {step === 1 ? (
                  <BriefStep formData={formData} errors={errors} setField={setField} />
                ) : (
                  <ContactStep formData={formData} errors={errors} setField={setField} />
                )}

                <div className={styles["offsite-footer-actions"]}>
                  {step === 2 ? (
                    <button
                      type="button"
                      className="btn outline tw:py-[12px] tw:px-[24px]"
                      onClick={() => {
                        setStep(1);
                        setErrors({});
                      }}
                    >
                      ← Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button type="submit" className="btn solid tw:py-[12px] tw:px-[28px]" disabled={isSubmitting}>
                    {step === 1 ? "Next: Your Details →" : (isSubmitting ? "Submitting Brief..." : "Submit Brief")}
                  </button>
                </div>
                
                {submitError && (
                  <div className="form-error tw:mt-[20px] tw:text-center tw:text-(color:--danger)">
                    {submitError}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
