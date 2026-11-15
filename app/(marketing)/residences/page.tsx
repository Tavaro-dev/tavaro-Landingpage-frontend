import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/heroes/residences-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import { ResidenceJourney } from "@/features/residences/components/Residence";
import styles from "./residences.module.css";

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
        photoSrc={heroPhoto}
        photoAlt="Leela by Tavaro Residences — terraces wrapped in greenery"
        placeholder="ph-2"
        breadcrumbLabel="Tavaro Residences"
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
          { label: "View Bhairavi Nilayam", href: "/residences/bhairavi-nilayam" },
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
          <Reveal className="tw:mt-[40px] tw:max-w-[68ch]">
            <p className="tw:leading-[1.8] tw:text-(color:--on-surface-muted)">
              We believe a home should belong to its place, responding to its landscape, light,
              climate and surroundings rather than existing apart from them.
            </p>
            <p className="tw:mt-[20px] tw:leading-[1.8] tw:text-(color:--on-surface-muted)">
              We design for the life that happens after the architecture is finished. For changing
              seasons, morning light, long conversations, quiet evenings, family gatherings and the
              many ways a home evolves with the people who inhabit it.
            </p>
            <p className="tw:mt-[20px] tw:leading-[1.8] tw:text-(color:--on-surface-muted)">
              We believe true luxury is not simply having more space, but having the freedom to
              experience it in your own way. To open the home to nature, retreat into privacy,
              gather with others, or simply slow down.
            </p>
            <p className="tw:mt-[20px] tw:leading-[1.8] tw:text-(color:--on-surface)">
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
          <Reveal stagger className={`${styles["principles-grid"]} ${styles.numbered}`}>
            {PRINCIPLES.map((p) => (
              <div className={styles["principle-item"]} key={p.label}>
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
      <section className="offer-block on-dark tw:pt-[0]" id="leela">
        <div className="container">
          <div className={styles["residence-card-pair"]}>
            <Reveal className={styles["residence-feature-card"]}>
              <div className={`${styles["residence-card-media"]} ph-2`}>
                <Image
                  src="/images/residences/leela-exterior.jpg"
                  alt="Leela by Tavaro Residences"
                  fill
                  sizes="(min-width: 860px) 55vw, 100vw"
                />
                <div className={styles["residence-card-scrim"]} />
                <span className={styles["residence-card-tag"]}>01 — Leela</span>
              </div>
              <div className={styles["residence-card-body"]}>
                <h2 className="display-3">
                  A home shaped
                  <br />
                  by stillness
                </h2>
                <p className="tw:mt-[16px]">
                  Leela is a residence built around calm — considered architecture, natural materials
                  and light that changes through the day. Every detail, from the amenities to the
                  landscaping, is designed to make ordinary days feel unhurried.
                </p>
                <ul className="split-list tw:mt-[20px]">
                  <li>Architecture &amp; design story</li>
                  <li>Floor plans &amp; area information</li>
                  <li>Curated interiors &amp; gallery</li>
                  <li>Location &amp; proximity</li>
                </ul>
                <Link href="/residences/leela" className="btn tw:mt-[28px]">
                  Explore Leela <span className="btn-arrow">→</span>
                </Link>
              </div>
            </Reveal>

            <Reveal className={`${styles["residence-feature-card"]} reverse`}>
              <div className={`${styles["residence-card-media"]} ph-4`}>
                <Image
                  src="/images/residences/bhairavi-nilayam-exterior.jpg"
                  alt="Bhairavi Nilayam residence"
                  fill
                  sizes="(min-width: 860px) 55vw, 100vw"
                />
                <div className={styles["residence-card-scrim"]} />
                <span className={styles["residence-card-tag"]}>02 — Bhairavi Nilayam</span>
              </div>
              <div className={styles["residence-card-body"]}>
                <h2 className="display-3">
                  Rooted in place,
                  <br />
                  built for living
                </h2>
                <p className="tw:mt-[16px]">
                  A 15,000 sq. ft. private residence on the outskirts of West Hyderabad — surrounded
                  by farmland, shaped by light, and designed around the full rhythms of family
                  living.
                </p>
                <ul className="split-list tw:mt-[20px]">
                  <li>Project story &amp; philosophy</li>
                  <li>Architecture &amp; residence plans</li>
                  <li>Location &amp; surrounds</li>
                  <li>Gallery &amp; enquiry</li>
                </ul>
                <Link href="/residences/bhairavi-nilayam" className="btn tw:mt-[28px]">
                  Discover Bhairavi Nilayam <span className="btn-arrow">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section on-panel" id="how-it-works">
        <div className="container">
          <ResidenceJourney
            heading={
              <>
                Registering interest,
                <br />
                step by step
              </>
            }
            cta={{ label: "Register Interest", href: "/residences/register" }}
          />
        </div>
      </section>

      <section className="section on-dark">
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
