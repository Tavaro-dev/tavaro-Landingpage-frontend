"use client";

import { useState } from "react";
import { FormField, type FormFieldClassNames } from "@/components/ui/FormField";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  UnderTheSkyFormData,
  INITIAL_UNDER_THE_SKY_FORM_DATA,
  PLANNING_TYPES,
  SETTING_PREFERENCES,
} from "../content/underTheSkyForm";
import styles from "./UnderTheSkyModal.module.css";

const FIELD: FormFieldClassNames = { group: styles["uts-form-group"], label: styles["uts-label"], error: styles["uts-error-msg"] };

interface UnderTheSkyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANNING_SELECT_OPTIONS = PLANNING_TYPES.map((pt) => ({
  value: pt,
  label: pt,
}));

export function UnderTheSkyModal({ isOpen, onClose }: UnderTheSkyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<UnderTheSkyFormData>(INITIAL_UNDER_THE_SKY_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update one field and clear its error.
  const setField = <K extends keyof UnderTheSkyFormData>(key: K, value: UnderTheSkyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key as string] ? { ...prev, [key]: "" } : prev));
  };
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  const handleCheckboxToggle = (value: string) => {
    setFormData((prev) => {
      const list = prev.settingPreferences;
      const updated = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, settingPreferences: updated };
    });
    if (errors.settingPreferences) {
      setErrors((prev) => ({ ...prev, settingPreferences: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.planningType) newErrors.planningType = "Please select what you are planning";
    if (formData.planningType === "Other" && !formData.planningOtherText?.trim()) {
      newErrors.planningOtherText = "Please specify what you are planning";
    }
    if (!formData.preferredDate) newErrors.preferredDate = "Please select a preferred date";
    if (!formData.expectedGuests?.trim()) newErrors.expectedGuests = "Please enter expected guest count";
    if (formData.settingPreferences.length === 0) {
      newErrors.settingPreferences = "Please select at least one setting preference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    if (formData.emailAddress?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      await submit({ type: "under_the_sky", data: formData });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="uts-modal-title" bare>
      <div className={`${styles["uts-modal-backdrop"]} sheet-overlay`} onClick={onClose}>
        <div className={`${styles["uts-modal-card"]} sheet-card`} onClick={(e) => e.stopPropagation()}>
          <header className={styles["uts-modal-header"]}>
            <div className={styles["uts-modal-header-text"]}>
              <span className="eyebrow no-line tw:text-[10px]">
                Under the Sky
              </span>
              <h2 id="uts-modal-title">Under the Sky</h2>
              <p className={styles["uts-subtitle"]}>For every celebration under the sky.</p>
              <p className={styles["uts-desc"]}>
                An open-air dining experience set across Tavaro Resorts. Tell us a little about what you’re planning, the people you’re bringing together and how you’d like the occasion to feel. We’ll take it from there.
              </p>
            </div>
            <button
              type="button"
              className={styles["uts-modal-close-btn"]}
              onClick={onClose}
              aria-label="Close enquiry form"
            >
              <Icon name="close" />
            </button>
          </header>

          <div className={styles["uts-modal-body"]}>
            {submitted ? (
              <div className={styles["uts-success-box"]}>
                <span className="eyebrow center no-line">Enquiry Received</span>
                <h3 className="display-3 tw:mt-[12px] tw:mb-[16px] tw:text-(color:--on-surface)">
                  Thank You for Your Enquiry
                </h3>
                <p className="lede tw:text-(color:--on-surface-muted) tw:max-w-[500px] tw:my-[0] tw:mx-auto">
                  We’ll be in touch soon and start figuring out all the good bits!
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
                    setFormData(INITIAL_UNDER_THE_SKY_FORM_DATA);
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                <div className={styles["uts-step-bar"]}>
                  <span>Step {step} of 2 — {step === 1 ? "About the Gathering" : "About You"}</span>
                </div>

                {step === 1 && (
                  <>
                    {/* 1. What are you planning? */}
                    <FormField classNames={FIELD} label="1. What are you planning?" required error={[errors.planningType, errors.planningOtherText]}>
                      {(field) => (
                        <>
                          <CustomSelect
                            id={field.id}
                            value={formData.planningType}
                            onChange={(val) => setField("planningType", val)}
                            options={PLANNING_SELECT_OPTIONS}
                            placeholder="Select what you are planning"
                          />
                          {formData.planningType === "Other" && (
                            <input
                              type="text"
                              className={`${styles["uts-input"]} tw:mt-[10px]`}
                              placeholder="Please specify what you are planning..."
                              aria-label="Please specify what you are planning"
                              value={formData.planningOtherText}
                              onChange={(e) => setField("planningOtherText", e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </FormField>

                    {/* 2. Tell us a little about the occasion */}
                    <FormField classNames={FIELD} label="2. Tell us a little about the occasion" optional>
                      {(field) => (
                        <textarea
                          {...field}
                          rows={3}
                          className={styles["uts-textarea"]}
                          placeholder="Tell us a little about the occasion..."
                          value={formData.occasionDetails}
                          onChange={(e) => setField("occasionDetails", e.target.value)}
                        />
                      )}
                    </FormField>

                    {/* 3 & 4. Preferred Date & Expected Guests in 2 columns */}
                    <div className={styles["uts-form-grid"]}>
                      <FormField classNames={FIELD} label="3. Preferred date" required error={errors.preferredDate}>
                        {(field) => (
                          <CustomDatePicker
                            id={field.id}
                            value={formData.preferredDate}
                            onChange={(date) => setField("preferredDate", date)}
                            placeholder="Select preferred date"
                          />
                        )}
                      </FormField>

                      <FormField classNames={FIELD} label="4. How many people expecting?" required error={errors.expectedGuests}>
                        {(field) => (
                          <input
                            {...field}
                            type="text"
                            className={styles["uts-input"]}
                            placeholder="e.g. 25"
                            value={formData.expectedGuests}
                            onChange={(e) => setField("expectedGuests", e.target.value)}
                          />
                        )}
                      </FormField>
                    </div>

                    {/* 5. What kind of setting are you drawn to? */}
                    <FormField classNames={FIELD} label="5. What kind of setting are you drawn to?" required group error={errors.settingPreferences}>
                      {(field) => (
                        <div className={styles["uts-pill-grid"]} {...field}>
                          {SETTING_PREFERENCES.map((setting) => {
                            const isSelected = formData.settingPreferences.includes(setting);
                            return (
                              <button
                                type="button"
                                key={setting}
                                className={`${styles["uts-pill"]}${isSelected ? " selected" : ""}`}
                                onClick={() => handleCheckboxToggle(setting)}
                              >
                                {isSelected && <Icon name="check" />}
                                <span>{setting}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </FormField>
                  </>
                )}

                {step === 2 && (
                  <div className={styles["uts-form-grid"]}>
                    <FormField classNames={FIELD} label="Name" required full error={errors.name}>
                      {(field) => (
                        <input
                          {...field}
                          type="text"
                          className={styles["uts-input"]}
                          placeholder="e.g. Ananya Sharma"
                          value={formData.name}
                          onChange={(e) => setField("name", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField classNames={FIELD} label="Phone number" required error={errors.phoneNumber}>
                      {(field) => (
                        <input
                          {...field}
                          type="tel"
                          className={styles["uts-input"]}
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phoneNumber}
                          onChange={(e) => setField("phoneNumber", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField classNames={FIELD} label="Email address" optional error={errors.emailAddress}>
                      {(field) => (
                        <input
                          {...field}
                          type="email"
                          className={styles["uts-input"]}
                          placeholder="e.g. ananya@example.com"
                          value={formData.emailAddress}
                          onChange={(e) => setField("emailAddress", e.target.value)}
                        />
                      )}
                    </FormField>
                  </div>
                )}

                <div className={styles["uts-footer-actions"]}>
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
                    {step === 1 ? "Next: About You →" : isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>

                {submitError && (
                  <div className="form-error tw:mt-[20px] tw:text-center tw:text-(color:--danger)" role="alert">
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
