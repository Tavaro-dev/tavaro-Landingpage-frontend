"use client";

import { useId, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";

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
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState("Booking a Stay");
  const [rooms, setRooms] = useState("");
  const [needCatering, setNeedCatering] = useState(false);

  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  const isEvent = interest === "Planning an Event";

  return (
    <form
      className="split-body"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor={fieldId("name")}>Full Name</label>
          <input id={fieldId("name")} name="name" type="text" autoComplete="name" required disabled={submitted} />
        </div>
        <div className="field">
          <label htmlFor={fieldId("email")}>Email</label>
          <input id={fieldId("email")} name="email" type="email" autoComplete="email" required disabled={submitted} />
        </div>
        <div className="field">
          <label htmlFor={fieldId("phone")}>Phone / WhatsApp</label>
          <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" required disabled={submitted} />
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
            <div className="field checkbox-field" style={{ alignSelf: "flex-end", paddingBottom: 10 }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={needCatering}
                  onChange={(e) => setNeedCatering(e.target.checked)}
                  disabled={submitted}
                />
                <span>I need catering</span>
              </label>
            </div>
          </>
        )}

        <div className="field full">
          <label htmlFor={fieldId("message")}>Message / Details</label>
          <textarea id={fieldId("message")} name="message" rows={4} disabled={submitted} />
        </div>
      </div>
      <button type="submit" className="btn solid" style={{ marginTop: 28 }} disabled={submitted}>
        ENQUIRE <span className="btn-arrow">→</span>
      </button>
      {submitted && (
        <div className="form-success" style={{ marginTop: 20, padding: 18, border: "1px solid var(--gold-dark)", background: "var(--surface-overlay)" }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--on-surface)" }}>
            Thank You for Reaching Out. We&apos;re delighted to hear from you. Your enquiry has been received, and
            our team will be in touch with you shortly to help bring your plans to life. We look forward to welcoming
            you to Tavaro.
          </p>
        </div>
      )}
    </form>
  );
}
