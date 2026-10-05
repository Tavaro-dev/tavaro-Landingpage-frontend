export type ResortLocationPoint = {
  id: string;
  name: string;
  travelTime?: string;
  type: "resort" | "landmark";
  x: number; // For map visualization relative positioning (percentage)
  y: number; // For map visualization relative positioning (percentage)
};

export const RESORT_LOCATION_POINTS: ResortLocationPoint[] = [
  {
    id: "rgi",
    name: "RGI International Airport",
    travelTime: "35 MINS",
    type: "landmark",
    x: 28,
    y: 22,
  },
  {
    id: "gachibowli",
    name: "Gachibowli",
    travelTime: "15 MINS",
    type: "landmark",
    x: 72,
    y: 40,
  },
  {
    id: "tavaro",
    name: "Tavaro Resorts",
    type: "resort",
    x: 50,
    y: 50,
  },
  {
    id: "jubilee-hills",
    name: "Jubilee Hills Checkpost",
    travelTime: "30 MINS",
    type: "landmark",
    x: 32,
    y: 74,
  },
];

export const RESORT_DISTANCE_INFO = "32 KILOMETRES / 20 MILES";
