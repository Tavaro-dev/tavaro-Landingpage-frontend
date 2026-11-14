"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
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

  // Update one field and clear its error.
  const setField = <K extends keyof OffsiteEditFormData>(key: K, value: OffsiteEditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key as string] ? { ...prev, [key]: "" } : prev));
  };
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
              <span className="eyebrow no-line tw:text-[10px]">
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
                <div className="offsite-step-bar">
                  <span>Step {step} of 2 — {step === 1 ? "Event Brief & Concept" : "Your Details"}</span>
                </div>

                {step === 1 && (
                  <>
                    {/* 1. Planning Type */}
                    <FormField ui="offsite" label="1. What are you planning?" required error={errors.planningType}>
                      {(field) => (
                        <CustomSelect
                          id={field.id}
                          value={formData.planningType}
                          onChange={(val) => setField("planningType", val)}
                          options={PLANNING_SELECT_OPTIONS}
                          placeholder="Select planning type"
                        />
                      )}
                    </FormField>

                    {/* 2. After Hours Addon */}
                    <div className="offsite-form-group">
                      <span className="offsite-label">2. Include After Hours?</span>
                      <label className="offsite-checkbox-row">
                        <input
                          type="checkbox"
                          checked={formData.afterHoursAddon}
                          onChange={(e) => setField("afterHoursAddon", e.target.checked)}
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
                    <FormField ui="offsite" label="3. Primary purpose of the event?" required group error={[errors.purpose, errors.purposeOtherText]}>
                      {(field) => (
                        <>
                          <div className="offsite-pill-grid" {...field}>
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
                              className="offsite-input tw:mt-[10px]"
                              placeholder="Please specify other purpose..."
                              aria-label="Please specify other purpose"
                              value={formData.purposeOtherText}
                              onChange={(e) => setField("purposeOtherText", e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </FormField>

                    {/* 4. Target Audience */}
                    <FormField ui="offsite" label="4. Who is this experience for?" required group error={[errors.targetAudience, errors.audienceOtherText]}>
                      {(field) => (
                        <>
                          <div className="offsite-pill-grid" {...field}>
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
                              className="offsite-input tw:mt-[10px]"
                              placeholder="Please specify other audience..."
                              aria-label="Please specify other audience"
                              value={formData.audienceOtherText}
                              onChange={(e) => setField("audienceOtherText", e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </FormField>

                    {/* 5. Expected Guests & Duration in 2 columns */}
                    <div className="offsite-form-grid">
                      <FormField ui="offsite" label="5. Expected Guests" required error={errors.expectedGuests}>
                        {(field) => (
                          <CustomSelect
                            id={field.id}
                            value={formData.expectedGuests}
                            onChange={(val) => setField("expectedGuests", val)}
                            options={GUEST_SELECT_OPTIONS}
                            placeholder="Select guest count"
                          />
                        )}
                      </FormField>

                      <FormField ui="offsite" label="Event Duration" required error={errors.eventDuration}>
                        {(field) => (
                          <CustomSelect
                            id={field.id}
                            value={formData.eventDuration}
                            onChange={(val) => setField("eventDuration", val)}
                            options={DURATION_SELECT_OPTIONS}
                            placeholder="Select duration"
                          />
                        )}
                      </FormField>
                    </div>

                    {/* 6 & 7. Event Date & Creative Direction side-by-side in 2 columns */}
                    <div className="offsite-form-grid">
                      <FormField ui="offsite" label="6. Tentative Event Date" required error={errors.eventDate}>
                        {(field) => (
                          <CustomDatePicker
                            id={field.id}
                            value={formData.eventDate}
                            onChange={(date) => setField("eventDate", date)}
                            placeholder="Select event date"
                          />
                        )}
                      </FormField>

                      <FormField ui="offsite" label="7. Creative Direction" required error={errors.creativeDirection}>
                        {(field) => (
                          <CustomSelect
                            id={field.id}
                            value={formData.creativeDirection}
                            onChange={(val) => setField("creativeDirection", val)}
                            options={CREATIVE_SELECT_OPTIONS}
                            placeholder="Select creative direction"
                          />
                        )}
                      </FormField>
                    </div>
                  </>
                )}


                {step === 2 && (
                  <div className="offsite-form-grid">
                    <FormField ui="offsite" label="Your Full Name" required error={errors.name}>
                      {(field) => (
                        <input
                          {...field}
                          type="text"
                          className="offsite-input"
                          placeholder="e.g. Ananya Sharma"
                          value={formData.name}
                          onChange={(e) => setField("name", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField ui="offsite" label="Company Name" required error={errors.company}>
                      {(field) => (
                        <input
                          {...field}
                          type="text"
                          className="offsite-input"
                          placeholder="e.g. Acme Tech Innovations"
                          value={formData.company}
                          onChange={(e) => setField("company", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField ui="offsite" label="Contact Number" required error={errors.contactNumber}>
                      {(field) => (
                        <input
                          {...field}
                          type="tel"
                          className="offsite-input"
                          placeholder="e.g. +91 98765 43210"
                          value={formData.contactNumber}
                          onChange={(e) => setField("contactNumber", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField ui="offsite" label="Email ID" required error={errors.email}>
                      {(field) => (
                        <input
                          {...field}
                          type="email"
                          className="offsite-input"
                          placeholder="e.g. ananya@acmetech.com"
                          value={formData.email}
                          onChange={(e) => setField("email", e.target.value)}
                        />
                      )}
                    </FormField>

                    <FormField ui="offsite" label="Designation / Role" required full error={errors.designation}>
                      {(field) => (
                        <input
                          {...field}
                          type="text"
                          className="offsite-input"
                          placeholder="e.g. Head of People &amp; Culture"
                          value={formData.designation}
                          onChange={(e) => setField("designation", e.target.value)}
                        />
                      )}
                    </FormField>
                  </div>
                )}

                <div className="offsite-footer-actions">
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
