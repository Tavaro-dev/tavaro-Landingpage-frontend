import { Reveal } from "@/components/shared/Reveal";
import { RoomCards } from "./RoomCards";
import { RoomSearchForm } from "./RoomSearchForm";

export function RoomAvailability() {
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
          <RoomSearchForm />
        </Reveal>

        <div style={{ marginTop: 56 }}>
          <RoomCards />
        </div>
      </div>
    </section>
  );
}
