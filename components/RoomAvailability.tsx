import { useId } from "react";
import { Reveal } from "./Reveal";
import { RoomCards } from "./RoomCards";

export function RoomAvailability() {
  // Prefix ids per instance so this form stays safe to mount more than once
  // on a page (useId works during server rendering too, no "use client" needed).
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  return (
    <section className="section on-panel tight" id="availability">
      <div className="container">
        <Reveal className="offer-head">
          <div>
            <p className="eyebrow">Book Your Stay</p>
            <h2 className="display-2" style={{ marginTop: 18 }}>
              Start with a room.
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: "34ch" }}>
            13 keys across the estate — check dates, then browse the estate&apos;s celebration spaces below.
          </p>
        </Reveal>

        <Reveal className="availability-panel">
          <form className="availability-search" action="/resorts/accommodations" method="get">
            <div className="availability-field">
              <label htmlFor={fieldId("checkin")}>Check-in</label>
              <input id={fieldId("checkin")} name="checkin" type="date" required />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("checkout")}>Check-out</label>
              <input id={fieldId("checkout")} name="checkout" type="date" required />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("guests")}>Guests</label>
              <input id={fieldId("guests")} name="guests" type="number" min={1} defaultValue={2} />
            </div>
            <div className="availability-field">
              <label htmlFor={fieldId("roomType")}>Room Type</label>
              <select id={fieldId("roomType")} name="roomType" defaultValue="Any">
                <option>Any</option>
                <option>Executive Rooms</option>
                <option>Suites</option>
                <option>Tavaro House</option>
              </select>
            </div>
            <button type="submit" className="btn solid availability-submit">
              Check Availability
            </button>
          </form>
        </Reveal>

        <div style={{ marginTop: 56 }}>
          <RoomCards />
        </div>
      </div>
    </section>
  );
}
