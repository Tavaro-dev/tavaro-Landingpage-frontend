import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/heroes/residences-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import {
  ResidenceFacts,
  ResidenceJourney,
  ResidenceMosaic,
  RuledList,
  type Fact,
  type MosaicItem,
  type RuledItem,
} from "@/features/residences/components/Residence";
import LeelaDynamicForm from "./LeelaDynamicForm";
import styles from "../residences.module.css";

export const metadata = pageMetadata({
  title: "Leela by Tavaro Residences — A Home Shaped by Stillness | Tavaro",
  description:
    "Leela by Tavaro Residences — considered architecture, natural materials and light that changes through the day. Floor plans, interiors, gallery and location.",
  path: "/residences/leela",
});

const FACTS: Fact[] = [
  { label: "Residence", value: "Leela by Tavaro Residences" },
  { label: "Configuration", value: "Curated multi-level layouts" },
  { label: "Floor plans", value: "Typical, Terrace & Sky Deck" },
  { label: "Spatial models", value: "Isometric & 3D volumetric" },
  { label: "Orientation", value: "Solar & wind-path aligned" },
  { label: "Area information", value: "Shared in the brochure" },
];

const ARCHITECTURAL_PRINCIPLES = [
  {
    label: "Belong to the Place",
    body: "Leela's architecture responds to its orientation, natural light and surrounding landscape — not apart from it.",
  },
  {
    label: "Make Room for Life",
    body: "Each space is considered for how it is actually used — morning routines, quiet afternoons, evening gatherings.",
  },
  {
    label: "Open & Retreat",
    body: "Large openings connect the interior to nature while intimate volumes offer genuine privacy and calm.",
  },
  {
    label: "Live Well",
    body: "Movement, stillness, light and green — wellbeing is built into the daily rhythm of the home.",
  },
  {
    label: "Age with Life",
    body: "Designed with enduring natural materials and flexible spaces that become more meaningful as generations inhabit them.",
  },
];

const LIVING: RuledItem[] = [
  {
    label: "Refined contemporary interiors",
    body: "Contemporary detailing balanced with a deep relationship to nature.",
  },
  {
    label: "Natural textures, honest finishes",
    body: "Materials chosen for how they age: warm, honest and quietly luxurious.",
  },
  {
    label: "Light through considered openings",
    body: "Large openings bring in light that changes through the day.",
  },
  {
    label: "Indoor–outdoor connection",
    body: "Deep perimeter verandas and terraces open the home to the landscape.",
  },
  {
    label: "Room to retreat",
    body: "Private family sanctuaries buffered from entertaining zones.",
  },
  {
    label: "Wellbeing built in",
    body: "Movement, stillness, light and green in the daily rhythm of the home.",
  },
];

const PLANS: RuledItem[] = [
  {
    label: "Typical floor plan — Living & bedroom suites",
    body: "Generous social living pavilions opening onto deep perimeter verandas, with private family sanctuaries buffered from entertaining zones.",
  },
  {
    label: "Terrace plan — Sky pavilion & landscape deck",
    body: "An open-to-sky entertaining terrace with shaded pergolas, lush planters and panoramic views of morning sun and twilight breezes.",
  },
  {
    label: "Isometric & 3D plans — Volumetric flow",
    body: "Double-height light shafts, cross-ventilation pathways and intuitive circulation connecting every level.",
  },
];

const PROXIMITY: RuledItem[] = [
  { label: "Outer Ring Road access", meta: "5 min" },
  { label: "Gachibowli", meta: "10 min" },
  { label: "Kokapet Financial District", meta: "12 min" },
  { label: "HITEC City", meta: "18 min" },
  { label: "Rajiv Gandhi International Airport", meta: "25 min" },
];

