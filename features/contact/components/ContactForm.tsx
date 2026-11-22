"use client";

import { useId, useRef, useState } from "react";
import { ThankYouModal } from "@/components/shared/ThankYou";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useEnquirySubmit } from "@/lib/enquiry/useEnquirySubmit";
import styles from "./ContactForm.module.css";

const INTEREST_OPTIONS = [
  { value: "Booking a Stay", label: "Booking a Stay" },
  { value: "Planning an Event", label: "Planning an Event" },
  { value: "A Corporate Experience", label: "A Corporate Experience" },
  { value: "A Residence", label: "A Residence" },
  { value: "An Upcoming Experience", label: "An Upcoming Experience" },
  { value: "Màre", label: "Màre" },
  { value: "Something Else", label: "Something Else" },
];

const ROOM_OPTIONS = [
  { value: "", label: "Select no. of rooms" },
  { value: "No rooms required", label: "No rooms required" },
  { value: "1 Room", label: "1 Room" },
  { value: "2 - 4 Rooms", label: "2 - 4 Rooms" },
  { value: "5 - 8 Rooms", label: "5 - 8 Rooms" },
  { value: "9 - 12 Rooms", label: "9 - 12 Rooms" },
  { value: "Entire Estate (13 Rooms)", label: "Entire Estate (13 Rooms)" },
];

export default function ContactForm() {
  const [interest, setInterest] = useState("Booking a Stay");
  const [rooms, setRooms] = useState("");
  const [needCatering, setNeedCatering] = useState(false);
  const { submit, reset, isSubmitting, submitted, error: submitError, isDemo } = useEnquirySubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  const isEvent = interest === "Planning an Event";

  return (
    <form
      ref={formRef}
      className="split-body"
      onSubmit={async (e) => {
        e.preventDefault();
        
        const form = new FormData(e.currentTarget);
        await submit({
          type: "contact",
          data: {
            name: String(form.get("name") || ""),
            email: String(form.get("email") || ""),
            phone: String(form.get("phone") || ""),
            interest,
            rooms: isEvent ? rooms : undefined,
            needCatering: isEvent ? needCatering : undefined,
            message: String(form.get("message") || ""),
          },
        });
      }}
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor={fieldId("name")}>Full Name</label>
          <input id={fieldId("name")} name="name" type="text" autoComplete="name" required disabled={submitted} suppressHydrationWarning />
        </div>
        <div className="field">
          <label htmlFor={fieldId("email")}>Email</label>
          <input id={fieldId("email")} name="email" type="email" autoComplete="email" required disabled={submitted} suppressHydrationWarning />
        </div>
        <div className="field">
          <label htmlFor={fieldId("phone")}>Phone / WhatsApp</label>
          <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" required disabled={submitted} suppressHydrationWarning />
        </div>
        <div className="field">
          <label htmlFor={fieldId("interest")}>I&apos;m interested in</label>
          <CustomSelect
            id={fieldId("interest")}
            value={interest}
            options={INTEREST_OPTIONS}
            onChange={(val) => setInterest(val)}
          />
        </div>

        {isEvent && (
          <>
            <div className="field">
              <label htmlFor={fieldId("rooms")}>Rooms</label>
              <CustomSelect
                id={fieldId("rooms")}
                value={rooms}
                options={ROOM_OPTIONS}
                placeholder="Select no. of rooms"
                onChange={(val) => setRooms(val)}
              />
            </div>
            <div className={`field ${styles["checkbox-field"]} tw:self-end tw:pb-[10px]`}>
              <label className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  checked={needCatering}
                  onChange={(e) => setNeedCatering(e.target.checked)}
                  disabled={submitted}
                  suppressHydrationWarning
                />
                <span>I need catering</span>
              </label>
            </div>
          </>
        )}

        <div className="field full">
          <label htmlFor={fieldId("message")}>Message / Details</label>
          <textarea id={fieldId("message")} name="message" rows={4} disabled={submitted || isSubmitting} suppressHydrationWarning />
        </div>
      </div>
      
      {submitError && (
        <div className="form-error tw:mt-[20px] tw:text-(color:--danger)">
          {submitError}
        </div>
      )}

      <button type="submit" className="btn solid tw:mt-[28px]" disabled={submitted || isSubmitting} suppressHydrationWarning>
        {isSubmitting ? "SUBMITTING..." : "ENQUIRE"} <span className="btn-arrow">→</span>
      </button>
      <ThankYouModal
        open={submitted}
        isDemo={isDemo}
        onClose={() => {
          // A clean form for the next enquiry.
          formRef.current?.reset();
          setInterest("Booking a Stay");
          setRooms("");
          setNeedCatering(false);
          reset();
        }}
      />
    </form>
  );
}
