export interface ActivityCategory {
  id: string;
  title: string;
  heading?: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  items: string[];
}

export interface ActivityPillar {
  id: "explore" | "create";
  route: string;
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  subtitle: string;
  badge: string;
  cardDescription: string;
  categoryPreview: string;
  ctaLabel: string;
  modalImage: string;
  modalImageAlt: string;
  heroImage: string;
  heroImageAlt: string;
  notice?: string;
  categories: ActivityCategory[];
}

export const THINGS_TO_DO_DATA: {
  explore: ActivityPillar;
  create: ActivityPillar;
} = {
  explore: {
    id: "explore",
    route: "/resorts/things-to-do/explore",
    title: "Explore at Your Own Pace",
    eyebrow: "EXPLORE AT YOUR OWN PACE",
    heading: "A little more room to be.",
    description: "Wander, dine, swim, play and unwind — at your own rhythm.",
    subtitle: "Wander, dine, swim, play and unwind — at your own rhythm.",
    badge: "At Your Own Rhythm",
    cardDescription:
      "Discover dining, swimming, nature walks, outdoor games and peaceful corners of Tavaro.",
    categoryPreview: "Dine · Unwind · Play · Explore",
    ctaLabel: "Discover Experiences",
    modalImage: "/images/things-to-do/explore-hero.jpg",
    modalImageAlt: "Tranquil outdoor resort pool and lush tropical gardens at Tavaro Resorts",
    heroImage: "/images/things-to-do/explore-hero.jpg",
    heroImageAlt: "Tranquil resort grounds, architecture, and swimming pool at Tavaro Resorts",
    notice: "Activities and estate spaces are subject to daylight, weather, and daily operational schedules.",
    categories: [
      {
        id: "dine",
        title: "Dine",
        tagline: "Leisurely breakfasts, poolside coffee & grove dining",
        description:
          "From leisurely breakfasts to evenings around the table, discover the pleasures of dining at Tavaro.",
        image: "/images/things-to-do/dine.jpg",
        imageAlt: "Poolside and outdoor garden dining at Màre, Tavaro Resorts",
        items: [
          "Màre — poolside coffee & dining",
          "Under the Sky — curated tables",
          "Sundowners",
          "Breakfast in the grove",
          "Seasonal dining experiences",
        ],
      },
      {
        id: "unwind",
        title: "Unwind",
        tagline: "Quiet spaces, restorative pools & shaded walks",
        description:
          "Make space for stillness, fresh air and the simple pleasure of slowing down.",
        image: "/images/things-to-do/unwind.jpg",
        imageAlt: "Peaceful garden spaces, quiet loungers, and poolside reflection at Tavaro",
        items: [
          "Swimming",
          "Nature walks",
          "Sunset walks",
          "Reading & quiet spaces",
          "Relaxing by the pool",
          "Time in the Mango Grove",
        ],
      },
      {
        id: "play",
        title: "Play",
        tagline: "Outdoor games, cycling & friendly competition",
        description:
          "Enjoy time outdoors, move at your own pace and share a little friendly competition.",
        image: "/images/things-to-do/play.jpg",
        imageAlt: "Expansive green recreation lawns and lawn games at Tavaro Resorts",
        items: [
          "Lawn games",
          "Cricket",
          "Badminton",
          "Outdoor games",
          "Cycling",
          "Kids' play",
        ],
      },
      {
        id: "explore",
        title: "Explore",
        tagline: "Mango grove trails, tree decks & stargazing",
        description:
          "Discover the landscapes, hidden corners and quiet natural beauty of Tavaro.",
        image: "/images/things-to-do/explore.jpg",
        imageAlt: "Scenic nature trails, dense canopies, and elevated tree decks at Tavaro",
        items: [
          "Mango Grove",
          "Tree Deck",
          "Nature trails",
          "Garden walks",
          "Birdwatching",
          "Photography",
          "Stargazing",
        ],
      },
    ],
  },
  create: {
    id: "create",
    route: "/resorts/things-to-do/create",
    title: "Create Your Experience",
    eyebrow: "CREATE YOUR EXPERIENCE",
    heading: "Something special, made yours.",
    description:
      "From moments of stillness to meaningful celebrations, arrange an experience that feels personal to you.",
    subtitle: "Arrange something special with our team.",
    badge: "On Request",
    cardDescription:
      "Arrange something special, from wellness sessions and creative workshops to private dining and celebrations.",
    categoryPreview: "Wellness · Movement · Create · Gather",
    ctaLabel: "Create Your Experience",
    modalImage: "/images/things-to-do/create-hero.jpg",
    modalImageAlt: "Peaceful outdoor wellness setting amidst natural greenery at Tavaro Resorts",
    heroImage: "/images/things-to-do/create-hero.jpg",
    heroImageAlt: "Mindful stillness and wellness gathering space at Tavaro Resorts",
    notice: "Experiences are arranged on request and subject to confirmation.",
    categories: [
      {
        id: "wellness",
        title: "Wellness",
        tagline: "Mind, breath & restorative stillness",
        description:
          "Dedicated wellness journeys guided by experienced facilitators, from restorative Hatha yoga to immersive acoustic sound healing.",
        image: "/images/things-to-do/wellness.jpg",
        imageAlt: "Serene outdoor yoga, meditation, and acoustic sound healing at Tavaro",
        items: [
          "Hatha Yoga",
          "Yoga & Kriya",
          "Meditation",
          "Sound Healing",
          "Wellness Retreats",
        ],
      },
      {
        id: "movement",
        title: "Movement",
        tagline: "Primal flow & mindful physical activity",
        description:
          "Energizing movement sessions incorporating primal flow patterns and traditional Kalari practices that awaken strength, agility, and mobility.",
        image: "/images/things-to-do/movement.jpg",
        imageAlt: "Movement session and mindful physical mobility at Tavaro Resorts",
        items: [
          "Animal Flow",
          "Kalari / Movement Sessions",
        ],
      },
      {
        id: "create",
        title: "Create",
        heading: "Make something of the moment.",
        tagline: "Hands-on craft, artistic & sensory masterclasses",
        description:
          "Explore creative experiences that invite you to learn, express yourself and try something new.",
        image: "/images/things-to-do/create-artisan.jpg",
        imageAlt: "Hands-on artisan workshop and ceramic pottery craft process",
        items: [
          "Art Workshops",
          "Pottery",
          "Craft Workshops",
          "Floral Workshops",
          "Cooking Workshops",
          "Photography Sessions",
          "Music Sessions",
          "Writing & Journaling",
        ],
      },
      {
        id: "gather",
        title: "Gather",
        heading: "Bring people together.",
        tagline: "Private dining, celebrations & seasonal festivals",
        description:
          "Create space for shared meals, meaningful celebrations and memorable gatherings.",
        image: "/images/things-to-do/gather.jpg",
        imageAlt: "Warm celebratory garden dining and long tables under evening fairy lights",
        items: [
          "Private Dining",
          "Chef-led Dinners",
          "Farm-to-table Experiences",
          "Celebration Dinners",
          "Private Parties",
          "Cultural Events",
          "Music Evenings",
          "Seasonal Festivals",
          "Tavaro Experiences",
        ],
      },
    ],
  },
};
