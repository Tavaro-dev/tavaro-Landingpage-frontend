import { FormField } from "@/components/ui/FormField";
import { FIELD, styles, type StepProps } from "./shared";

const FIELDS = [
  { key: "name", label: "Your Full Name", type: "text", placeholder: "e.g. Ananya Sharma" },
  { key: "company", label: "Company Name", type: "text", placeholder: "e.g. Acme Tech Innovations" },
  { key: "contactNumber", label: "Contact Number", type: "tel", placeholder: "e.g. +91 98765 43210" },
  { key: "email", label: "Email ID", type: "email", placeholder: "e.g. ananya@acmetech.com" },
  { key: "designation", label: "Designation / Role", type: "text", placeholder: "e.g. Head of People & Culture", full: true },
] as const;

export function ContactStep({ formData, errors, setField }: StepProps) {
  return (
    <div className={styles["offsite-form-grid"]}>
      {FIELDS.map((f) => (
        <FormField key={f.key} classNames={FIELD} label={f.label} required full={"full" in f} error={errors[f.key]}>
          {(field) => (
            <input
              {...field}
              type={f.type}
              className={styles["offsite-input"]}
              placeholder={f.placeholder}
              value={formData[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
            />
          )}
        </FormField>
      ))}
    </div>
  );
}
