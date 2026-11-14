"use client";

import { useState } from "react";
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
import "./UnderTheSkyModal.css";

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
      <div className="uts-modal-backdrop" onClick={onClose}>
        <div className="uts-modal-card" onClick={(e) => e.stopPropagation()}>
          <header className="uts-modal-header">
            <div className="uts-modal-header-text">
              <span className="eyebrow no-line" style={{ fontSize: "10px" }}>
                Under the Sky
              </span>
              <h2 id="uts-modal-title">Under the Sky</h2>
              <p className="uts-subtitle">For every celebration under the sky.</p>
              <p className="uts-desc">
                An open-air dining experience set across Tavaro Resorts. Tell us a little about what you’re planning, the people you’re bringing together and how you’d like the occasion to feel. We’ll take it from there.
              </p>
            </div>
            <button
              type="button"
              className="uts-modal-close-btn"
              onClick={onClose}
              aria-label="Close enquiry form"
            >
              <Icon name="close" />
            </button>
          </header>

          <div className="uts-modal-body">
            {submitted ? (
              <div className="uts-success-box">
                <span className="eyebrow center no-line">Enquiry Received</span>
                <h3 className="display-3" style={{ marginTop: 12, marginBottom: 16, color: "var(--on-surface)" }}>
                  Thank You for Your Enquiry
                </h3>
                <p className="lede" style={{ color: "var(--on-surface-muted)", maxWidth: "500px", margin: "0 auto" }}>
                  We’ll be in touch soon and start figuring out all the good bits!
                </p>
                {isDemo && (
                  <p className="order-summary-muted" style={{ marginTop: 16, color: "var(--gold-dark)" }}>
                    (Demo: No real enquiry was delivered.)
                  </p>
                )}
                <button
                  type="button"
                  className="btn solid"
                  style={{ marginTop: 32 }}
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
                <div className="uts-step-bar">
                  <span>Step {step} of 2 — {step === 1 ? "About the Gathering" : "About You"}</span>
                </div>

                {step === 1 && (
                  <>
                    {/* 1. What are you planning? */}
                    <div className="uts-form-group">
                      <label className="uts-label">
                        1. What are you planning?<span className="required">*</span>
                      </label>
                      <CustomSelect
                        value={formData.planningType}
                        onChange={(val) => {
                          setFormData({ ...formData, planningType: val });
                          if (errors.planningType) setErrors({ ...errors, planningType: "" });
                        }}
                        options={PLANNING_SELECT_OPTIONS}
                        placeholder="Select what you are planning"
                      />
                      {formData.planningType === "Other" && (
                        <input
                          type="text"
                          className="uts-input"
                          style={{ marginTop: 10 }}
                          placeholder="Please specify what you are planning..."
                          value={formData.planningOtherText}
                          onChange={(e) => setFormData({ ...formData, planningOtherText: e.target.value })}
                        />
                      )}
                      {errors.planningType && <p className="uts-error-msg">{errors.planningType}</p>}
                      {errors.planningOtherText && <p className="uts-error-msg">{errors.planningOtherText}</p>}
                    </div>

                    {/* 2. Tell us a little about the occasion */}
                    <div className="uts-form-group">
                      <label className="uts-label">
                        2. Tell us a little about the occasion<span className="optional">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        className="uts-textarea"
                        placeholder="Tell us a little about the occasion..."
                        value={formData.occasionDetails}
                        onChange={(e) => setFormData({ ...formData, occasionDetails: e.target.value })}
                      />
                    </div>

                    {/* 3 & 4. Preferred Date & Expected Guests in 2 columns */}
                    <div className="uts-form-grid">
                      <div className="uts-form-group">
                        <label className="uts-label">
                          3. Preferred date<span className="required">*</span>
                        </label>
                        <CustomDatePicker
                          value={formData.preferredDate}
                          onChange={(date) => {
                            setFormData({ ...formData, preferredDate: date });
                            if (errors.preferredDate) setErrors({ ...errors, preferredDate: "" });
                          }}
                          placeholder="Select preferred date"
                        />
                        {errors.preferredDate && <p className="uts-error-msg">{errors.preferredDate}</p>}
                      </div>

                      <div className="uts-form-group">
                        <label className="uts-label">
                          4. How many people expecting?<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="uts-input"
                          placeholder="e.g. 25"
                          value={formData.expectedGuests}
                          onChange={(e) => {
                            setFormData({ ...formData, expectedGuests: e.target.value });
                            if (errors.expectedGuests) setErrors({ ...errors, expectedGuests: "" });
                          }}
                        />
                        {errors.expectedGuests && <p className="uts-error-msg">{errors.expectedGuests}</p>}
                      </div>
                    </div>

                    {/* 5. What kind of setting are you drawn to? */}
                    <div className="uts-form-group">
                      <label className="uts-label">
                        5. What kind of setting are you drawn to?<span className="required">*</span>
                      </label>
                      <div className="uts-pill-grid">
                        {SETTING_PREFERENCES.map((setting) => {
                          const isSelected = formData.settingPreferences.includes(setting);
                          return (
                            <button
                              type="button"
                              key={setting}
                              className={`uts-pill${isSelected ? " selected" : ""}`}
                              onClick={() => handleCheckboxToggle(setting)}
                            >
                              {isSelected && <Icon name="check" />}
                              <span>{setting}</span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.settingPreferences && <p className="uts-error-msg">{errors.settingPreferences}</p>}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="uts-form-grid">
                    <div className="uts-form-group full">
                      <label className="uts-label">
                        Name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="uts-input"
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <p className="uts-error-msg">{errors.name}</p>}
                    </div>

                    <div className="uts-form-group">
                      <label className="uts-label">
                        Phone number<span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        className="uts-input"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      />
                      {errors.phoneNumber && <p className="uts-error-msg">{errors.phoneNumber}</p>}
                    </div>

                    <div className="uts-form-group">
                      <label className="uts-label">
                        Email address<span className="optional">(optional)</span>
                      </label>
                      <input
                        type="email"
                        className="uts-input"
                        placeholder="e.g. ananya@example.com"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      />
                      {errors.emailAddress && <p className="uts-error-msg">{errors.emailAddress}</p>}
                    </div>
                  </div>
                )}

                <div className="uts-footer-actions">
                  {step === 2 ? (
                    <button
                      type="button"
                      className="btn outline"
                      style={{ padding: "12px 24px" }}
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

                  <button type="submit" className="btn solid" style={{ padding: "12px 28px" }} disabled={isSubmitting}>
                    {step === 1 ? "Next: About You →" : isSubmitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>

                {submitError && (
                  <div className="form-error" role="alert" style={{ marginTop: 20, textAlign: "center", color: "var(--danger)" }}>
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
