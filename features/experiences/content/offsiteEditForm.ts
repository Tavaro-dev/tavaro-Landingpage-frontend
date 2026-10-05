export type OffsiteEditFormData = {
  // Step 1: Event Brief
  planningType: string;
  afterHoursAddon: boolean;
  purpose: string[];
  purposeOtherText?: string;
  targetAudience: string[];
  audienceOtherText?: string;
  expectedGuests: string;
  eventDate: string;
  eventDuration: string;
  creativeDirection: string;

  // Step 2: Contact Details
  name: string;
  company: string;
  contactNumber: string;
  designation: string;
  email: string;
};

export const INITIAL_OFFSITE_FORM_DATA: OffsiteEditFormData = {
  planningType: "Corporate Offsite - A day away from the usual, built around your team, culture and a little fun.",
  afterHoursAddon: false,
  purpose: [],
  purposeOtherText: "",
  targetAudience: [],
  audienceOtherText: "",
  expectedGuests: "",
  eventDate: "",
  eventDuration: "",
  creativeDirection: "",
  name: "",
  company: "",
  contactNumber: "",
  designation: "",
  email: "",
};

export const PLANNING_TYPES = [
  {
    value: "Corporate Offsite - A day away from the usual, built around your team, culture and a little fun.",
    label: "Corporate Offsite",
    description: "A day away from the usual, built around your team, culture and a little fun.",
  },
  {
    value: "Corporate Retreat - Step away, slow down and create space to reconnect, reflect or recharge.",
    label: "Corporate Retreat",
    description: "Step away, slow down and create space to reconnect, reflect or recharge.",
  },
  {
    value: "Leadership Retreats",
    label: "Leadership Retreats",
    description: "Exclusive gatherings tailored for executive leadership and strategic alignment.",
  },
  {
    value: "Brand Activation - Bring your brand to life through experiences people can see, feel and remember.",
    label: "Brand Activation",
    description: "Bring your brand to life through experiences people can see, feel and remember.",
  },
  {
    value: "After Hours - Because corporate doesn’t always have to mean 9 to 5.",
    label: "After Hours",
    description: "Because corporate doesn’t always have to mean 9 to 5. Think late nights, good food and games.",
  },
];

export const EVENT_PURPOSES = [
  "Team bonding",
  "Learning / development",
  "Celebration",
  "Networking",
  "Client engagement",
  "Brand awareness",
  "Launch",
  "Other",
];

export const TARGET_AUDIENCES = [
  "Employees",
  "Clients",
  "Management",
  "Consumers",
  "Creators / influencers",
  "Media",
  "VIP guests",
  "Other",
];

export const GUEST_COUNT_OPTIONS = [
  "Under 25",
  "25–50",
  "50–100",
  "100–250",
  "250–500",
  "500+",
];

export const DURATION_OPTIONS = [
  "2–4 hours",
  "Half day",
  "Full day",
  "Multiple days",
  "Not sure yet",
];

export const CREATIVE_DIRECTIONS = [
  "We have a clear concept",
  "We have a rough idea",
  "We have references but no concept yet",
  "We want EXP to develop the concept",
];
