
import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/heroes/mare-hero-cup-right.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { JsonLd } from "@/components/shared/JsonLd";
import { mareSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/mare",
  title: "Màre Coffee House — Where Life Comes Together | Tavaro",
  description:
    "Màre Coffee House at Tavaro, Kokapet, Hyderabad: specialty coffee and pour overs, a daily bakery and all-day breakfast. A place to meet, work and slow down.",
});

export default function MarePage() {
  return (
    <>
      <JsonLd data={mareSchema} />
      <PageHero
        photoSrc={heroPhoto}
        photoPosition="68% center"
        photoAlt="A cortado by the pool at Màre"
        placeholder="ph-gold"
        breadcrumbLabel="Màre"
        breadcrumbIcon="mare-wordmark"
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
          <SplitSection placeholder="ph-1" src="/images/mare/coffee.jpg" alt="A cortado at Màre">
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
          <SplitSection reverse wide placeholder="ph-4" src="/images/mare/coffee-house-arch.jpg" alt="Community at Màre">
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
