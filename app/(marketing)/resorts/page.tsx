import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { Icon } from "@/components/ui/Icon";
import { RoomAvailability } from "@/features/accommodations/components/RoomAvailability";
import StickyCta from "@/components/shared/StickyCta";
import { PlanEventButton } from "@/features/experiences/components/PlanEventButton";
import { ResortDining } from "@/features/resorts/components/ResortDining";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Resorts — A World Away, Yet Close to You | Tavaro",
  description:
    "Tavaro Resorts, Kokapet — stays, celebrations, culinary experiences, coffee and movement. Plus Leaf by Tavaro, Mahalingapuram, coming soon.",
  path: "/resorts",
});

export default function ResortsPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/resorts-horses.jpg"
        photoAlt="Horses on the grounds at Tavaro Resorts, Kokapet"
        placeholder="ph-1"
        breadcrumbLabel="Tavaro Resorts"
        eyebrow="Kokapet, Hyderabad"
        title={
          <>
            A world away,
            <br />
            yet close to you
          </>
        }
        titleSize="clamp(34px,4.2vw,54px)"
        lede="From quiet stays and long lunches to grand celebrations and shared experiences, Tavaro brings people together in one expansive destination."
        ctas={[
          { label: "Book Your Stay", href: "#availability", solid: true },
          { label: "Plan Your Event", href: "#celebrate" },
        ]}
        quickNav={[
          { label: "Location", href: "/resorts/location", icon: "location" },
          { label: "Photos & Videos", href: "/resorts/photos", icon: "photos" },
          { label: "Facilities & Amenities", href: "#facilities", icon: "facilities" },
          { label: "Dining", href: "#culinary", icon: "dining" },
          { label: "Things to do", href: "#things-to-do", icon: "compass" },
        ]}
      />

      <RoomAvailability />

      {/* Intro */}
      <section className="section on-dark tight">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">Tavaro Resorts, Kokapet</p>
            <p className="lede">
              A destination built for staying, celebrating, gathering and slowing down — rooms and suites,
              event lawns and venues, a culinary table, a coffee house and a movement studio, all within
              one warm, natural setting close to the city.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 01 — Celebrate With Us */}
      <section className="offer-block on-panel" id="celebrate">
        <div className="container">
          <SplitSection
            reverse
            wide
            placeholder="ph-4"
            src="/images/unsplash/resorts-wedding-celebration.jpg"
            alt="A wedding celebration at Tavaro Resorts"
          >
            <OfferHead num="01 — Celebrate With Us" heading="Events & Venues" />
            <p>
              Weddings, social celebrations and corporate gatherings, held across lawns, banquet halls and
              intimate courtyards — each venue shaped for a different scale of celebration.
            </p>
            <ul className="split-list">
              <li>Weddings &amp; social celebrations</li>
              <li>Corporate events &amp; offsites</li>
              <li>Multiple venues, varying capacities</li>
              <li>End-to-end event planning support</li>
            </ul>
            <PlanEventButton />
          </SplitSection>
        </div>
      </section>

      {/* 02 — Rooms & Stays */}
      <section className="offer-block on-dark" id="stay">
        <div className="container">
          <SplitSection wide placeholder="ph-1" src="/images/unsplash/resorts-suite.jpg" alt="A Tavaro Resorts suite">
            <OfferHead num="02 — Stay With Us" heading="Rooms & Stays" />
            <p>
              Rooms and suites designed for rest — natural materials, soft light and views that slow the
              day down. Every stay is built around comfort, quiet and easy access to everything Tavaro has
              to offer.
            </p>
            <ul className="split-list">
              <li>Garden &amp; pool-facing rooms and suites</li>
              <li>Curated in-room amenities</li>
              <li>Daily dining, coffee and wellness access</li>
              <li>Flexible rates and seasonal offers</li>
            </ul>
            <Link href="#availability" className="btn">
              Book Your Stay <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* 03 — Culinary Experience */}
      <ResortDining />

      {/* 04 — Màre */}
      <section className="offer-block on-dark">
        <div className="container">
          <SplitSection
            wide
            priority
            placeholder="ph-gold"
            src="/images/unsplash/mare-community-coffee-house.jpg"
            alt="Màre Coffee House at Tavaro Resorts"
          >
            <OfferHead num="04 — Coffee & Community" heading="Màre Coffee House" />
            <p className="italic display-3" style={{ marginBottom: 16 }}>
              Where life comes together.
            </p>
            <p>
              Màre is Tavaro&apos;s own lifestyle brand — a space for coffee, food, ideas and conversation,
              open to guests and the wider community alike.
            </p>
            <Link href="/mare" className="btn">
              Discover Màre <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* 05 — Sol Pilates */}
      <section className="offer-block on-panel" id="sol">
        <div className="container">
          <SplitSection reverse wide placeholder="ph-6" src="/images/unsplash/resorts-sol-pilates.jpg" alt="Sol Pilates Studio">
            <OfferHead num="05 — Movement & Wellness" heading="Sol Pilates Studio" />
            <p>
              A dedicated studio for movement and physical wellbeing — Pilates, mobility and guided fitness
              sessions set within the calm of the Tavaro grounds.
            </p>
            <Link href="/wellness" className="btn">
              Discover Sol <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Leaf by Tavaro */}
      <section className="section leaf-section" id="leaf" style={{ color: "var(--cream)" }}>
        <div className="container">
          <Reveal className="two-col-text">
            <div>
              <span className="coming-soon-tag">Coming Soon</span>
              <p className="eyebrow" style={{ color: "#a9c2a6" }}>
                Leaf by Tavaro — Mahalingapuram
              </p>
            </div>
            <div>
              <p
                className="lede italic"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,2.4vw,28px)", color: "var(--cream)" }}
              >
                Moving wellness beyond clinics and into restorative resort experiences.
              </p>
              <p style={{ marginTop: 22, color: "var(--muted-on-dark)" }}>
                A quiet, restorative retreat built around concept, architecture and a wellness proposition
                designed for the way people want to heal, rest and return to themselves.
              </p>
              <Link href="/wellness" className="text-link" style={{ marginTop: 26, display: "inline-flex" }}>
                Discover Leaf <Icon name="arrow" className="icon-arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyCta text="Ready to plan your stay at Tavaro Resorts?" ctaLabel="Book Your Stay" ctaHref="/contact" />
    </>
  );
}
