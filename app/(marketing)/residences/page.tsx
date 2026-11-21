import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/heroes/residences-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import { ResidenceJourney } from "@/features/residences/components/ResidenceJourney";
import styles from "./residences.module.css";

export const metadata = pageMetadata({
  title: "Residences — Come Home to Yourself | Tavaro",
  description:
    "Tavaro Residences: Leela, apartments wrapped in green near Hyderabad's Financial District, and Bhairavi Nilayam, a 15,000 sq. ft. private home in West Hyderabad.",
  path: "/residences",
});

const PRINCIPLES = [
  {
    title: "Belong to the place",
    body: "Built for its landscape, light and climate, not apart from them.",
    src: "/images/residences/leela-exterior.jpg",
    alt: "Planted terraces and hanging greenery among tall trees",
  },
  {
    title: "Make room for life",
    body: "Planned for how a home is lived in, not just how it looks.",
    src: "/images/residences/leela-dining.jpg",
    alt: "A dining table for eight beside an open kitchen",
  },
  {
    title: "Open and retreat",
    body: "Open up to nature and people, or close the door for quiet.",
    src: "/images/residences/leela-rooftop-lounge.jpg",
    alt: "A rooftop lounge at dusk under a timber canopy",
  },
  {
    title: "Live well",
    body: "Room to move, rest and be still, every single day.",
    src: "/images/residences/leela-rooftop-yoga.jpg",
    alt: "Morning yoga on a rooftop deck",
  },
  {
    title: "Age with life",
    body: "Homes that grow more meaningful as the years and generations go by.",
    src: "/images/residences/leela-bedroom-2.jpg",
    alt: "A bedroom with timber wall panels cut in soft waves",
  },
];

export default function ResidencesPage() {
  return (
    <>
      <PageHero
        photoSrc={heroPhoto}
        photoAlt="Leela at dusk, its windows lit, under the first stars"
        // The building stands on the right of the photo; phones get the upright residences-hero-mobile.jpg.
        photoPosition="75% 50%"
        lightScrim
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
        lede="Two homes, each designed around the place it stands in and the life lived inside it."
        ctas={[
          { label: "Explore Leela", href: "/residences/leela", solid: true },
          { label: "Explore Bhairavi Nilayam", href: "/residences/bhairavi-nilayam" },
        ]}
      />

      {/* Philosophy */}
      <section className="section on-dark" id="philosophy">
        <div className="container">
          <Reveal className={styles.intro}>
            <h2 className={styles.statement}>A home should belong to its place.</h2>
            <div className={styles.muted}>
              <p>
                Tavaro Residences carries Tavaro&apos;s way of living into the home. We design for
                the life that happens after the building is finished: morning light, long
                conversations, quiet evenings and family gatherings.
              </p>
              <p>
                True luxury isn&apos;t more space. It&apos;s the freedom to open your home to nature,
                retreat into privacy, gather with others, or simply slow down.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Five principles */}
      <section className="section on-panel" id="principles">
        <div className="container">
          <OfferHead
            num="What guides every home"
            heading={
              <>
                Five ideas,
                <br />
                one way of living
              </>
            }
          />
          <Reveal stagger className={styles.principles}>
            {PRINCIPLES.map((p) => (
              <article className={styles.principle} key={p.title}>
                <div className={`${styles.media} ph-2`}>
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1081px) 18vw, (max-width: 600px) 72vw, 34vw" />
                </div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* The two residences */}
      <section className="section on-dark" id="the-residences">
        <div className="container">
          <OfferHead
            num="The Residences"
            heading={
              <>
                Two homes,
                <br />
                each its own answer
              </>
            }
            lede="Same ideas, different places: an apartment building wrapped in green, and a private house among farmland."
          />
          <Reveal stagger className={styles.homes}>
            <Link href="/residences/leela" className={styles.home}>
              <div className={`${styles.media} ph-2`}>
                <Image
                  src="/images/residences/leela-elevation.jpg"
                  alt="Leela at dusk, its terraces lit and planted"
                  fill
                  sizes="(min-width: 861px) 50vw, 100vw"
                />
              </div>
              <div className={styles["home-body"]}>
                <h3>Leela</h3>
                <p>
                  Apartments wrapped in planted terraces near the Financial District, with a
                  rooftop for yoga, gatherings and quiet evenings.
                </p>
                <ul className={styles.chips}>
                  <li>3,027 sq. ft. homes</li>
                  <li>Rooftop lounge and yoga deck</li>
                  <li>15 min to the Financial District</li>
                </ul>
                <span className={styles.go}>Explore Leela</span>
              </div>
            </Link>

            <Link href="/residences/bhairavi-nilayam" className={styles.home}>
              <div className={`${styles.media} ph-2`}>
                <Image
                  src="/images/heroes/bhairavi-nilayam-hero.jpg"
                  alt="An open-air terrace at dusk, wrapped in a terracotta jaali wall"
                  fill
                  sizes="(min-width: 861px) 50vw, 100vw"
                />
              </div>
              <div className={styles["home-body"]}>
                <h3>Bhairavi Nilayam</h3>
                <p>
                  A private house among farmland in West Hyderabad, designed by Praveen Architects
                  around light, landscape and family life.
                </p>
                <ul className={styles.chips}>
                  <li>15,000 sq. ft.</li>
                  <li>5 bedrooms</li>
                  <li>Vastu compliant</li>
                </ul>
                <span className={styles.go}>Explore Bhairavi Nilayam</span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* How registering works */}
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
            cta={{ label: "Register Interest", href: "#register-interest" }}
          />
        </div>
      </section>

      <StickyCta
        text="Interested in a Tavaro Residence?"
        ctaLabel="Register Interest"
        ctaHref="#register-interest"
      />
    </>
  );
}
