import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { OfferHead } from "@/components/OfferHead";
import { TriGrid, type TriCardData } from "@/components/TriGrid";
import { EventGrid, type EventCardData } from "@/components/EventGrid";
import { BandQuote } from "@/components/BandQuote";
import { Icon } from "@/components/Icon";
import StickyCta from "@/components/StickyCta";
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
];

const EVENTS: EventCardData[] = [
  {
    id: "stillness-project",
    tag: "Wellness",
    placeholder: "ph-green",
    src: "/images/unsplash/stillness-retreat.jpg",
    alt: "The Stillness Project retreat",
    date: "One-Day Retreat",
    title: "The Stillness Project",
    meta: "Tavaro Resorts, Kokapet · Registrations open",
    ctaHref: "/contact",
  },
  {
    id: "monsoon-table",
    tag: "Culinary",
    placeholder: "ph-5",
    src: "/images/unsplash/monsoon-table-culinary.jpg",
    alt: "Monsoon Table dining experience",
    date: "Seasonal Dining Experience",
    title: "Monsoon Table",
    meta: "Tavaro Resorts, Kokapet · Limited seating",
    ctaHref: "/contact",
  },
  {
    id: "rain-rhythm",
    tag: "Social & Cultural",
    placeholder: "ph-gold",
    src: "/images/unsplash/rain-rhythm-mare.jpg",
    alt: "Rain and Rhythm at Màre",
    date: "Music, Chai & Conversations",
    title: "Rain & Rhythm",
    meta: "Màre Coffee House · Open to all",
    ctaHref: "/contact",
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
        titleSize="clamp(38px,6.4vw,84px)"
        lede="Tavaro curates and creates experiences — not just spaces to host them in. An ongoing platform of gatherings, not a static list of events."
        ctas={[
          { label: "See Upcoming Experiences", href: "#upcoming", solid: true },
          { label: "Create a Corporate Experience", href: "#corporate" },
        ]}
      />

      {/* Three categories */}
      <section className="section on-dark">
        <div className="container">
          <OfferHead eyebrow="What We Curate" heading="Three ways to gather" />
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
          <EventGrid events={EVENTS} />
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/mare#events" className="text-link">
              See What&apos;s Happening at Màre <Icon name="arrow" className="icon-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section on-dark">
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