const GALLERY: MosaicItem[] = [
  {
    src: "/images/residences/leela-exterior.jpg",
    alt: "Leela's terraces, glass balustrades and hanging greenery among the trees",
    caption: "Architecture",
    size: "lead",
  },
  {
    src: "/images/residences/leela-elevation.jpg",
    alt: "The full elevation of Leela at dusk, with its curved stone facade and roof canopy",
    caption: "Elevation",
    size: "tall",
  },
  {
    src: "/images/residences/leela-living-room.jpg",
    alt: "A Leela living room with pale stone floors and soft seating",
    caption: "Interiors",
    size: "third",
  },
  {
    src: "/images/residences/leela-detail.jpg",
    alt: "Material detail: timber, stone and greenery at Leela",
    caption: "Details",
    size: "third",
  },
  {
    src: "/images/residences/leela-terrace.jpg",
    alt: "Leela's lit terraces at dusk",
    caption: "Terraces",
    size: "third",
  },
];

export default function LeelaPage() {
  return (
    <>
      <PageHero
        photoSrc={heroPhoto}
        photoAlt="Leela by Tavaro Residences — architectural exterior"
        placeholder="ph-2"
        breadcrumbLabel="Tavaro Residences"
        eyebrow="01 — Leela by Tavaro Residences"
        title={
          <>
            A home shaped
            <br />
            by stillness
          </>
        }
        titleSize="clamp(34px,5.6vw,72px)"
        lede="Considered architecture, natural materials and light that changes through the day. Every detail designed to make ordinary days feel unhurried."
        ctas={[
          { label: "Register Interest", href: "#register", solid: true },
          { label: "View Floor Plans", href: "#floor-plans" },
        ]}
        quickNav={[
          { label: "At a glance", href: "#overview", icon: "facilities" },
          { label: "Floor Plans", href: "#floor-plans", icon: "compass" },
          { label: "Gallery", href: "#gallery", icon: "photos" },
          { label: "Location", href: "#location", icon: "location" },
          { label: "How it works", href: "#how-it-works", icon: "mail" },
        ]}
      />

      {/* A. Overview + at a glance */}
      <section className="section on-dark tight" id="overview">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">The Residence</p>
            <p className="lede">
              Leela is a residence built around calm. It is not simply architecture — it is a way of
              experiencing the day, from the quality of morning light to the ease of an evening
              gathered with people you love.
            </p>
          </Reveal>
          <ResidenceFacts facts={FACTS} />
        </div>
      </section>

      {/* B. The Architectural Story */}
      <section className="section on-panel" id="architecture">
        <div className="container">
          <OfferHead
            num="The Architectural Story"
            heading={
              <>
                How Leela interprets
                <br />
                the Tavaro philosophy
              </>
            }
            lede="Each of Tavaro's residential principles is expressed through Leela's architecture — in the way it meets its landscape, handles light and creates space for living."
          />
          <Reveal stagger className={`${styles["principles-grid"]} ${styles.numbered} tw:mt-[40px]`}>
            {ARCHITECTURAL_PRINCIPLES.map((p) => (
              <div className={styles["principle-item"]} key={p.label}>
                <p className="eyebrow no-line">{p.label}</p>
                <p>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* C. What living here includes */}
      <section className="section on-dark" id="interiors">
        <div className="container">
          <Reveal className={styles["living-split"]}>
            <div className={`${styles["living-media"]} ph-3`}>
              <Image
                src="/images/residences/leela-living-room.jpg"
                alt="Leela interiors — a light-filled living space"
                fill
                sizes="(min-width: 861px) 45vw, 100vw"
              />
            </div>
            <div>
              <span className="offer-num">Living at Leela</span>
              <h2 className="display-2 tw:mt-[18px]">
                What living
                <br />
                here includes
              </h2>
              <p className="tw:mt-[18px] tw:mb-[24px] tw:max-w-[52ch] tw:text-(color:--on-surface-muted) tw:leading-[1.75]">
                Leela&apos;s interiors balance refined contemporary detailing with a deep relationship
                to nature. Each space is designed for the life that happens within it.
              </p>
              <RuledList items={LIVING} columns={2} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* D. Floor Plans */}
      <section className="section on-panel" id="floor-plans">
        <div className="container">
          <OfferHead
            num="Floor Plans"
            heading={
              <>
                Thoughtfully
                <br />
                planned spaces
              </>
            }
            lede="Each level considered for orientation, privacy and unhindered connection to nature."
          />
          <Reveal className={`${styles["living-split"]} ${styles.flip} tw:mt-[32px]`}>
            <div className={`${styles["living-media"]} ${styles.portrait} ph-5`}>
              <Image
                src="/images/residences/leela-elevation.jpg"
                alt="The full elevation of Leela, floor by floor"
                fill
                sizes="(min-width: 861px) 40vw, 100vw"
              />
            </div>
            <div>
              <RuledList items={PLANS} />
              <p className="tw:mt-[24px] tw:max-w-[56ch] tw:text-[13.5px] tw:leading-[1.7] tw:text-(color:--on-surface-muted)">
                Detailed architectural plans, including floor-wise layouts, dimensioned room
                configurations, terrace layouts and orientation studies, are shared on enquiry.
              </p>
              <Link href="#register" className="btn solid tw:mt-[24px]">
                Request floor plans <span className="btn-arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* E. Gallery */}
      <section className="section on-dark" id="gallery">
        <div className="container">
          <OfferHead
            num="Gallery"
            heading={
              <>
                Architecture. Interiors.
                <br />
                Landscape. Life.
              </>
            }
          />
          <ResidenceMosaic items={GALLERY} />
        </div>
      </section>

      {/* F. Location & Proximity */}
      <section className="section on-panel" id="location">
        <div className="container">
          <OfferHead
            num="Location & Proximity"
            heading={
              <>
                Set within reach,
                <br />
                away from the noise
              </>
            }
            lede="Leela is positioned to offer genuine connection to nature while remaining close to the rhythms of city life."
          />
          <Reveal className={`${styles["living-split"]} tw:mt-[32px]`}>
            <div className={`${styles["living-media"]} ph-1`}>
              <Image
                src="/images/residences/leela-terrace.jpg"
                alt="Leela's terraces at dusk, open to the sky"
                fill
                sizes="(min-width: 861px) 45vw, 100vw"
              />
            </div>
            <div>
              <p className="eyebrow no-line tw:mb-[16px]">Key destinations</p>
              <RuledList items={PROXIMITY} />
              <p className="tw:text-[12px] tw:text-(color:--on-surface-muted) tw:mt-[16px]">
                Travel times are indicative. Verified times available on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* G. How it works */}
      <section className="section on-dark" id="how-it-works">
        <div className="container">
          <ResidenceJourney
            heading={
              <>
                From first enquiry
                <br />
                to a private viewing
              </>
            }
          />
        </div>
      </section>

      {/* H. Register Your Interest */}
      <section className="section on-panel" id="register">
        <div className="container">
          <Reveal className="split">
            <div className="split-body">
              <p className="eyebrow">Register Your Interest</p>
              <h2 className="display-3">A discreet enquiry,
                <br />at your pace
              </h2>
              <p className="lede tw:mt-[16px]">
                Tell us what you&apos;d like to know. We&apos;ll follow up personally and without
                pressure — a conversation, not a sales call.
              </p>
              <p className="tw:mt-[24px] tw:text-[13px] tw:text-(color:--on-surface-muted) tw:leading-[1.7]">
                Whether you&apos;d like the brochure, pricing information, a private viewing or simply
                a conversation with our team — we&apos;re here to help you understand if Leela is
                right for you.
              </p>
            </div>
            {/* Dynamic import to avoid SSR issues with client form */}
            <LeelaDynamicForm />
          </Reveal>
        </div>
      </section>

      <section className="section on-dark">
        <BandQuote
          label="Tavaro Residences"
          quote="A home shaped by stillness, light and the way you choose to live."
          ctas={[
            { label: "Discover Bhairavi Nilayam", href: "/residences/bhairavi-nilayam" },
            { label: "Back to Residences", href: "/residences", solid: true },
          ]}
        />
      </section>

      <StickyCta
        text="Interested in Leela by Tavaro?"
        ctaLabel="Register Interest"
        ctaHref="#register"
      />
    </>
  );
}
