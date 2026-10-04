import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { OfferHead } from "@/components/shared/OfferHead";
import { TriGrid, type TriCardData } from "@/components/shared/TriGrid";
import { EventsSection } from "@/features/experiences/components/EventsSection";
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
    body: "Experiences built around music, food, art, culture, markets, festivals, community and conversation.",
    tags: ["Music", "Food", "Art", "Markets", "Festivals"],
    cta: { label: "See What's On", href: "#upcoming" },
  },
  {
    id: "corporate",
    icon: "building",
    heading: "Corporate",
    body: "Experiences for organisations and teams — retreats, offsites, leadership gatherings and custom celebrations.",
    tags: ["Retreats", "Offsites", "Team Experiences", "Leadership"],
    cta: { label: "Create a Corporate Experience", href: "/contact" },
  },
  {
    id: "wellness-exp",
    icon: "wellness",
    heading: "Wellness",
    body: "Yoga, movement, breathwork, meditation, retreats, sound and rituals for conscious living.",
    tags: ["Yoga", "Breathwork", "Meditation", "Retreats", "Sound"],
    cta: { label: "Explore Wellness Experiences", href: "/wellness" },
  },
  {
    id: "celebrations",
    icon: "celebration",
    heading: "Celebrations",
    body: "Weddings, milestone anniversaries, birthday gatherings and personal celebrations created across Tavaro's lawns, banquet spaces and private dining rooms.",
    tags: ["Weddings", "Milestones", "Banquets", "Private Parties"],
    cta: { label: "Plan a Celebration", href: "/resorts#celebrate" },
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/experiences-cars.jpg"
        photoAlt="A curated car experience at Tavaro"
        placeholder="ph-3"
        breadcrumbLabel="Experiences"
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
        quickNav={[
          { label: "SEE UPCOMING EXPERIENCES", desc: "Join a curated experience at Tavaro.", icon: "sun", href: "#upcoming" },
          { label: "CREATE YOUR DAY", desc: "Build a day around your team, friends or family.", icon: "building", href: "#ways-to-gather" },
          { label: "HOST YOUR TABLE", desc: "Bring your people together over a meal.", icon: "dining", href: "/contact" },
          { label: "GALLERY", desc: "Explore photos & moments from past gatherings.", icon: "photos", href: "#gallery" },
        ]}
      />

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
