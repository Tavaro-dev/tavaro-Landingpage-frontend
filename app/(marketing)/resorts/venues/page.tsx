import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/resorts/venues/tavaro-lawn.jpg";
import { ResortSpaces } from "@/features/resorts/components/spaces/ResortSpaces";
import { ResortGrounds } from "@/features/resorts/components/spaces/ResortGrounds";
import { ResortPlan } from "@/features/resorts/components/spaces/ResortPlan";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Wedding & Event Venues in Kokapet — Tavaro Resorts | Tavaro",
  description:
    "Six venues at Tavaro Resorts, Kokapet: lawns for up to 4,000, an air-conditioned hall, a pool deck, a heritage villa and a tree deck. Capacities, catering and how to book a site visit.",
  path: "/resorts/venues",
});

export default function ResortVenuesPage() {
  return (
    <>
      <PageHero
        photoSrc={heroPhoto}
        photoAlt="Tavaro Lawn at night from above, set for a wedding, with the city skyline beyond"
        placeholder="ph-1"
        breadcrumbLabel="Tavaro Resorts"
        eyebrow="Venues & celebrations"
        title="Weddings and celebrations at Tavaro"
        titleSize="clamp(34px,4.2vw,54px)"
        titleMaxWidth="20ch"
        lede="A 16-acre resort in Kokapet with six spaces, from a lawn for 4,000 guests to a heritage villa for fifty. Pick one for every celebration."
        ctas={[
          { label: "See the spaces", href: "#spaces", solid: true },
          { label: "Plan a site visit", href: "#plan" },
        ]}
      />
      <ResortSpaces />
      <ResortGrounds />
      <ResortPlan />
    </>
  );
}
