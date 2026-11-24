import heroPhoto from "@/public/images/heroes/leela-hero.jpg";
import { pageMetadata } from "@/lib/metadata";
import { PlaceLocation, type Place } from "@/features/resorts/components/location/ResortLocation";

export const metadata = pageMetadata({
  title: "Location & Directions — Leela by Tavaro Residences, Hyderabad",
  description:
    "Leela is off Radial Road 7 towards Gandipet: 15 minutes from Hyderabad's Financial District, 30 from IKEA and 45 from RGI Airport. Map, directions and a number to call.",
  path: "/residences/leela/location",
});

/** Leela's place on Google Maps (the client's link, without its tracking parameters), and its pin for directions. */
const MAP =
  "https://www.google.com/maps/place/Leela+By+Tavaro+Residences/@17.4566428,78.1981187,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcbefe79b820785:0xf8b7b7d83f9dcd19!8m2!3d17.4566428!4d78.2006936!16s%2Fg%2F11x27q4rv6";
const PIN = "17.4566428,78.2006936";

const directionsFrom = (origin: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${PIN}&origin=${encodeURIComponent(origin)}`;

// Drive times from the Leela brochure, nearest first.
const LEELA: Place = {
  name: "Leela",
  pinName: "Leela",
  where: "Off Radial Road 7, Hyderabad",
  arrived: "Welcome home",
  mapsUrl: MAP,
  drives: [
    { id: "financial-district", name: "the Financial District", short: "Financial District", minutes: 15, directions: directionsFrom("Financial District, Hyderabad") },
    { id: "ikea", name: "IKEA", short: "IKEA", minutes: 30, directions: directionsFrom("IKEA Hyderabad") },
    { id: "rgi", name: "RGI International Airport", short: "Airport", minutes: 45, directions: directionsFrom("Rajiv Gandhi International Airport, Hyderabad") },
  ],
  photo: heroPhoto,
  photoAlt: "Leela at dusk: the street front, planted terraces and entrance",
  address: ["Leela by Tavaro Residences", "Off Radial Road 7, towards Gandipet", "Hyderabad, Telangana, India"],
};

export default function LeelaLocationPage() {
  return <PlaceLocation place={LEELA} />;
}
