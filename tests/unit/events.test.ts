import { describe, it, expect } from "vitest";
import { EVENTS, getPastEvents, isBookable, type EventItem } from "../../lib/content/events";

describe("Event booking window", () => {
  it("keeps a multi-date event bookable until its last date", () => {
    const rain: EventItem = {
      ...EVENTS[0],
      date: "2026-09-05",
      extraDates: ["2026-09-12", "2026-09-19"],
      ticketTypes: [{ id: "t", name: "Ticket", price: 800, description: "" }],
    };
    expect(isBookable(rain, new Date("2026-09-10T12:00:00"))).toBe(true);
    expect(isBookable(rain, new Date("2026-09-19T20:00:00"))).toBe(true);
    expect(isBookable(rain, new Date("2026-09-20T00:00:01"))).toBe(false);
  });
});

describe("Past experiences", () => {
  it("lists the newest first and the undated ones last", () => {
    const dates = getPastEvents(new Date("2026-11-24")).map((e) => e.date);
    expect(dates.slice(-2)).toEqual([undefined, undefined]);
    const dated = dates.filter(Boolean) as string[];
    expect(dated).toEqual([...dated].sort().reverse());
  });
});
