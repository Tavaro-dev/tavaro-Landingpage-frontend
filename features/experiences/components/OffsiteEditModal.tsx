"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  OffsiteEditFormData,
  INITIAL_OFFSITE_FORM_DATA,
  PLANNING_TYPES,
  EVENT_PURPOSES,
  TARGET_AUDIENCES,
  GUEST_COUNT_OPTIONS,
  DURATION_OPTIONS,
  CREATIVE_DIRECTIONS,
} from "../content/offsiteEditForm";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import "./OffsiteEditModal.css";

interface OffsiteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANNING_SELECT_OPTIONS = PLANNING_TYPES.map((pt) => ({
  value: pt.value,
  label: `${pt.label} — ${pt.description}`,
}));

const GUEST_SELECT_OPTIONS = GUEST_COUNT_OPTIONS.map((g) => ({
  value: g,
  label: g,
}));

const DURATION_SELECT_OPTIONS = DURATION_OPTIONS.map((d) => ({
  value: d,
  label: d,
}));

const CREATIVE_SELECT_OPTIONS = CREATIVE_DIRECTIONS.map((c) => ({
  value: c,
  label: c,
}));

export function OffsiteEditModal({ isOpen, onClose }: OffsiteEditModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<OffsiteEditFormData>(INITIAL_OFFSITE_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();

  const handleCheckboxToggle = (field: "purpose" | "targetAudience", value: string) => {
    setFormData((prev) => {
      const list = prev[field];
      const updated = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [field]: updated };
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.planningType) newErrors.planningType = "Please select what you are planning";
    if (formData.purpose.length === 0) newErrors.purpose = "Please select at least one purpose";
    if (formData.purpose.includes("Other") && !formData.purposeOtherText?.trim()) {
      newErrors.purposeOtherText = "Please specify the purpose";
    }
    if (formData.targetAudience.length === 0) newErrors.targetAudience = "Please select target audience";
    if (formData.targetAudience.includes("Other") && !formData.audienceOtherText?.trim()) {
      newErrors.audienceOtherText = "Please specify the audience";
    }
    if (!formData.expectedGuests) newErrors.expectedGuests = "Please select expected guest count";
    if (!formData.eventDate) newErrors.eventDate = "Please select event date";
    if (!formData.eventDuration) newErrors.eventDuration = "Please select event duration";
    if (!formData.creativeDirection) newErrors.creativeDirection = "Please select creative direction";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.company.trim()) newErrors.company = "Company Name is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact Number is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
      await submit({ type: "offsite", data: formData });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="offsite-modal-title" bare>
      <div className="offsite-modal-backdrop" onClick={onClose}>
        <div className="offsite-modal-card" onClick={(e) => e.stopPropagation()}>
          <header className="offsite-modal-header">
            <div className="offsite-modal-header-text">
              <span className="eyebrow no-line" style={{ fontSize: "10px" }}>
                The Offsite Edit
              </span>
              <h2 id="offsite-modal-title">Create your day</h2>
              <p className="offsite-subtitle">For corporate gatherings, offsites, launches &amp; brand activations</p>
              <p className="offsite-desc">
                Tell us what you’re building. From team days to brand moments, give us the brief and we’ll help shape the experience around it.
              </p>
            </div>
            <button
              type="button"
              className="offsite-modal-close-btn"
              onClick={onClose}
              aria-label="Close enquiry form"
            >
              <Icon name="close" />
            </button>
          </header>

          <div className="offsite-modal-body">
            {submitted ? (
              <div className="offsite-success-box">
                <span className="eyebrow center no-line">Brief Submitted</span>
                <h3 className="display-3" style={{ marginTop: 12, marginBottom: 16, color: "var(--on-surface)" }}>
                  Thank You for Your Brief
                </h3>
                <p className="lede" style={{ color: "var(--on-surface-muted)", maxWidth: "500px", margin: "0 auto" }}>
                  We&apos;ve received your requirements for <strong>{formData.company || "your team"}</strong>.
                  Our experiences curation team will review the details and reach out shortly to help shape the experience.
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
                    setFormData(INITIAL_OFFSITE_FORM_DATA);
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                <div className="offsite-step-bar">
                  <span>Step {step} of 2 — {step === 1 ? "Event Brief & Concept" : "Your Details"}</span>
                </div>

                {step === 1 && (
                  <>
                    {/* 1. Planning Type */}
                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        1. What are you planning?<span className="required">*</span>
                      </label>
                      <CustomSelect
                        value={formData.planningType}
                        onChange={(val) => {
                          setFormData({ ...formData, planningType: val });
                          if (errors.planningType) setErrors({ ...errors, planningType: "" });
                        }}
                        options={PLANNING_SELECT_OPTIONS}
                        placeholder="Select planning type"
                      />
                      {errors.planningType && <p className="offsite-error-msg">{errors.planningType}</p>}
                    </div>

                    {/* 2. After Hours Addon */}
                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        2. Include After Hours?
                      </label>
                      <label className="offsite-checkbox-row">
                        <input
                          type="checkbox"
                          checked={formData.afterHoursAddon}
                          onChange={(e) => setFormData({ ...formData, afterHoursAddon: e.target.checked })}
                        />
                        <div>
                          <span className="offsite-checkbox-title">
                            After Hours — Take the party to after hours (Add-on)
                          </span>
                          <span className="offsite-checkbox-desc">
                            Extend your experience with late night dining, games and music.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* 3. Event Purpose */}
                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        3. Primary purpose of the event?<span className="required">*</span>
                      </label>
                      <div className="offsite-pill-grid">
                        {EVENT_PURPOSES.map((purpose) => {
                          const isSelected = formData.purpose.includes(purpose);
                          return (
                            <button
                              type="button"
                              key={purpose}
                              className={`offsite-pill${isSelected ? " selected" : ""}`}
                              onClick={() => handleCheckboxToggle("purpose", purpose)}
                            >
                              {isSelected && <Icon name="check" />}
                              <span>{purpose}</span>
                            </button>
                          );
                        })}
                      </div>
                      {formData.purpose.includes("Other") && (
                        <input
                          type="text"
                          className="offsite-input"
                          style={{ marginTop: 10 }}
                          placeholder="Please specify other purpose..."
                          value={formData.purposeOtherText}
                          onChange={(e) => setFormData({ ...formData, purposeOtherText: e.target.value })}
                        />
                      )}
                      {errors.purpose && <p className="offsite-error-msg">{errors.purpose}</p>}
                      {errors.purposeOtherText && <p className="offsite-error-msg">{errors.purposeOtherText}</p>}
                    </div>

                    {/* 4. Target Audience */}
                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        4. Who is this experience for?<span className="required">*</span>
                      </label>
                      <div className="offsite-pill-grid">
                        {TARGET_AUDIENCES.map((aud) => {
                          const isSelected = formData.targetAudience.includes(aud);
                          return (
                            <button
                              type="button"
                              key={aud}
                              className={`offsite-pill${isSelected ? " selected" : ""}`}
                              onClick={() => handleCheckboxToggle("targetAudience", aud)}
                            >
                              {isSelected && <Icon name="check" />}
                              <span>{aud}</span>
                            </button>
                          );
                        })}
                      </div>
                      {formData.targetAudience.includes("Other") && (
                        <input
                          type="text"
                          className="offsite-input"
                          style={{ marginTop: 10 }}
                          placeholder="Please specify other audience..."
                          value={formData.audienceOtherText}
                          onChange={(e) => setFormData({ ...formData, audienceOtherText: e.target.value })}
                        />
                      )}
                      {errors.targetAudience && <p className="offsite-error-msg">{errors.targetAudience}</p>}
                      {errors.audienceOtherText && <p className="offsite-error-msg">{errors.audienceOtherText}</p>}
                    </div>

                    {/* 5. Expected Guests & Duration in 2 columns */}
                    <div className="offsite-form-grid">
                      <div className="offsite-form-group">
                        <label className="offsite-label">
                          5. Expected Guests<span className="required">*</span>
                        </label>
                        <CustomSelect
                          value={formData.expectedGuests}
                          onChange={(val) => {
                            setFormData({ ...formData, expectedGuests: val });
                            if (errors.expectedGuests) setErrors({ ...errors, expectedGuests: "" });
                          }}
                          options={GUEST_SELECT_OPTIONS}
                          placeholder="Select guest count"
                        />
                        {errors.expectedGuests && <p className="offsite-error-msg">{errors.expectedGuests}</p>}
                      </div>

                      <div className="offsite-form-group">
                        <label className="offsite-label">
                          Event Duration<span className="required">*</span>
                        </label>
                        <CustomSelect
                          value={formData.eventDuration}
                          onChange={(val) => {
                            setFormData({ ...formData, eventDuration: val });
                            if (errors.eventDuration) setErrors({ ...errors, eventDuration: "" });
                          }}
                          options={DURATION_SELECT_OPTIONS}
                          placeholder="Select duration"
                        />
                        {errors.eventDuration && <p className="offsite-error-msg">{errors.eventDuration}</p>}
                      </div>
                    </div>

                    {/* 6 & 7. Event Date & Creative Direction side-by-side in 2 columns */}
                    <div className="offsite-form-grid">
                      <div className="offsite-form-group">
                        <label className="offsite-label">
                          6. Tentative Event Date<span className="required">*</span>
                        </label>
                        <CustomDatePicker
                          value={formData.eventDate}
                          onChange={(date) => {
                            setFormData({ ...formData, eventDate: date });
                            if (errors.eventDate) setErrors({ ...errors, eventDate: "" });
                          }}
                          placeholder="Select event date"
                        />
                        {errors.eventDate && <p className="offsite-error-msg">{errors.eventDate}</p>}
                      </div>

                      <div className="offsite-form-group">
                        <label className="offsite-label">
                          7. Creative Direction<span className="required">*</span>
                        </label>
                        <CustomSelect
                          value={formData.creativeDirection}
                          onChange={(val) => {
                            setFormData({ ...formData, creativeDirection: val });
                            if (errors.creativeDirection) setErrors({ ...errors, creativeDirection: "" });
                          }}
                          options={CREATIVE_SELECT_OPTIONS}
                          placeholder="Select creative direction"
                        />
                        {errors.creativeDirection && <p className="offsite-error-msg">{errors.creativeDirection}</p>}
                      </div>
                    </div>
                  </>
                )}


                {step === 2 && (
                  <div className="offsite-form-grid">
                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        Your Full Name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="offsite-input"
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <p className="offsite-error-msg">{errors.name}</p>}
                    </div>

                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        Company Name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="offsite-input"
                        placeholder="e.g. Acme Tech Innovations"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                      {errors.company && <p className="offsite-error-msg">{errors.company}</p>}
                    </div>

                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        Contact Number<span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        className="offsite-input"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      />
                      {errors.contactNumber && <p className="offsite-error-msg">{errors.contactNumber}</p>}
                    </div>

                    <div className="offsite-form-group">
                      <label className="offsite-label">
                        Email ID<span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        className="offsite-input"
                        placeholder="e.g. ananya@acmetech.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {errors.email && <p className="offsite-error-msg">{errors.email}</p>}
                    </div>

                    <div className="offsite-form-group full">
                      <label className="offsite-label">
                        Designation / Role<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="offsite-input"
                        placeholder="e.g. Head of People &amp; Culture"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                      {errors.designation && <p className="offsite-error-msg">{errors.designation}</p>}
                    </div>
                  </div>
                )}

                <div className="offsite-footer-actions">
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
                    {step === 1 ? "Next: Your Details →" : (isSubmitting ? "Submitting Brief..." : "Submit Brief")}
                  </button>
                </div>
                
                {submitError && (
                  <div className="form-error" style={{ marginTop: 20, textAlign: "center", color: "var(--danger)" }}>
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
