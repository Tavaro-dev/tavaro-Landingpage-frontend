"use client";

import { useId, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { submitEnquiryAction } from "@/app/actions/enquiry";

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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
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
        setIsSubmitting(true);
        setSubmitError(null);

        const form = new FormData(e.currentTarget);
        const result = await submitEnquiryAction({
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

        setIsSubmitting(false);

        if (result.success) {
          setIsDemo(!!result.isDemo);
          setSubmitted(true);
        } else {
          setSubmitError(result.message);
        }
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
      <div className="residence-intent-group" style={{ marginTop: 28 }}>
        <p className="eyebrow no-line" style={{ marginBottom: 14, fontSize: 10 }}>
          I would like to (optional)
        </p>
        <div className="residence-intent-options">
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
        <div className="form-error" style={{ marginTop: 20, color: "var(--danger)" }}>
          {submitError}
        </div>
      )}

      <button
        type="submit"
        id="residence-register-submit"
        className="btn solid"
        style={{ marginTop: 32 }}
        disabled={submitted || isSubmitting}
        suppressHydrationWarning
      >
        {isSubmitting ? "REGISTERING..." : "REGISTER INTEREST"}{" "}
        <span className="btn-arrow">→</span>
      </button>

      {submitted && (
        <div
          className="form-success"
          style={{
            marginTop: 20,
            padding: 18,
            border: "1px solid var(--gold-dark)",
            background: "var(--surface-overlay)",
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--on-surface)" }}>
            Thank you for your interest. We&apos;ll be in touch discreetly and personally
            — exactly as a home of this nature deserves.
          </p>
          {isDemo && (
            <p
              className="order-summary-muted"
              style={{ marginTop: 12, color: "var(--gold-dark)" }}
            >
              (Demo: No real enquiry was delivered.)
            </p>
          )}
        </div>
      )}
    </form>
  );
}
