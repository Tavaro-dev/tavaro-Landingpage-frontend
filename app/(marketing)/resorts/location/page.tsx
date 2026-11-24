import { pageMetadata } from "@/lib/metadata";
import { ResortLocation } from "@/features/resorts/components/location/ResortLocation";

export const metadata = pageMetadata({
  title: "Location & Directions — Tavaro Resorts, Kokapet, Hyderabad",
  description: "Tavaro Resorts is in Kokapet, Hyderabad: 15 minutes from Gachibowli, 30 from Jubilee Hills and 35 from RGI Airport. Directions, maps and a number to call.",
  path: "/resorts/location",
});

export default function ResortLocationPage() {
  return <ResortLocation />;
}
