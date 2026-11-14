import { useId, type FormEvent } from "react";
import { type Details } from "./shared";
import styles from "./ticket-booking.module.css";

type Field = { name: keyof Details; label: string; type: string; autoComplete: string; full?: boolean; inputMode?: "numeric" };

const CONTACT: Field[] = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name", full: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
];
const BILLING: Field[] = [
  { name: "address", label: "Address", type: "text", autoComplete: "street-address", full: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { name: "state", label: "State", type: "text", autoComplete: "address-level1" },
  { name: "postal", label: "Postal Code", type: "text", autoComplete: "postal-code", inputMode: "numeric" },
];

export function DetailsStep({ details, onSubmit, onBack }: { details: Details; onSubmit: (d: Details) => void; onBack: () => void }) {
  // Per-instance ids so the component stays safe to mount more than once.
  const uid = useId();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const read = (k: keyof Details) => String(form.get(k) ?? "");
    onSubmit({ name: read("name"), email: read("email"), phone: read("phone"), address: read("address"), city: read("city"), state: read("state"), postal: read("postal") });
  };

  const grid = (fields: Field[]) => (
    <div className="form-grid">
      {fields.map(({ name, label, full, ...input }) => (
        <div className={full ? "field full" : "field"} key={name}>
          <label htmlFor={`${uid}-${name}`}>{label}</label>
          <input id={`${uid}-${name}`} name={name} {...input} defaultValue={details[name]} required />
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <p className="eyebrow">Step 3</p>
      <h1 className="display-2 step-title">Enter your details</h1>
      <p className="lede step-lede">We&apos;ll email your tickets and invoice to the address below.</p>

      <p className="order-summary-label">Personal &amp; Contact</p>
      {grid(CONTACT)}

      <p className="order-summary-label">Billing Address</p>
      {grid(BILLING)}

      <label className={styles["terms-check"]}>
        <input type="checkbox" name="terms" required />
        <span>I have read and accept the terms and conditions.</span>
      </label>

      <div className="step-actions center">
        <button type="button" className="btn" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="btn solid">
          Continue to Payment
        </button>
      </div>
    </form>
  );
}
