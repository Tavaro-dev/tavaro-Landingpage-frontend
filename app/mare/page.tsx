import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { OfferHead } from "@/components/OfferHead";
import { SplitSection } from "@/components/SplitSection";
import { EventGrid, type EventCardData } from "@/components/EventGrid";
import { BandQuote } from "@/components/BandQuote";
import { Icon } from "@/components/Icon";
import StickyCta from "@/components/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/mare",
  title: "Màre Coffee House — Where Life Comes Together | Tavaro",
  description:
    "Màre is a lifestyle brand by Tavaro — coffee, food, conversation and community. Discover the space, the community and events at Màre.",
});

const EVENTS: EventCardData[] = [
  {
    id: "rain-rhythm",
    tag: "Music",
    placeholder: "ph-gold",
    src: "/images/unsplash/rain-rhythm-mare.jpg",
    alt: "Rain and Rhythm at Màre",
    date: "Music, Chai & Conversations",
    title: "Rain & Rhythm",
    meta: "Màre Coffee House · Open to all",
    ctaHref: "/contact",
  },
  {
    id: "art-of-the-brew",
    tag: "Workshop",
    placeholder: "ph-5",
    src: "/images/unsplash/mare-brewing-workshop.jpg",
    alt: "A brewing workshop at Màre",
    date: "Weekend Workshop",
    title: "The Art of the Brew",
    meta: "Màre Coffee House · Limited seats",
    ctaHref: "/contact",
  },
  {
    id: "sunday-market",
    tag: "Community",
    placeholder: "ph-1",
    src: "/images/unsplash/mare-sunday-market.jpg",
    alt: "Community pop-up at Màre",
    date: "Monthly Pop-Up",
    title: "Sunday Market at Màre",
    meta: "Màre Coffee House · Family friendly",
    ctaHref: "/contact",
  },
];

export default function MarePage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/mare-cover.jpg"
        photoAlt="Màre — a coffee house moment"
        placeholder="ph-gold"
        breadcrumbLabel="Màre"
        eyebrow="Màre Coffee House"
        title={
          <>
            Where life
            <br />
            comes together
          </>
        }
        titleSize="clamp(38px,6.4vw,84px)"
        lede="A lifestyle brand by Tavaro. Created as a space for ideas, creativity and meaningful conversations."
        ctas={[
          { label: "What's Happening at Màre", href: "#events", solid: true },
          { label: "Visit Màre", href: "/contact" },
        ]}
      />

      <section className="section on-dark tight">
        <div className="container">
          <Reveal className="center-col">
            <p className="intro-quote-mark">&ldquo;</p>
            <p className="display-2 italic">
              Created as a space for ideas, creativity
              <br />
              and meaningful conversations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Coffee & Food */}
      <section className="offer-block on-dark">
        <div className="container">
          <OfferHead num="01 — Everyday Màre" heading="Coffee & Food" />
          <SplitSection wide placeholder="ph-gold" src="/images/unsplash/mare-coffee.jpg" alt="Coffee at Màre">
            <p>
              Considered coffee and a thoughtful all-day food menu — the everyday Màre experience, made for
              lingering over a slow morning or an afternoon of work.
            </p>
            <Link href="/contact" className="text-link">
              View the Menu <Icon name="arrow" className="icon-arrow" />
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* The Space */}
      <section className="offer-block on-panel">
        <div className="container">
          <OfferHead num="02 — Architecture & Atmosphere" heading="The Space" />
          <SplitSection reverse wide placeholder="ph-5" src="/images/unsplash/mare-interior.jpg" alt="Màre interior architecture">
            <p>
              Warm materials, natural light and a layout built for both quiet corners and shared tables —
              Màre&apos;s interiors are designed to feel like an extension of home.
            </p>
          </SplitSection>
        </div>
      </section>

      {/* Community */}
      <section className="offer-block on-dark">
        <div className="container">
          <OfferHead num="03 — Community" heading="A Place to Belong" />
          <SplitSection wide placeholder="ph-4" src="/images/unsplash/mare-community-coffee-house.jpg" alt="Community at Màre">
            <p>
              A place to meet, work, connect and spend time — Màre draws together guests, neighbours and
              regulars into one shared table.
            </p>
          </SplitSection>
        </div>
      </section>

      {/* Events */}
      <section className="section on-panel" id="events">
        <div className="container">
          <OfferHead
            num="Events at Màre"
            heading={
              <>
                What&apos;s Happening
                <br />
                at Màre
              </>
            }
            lede="Conversations, music, workshops, dinners, cultural events and pop-ups — the Màre calendar, always evolving."
          />
          <EventGrid events={EVENTS} />
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/contact" className="text-link">
              View Past Events at Màre <Icon name="arrow" className="icon-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section on-dark">
        <BandQuote
          label="Màre"
          quote="A cup of coffee, and the people who make it worth staying for."
          ctas={[{ label: "Visit Màre", href: "/contact", solid: true }]}
        />
      </section>

      <StickyCta text="Want to know what's on at Màre?" ctaLabel="See Events" ctaHref="#events" />
    </>
  );
}
