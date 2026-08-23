export type Enhancement = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
};

export const ENHANCEMENTS: readonly Enhancement[] = [
  {
    id: "airport-pickup",
    category: "Transportation",
    name: "Arrival Airport Pick-up",
    description:
      "A seamless private transfer from Rajiv Gandhi International Airport to the estate, timed to your flight.",
    price: 3500,
  },
  {
    id: "airport-dropoff",
    category: "Transportation",
    name: "Departure Airport Drop-off",
    description: "A comfortable private transfer back to the airport at the end of your stay.",
    price: 3500,
  },
  {
    id: "spa-ritual",
    category: "Wellness",
    name: "Signature Spa Ritual",
    description: "A 60-minute restorative treatment at Sol, set within the calm of the grounds.",
    price: 6500,
  },
  {
    id: "tavaro-table",
    category: "Culinary",
    name: "The Tavaro Table Tasting Menu",
    description: "A seasonal, curated multi-course dinner for two at The Tavaro Table.",
    price: 8500,
  },
] as const;
