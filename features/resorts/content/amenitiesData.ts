export interface AmenityGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface AmenityItem {
  slug: string;
  title: string;
  column: 1 | 2;
  eyebrow: string;
  summary: string;
  details: string;
  heroImage: string;
  heroAlt: string;
  gallery: AmenityGalleryImage[];
  highlights: string[];
}

// Client's exact source-of-truth items
export const AMENITIES_COLUMN_1_NAMES = [
  "Coffee House",
  "Pilates Studio",
  "Swimming Pool",
  "Calisthenics Stations",
  "Poolside",
] as const;

export const AMENITIES_COLUMN_2_NAMES = [
  "In-room Dining",
  "In-house Catering",
  "Event Planning",
  "Event Décor",
  "Power Backup",
  "Housekeeping",
  "Valet Parking",
] as const;

export const AMENITIES_DATA: AmenityItem[] = [
  {
    slug: "coffee-house",
    title: "Coffee House",
    column: 1,
    eyebrow: "Artisanal Coffee & Gathering",
    summary:
      "A welcoming space for artisanal brews, slow mornings, and conversation set within the natural calm of the resort grounds.",
    details:
      "Set amid the natural greenery of Tavaro Resorts, the Coffee House offers a warm space for slow mornings, afternoon conversations, and artisanal coffees crafted with carefully selected beans.",
    heroImage: "/images/unsplash/mare-community-coffee-house.jpg",
    heroAlt: "Màre Coffee House at Tavaro Resorts",
    gallery: [
      {
        src: "/images/unsplash/mare-coffee.jpg",
        alt: "Freshly brewed pour-over coffee at the Coffee House",
        caption: "Artisanal coffee brewed fresh daily",
      },
      {
        src: "/images/unsplash/mare-interior.jpg",
        alt: "Warm interior seating and natural light at the Coffee House",
        caption: "Inviting seating for quiet mornings and gatherings",
      },
      {
        src: "/images/unsplash/mare-community-coffee-house.jpg",
        alt: "Sunlit verandah at the Coffee House",
        caption: "Open verandah surrounded by native greenery",
      },
    ],
    highlights: [
      "Artisanal pour-over & espresso bar",
      "Outdoor verandah seating",
      "Daily fresh bakes & roasts",
    ],
  },
  {
    slug: "pilates-studio",
    title: "Pilates Studio",
    column: 1,
    eyebrow: "Mindful Movement & Posture",
    summary:
      "A light-filled studio for mindful movement, core alignment, and guided reformer sessions surrounded by garden views.",
    details:
      "Sol Pilates Studio is dedicated to movement, alignment, and mindful physical wellbeing. Sessions are tailored for restorative strengthening in a tranquil, open setting.",
    heroImage: "/images/unsplash/resorts-sol-pilates.jpg",
    heroAlt: "Sol Pilates Studio at Tavaro Resorts",
    gallery: [
      {
        src: "/images/things-to-do/movement.jpg",
        alt: "Guided movement and posture exercises in the studio",
        caption: "Mindful physical movement sessions",
      },
      {
        src: "/images/unsplash/stillness-retreat.jpg",
        alt: "Calm wellness environment and dedicated mats",
        caption: "Serene ambience designed for focus and breathing",
      },
      {
        src: "/images/unsplash/resorts-sol-pilates.jpg",
        alt: "Reformer equipment inside Sol Pilates Studio",
        caption: "Dedicated reformer and mat movement studio",
      },
    ],
    highlights: [
      "Reformer & mat sessions",
      "Certified movement instructors",
      "Natural daylight & garden views",
    ],
  },
  {
    slug: "swimming-pool",
    title: "Swimming Pool",
    column: 1,
    eyebrow: "Aquatic Leisure & Rest",
    summary:
      "An expansive outdoor swimming pool nestled in lush greenery, offering refreshing laps and tranquil waterside lounging.",
    details:
      "Framed by native greenery and open skies, the resort swimming pool offers an idyllic escape for morning laps or quiet afternoon unwinding under the sun.",
    heroImage: "/images/unsplash/resorts-poolside-service.jpg",
    heroAlt: "Swimming pool at Tavaro Resorts",
    gallery: [
      {
        src: "/images/things-to-do/unwind.jpg",
        alt: "Lounging beside the azure pool waters at Tavaro Resorts",
        caption: "Tranquil waterside rest",
      },
      {
        src: "/images/unsplash/resorts-tavaro-house-2.jpg",
        alt: "Lush landscape surrounding the pool deck",
        caption: "Lush landscape framing the pool terrace",
      },
      {
        src: "/images/unsplash/resorts-poolside-service.jpg",
        alt: "Sun loungers by the resort swimming pool",
        caption: "Sun loungers and poolside service",
      },
    ],
    highlights: [
      "Crystal-clear outdoor pool",
      "Shaded cabanas & loungers",
      "Dedicated towel & refreshment service",
    ],
  },
  {
    slug: "calisthenics-stations",
    title: "Calisthenics Stations",
    column: 1,
    eyebrow: "Outdoor Functional Fitness",
    summary:
      "Open-air bodyweight and functional fitness stations crafted into the natural garden landscape for energetic workouts.",
    details:
      "Set in a shaded garden clearing, our outdoor calisthenics stations provide bodyweight training enthusiasts with high-grade bars and functional workout zones in the fresh open air.",
    heroImage: "/images/unsplash/resorts-calisthenics-stations.jpg",
    heroAlt: "Outdoor calisthenics fitness station in the resort garden",
    gallery: [
      {
        src: "/images/things-to-do/play.jpg",
        alt: "Outdoor functional fitness and recreation grounds",
        caption: "Outdoor fitness and recreation grounds",
      },
      {
        src: "/images/things-to-do/movement.jpg",
        alt: "Garden fitness training and mobility practice",
        caption: "Functional mobility in natural surroundings",
      },
      {
        src: "/images/unsplash/resorts-calisthenics-stations.jpg",
        alt: "Calisthenics training bars and parallel equipment",
        caption: "High-grade outdoor pull-up and dip stations",
      },
    ],
    highlights: [
      "Custom pull-up & parallel bars",
      "Outdoor exercise turf",
      "Surrounded by fresh garden breeze",
    ],
  },
  {
    slug: "poolside",
    title: "Poolside",
    column: 1,
    eyebrow: "Open-Air Comfort & Refreshment",
    summary:
      "Sun-drenched loungers and shaded daybeds with attentive beverage service for peaceful daytime relaxation.",
    details:
      "The poolside terrace combines generous shaded loungers, poolside refreshments, and panoramic views of the water, making it a favorite retreat throughout the day.",
    heroImage: "/images/unsplash/resorts-poolside-service.jpg",
    heroAlt: "Poolside loungers and butler service at Tavaro Resorts",
    gallery: [
      {
        src: "/images/things-to-do/unwind.jpg",
        alt: "Relaxing poolside at Tavaro Resorts",
        caption: "Leisurely poolside relaxation",
      },
      {
        src: "/images/unsplash/monsoon-table-culinary.jpg",
        alt: "Chilled beverages and light snacks served poolside",
        caption: "Attentive beverage and culinary service",
      },
      {
        src: "/images/unsplash/resorts-poolside-service.jpg",
        alt: "Poolside attendants and loungers",
        caption: "Comfortable loungers beneath open skies",
      },
    ],
    highlights: [
      "Plush sun loungers & daybeds",
      "Chilled beverages & light snacks",
      "Tranquil open-sky atmosphere",
    ],
  },
  {
    slug: "in-room-dining",
    title: "In-room Dining",
    column: 2,
    eyebrow: "Private Suite Culinary Service",
    summary:
      "Carefully curated menus delivered directly to your room or private terrace for intimate, leisurely dining.",
    details:
      "Experience the flavours of Tavaro's culinary kitchen from the privacy of your suite or terrace. Each meal is prepared fresh and presented with thoughtful table service.",
    heroImage: "/images/unsplash/resorts-suite.jpg",
    heroAlt: "In-room dining service inside a Tavaro Resorts suite",
    gallery: [
      {
        src: "/images/unsplash/monsoon-table-culinary.jpg",
        alt: "Fine dining meal served in private comfort",
        caption: "Chef-prepared culinary dishes",
      },
      {
        src: "/images/things-to-do/dine.jpg",
        alt: "Freshly prepared resort culinary creations",
        caption: "Seasonal ingredients and attentive presentation",
      },
      {
        src: "/images/unsplash/resorts-suite.jpg",
        alt: "Private terrace dining setting overlooking greenery",
        caption: "Intimate dining in suite privacy",
      },
    ],
    highlights: [
      "All-day à la carte dining",
      "Private terrace setups",
      "Seasonal farm-to-table specialties",
    ],
  },
  {
    slug: "in-house-catering",
    title: "In-house Catering",
    column: 2,
    eyebrow: "Artisanal Event Gastronomy",
    summary:
      "Bespoke catering and live banquet counters tailored for weddings, corporate retreats, and private celebrations.",
    details:
      "From intimate dinners to multi-day celebrations, our dedicated culinary team crafts customized menus using seasonal ingredients, served seamlessly across our event venues.",
    heroImage: "/images/unsplash/monsoon-table-culinary.jpg",
    heroAlt: "Culinary catering presentation at Tavaro Resorts",
    gallery: [
      {
        src: "/images/things-to-do/dine.jpg",
        alt: "Artful culinary presentation and banquet displays",
        caption: "Customized banquet menus",
      },
      {
        src: "/images/unsplash/resorts-wedding-celebration.jpg",
        alt: "Banqueting setup at an outdoor event",
        caption: "Seamless open-air dining execution",
      },
      {
        src: "/images/unsplash/monsoon-table-culinary.jpg",
        alt: "Gourmet dishes prepared for celebrations",
        caption: "Live culinary counters and table service",
      },
    ],
    highlights: [
      "Tailored banquet & buffet menus",
      "Live culinary & grilling stations",
      "Regional and global gastronomy",
    ],
  },
  {
    slug: "event-planning",
    title: "Event Planning",
    column: 2,
    eyebrow: "End-to-End Coordination",
    summary:
      "Seamless orchestration and dedicated on-site coordination for unforgettable weddings, offsites, and celebrations.",
    details:
      "Our seasoned event planning specialists work closely with hosts from initial concept through day-of execution, ensuring every celebration unfolds effortlessly.",
    heroImage: "/images/unsplash/resorts-wedding-celebration.jpg",
    heroAlt: "Event planning and celebration setup at Tavaro Resorts",
    gallery: [
      {
        src: "/images/things-to-do/gather.jpg",
        alt: "Curated gathering under the evening sky",
        caption: "Curated celebrations and gatherings",
      },
      {
        src: "/photos/experiences-cars.jpg",
        alt: "Guest arrivals and logistics coordination",
        caption: "Smooth guest management and logistics",
      },
      {
        src: "/images/unsplash/resorts-wedding-celebration.jpg",
        alt: "Lawn event orchestration at Tavaro Resorts",
        caption: "Celebrations on expansive open lawns",
      },
    ],
    highlights: [
      "Dedicated event coordinator",
      "Vendor & timeline management",
      "Flexible indoor & outdoor venues",
    ],
  },
  {
    slug: "event-decor",
    title: "Event Décor",
    column: 2,
    eyebrow: "Atmospheric Design & Styling",
    summary:
      "Artful lighting, bespoke floral installations, and thematic stage arrangements tailored to each special occasion.",
    details:
      "Every venue at Tavaro can be transformed with tailored styling, bespoke floral artistry, ambient lighting, and elegant seating concepts suited to the mood of your event.",
    heroImage: "/images/things-to-do/gather.jpg",
    heroAlt: "Event décor and celebratory lighting at Tavaro Resorts",
    gallery: [
      {
        src: "/images/unsplash/resorts-wedding-celebration.jpg",
        alt: "Celebration floral décor on the lawn",
        caption: "Bespoke floral arrangements",
      },
      {
        src: "/images/unsplash/resorts-tavaro-house.jpg",
        alt: "Architectural lighting and evening ambience",
        caption: "Warm evening illumination",
      },
      {
        src: "/images/things-to-do/gather.jpg",
        alt: "Fairy lights and celebratory table styling",
        caption: "Atmospheric table styling under the stars",
      },
    ],
    highlights: [
      "Custom floral & stage design",
      "Ambient evening illumination",
      "Sustainable natural styling",
    ],
  },
  {
    slug: "power-backup",
    title: "Power Backup",
    column: 2,
    eyebrow: "Continuous Reliability",
    summary:
      "Uninterrupted 24/7 power backup infrastructure ensuring seamless comfort and flawless events across all grounds.",
    details:
      "The resort is equipped with high-capacity silent power backup systems to ensure round-the-clock air conditioning, lighting, sound, and technology without pause.",
    heroImage: "/images/unsplash/resorts-tavaro-house.jpg",
    heroAlt: "Tavaro House illuminated with reliable power backup",
    gallery: [
      {
        src: "/photos/drone-hero.jpg",
        alt: "Tavaro estate grounds under full illumination",
        caption: "Expansive resort estate with reliable power infrastructure",
      },
      {
        src: "/images/unsplash/resorts-suite-2.jpg",
        alt: "Comfortable air-conditioned suite",
        caption: "Uninterrupted climate control and lighting",
      },
      {
        src: "/images/unsplash/resorts-tavaro-house.jpg",
        alt: "Evening lighting at the resort courtyard",
        caption: "Reliable evening power across all venues",
      },
    ],
    highlights: [
      "100% full-capacity generators",
      "Instant automatic changeover",
      "Zero disruption for events & stays",
    ],
  },
  {
    slug: "housekeeping",
    title: "Housekeeping",
    column: 2,
    eyebrow: "Impeccable Care & Comfort",
    summary:
      "Discreet, attentive daily housekeeping and turndown service maintaining pristine hygiene and guest comfort.",
    details:
      "Our housekeeping associates work with gentle attention to detail, providing fresh linens, sanitised spaces, evening turndown, and any special amenities required during your stay.",
    heroImage: "/images/unsplash/resorts-executive-room.jpg",
    heroAlt: "Pristine executive suite maintained by Tavaro housekeeping",
    gallery: [
      {
        src: "/images/unsplash/resorts-suite.jpg",
        alt: "Crisp linen and immaculate suite bedroom",
        caption: "Immaculately maintained guest suites",
      },
      {
        src: "/images/unsplash/resorts-executive-room-2.jpg",
        alt: "Spotless en-suite bath amenities",
        caption: "Carefully curated bath amenities",
      },
      {
        src: "/images/unsplash/resorts-executive-room.jpg",
        alt: "Prepared guest suite ready for arrival",
        caption: "Discreet daily turndown and refreshing",
      },
    ],
    highlights: [
      "Twice-daily housekeeping service",
      "Premium eco-friendly linens",
      "Prompt guest-request fulfillment",
    ],
  },
  {
    slug: "valet-parking",
    title: "Valet Parking",
    column: 2,
    eyebrow: "Effortless Arrival & Departure",
    summary:
      "Professional, secure valet parking service at the main portico for effortless arrivals and departures.",
    details:
      "From the moment you drive through our gates, our courteous valet staff takes care of your vehicle with safety and promptness, allowing you to begin your retreat without delay.",
    heroImage: "/photos/experiences-cars.jpg",
    heroAlt: "Valet parking and guest arrival at Tavaro Resorts",
    gallery: [
      {
        src: "/images/unsplash/resorts-tavaro-house.jpg",
        alt: "Grand arrival driveway and portico",
        caption: "Grand portico arrival area",
      },
      {
        src: "/photos/drone-hero.jpg",
        alt: "Spacious secure resort parking grounds",
        caption: "Dedicated and monitored on-site parking",
      },
      {
        src: "/photos/experiences-cars.jpg",
        alt: "Professional valet attendants welcoming guests",
        caption: "Professional valet and luggage assistance",
      },
    ],
    highlights: [
      "Dedicated portico greeting",
      "Spacious, secure on-site parking",
      "Smooth event guest turnaround",
    ],
  },
];

export function getAmenityBySlug(slug: string): AmenityItem | undefined {
  return AMENITIES_DATA.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getAllAmenitySlugs(): string[] {
  return AMENITIES_DATA.map((item) => item.slug);
}
