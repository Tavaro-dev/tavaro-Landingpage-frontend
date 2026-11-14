import { FormField } from "@/components/ui/FormField";
import { Icon } from "@/components/ui/Icon";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  PLANNING_TYPES,
  EVENT_PURPOSES,
  TARGET_AUDIENCES,
  GUEST_COUNT_OPTIONS,
  DURATION_OPTIONS,
  CREATIVE_DIRECTIONS,
} from "../../content/offsiteEditForm";
import { FIELD, styles, type StepProps } from "./shared";

const PLANNING_SELECT_OPTIONS = PLANNING_TYPES.map((pt) => ({ value: pt.value, label: `${pt.label} — ${pt.description}` }));
const asOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }));
const GUEST_SELECT_OPTIONS = asOptions(GUEST_COUNT_OPTIONS);
const DURATION_SELECT_OPTIONS = asOptions(DURATION_OPTIONS);
const CREATIVE_SELECT_OPTIONS = asOptions(CREATIVE_DIRECTIONS);

/** Multi-select pills, with a free-text box once "Other" is picked. */
function PillChoice({
  label,
  options,
  selected,
  onToggle,
  otherText,
  onOtherText,
  otherLabel,
  error,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  otherText?: string;
  onOtherText: (text: string) => void;
  otherLabel: string;
  error: (string | undefined)[];
}) {
  return (
    <FormField classNames={FIELD} label={label} required group error={error}>
      {(field) => (
        <>
          <div className={styles["offsite-pill-grid"]} {...field}>
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  className={`${styles["offsite-pill"]}${isSelected ? " selected" : ""}`}
                  onClick={() => onToggle(option)}
                >
                  {isSelected && <Icon name="check" />}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          {selected.includes("Other") && (
            <input
              type="text"
              className={`${styles["offsite-input"]} tw:mt-[10px]`}
              placeholder={`${otherLabel}...`}
              aria-label={otherLabel}
              value={otherText}
              onChange={(e) => onOtherText(e.target.value)}
            />
          )}
        </>
      )}
    </FormField>
  );
}

export function BriefStep({ formData, errors, setField }: StepProps) {
  const toggle = (key: "purpose" | "targetAudience") => (value: string) => {
    const list = formData[key];
    setField(key, list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const select = (
    label: string,
    key: "expectedGuests" | "eventDuration" | "creativeDirection" | "planningType",
    options: { value: string; label: string }[],
    placeholder: string,
  ) => (
    <FormField classNames={FIELD} label={label} required error={errors[key]}>
      {(field) => (
        <CustomSelect id={field.id} value={formData[key]} onChange={(val) => setField(key, val)} options={options} placeholder={placeholder} />
      )}
    </FormField>
  );

  return (
    <>
      {select("1. What are you planning?", "planningType", PLANNING_SELECT_OPTIONS, "Select planning type")}

      <div className={styles["offsite-form-group"]}>
        <span className={styles["offsite-label"]}>2. Include After Hours?</span>
        <label className={styles["offsite-checkbox-row"]}>
          <input type="checkbox" checked={formData.afterHoursAddon} onChange={(e) => setField("afterHoursAddon", e.target.checked)} />
          <div>
            <span className={styles["offsite-checkbox-title"]}>After Hours — Take the party to after hours (Add-on)</span>
            <span className={styles["offsite-checkbox-desc"]}>Extend your experience with late night dining, games and music.</span>
          </div>
        </label>
      </div>

      <PillChoice
        label="3. Primary purpose of the event?"
        options={EVENT_PURPOSES}
        selected={formData.purpose}
        onToggle={toggle("purpose")}
        otherText={formData.purposeOtherText}
        onOtherText={(t) => setField("purposeOtherText", t)}
        otherLabel="Please specify other purpose"
        error={[errors.purpose, errors.purposeOtherText]}
      />

      <PillChoice
        label="4. Who is this experience for?"
        options={TARGET_AUDIENCES}
        selected={formData.targetAudience}
        onToggle={toggle("targetAudience")}
        otherText={formData.audienceOtherText}
        onOtherText={(t) => setField("audienceOtherText", t)}
        otherLabel="Please specify other audience"
        error={[errors.targetAudience, errors.audienceOtherText]}
      />

      <div className={styles["offsite-form-grid"]}>
        {select("5. Expected Guests", "expectedGuests", GUEST_SELECT_OPTIONS, "Select guest count")}
        {select("Event Duration", "eventDuration", DURATION_SELECT_OPTIONS, "Select duration")}
      </div>

      <div className={styles["offsite-form-grid"]}>
        <FormField classNames={FIELD} label="6. Tentative Event Date" required error={errors.eventDate}>
          {(field) => (
            <CustomDatePicker id={field.id} value={formData.eventDate} onChange={(date) => setField("eventDate", date)} placeholder="Select event date" />
          )}
        </FormField>
        {select("7. Creative Direction", "creativeDirection", CREATIVE_SELECT_OPTIONS, "Select creative direction")}
      </div>
    </>
  );
}
