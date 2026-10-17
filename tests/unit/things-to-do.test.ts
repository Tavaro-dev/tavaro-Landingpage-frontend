import { describe, it, expect } from "vitest";
import { THINGS_TO_DO_DATA } from "../../features/resorts/content/thingsToDoData";
import { submitEnquiryAction } from "../../app/actions/enquiry";

describe("Things to Do Data Model", () => {
  it("contains both Explore and Create pillars with accurate routes", () => {
    expect(THINGS_TO_DO_DATA.explore).toBeDefined();
    expect(THINGS_TO_DO_DATA.create).toBeDefined();

    expect(THINGS_TO_DO_DATA.explore.route).toBe("/resorts/things-to-do/explore");
    expect(THINGS_TO_DO_DATA.create.route).toBe("/resorts/things-to-do/create");
  });

  it("contains all exact categories and activities for Explore at Your Own Pace", () => {
    const { categories } = THINGS_TO_DO_DATA.explore;
    expect(categories).toHaveLength(4);

    const dine = categories.find((c) => c.title.toLowerCase() === "dine");
    expect(dine).toBeDefined();
    expect(dine?.items).toEqual([
      "Màre — poolside coffee & dining",
      "Under the Sky — curated tables",
      "Sundowners",
      "Breakfast in the grove",
      "Seasonal dining experiences",
    ]);

    const unwind = categories.find((c) => c.title.toLowerCase() === "unwind");
    expect(unwind).toBeDefined();
    expect(unwind?.items).toEqual([
      "Swimming",
      "Nature walks",
      "Sunset walks",
      "Reading & quiet spaces",
      "Relaxing by the pool",
      "Time in the Mango Grove",
    ]);

    const play = categories.find((c) => c.title.toLowerCase() === "play");
    expect(play).toBeDefined();
    expect(play?.items).toEqual([
      "Lawn games",
      "Cricket",
      "Badminton",
      "Outdoor games",
      "Cycling",
      "Kids' play",
    ]);

    const exploreCat = categories.find((c) => c.title.toLowerCase() === "explore");
    expect(exploreCat).toBeDefined();
    expect(exploreCat?.items).toEqual([
      "Mango Grove",
      "Tree Deck",
      "Nature trails",
      "Garden walks",
      "Birdwatching",
      "Photography",
      "Stargazing",
    ]);
  });

  it("contains all exact categories and activities for Create Your Experience (On Request)", () => {
    const { categories } = THINGS_TO_DO_DATA.create;
    expect(categories).toHaveLength(4);

    const wellness = categories.find((c) => c.title.toLowerCase() === "wellness");
    expect(wellness).toBeDefined();
    expect(wellness?.items).toEqual([
      "Hatha Yoga",
      "Yoga & Kriya",
      "Meditation",
      "Sound Healing",
      "Wellness Retreats",
    ]);

    const movement = categories.find((c) => c.title.toLowerCase() === "movement");
    expect(movement).toBeDefined();
    expect(movement?.items).toEqual([
      "Animal Flow",
      "Kalari / Movement Sessions",
    ]);

    const createCat = categories.find((c) => c.title.toLowerCase() === "create");
    expect(createCat).toBeDefined();
    expect(createCat?.items).toEqual([
      "Art Workshops",
      "Pottery",
      "Craft Workshops",
      "Floral Workshops",
      "Cooking Workshops",
      "Photography Sessions",
      "Music Sessions",
      "Writing & Journaling",
    ]);

    const gather = categories.find((c) => c.title.toLowerCase() === "gather");
    expect(gather).toBeDefined();
    expect(gather?.items).toEqual([
      "Private Dining",
      "Chef-led Dinners",
      "Farm-to-table Experiences",
      "Celebration Dinners",
      "Private Parties",
      "Cultural Events",
      "Music Evenings",
      "Seasonal Festivals",
      "Tavaro Experiences",
    ]);
  });

  it("verifies exact activity counts and headings match specification", () => {
    const exploreItems = THINGS_TO_DO_DATA.explore.categories.flatMap((c) => c.items);
    const createItems = THINGS_TO_DO_DATA.create.categories.flatMap((c) => c.items);

    expect(exploreItems).toHaveLength(24); // 5 + 6 + 6 + 7 = 24
    expect(createItems).toHaveLength(24); // 5 + 2 + 8 + 9 = 24

    // Ensure all 48 unique activity names across the 8 categories are present
    const allActivities = new Set([...exploreItems, ...createItems]);
    expect(allActivities.size).toBe(48);

    // Verify headings
    expect(THINGS_TO_DO_DATA.explore.heading).toBe("A little more room to be.");
    expect(THINGS_TO_DO_DATA.create.heading).toBe("Something special, made yours.");

    const createCat = THINGS_TO_DO_DATA.create.categories.find((c) => c.id === "create");
    expect(createCat?.heading).toBe("Make something of the moment.");

    const gatherCat = THINGS_TO_DO_DATA.create.categories.find((c) => c.id === "gather");
    expect(gatherCat?.heading).toBe("Bring people together.");
  });

  it("processes real experience enquiries successfully through submitEnquiryAction", async () => {
    const validEnquiry = {
      type: "contact" as const,
      data: {
        name: "Arjun Verma",
        email: "arjun@example.com",
        phone: "+91 9876543210",
        interest: "An Upcoming Experience",
        message: "[Experience Request - Wellness] Preferred Date: Next month | Preferences: Sound healing retreat",
      },
    };

    const result = await submitEnquiryAction(validEnquiry);
    expect(result.success).toBe(true);
  });
});

