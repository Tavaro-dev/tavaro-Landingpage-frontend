"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  UnderTheSkyFormData,
  INITIAL_UNDER_THE_SKY_FORM_DATA,
  PLANNING_TYPES,
  SETTING_PREFERENCES,
} from "../content/underTheSkyForm";

interface UnderTheSkyModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const emptySubscribe = () => () => {};

const PLANNING_SELECT_OPTIONS = PLANNING_TYPES.map((pt) => ({
  value: pt,
  label: pt,
}));

export function UnderTheSkyModal({ isOpen, onClose, triggerRef }: UnderTheSkyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<UnderTheSkyFormData>(INITIAL_UNDER_THE_SKY_FORM_DATA);
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
        .uts-modal-backdrop {
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
        .uts-modal-card {
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
        .uts-modal-header {
          padding: 24px 30px 18px;
          border-bottom: 1px solid var(--surface-line);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: var(--surface);
        }
        .uts-modal-header-text h2 {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 24px);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 4px 0;
          color: var(--on-surface);
        }
        .uts-modal-header-text .uts-subtitle {
          font-family: var(--font-sans);
          font-size: 13px;
          font-style: italic;
          font-weight: 500;
          color: var(--gold);
          margin-top: 2px;
          margin-bottom: 6px;
        }
        [data-theme="light"] .uts-modal-header-text .uts-subtitle {
          color: var(--gold-dark);
        }
        .uts-modal-header-text .uts-desc {
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: var(--on-surface-muted);
          line-height: 1.5;
          margin: 0;
        }
        .uts-modal-close-btn {
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
        .uts-modal-close-btn:hover {
          background: var(--gold);
          color: var(--black);
          border-color: var(--gold);
          transform: scale(1.05);
        }
        [data-theme="light"] .uts-modal-close-btn:hover {
          background: var(--gold-dark);
          color: #ffffff;
          border-color: var(--gold-dark);
        }
        .uts-modal-close-btn svg {
          width: 18px;
          height: 18px;
        }
        .uts-modal-body {
          padding: 24px 30px 32px;
          overflow-y: auto;
          flex: 1;
        }
        .uts-step-bar {
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
        [data-theme="light"] .uts-step-bar {
          color: var(--gold-dark);
        }
        .uts-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .uts-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 22px;
        }
        .uts-form-group.full {
          grid-column: 1 / -1;
        }
        .uts-label {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--on-surface);
          margin-bottom: 4px;
        }
        .uts-label .required {
          color: var(--gold);
          margin-left: 4px;
        }
        [data-theme="light"] .uts-label .required {
          color: var(--gold-dark);
        }
        .uts-label .optional {
          color: var(--on-surface-muted);
          font-weight: 400;
          text-transform: none;
          margin-left: 4px;
          font-size: 11px;
        }
        .uts-input, .uts-textarea {
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
        [data-theme="dark"] .uts-input,
        [data-theme="dark"] .uts-textarea {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--surface-line);
        }
        .uts-input:focus, .uts-textarea:focus {
          border-color: var(--gold-dark);
        }
        [data-theme="dark"] .uts-input:focus,
        [data-theme="dark"] .uts-textarea:focus {
          border-color: var(--gold);
        }
        .uts-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .uts-pill {
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
        [data-theme="dark"] .uts-pill {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--surface-line);
        }
        .uts-pill:hover {
          border-color: var(--gold-dark);
          background: rgba(156, 124, 62, 0.06);
        }
        [data-theme="dark"] .uts-pill:hover {
          border-color: var(--gold);
        }
        .uts-pill.selected {
          background: var(--gold);
          color: var(--black);
          border-color: var(--gold);
          font-weight: 600;
        }
        [data-theme="light"] .uts-pill.selected {
          background: var(--gold-dark);
          color: #ffffff;
          border-color: var(--gold-dark);
        }
        .uts-error-msg {
          font-family: var(--font-sans);
          font-size: 11px;
          color: #e54d42;
          margin-top: 4px;
        }
        .uts-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--surface-line);
        }
        .uts-success-box {
          text-align: center;
          padding: 40px 20px;
        }
        @media (max-width: 640px) {
          .uts-modal-header { padding: 18px 20px; }
          .uts-modal-body { padding: 20px; }
          .uts-form-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div
        className="uts-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="uts-modal-title"
        onClick={handleClose}
      >
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
              ref={closeBtnRef}
              className="uts-modal-close-btn"
              onClick={handleClose}
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
                <button
                  type="button"
                  className="btn solid"
                  style={{ marginTop: 32 }}
                  onClick={() => {
                    setSubmitted(false);
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

                  <button type="submit" className="btn solid" style={{ padding: "12px 28px" }}>
                    {step === 1 ? "Next: About You →" : "Submit Enquiry"}
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
