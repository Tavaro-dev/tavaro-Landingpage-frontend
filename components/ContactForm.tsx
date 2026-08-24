"use client";

import { useId, useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  // Generic field names ("name", "email"...) would collide if this form is
  // ever mounted more than once on a page — prefix every id/htmlFor pair
  // with a per-instance id instead of hardcoding them.
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

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
          <label htmlFor={fieldId("phone")}>Phone</label>
          <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" disabled={submitted} />
        </div>
        <div className="field">
          <label htmlFor={fieldId("interest")}>I&apos;m interested in</label>
          <select id={fieldId("interest")} name="interest" defaultValue="Booking a Stay" disabled={submitted}>
            <option>Booking a Stay</option>
            <option>Planning an Event</option>
            <option>A Corporate Experience</option>
            <option>A Residence</option>
            <option>An Upcoming Experience</option>
            <option>Màre</option>
            <option>Something Else</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor={fieldId("message")}>Message</label>
          <textarea id={fieldId("message")} name="message" rows={4} disabled={submitted} />
        </div>
      </div>
      <button type="submit" className="btn solid" style={{ marginTop: 28 }} disabled={submitted}>
        Send Enquiry <span className="btn-arrow">→</span>
      </button>
      {submitted && (
        <p className="form-success" style={{ marginTop: 18, fontSize: 13, color: "var(--muted-on-light)" }}>
          Thank you — this is a demo form. Your enquiry would be sent to the Tavaro team.
        </p>
      )}
    </form>
  );
}
