import type { FormFieldClassNames } from "@/components/ui/FormField";
import type { OffsiteEditFormData, OffsiteErrors } from "../../content/offsiteEditForm";
import styles from "../OffsiteEditModal.module.css";

export { styles };

export const FIELD: FormFieldClassNames = {
  group: styles["offsite-form-group"],
  label: styles["offsite-label"],
  error: styles["offsite-error-msg"],
};

export type StepProps = {
  formData: OffsiteEditFormData;
  errors: OffsiteErrors;
  setField: <K extends keyof OffsiteEditFormData>(key: K, value: OffsiteEditFormData[K]) => void;
};
