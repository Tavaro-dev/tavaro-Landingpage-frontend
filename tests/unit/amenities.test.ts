import { describe, it, expect } from "vitest";
import {
  AMENITIES_DATA,
  AMENITIES_COLUMN_1_NAMES,
  AMENITIES_COLUMN_2_NAMES,
  getAmenityBySlug,
  getAllAmenitySlugs,
} from "../../features/resorts/content/amenitiesData";

describe("Amenities & Services Data Model", () => {
  it("contains all 12 approved items across Column 1 and Column 2", () => {
    expect(AMENITIES_DATA).toHaveLength(12);

    expect(AMENITIES_COLUMN_1_NAMES).toEqual([
      "Coffee House",
      "Pilates Studio",
      "Swimming Pool",
      "Calisthenics Stations",
      "Poolside",
    ]);

    expect(AMENITIES_COLUMN_2_NAMES).toEqual([
      "In-room Dining",
      "In-house Catering",
      "Event Planning",
      "Event Décor",
      "Power Backup",
      "Housekeeping",
      "Valet Parking",
    ]);
  });

  it("verifies every amenity has complete, authentic metadata and images", () => {
    AMENITIES_DATA.forEach((amenity) => {
      expect(amenity.slug).toBeTruthy();
      expect(amenity.title).toBeTruthy();
      expect(amenity.heroImage).toBeTruthy();
      expect(amenity.heroAlt).toBeTruthy();
      expect(amenity.summary).toBeTruthy();
      expect(amenity.details).toBeTruthy();
      expect(amenity.gallery.length).toBeGreaterThanOrEqual(2);
      expect(amenity.highlights.length).toBeGreaterThanOrEqual(2);

      // Verify each gallery image has src and alt
      amenity.gallery.forEach((img) => {
        expect(img.src).toBeTruthy();
        expect(img.alt).toBeTruthy();
      });
    });
  });

  it("resolves amenity slugs correctly via getAmenityBySlug", () => {
    const swimmingPool = getAmenityBySlug("swimming-pool");
    expect(swimmingPool).toBeDefined();
    expect(swimmingPool?.title).toBe("Swimming Pool");
    expect(swimmingPool?.column).toBe(1);

    const eventDecor = getAmenityBySlug("event-decor");
    expect(eventDecor).toBeDefined();
    expect(eventDecor?.title).toBe("Event Décor");
    expect(eventDecor?.column).toBe(2);

    // Case insensitivity
    const coffee = getAmenityBySlug("COFFEE-HOUSE");
    expect(coffee).toBeDefined();
    expect(coffee?.title).toBe("Coffee House");

    // Invalid slug
    expect(getAmenityBySlug("non-existent-amenity")).toBeUndefined();
  });

  it("returns all 12 unique slugs via getAllAmenitySlugs", () => {
    const slugs = getAllAmenitySlugs();
    expect(slugs).toHaveLength(12);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(12);

    expect(slugs).toContain("coffee-house");
    expect(slugs).toContain("pilates-studio");
    expect(slugs).toContain("swimming-pool");
    expect(slugs).toContain("calisthenics-stations");
    expect(slugs).toContain("poolside");
    expect(slugs).toContain("in-room-dining");
    expect(slugs).toContain("in-house-catering");
    expect(slugs).toContain("event-planning");
    expect(slugs).toContain("event-decor");
    expect(slugs).toContain("power-backup");
    expect(slugs).toContain("housekeeping");
    expect(slugs).toContain("valet-parking");
  });
});
