/** Where the resort is, for maps links and the embed. */
export const RESORT_PLACE = "Tavaro Resorts, Kokapet, Hyderabad";

export type DriveTime = {
  id: string;
  name: string;
  /** Typical drive time by car, in minutes. */
  minutes: number;
  /** Search text Google Maps uses as the starting point for directions. */
  origin: string;
};

/** Nearest first. */
export const DRIVE_TIMES: DriveTime[] = [
  { id: "gachibowli", name: "Gachibowli", minutes: 15, origin: "Gachibowli, Hyderabad" },
  { id: "jubilee-hills", name: "Jubilee Hills Checkpost", minutes: 30, origin: "Jubilee Hills Checkpost, Hyderabad" },
  { id: "rgi", name: "RGI International Airport", minutes: 35, origin: "Rajiv Gandhi International Airport, Hyderabad" },
];

/** Google Maps directions to the resort, from the visitor's location or a given starting point. */
export const directionsUrl = (origin?: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(RESORT_PLACE)}${
    origin ? `&origin=${encodeURIComponent(origin)}` : ""
  }`;
