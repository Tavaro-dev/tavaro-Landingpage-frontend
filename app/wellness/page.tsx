import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { OfferHead } from "@/components/OfferHead";
import { TriGrid, type TriCardData } from "@/components/TriGrid";
import { SplitSection } from "@/components/SplitSection";
import { EventGrid, type EventCardData } from "@/components/EventGrid";
import { BandQuote } from "@/components/BandQuote";
import Link from "next/link";
import StickyCta from "@/components/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/wellness",
  title: "Wellness — A Tavaro Way of Life | Tavaro",
  description:
    "Wellness at Tavaro is not a facility, it's a way of living — physical wellness, mental wellness and restorative living woven through everything Tavaro creates.",
});

const PILLARS: TriCardData[] = [
  {
    icon: "wellness",
    heading: "Physical Wellness",
    body: "Movement and physical vitality — the energy that comes from a body in motion.",
    tags: ["Pilates", "Yoga", "Fitness", "Mobility", "Sport"],
  },
  {
    icon: "moon",
    heading: "Mental Wellness",
    body: "Creating space to slow down, reconnect and restore, away from constant noise.",
    tags: ["Meditation", "Breathwork", "Reflection", "Nature", "Community"],
  },
  {
    icon: "leaf",
    heading: "Restorative Living",
    body: "Wellness woven into the everyday — sleep, food, nature, hospitality and connection.",
    tags: ["Sleep", "Food", "Nature", "Retreat", "Connection"],
  },
];

const PROGRAMMES: EventCardData[] = [
  {
    id: "stillness-project",
    tag: "Retreat",
    placeholder: "ph-green",
    src: "/images/unsplash/stillness-retreat.jpg",
    alt: "The Stillness Project",
    date: "One-Day Retreat",
    title: "The Stillness Project",
    meta: "Tavaro Resorts, Kokapet",
    ctaHref: "/contact",
  },
  {
    id: "breath-sound-circle",
    tag: "Movement",
    placeholder: "ph-6",
    src: "/images/unsplash/wellness-breath-sound-circle.jpg",
    alt: "Sound & breathwork session",
    date: "Weekly Session",
    title: "Breath & Sound Circle",
    meta: "Sol Pilates Studio",
    ctaHref: "/contact",
  },
  {
    id: "leaf-retreat",
    tag: "Retreat",
    placeholder: "ph-1",
    src: "/images/unsplash/wellness-future-retreat.jpg",
    alt: "Future wellness retreat",
    date: "Coming Soon",
    title: "Leaf Restorative Retreat",
    meta: "Leaf by Tavaro, Mahalingapuram",
    ctaLabel: "Register Interest",
    ctaHref: "/contact",
  },
];

export default function WellnessPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/wellness-hands.jpg"
        photoAlt="Wellness at Tavaro"
        placeholder="ph-green"
        breadcrumbLabel="Wellness"
        eyebrow="Wellness at Tavaro"
        title={
          <>
            A Tavaro
            <br />
            way of life
          </>
        }
        titleSize="clamp(38px,6.4vw,84px)"
        lede="Not a single facility or service — a way of living that shapes the places we create, the food we serve and the experiences we curate."
        ctas={[
          { label: "Explore Wellness", href: "#pillars", solid: true },
        ]}
      />

      {/* Opening statement */}
      <section className="section on-dark">
        <div className="container">
          <Reveal className="center-col">
            <p className="intro-quote-mark">&ldquo;</p>
            <p className="display-2 italic">
              Wellness is not something we visit.
              <br />
              It is something we live.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* Pillars */}
      <section className="section on-dark" id="pillars">
        <div className="container">
          <OfferHead eyebrow="The Wellness Pillars" heading="Three ways we live well" />
        </div>
        <TriGrid cards={PILLARS} />
      </section>

      {/* Ecosystem */}
      <section className="section on-panel">
        <div className="container">
          <OfferHead
            eyebrow="The Wellness Ecosystem"
            heading={
              <>
                Everywhere wellness
                <br />
                shows up at Tavaro
              </>
            }
          />

          <div style={{ marginBottom: 70 }}>
            <SplitSection placeholder="ph-green" src="/images/unsplash/wellness-leaf-by-tavaro.jpg" alt="Leaf by Tavaro">
              <span className="coming-soon-tag">Coming Soon</span>
              <p className="eyebrow">Leaf by Tavaro — Mahalingapuram</p>
              <p className="lede italic" style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "16px 0" }}>
                Moving wellness beyond clinics and into restorative resort experiences.
              </p>
              <Link href="/resorts#leaf" className="btn">
                Discover Leaf <span className="btn-arrow">→</span>
              </Link>
            </SplitSection>
          </div>

          <SplitSection reverse placeholder="ph-6" src="/images/unsplash/resorts-sol-pilates.jpg" alt="Sol Pilates Studio">
            <p className="eyebrow">Sol Pilates Studio</p>
            <p className="lede" style={{ marginTop: 16 }}>
              Movement at the heart of Tavaro Resorts — Pilates, mobility and guided fitness within the
              calm of the grounds.
            </p>
            <Link href="/resorts#sol" className="btn">
              Discover Sol <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Programmes */}
      <section className="section on-dark">
        <div className="container">
          <OfferHead num="Programmes" heading="Wellness Experiences & Retreats" />
          <EventGrid events={PROGRAMMES} />
        </div>
      </section>

      <section className="section on-panel">
        <BandQuote
          label="A Way of Life"
          quote="Wellness at Tavaro isn't a department. It's the thread through everything we build."
        />
      </section>

      <StickyCta text="Curious about wellness at Tavaro?" ctaLabel="Enquire" ctaHref="/contact" />
    </>
  );
}
