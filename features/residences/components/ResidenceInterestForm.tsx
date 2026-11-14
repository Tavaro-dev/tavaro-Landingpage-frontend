"use client";

import { useId, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import styles from "./ResidenceInterestForm.module.css";

const RESIDENCE_OPTIONS = [
  { value: "Leela by Tavaro Residences", label: "Leela by Tavaro Residences" },
  { value: "Bhairavi Nilayam", label: "Bhairavi Nilayam" },
  { value: "Both", label: "Both Residences" },
];

const INTENT_OPTIONS = [
  { value: "Receive the residence brochure", label: "Receive the residence brochure" },
  { value: "Enquire about pricing and availability", label: "Enquire about pricing and availability" },
  { value: "Schedule a private viewing", label: "Schedule a private viewing" },
  { value: "Speak with a representative", label: "Speak with a representative" },
];

export default function ResidenceInterestForm({
  defaultResidence,
}: {
  defaultResidence?: string;
}) {
  const { submit, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();
  const [residence, setResidence] = useState(defaultResidence ?? RESIDENCE_OPTIONS[0].value);
  const [intents, setIntents] = useState<string[]>([]);

  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  function toggleIntent(value: string) {
    setIntents((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <form
      className="split-body"
      suppressHydrationWarning
      onSubmit={async (e) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        await submit({
          type: "contact",
          data: {
            name: String(form.get("name") || ""),
            email: String(form.get("email") || ""),
            phone: String(form.get("phone") || ""),
            interest: `Residence: ${residence}`,
            message: intents.length
              ? `Enquiry intent: ${intents.join(", ")}`
              : undefined,
          },
        });
      }}
    >
      <div className="form-grid">
        {/* Name */}
        <div className="field full">
          <label htmlFor={fieldId("name")}>Name</label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={submitted}
            suppressHydrationWarning
          />
        </div>

        {/* Mobile */}
        <div className="field">
          <label htmlFor={fieldId("phone")}>Mobile Number</label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            disabled={submitted}
            suppressHydrationWarning
          />
        </div>

        {/* Email */}
        <div className="field">
          <label htmlFor={fieldId("email")}>Email</label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={submitted}
            suppressHydrationWarning
          />
        </div>

        {/* Residence of Interest */}
        <div className="field full">
          <label htmlFor={fieldId("residence")}>Residence of Interest</label>
          <CustomSelect
            id={fieldId("residence")}
            value={residence}
            options={RESIDENCE_OPTIONS}
            onChange={(val) => setResidence(val)}
            disabled={submitted}
          />
        </div>
      </div>

      {/* Optional intents */}
      <div className="residence-intent-group tw:mt-[28px]">
        <p className="eyebrow no-line tw:mb-[14px] tw:text-[10px]">
          I would like to (optional)
        </p>
        <div className={styles["residence-intent-options"]}>
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`intent-pill${intents.includes(opt.value) ? " active" : ""}`}
              onClick={() => toggleIntent(opt.value)}
              disabled={submitted}
              suppressHydrationWarning
            >
              {intents.includes(opt.value) ? "✓ " : ""}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="form-error tw:mt-[20px] tw:text-(color:--danger)">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        id="residence-register-submit"
        className="btn solid tw:mt-[32px]"
        disabled={submitted || isSubmitting}
        suppressHydrationWarning
      >
        {isSubmitting ? "REGISTERING..." : "REGISTER INTEREST"}{" "}
        <span className="btn-arrow">→</span>
      </button>

      {submitted && (
        <div className="form-success">
          <p className="tw:text-[14px] tw:leading-[1.7] tw:text-(color:--on-surface)">
            Thank you for your interest. We&apos;ll be in touch discreetly and personally
            — exactly as a home of this nature deserves.
          </p>
          {isDemo && (
            <p
              className="order-summary-muted tw:mt-[12px] tw:text-(color:--gold-dark)"
            >
              (Demo: No real enquiry was delivered.)
            </p>
          )}
        </div>
      )}
    </form>
  );
}
