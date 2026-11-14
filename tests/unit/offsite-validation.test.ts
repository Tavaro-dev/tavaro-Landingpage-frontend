import { describe, it, expect } from "vitest";
import {
  INITIAL_OFFSITE_FORM_DATA as EMPTY,
  validateOffsiteBrief,
  validateOffsiteContact,
} from "../../features/experiences/content/offsiteEditForm";

const brief = {
  ...EMPTY,
  purpose: ["Team bonding"],
  targetAudience: ["Leadership"],
  expectedGuests: "20-50",
  eventDate: "2027-02-01",
  eventDuration: "Full day",
  creativeDirection: "Rustic",
};

describe("Offsite Edit validation", () => {
  it("passes a complete brief and flags each missing field", () => {
    expect(validateOffsiteBrief(brief)).toEqual({});
    expect(Object.keys(validateOffsiteBrief(EMPTY)).sort()).toEqual(
      ["creativeDirection", "eventDate", "eventDuration", "expectedGuests", "purpose", "targetAudience"],
    );
  });

  it("requires the free text when Other is picked", () => {
    const e = validateOffsiteBrief({ ...brief, purpose: ["Other"], targetAudience: ["Other"] });
    expect(Object.keys(e).sort()).toEqual(["audienceOtherText", "purposeOtherText"]);
  });

  it("checks contact details and email format", () => {
    const contact = { ...brief, name: "A", company: "B", contactNumber: "1", designation: "C", email: "a@b.co" };
    expect(validateOffsiteContact(contact)).toEqual({});
    expect(validateOffsiteContact({ ...contact, email: "nope" }).email).toBe("Please enter a valid email address");
    expect(Object.keys(validateOffsiteContact(EMPTY)).length).toBe(5);
  });
});
