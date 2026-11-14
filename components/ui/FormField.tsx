"use client";

import { useId, type ReactNode } from "react";

/** Props to spread on the field's control (input, CustomSelect id, or a pill group). */
export type FieldControlProps = {
  id: string;
  role?: "group";
  "aria-labelledby"?: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

/**
 * Label + control + error, wired together for assistive tech: the label names
 * the control (htmlFor, or aria-labelledby for a group of buttons) and the
 * error text is linked via aria-describedby. `classNames` comes from the
 * form's CSS module, so each form keeps its own look.
 */
export type FormFieldClassNames = { group: string; label: string; error: string };

export function FormField({
  classNames,
  label,
  required,
  optional,
  error,
  full,
  group,
  children,
}: {
  classNames: FormFieldClassNames;
  label: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** One message, or several (e.g. a choice plus its "Other" text box). */
  error?: string | (string | undefined)[];
  full?: boolean;
  /** The control is a set of buttons/checkboxes: the label names the group. */
  group?: boolean;
  children: (control: FieldControlProps) => ReactNode;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const errors = (Array.isArray(error) ? error : [error]).filter(Boolean) as string[];

  const control: FieldControlProps = { id };
  if (group) {
    control.role = "group";
    control["aria-labelledby"] = labelId;
  }
  if (errors.length) {
    control["aria-invalid"] = true;
    control["aria-describedby"] = errors.map((_, i) => `${id}-error-${i}`).join(" ");
  }

  const marker = required ? (
    <span className="required">*</span>
  ) : optional ? (
    <span className="optional">(optional)</span>
  ) : null;

  return (
    <div className={full ? `${classNames.group} full` : classNames.group}>
      {group ? (
        <span id={labelId} className={classNames.label}>
          {label}
          {marker}
        </span>
      ) : (
        <label id={labelId} htmlFor={id} className={classNames.label}>
          {label}
          {marker}
        </label>
      )}
      {children(control)}
      {errors.map((message, i) => (
        <p key={message} id={`${id}-error-${i}`} className={classNames.error} role="alert">
          {message}
        </p>
      ))}
    </div>
  );
}
