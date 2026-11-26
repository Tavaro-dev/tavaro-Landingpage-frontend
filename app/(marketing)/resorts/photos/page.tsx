import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { galleryVideosSchema } from "@/lib/schema";
import { ResortGallery } from "@/features/resorts/components/gallery/ResortGallery";

export const metadata = pageMetadata({
  title: "Gallery — Tavaro Resorts | Tavaro",
  description:
    "Weddings, sangeet nights, corporate offsites, dining and the spaces that hold them — a curated gallery from Tavaro Resorts in Kokapet, Hyderabad.",
  path: "/resorts/photos",
});

export default function ResortPhotosPage() {
  return (
    <>
      <JsonLd data={galleryVideosSchema} />
      <ResortGallery />
    </>
  );
}
