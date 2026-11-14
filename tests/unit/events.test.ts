import { describe, it, expect } from "vitest";
import { getEvent, isBookable } from "../../lib/content/events";

describe("Event booking window", () => {
  it("keeps a multi-date event bookable until its last date", () => {
    const rain = getEvent("rain-rhythm")!; // 2026-09-05, extra dates up to 2026-09-19
    expect(isBookable(rain, new Date("2026-09-10T12:00:00"))).toBe(true);
    expect(isBookable(rain, new Date("2026-09-19T20:00:00"))).toBe(true);
    expect(isBookable(rain, new Date("2026-09-20T00:00:01"))).toBe(false);
  });
});
