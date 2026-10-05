import { pageMetadata } from "@/lib/metadata";
import { ResortMediaGallery } from "@/features/resorts/components/ResortMediaGallery";

export const metadata = pageMetadata({
  title: "Photos & Videos — Tavaro Resorts | Tavaro",
  description:
    "Explore Tavaro Resorts through our visual gallery — grounds, celebration venues, dining experiences and restful accommodations in Kokapet, Hyderabad.",
  path: "/resorts/photos",
});

export default function ResortPhotosPage() {
  return <ResortMediaGallery isStandalone />;
}
