"use client";

import { useId, useState, type ReactNode } from "react";
import { ThankYou } from "@/components/shared/ThankYou";
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
  intro,
  onClose,
}: {
  defaultResidence?: string;
  /** Shown above the form, and gone once it is sent. */
  intro?: ReactNode;
  onClose: () => void;
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

  if (submitted) {
    return (
      <ThankYou eyebrow="Interest Registered" heading="Thank You for Your Interest" isDemo={isDemo} onClose={onClose}>
        We&apos;ll be in touch discreetly and personally, exactly as a home of this nature deserves.
      </ThankYou>
    );
  }

  return (
    <>
    {intro}
    <form
      className={`split-body ${styles.form}`}
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
            placeholder="Your full name"
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
            placeholder="+91"
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
            placeholder="you@example.com"
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
      <fieldset className={styles.intents}>
        <legend className={styles.legend}>
          I would like to <span>(optional, choose any)</span>
        </legend>
        <div className={styles["intent-list"]}>
          {INTENT_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.intent}>
              <input
                type="checkbox"
                checked={intents.includes(opt.value)}
                onChange={() => toggleIntent(opt.value)}
                disabled={submitted}
                suppressHydrationWarning
              />
              <span className={styles.box} aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M3.5 8.5l3 3 6-7" />
                </svg>
              </span>
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {submitError && (
        <div className="form-error tw:mt-[20px] tw:text-(color:--danger)">
          {submitError}
        </div>
      )}

      <div className={styles.actions} data-form-actions>
        <button
          type="submit"
          id="residence-register-submit"
          className="btn solid"
          disabled={submitted || isSubmitting}
          suppressHydrationWarning
        >
          {isSubmitting ? "Registering…" : submitted ? "Registered" : "Register interest"}
          {!isSubmitting && !submitted && <span className="btn-arrow">→</span>}
        </button>
      </div>
    </form>
    </>
  );
}
