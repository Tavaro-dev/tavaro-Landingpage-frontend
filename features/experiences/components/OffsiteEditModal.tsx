"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
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

interface OffsiteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const emptySubscribe = () => () => {};

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

export function OffsiteEditModal({ isOpen, onClose, triggerRef }: OffsiteEditModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<OffsiteEditFormData>(INITIAL_OFFSITE_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Lock body scroll and set focus when open
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

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  const handleClose = () => {
    onClose();
    triggerRef?.current?.focus();
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setSubmitted(true);
    }
  };

  if (!isClient || !isOpen) return null;

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .offsite-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(10, 9, 8, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .offsite-modal-card {
          position: relative;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          background: var(--surface);
          color: var(--on-surface);
          border: 1px solid var(--surface-line);
          border-radius: 2px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background-color 0.3s, color 0.3s;
        }
        .offsite-modal-header {
          padding: 24px 30px 18px;
          border-bottom: 1px solid var(--surface-line);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: var(--surface);
        }
        .offsite-modal-header-text h2 {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 24px);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 4px 0;
          color: var(--on-surface);
        }
        .offsite-modal-header-text p {
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--on-surface-muted);
          margin: 0;
        }
        .offsite-modal-close-btn {
          background: var(--surface-2);
          border: 1px solid var(--surface-line);
          color: var(--on-surface);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s var(--ease);
          outline: none;
          flex-shrink: 0;
        }
        .offsite-modal-close-btn:hover {
          background: var(--gold);
          color: var(--black);
          border-color: var(--gold);
          transform: scale(1.05);
        }
        [data-theme="light"] .offsite-modal-close-btn:hover {
          background: var(--gold-dark);
          color: #ffffff;
          border-color: var(--gold-dark);
        }
        .offsite-modal-close-btn svg {
          width: 18px;
          height: 18px;
        }
        .offsite-modal-header-text .offsite-subtitle {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface-muted);
          margin-top: 4px;
          margin-bottom: 4px;
        }
        .offsite-modal-header-text .offsite-desc {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: var(--on-surface-muted);
          line-height: 1.5;
          margin: 0;
        }
        .offsite-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid var(--surface-line);
          border-radius: 2px;
          background: var(--surface-2);
          cursor: pointer;
          transition: border-color 0.2s var(--ease);
          user-select: none;
          margin-top: 4px;
        }
        .offsite-checkbox-row:hover {
          border-color: var(--gold);
        }
        .offsite-checkbox-row input[type="checkbox"] {
          accent-color: var(--gold);
          width: 18px;
          height: 18px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .offsite-checkbox-title {
          font-family: var(--font-sans);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--on-surface);
          display: block;
        }
        .offsite-checkbox-desc {
          font-family: var(--font-sans);
          font-size: 12px;
          color: var(--on-surface-muted);
          display: block;
          margin-top: 2px;
        }
        .offsite-modal-body {
          padding: 24px 30px 32px;
          overflow-y: auto;
          flex: 1;
        }
        .offsite-step-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--surface-line);
          font-family: var(--font-sans);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
        }
        [data-theme="light"] .offsite-step-bar {
          color: var(--gold-dark);
        }
        .offsite-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .offsite-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 22px;
        }
        .offsite-form-group.full {
          grid-column: 1 / -1;
        }
        .offsite-label {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--on-surface);
          margin-bottom: 4px;
        }
        .offsite-label .required {
          color: var(--gold);
          margin-left: 4px;
        }
        [data-theme="light"] .offsite-label .required {
          color: var(--gold-dark);
        }
        .offsite-input, .offsite-textarea {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(28, 23, 18, 0.2);
          color: var(--on-surface);
          padding: 11px 14px;
          border-radius: 2px;
          font-family: var(--font-sans);
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s var(--ease);
          box-sizing: border-box;
        }
        [data-theme="dark"] .offsite-input,
        [data-theme="dark"] .offsite-textarea {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--surface-line);
        }
        .offsite-input:focus, .offsite-textarea:focus {
          border-color: var(--gold-dark);
        }
        [data-theme="dark"] .offsite-input:focus,
        [data-theme="dark"] .offsite-textarea:focus {
          border-color: var(--gold);
        }
        .offsite-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .offsite-pill {
          padding: 9px 15px;
          font-family: var(--font-sans);
          font-size: 13px;
          border: 1px solid rgba(28, 23, 18, 0.16);
          border-radius: 2px;
          background: #ffffff;
          color: var(--on-surface);
          cursor: pointer;
          transition: all 0.2s var(--ease);
          user-select: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        [data-theme="dark"] .offsite-pill {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--surface-line);
        }
        .offsite-pill:hover {
          border-color: var(--gold-dark);
          background: rgba(156, 124, 62, 0.06);
        }
        .offsite-pill.selected {
          background: var(--gold);
          color: var(--black);
          border-color: var(--gold);
          font-weight: 600;
        }
        [data-theme="light"] .offsite-pill.selected {
          background: var(--gold-dark);
          color: #ffffff;
          border-color: var(--gold-dark);
        }
        .offsite-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid rgba(28, 23, 18, 0.16);
          border-radius: 2px;
          background: #ffffff;
          cursor: pointer;
          transition: border-color 0.2s var(--ease);
          user-select: none;
          margin-top: 4px;
        }
        [data-theme="dark"] .offsite-checkbox-row {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--surface-line);
        }
        .offsite-checkbox-row:hover {
          border-color: var(--gold-dark);
        }
        [data-theme="dark"] .offsite-checkbox-row:hover {
          border-color: var(--gold);
        }
        .offsite-error-msg {
          font-family: var(--font-sans);
          font-size: 11px;
          color: #e54d42;
          margin-top: 4px;
        }
        .offsite-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--surface-line);
        }
        .offsite-success-box {
          text-align: center;
          padding: 40px 20px;
        }
        @media (max-width: 640px) {
          .offsite-modal-header { padding: 18px 20px; }
          .offsite-modal-body { padding: 20px; }
          .offsite-form-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div
        className="offsite-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offsite-modal-title"
        onClick={handleClose}
      >
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
              ref={closeBtnRef}
              className="offsite-modal-close-btn"
              onClick={handleClose}
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
                <button
                  type="button"
                  className="btn solid"
                  style={{ marginTop: 32 }}
                  onClick={() => {
                    setSubmitted(false);
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

                  <button type="submit" className="btn solid" style={{ padding: "12px 28px" }}>
                    {step === 1 ? "Next: Your Details →" : "Submit Brief"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
