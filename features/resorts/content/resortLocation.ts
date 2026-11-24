import lawnPhoto from "@/public/images/resorts/venues/tavaro-lawn.jpg";
import type { Place } from "../components/location/ResortLocation";

/** Where the resort is, for maps links. */
const RESORT_PLACE = "Tavaro Resorts, Kokapet, Hyderabad";

/** Google Maps directions to the resort from a starting point. */
const directionsFrom = (origin: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(RESORT_PLACE)}&origin=${encodeURIComponent(origin)}`;

export const RESORT_LOCATION: Place = {
  name: "Tavaro Resorts",
  pinName: "Tavaro Resort",
  where: "Kokapet, Hyderabad",
  arrived: "You've arrived",
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESORT_PLACE)}`,
  // Nearest first.
  drives: [
    { id: "gachibowli", name: "Gachibowli", short: "Gachibowli", minutes: 15, directions: directionsFrom("Gachibowli, Hyderabad") },
    {
      id: "jubilee-hills",
      name: "Jubilee Hills Checkpost",
      short: "Jubilee Hills",
      minutes: 30,
      directions: directionsFrom("Jubilee Hills Checkpost, Hyderabad"),
    },
    {
      id: "rgi",
      name: "RGI International Airport",
      short: "Airport",
      minutes: 35,
      directions: directionsFrom("Rajiv Gandhi International Airport, Hyderabad"),
    },
  ],
  photo: lawnPhoto,
  photoAlt: "Tavaro Resorts at night from above, lit for a wedding",
  address: ["Tavaro Resorts", "Kokapet, Hyderabad", "Telangana, India"],
};
