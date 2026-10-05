import { pageMetadata } from "@/lib/metadata";
import { ResortLocation } from "@/features/resorts/components/ResortLocation";

export const metadata = pageMetadata({
  title: "Location — Tavaro Resorts | Tavaro",
  description: "Find your way to Tavaro Resorts, Kokapet. Directions, maps, and connectivity.",
  path: "/resorts/location",
});

export default function ResortLocationPage() {
  return <ResortLocation />;
}
