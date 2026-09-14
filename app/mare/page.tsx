import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { OfferHead } from "@/components/OfferHead";
import { SplitSection } from "@/components/SplitSection";
import { BandQuote } from "@/components/BandQuote";
import StickyCta from "@/components/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/mare",
  title: "Màre Coffee House — Where Life Comes Together | Tavaro",
  description:
    "Màre is a lifestyle brand by Tavaro — coffee, food, conversation and community.",
});

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
          { label: "Visit Màre", href: "/contact", solid: true },
          { label: "Explore Experiences", href: "/experiences" },
        ]}
      />

      <section className="section on-dark tight">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">Màre Coffee House</p>
            <p className="lede">
              Coffee, food and community built around quiet luxury, craftsmanship and slow mornings.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Coffee & Food */}
      <section className="offer-block on-dark" id="coffee">
        <div className="container">
          <OfferHead
            num="01 — Coffee &amp; Culinary"
            heading={
              <>
                Shaped by flavor,
                <br />
                poured with care
              </>
            }
          />
          <SplitSection placeholder="ph-1" src="/images/unsplash/mare-coffee.jpg" alt="Pour over coffee at Màre">
            <p>
              Specialty beans roasted for balance, house bakery items baked daily, and clean, fresh plates
              designed for unhurried breakfasts and afternoon gatherings.
            </p>
            <ul className="split-list">
              <li>Specialty coffee &amp; single-origin pour overs</li>
              <li>Artisanal bakery &amp; fresh savouries</li>
              <li>All-day breakfast &amp; light plates</li>
              <li>Seasonal beverage menu</li>
            </ul>
          </SplitSection>
        </div>
      </section>

      {/* Community */}
      <section className="offer-block on-panel" id="community">
        <div className="container">
          <OfferHead
            num="02 — Community &amp; Culture"
            heading={
              <>
                A table for
                <br />
                every conversation
              </>
            }
          />
          <SplitSection wide placeholder="ph-4" src="/images/unsplash/mare-community-coffee-house.jpg" alt="Community at Màre">
            <p>
              A place to meet, work, connect and spend time — Màre draws together guests, neighbours and
              regulars into one shared table.
            </p>
          </SplitSection>
        </div>
      </section>

      <section className="section on-dark">
        <BandQuote
          label="Màre"
          quote="A cup of coffee, and the people who make it worth staying for."
          ctas={[{ label: "Visit Màre", href: "/contact", solid: true }]}
        />
      </section>

      <StickyCta text="Visit Màre Coffee House" ctaLabel="Get Directions" ctaHref="/contact" />
    </>
  );
}
