import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Residences — Come Home to Yourself | Tavaro",
  description:
    "Tavaro Residences — Leela by Tavaro Residences and Bhairavi Nilayam. Homes built around belonging, place, light and the rhythms of living.",
  path: "/residences",
});

const PRINCIPLES = [
  {
    label: "Belong to the Place",
    body: "Architecture that responds to its landscape, climate, orientation and surroundings.",
  },
  {
    label: "Make Room for Life",
    body: "Spaces designed around the many ways a home is actually lived in, not simply how it looks.",
  },
  {
    label: "Open & Retreat",
    body: "A thoughtful balance between connection and privacy. Spaces that open outward when desired and allow retreat when needed.",
  },
  {
    label: "Live Well",
    body: "Wellbeing woven into everyday living through opportunities for movement, stillness, nature, light and connection.",
  },
  {
    label: "Age with Life",
    body: "Homes designed to become more meaningful as they are lived in, accommodating changing needs, memories and generations.",
  },
];

export default function ResidencesPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/residences-villa.jpg"
        photoAlt="A Tavaro Residence exterior in the evening"
        placeholder="ph-2"
        breadcrumbLabel="Residences"
        eyebrow="Tavaro Residences"
        title={
          <>
            Come home
            <br />
            to yourself
          </>
        }
        titleSize="clamp(38px,6.4vw,84px)"
        lede="If earth is our only home, then the homes we create should help us live more consciously within it."
        ctas={[
          { label: "Explore Leela", href: "/residences/leela", solid: true },
          { label: "Discover Bhairavi Nilayam", href: "/residences/bhairavi-nilayam" },
        ]}
      />

      {/* Residential Philosophy */}
      <section className="section on-dark tight" id="philosophy">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">Residential Philosophy</p>
            <p className="lede">
              If earth is our only home, then the homes we create should help us live more
              consciously within it. Tavaro Residences is an extension of Tavaro&apos;s larger
              philosophy, expressed through the way we choose to live within our homes.
            </p>
          </Reveal>
          <Reveal style={{ marginTop: 40, maxWidth: "68ch" }}>
            <p style={{ lineHeight: 1.8, color: "var(--muted-on-dark)" }}>
              We believe a home should belong to its place, responding to its landscape, light,
              climate and surroundings rather than existing apart from them.
            </p>
            <p style={{ marginTop: 20, lineHeight: 1.8, color: "var(--muted-on-dark)" }}>
              We design for the life that happens after the architecture is finished. For changing
              seasons, morning light, long conversations, quiet evenings, family gatherings and the
              many ways a home evolves with the people who inhabit it.
            </p>
            <p style={{ marginTop: 20, lineHeight: 1.8, color: "var(--muted-on-dark)" }}>
              We believe true luxury is not simply having more space, but having the freedom to
              experience it in your own way. To open the home to nature, retreat into privacy,
              gather with others, or simply slow down.
            </p>
            <p style={{ marginTop: 20, lineHeight: 1.8, color: "var(--on-surface)" }}>
              Wellbeing is embedded in the rhythm of the home, in the spaces to move, rest, work,
              eat, connect and be still.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section on-panel tight" id="principles">
        <div className="container">
          <OfferHead
            num="Core Principles"
            heading={
              <>
                Five ways a home
                <br />
                becomes a life
              </>
            }
          />
          <Reveal stagger className="principles-grid">
            {PRINCIPLES.map((p) => (
              <div className="principle-item" key={p.label}>
                <p className="eyebrow no-line">{p.label}</p>
                <p>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* The Residences */}
      <section className="section on-dark" id="the-residences">
        <div className="container">
          <OfferHead
            num="The Residences"
            heading={
              <>
                Two homes.
                <br />
                One philosophy.
              </>
            }
            lede="Each Tavaro residence is an individual architectural response to our residential principles — shaped by its place, its people and the life lived within it."
          />
        </div>
      </section>

      {/* Leela */}
      <section className="offer-block on-dark" id="leela" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="residence-card-pair">
            <Reveal className="residence-feature-card">
              <div className="residence-card-media ph-2">
                <Image
                  src="/images/unsplash/residences-leela.jpg"
                  alt="Leela by Tavaro Residences"
                  fill
                  sizes="(min-width: 860px) 55vw, 100vw"
                />
                <div className="residence-card-scrim" />
                <span className="residence-card-tag">01 — Leela</span>
              </div>
              <div className="residence-card-body">
                <h2 className="display-3">
                  A home shaped
                  <br />
                  by stillness
                </h2>
                <p style={{ marginTop: 16 }}>
                  Leela is a residence built around calm — considered architecture, natural materials
                  and light that changes through the day. Every detail, from the amenities to the
                  landscaping, is designed to make ordinary days feel unhurried.
                </p>
                <ul className="split-list" style={{ marginTop: 20 }}>
                  <li>Architecture &amp; design story</li>
                  <li>Floor plans &amp; area information</li>
                  <li>Curated interiors &amp; gallery</li>
                  <li>Location &amp; proximity</li>
                </ul>
                <Link href="/residences/leela" className="btn" style={{ marginTop: 28 }}>
                  Explore Leela <span className="btn-arrow">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal className="residence-feature-card reverse">
              <div className="residence-card-media ph-4">
                <Image
                  src="/images/unsplash/residences-bhairavi-nilayam.jpg"
                  alt="Bhairavi Nilayam residence"
                  fill
                  sizes="(min-width: 860px) 55vw, 100vw"
                />
                <div className="residence-card-scrim" />
                <span className="residence-card-tag">02 — Bhairavi Nilayam</span>
              </div>
              <div className="residence-card-body">
                <h2 className="display-3">
                  Rooted in place,
                  <br />
                  built for living
                </h2>
                <p style={{ marginTop: 16 }}>
                  A 15,000 sq. ft. private residence on the outskirts of West Hyderabad — surrounded
                  by farmland, shaped by light, and designed around the full rhythms of family
                  living.
                </p>
                <ul className="split-list" style={{ marginTop: 20 }}>
                  <li>Project story &amp; philosophy</li>
                  <li>Architecture &amp; residence plans</li>
                  <li>Location &amp; surrounds</li>
                  <li>Gallery &amp; enquiry</li>
                </ul>
                <Link href="/residences/bhairavi-nilayam" className="btn" style={{ marginTop: 28 }}>
                  Discover Bhairavi Nilayam <span className="btn-arrow">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section on-panel">
        <BandQuote
          label="Register Your Interest"
          quote="A home is not just where you live. It is who you become when you're there."
          ctas={[{ label: "Register Interest", href: "/residences/register", solid: true }]}
        />
      </section>

      <StickyCta
        text="Interested in a Tavaro Residence?"
        ctaLabel="Register Interest"
        ctaHref="/residences/register"
      />
    </>
  );
}
