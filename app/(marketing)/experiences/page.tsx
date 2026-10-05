import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { TriGrid, type TriCardData } from "@/components/shared/TriGrid";
import { EventsSection } from "@/features/experiences/components/EventsSection";
import { OffsiteEditButton } from "@/features/experiences/components/OffsiteEditButton";
import { GalleryHeroButton } from "@/features/experiences/components/GalleryHeroButton";
import { BandQuote } from "@/components/shared/BandQuote";
import { Icon } from "@/components/ui/Icon";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experiences — Moments Made Extraordinary | Tavaro",
  description:
    "Tavaro Experiences — social & cultural gatherings, corporate offsites and wellness retreats, curated as an ongoing platform of moments.",
  path: "/experiences",
});

const CATEGORIES: TriCardData[] = [
  {
    id: "social",
    icon: "sun",
    heading: "Social & Cultural",
    subtitle: "People · Culture · Connection",
    bgImage: "/images/unsplash/mare-sunday-market.jpg",
  },
  {
    id: "corporate",
    icon: "building",
    heading: "Corporate",
    subtitle: "Offsites, retreats & team experiences",
    bgImage: "/photos/experiences-cars.jpg",
  },
  {
    id: "wellness-exp",
    icon: "wellness",
    heading: "Wellness",
    subtitle: "Movement · Stillness · Wellbeing",
    bgImage: "/images/unsplash/stillness-retreat.jpg",
  },
  {
    id: "golden-society",
    icon: "golden-society",
    heading: "The Golden Society",
    subtitle: "Weddings & Celebrations",
    bgImage: "/images/unsplash/resorts-wedding-celebration.jpg",
    isGoldenSociety: true,
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/experiences-cars.jpg"
        photoAlt="A curated car experience at Tavaro"
        placeholder="ph-3"
        breadcrumbLabel="Tavaro / Experiences"
        eyebrow="Experiences"
        title={
          <>
            Moments made
            <br />
            extraordinary
          </>
        }
        titleSize="clamp(34px,4.2vw,54px)"
        lede="Tavaro curates and creates experiences — not just spaces to host them in. An ongoing platform of gatherings, not a static list of events."
        topRightCta={<GalleryHeroButton />}
        quickNav={[
          {
            label: "UPCOMING EXPERIENCES",
            desc: "Experiences worth showing up for.",
            icon: "sun",
            href: "#upcoming",
          },
          {
            label: "THE OFFSITE EDIT",
            desc: "Team outings, offsites, celebrations & more.",
            icon: "building",
            href: "#offsite-edit",
            isOffsiteModal: true,
          },
          {
            label: "UNDER THE SKY",
            desc: "Open-air dining experience across Tavaro",
            icon: "dining",
            href: "#under-the-sky",
            isUnderTheSkyModal: true,
          },
        ]}
      />

      {/* The Offsite Edit Featured Section */}
      <section className="offer-block on-panel" id="offsite-edit">
        <div className="container">
          <SplitSection
            reverse
            wide
            placeholder="ph-3"
            src="/photos/experiences-cars.jpg"
            alt="Corporate offsite and brand activation experience at Tavaro"
          >
            <OfferHead num="Featured Experience" heading="The Offsite Edit" />
            <p className="italic display-3" style={{ marginBottom: 16 }}>
              Create your day.
            </p>
            <p>
              Tell us what you&apos;re building. From team offsites and leadership retreats to brand activations and after-hours gatherings, give us the brief and we&apos;ll help shape the experience around it.
            </p>
            <ul className="split-list">
              <li>Corporate Offsites &amp; Team Days</li>
              <li>Leadership &amp; Strategic Retreats</li>
              <li>Brand Activations &amp; Launches</li>
              <li>After Hours Dining &amp; Evening Add-ons</li>
            </ul>
            <OffsiteEditButton />
          </SplitSection>
        </div>
      </section>

      {/* Four categories */}
      <section className="section on-dark" id="ways-to-gather">
        <div className="container">
          <OfferHead eyebrow="What We Curate" heading="Four ways to gather" />
        </div>
        <TriGrid cards={CATEGORIES} />
      </section>

      {/* Upcoming */}
      <section className="section on-panel" id="upcoming">
        <div className="container">
          <OfferHead
            num="Upcoming"
            heading="Experiences at Tavaro"
            lede="A living calendar of gatherings — updated as new experiences are announced."
          />
          <EventsSection />
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/mare#events" className="text-link">
              See More <Icon name="arrow" className="icon-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Gallery */}
      <section className="section on-dark" id="gallery">
        <div className="container">
          <OfferHead
            eyebrow="Visual Memories"
            heading="Experiences Gallery"
            lede="A look back at moments, gatherings, and celebrations created at Tavaro."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 40 }}>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/photos/experiences-cars.jpg" alt="Curated Car Meet" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/images/unsplash/resorts-wedding-celebration.jpg" alt="Outdoor Lawn Celebration" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/images/unsplash/monsoon-table-culinary.jpg" alt="Private Dining Experience" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/images/unsplash/mare-community-coffee-house.jpg" alt="Màre Social Gathering" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/images/unsplash/resorts-sol-pilates.jpg" alt="Wellness Movement Retreat" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <div className="split-media" style={{ aspectRatio: "4/3", borderRadius: 4 }}>
              <Image src="/photos/resorts-horses.jpg" alt="Estate Sunset Walk" fill sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="section on-panel">
        <BandQuote
          label="Experiences at Tavaro"
          quote="Reasons to come together — curated, not just hosted."
          ctas={[{ label: "Create an Experience With Us", href: "/contact", solid: true }]}
        />
      </section>

      <StickyCta text="Have an experience in mind?" ctaLabel="Enquire" ctaHref="/contact" />
    </>
  );
}
