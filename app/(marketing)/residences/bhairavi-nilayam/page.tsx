import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import heroPhoto from "@/public/images/heroes/bhairavi-nilayam-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
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
import BhairavDynamicForm from "./BhairavDynamicForm";
import styles from "../residences.module.css";

export const metadata = pageMetadata({
  title: "Bhairavi Nilayam — A Private Residence Shaped by Light | Tavaro",
  description:
    "Bhairavi Nilayam — a 15,000 sq. ft. private residence by Praveen Architects, West Hyderabad. Shaped by light, landscape and the rhythms of living.",
  path: "/residences/bhairavi-nilayam",
});

const RESIDENCE_SPECS: Fact[] = [
  { label: "Residence", value: "Bhairavi Nilayam" },
  { label: "Area", value: "15,000 sq. ft." },
  { label: "Floors", value: "3" },
  { label: "Bedrooms", value: "5" },
  { label: "Landscape & Lawn", value: "Approx. 7,000 sq. ft." },
  { label: "Planning", value: "Vastu Compliant" },
];

const ARCHITECTURE_NOTES: RuledItem[] = [
  { label: "Praveen Architects — West Hyderabad" },
  { label: "Vastu conscious contemporary planning" },
  { label: "North-facing glass wall — landscape connection" },
  { label: "Double-height volumes across levels" },
];

const DESIGN_PRINCIPLES = [
  {
    label: "Belong to the Place",
    body: "Approximately 7,000 sq. ft. of green space and lawn creates a private landscape around the home, rooting it in its West Hyderabad setting.",
  },
  {
    label: "Light & Openness",
    body: "Abundant natural lighting and a large north-facing glass wall create a strong, living relationship between the interiors and the surrounding landscape.",
  },
  {
    label: "Volume",
    body: "Double-height spaces introduce generosity, openness and visual connection across levels — a home that breathes.",
  },
  {
    label: "Materiality",
    body: "Contemporary architectural forms complemented by terracotta and brick jaali screens, greenery and natural textures.",
  },
  {
    label: "Vastu Conscious Planning",
    body: "The residence is planned in accordance with Vastu principles within a contemporary architectural framework.",
  },
  {
    label: "Make Room for Life",
    body: "Three floors and five bedrooms accommodate multiple modes of living — work, entertainment, wellness and everyday life.",
  },
];

const LIVING_SPACES: RuledItem[] = [
  {
    label: "Dedicated Theatre Room",
    body: "An acoustically tailored private cinema designed for quiet evenings, screenings and shared family stories.",
  },
  {
    label: "Dedicated Yoga Room",
    body: "A dedicated sanctuary oriented for morning light, breathwork, movement and daily stillness.",
  },
  {
    label: "Indoor Kitchen",
    body: "A refined culinary space designed for family meals, quiet breakfasts and everyday rhythms.",
  },
  {
    label: "Outdoor Kitchen",
    body: "An al fresco cooking and dining pavilion immersed in the garden breeze for open-air entertaining.",
  },
  {
    label: "Separate Office Block",
    body: "A quiet, dedicated architectural wing allowing deep focus and work while maintaining privacy from the home.",
  },
  {
    label: "Terrace Gym",
    body: "An elevated fitness space with natural cross-ventilation and open sky views across the surrounding landscape.",
  },
  {
    label: "Parking",
    body: "Considered, discreet parking integrated into the estate grounds for effortless daily arrival.",
  },
  {
    label: "Approx. 7,000 sq. ft. Green Space and Lawn",
    body: "Generous private landscape and emerald lawns creating a natural buffer, garden walks and connection to the earth.",
  },
];

const GALLERY: MosaicItem[] = [
  {
    src: "/images/residences/bhairavi-nilayam-exterior.jpg",
    alt: "Bhairavi Nilayam at dusk: the street front, landscaped edge and gated entrance",
    caption: "Architecture",
    size: "lead",
  },
  {
    src: "/images/residences/bhairavi-nilayam-terrace.jpg",
    alt: "Lit terraces with planters and hanging greenery",
    caption: "Terraces",
    size: "tall",
    position: "30% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-living-room.jpg",
    alt: "A living space at Bhairavi Nilayam",
    caption: "Interiors",
    size: "half",
  },
  {
    src: "/images/residences/bhairavi-nilayam-gate.jpg",
    alt: "The planted entrance and front steps at night",
    caption: "Arrival",
    size: "half",
  },
];

export default function BhairavPage() {
  return (
    <>
      <PageHero
        photoSrc={heroPhoto}
        photoAlt="Bhairavi Nilayam — exterior view"
        placeholder="ph-4"
        breadcrumbLabel="Tavaro Residences"
        eyebrow="02 — Bhairavi Nilayam"
        title={
          <>
            A private residence
            <br />
            shaped by light
          </>
        }
        titleSize="clamp(34px,5.2vw,66px)"
        lede="A 15,000 sq. ft. private residence designed by Praveen Architects, shaped by landscape, light and the rhythms of living on the outskirts of West Hyderabad."
        ctas={[
          { label: "Register Interest", href: "#register", solid: true },
          { label: "Residence Details", href: "#details" },
        ]}
        quickNav={[
          { label: "At a glance", href: "#details", icon: "facilities" },
          { label: "Spaces", href: "#spaces", icon: "compass" },
          { label: "Gallery", href: "#gallery", icon: "photos" },
          { label: "How it works", href: "#how-it-works", icon: "location" },
          { label: "Enquire", href: "#register", icon: "mail" },
        ]}
      />

      {/* Overview + at a glance */}
      <section className="section on-dark tight" id="details">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">The Residence</p>
            <p className="lede">
              Bhairavi Nilayam sits on the outskirts of West Hyderabad, surrounded by farmland and
              close to nature. Its architecture responds to this setting through generous landscape,
              abundant natural light, strong indoor — outdoor connections and spaces designed around
              the life of its residents.
            </p>
          </Reveal>
          <ResidenceFacts facts={RESIDENCE_SPECS} />
        </div>
      </section>

      {/* Architecture Story */}
      <section className="offer-block on-panel" id="architecture">
        <div className="container">
          <SplitSection
            placeholder="ph-5"
            src="/images/residences/bhairavi-nilayam-gate.jpg"
            alt="Bhairavi Nilayam's planted entrance, front steps and stone-clad facade at night"
          >
            <OfferHead
              num="The Architectural Story"
              heading={
                <>
                  Designed by
                  <br />
                  Praveen Architects
                </>
              }
            />
            <p>
              Bhairavi Nilayam is a residential project by Praveen Architects — a practice known for
              architecture that is deeply responsive to its setting. The residence balances
              contemporary forms with traditional craft, vastu-conscious planning with modern living.
            </p>
            <div className="tw:mt-[20px]">
              <RuledList items={ARCHITECTURE_NOTES} />
            </div>
          </SplitSection>
        </div>
      </section>

      {/* Design Principles */}
      <section className="section on-dark">
        <div className="container">
          <OfferHead
            num="Design Principles"
            heading={
              <>
                How Bhairavi Nilayam
                <br />
                interprets its place
              </>
            }
          />
          <Reveal stagger className={`${styles["principles-grid"]} ${styles.numbered} tw:mt-[40px]`}>
            {DESIGN_PRINCIPLES.map((p) => (
              <div className={styles["principle-item"]} key={p.label}>
                <p className="eyebrow no-line">{p.label}</p>
                <p>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* What living here includes */}
      <section className="section on-panel" id="spaces">
        <div className="container">
          <OfferHead
            num="Make Room for Life"
            heading={
              <>
                What living
                <br />
                here includes
              </>
            }
            lede="These spaces are not a list of amenities. They are the parts of a home designed around how a family actually lives — across mornings, evenings, weekends and years."
          />
          <Reveal className={`${styles["living-split"]} ${styles.top} tw:mt-[32px]`}>
            <div className={`${styles["living-media"]} ${styles.sticky} ph-2`}>
              <Image
                src="/images/residences/bhairavi-nilayam-living-room.jpg"
                alt="A lounge with recliner seating and a glass wall onto a planted balcony"
                fill
                sizes="(min-width: 861px) 45vw, 100vw"
              />
            </div>
            <RuledList items={LIVING_SPACES} />
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="section on-dark" id="gallery">
        <div className="container">
          <OfferHead
            num="Gallery"
            heading={
              <>
                Architecture.
                <br />
                Landscape. Life.
              </>
            }
          />
          <ResidenceMosaic items={GALLERY} />
        </div>
      </section>

      {/* How it works */}
      <section className="section on-panel" id="how-it-works">
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

      {/* Register Interest */}
      <section className="section on-dark" id="register">
        <div className="container">
          <Reveal className="split">
            <div className="split-body">
              <p className="eyebrow">Register Your Interest</p>
              <h2 className="display-3">
                A private home
                <br />
                for a private conversation
              </h2>
              <p className="lede tw:mt-[16px]">
                Bhairavi Nilayam is a residence of singular character. If it speaks to you, we&apos;d
                like to speak with you — personally, discreetly, at your pace.
              </p>
              <p className="tw:mt-[24px] tw:text-[13px] tw:text-(color:--on-surface-muted) tw:leading-[1.7]">
                15,000 sq. ft. · 3 floors · 5 bedrooms · Approx. 7,000 sq. ft. of landscape and lawn.
              </p>
            </div>
            <BhairavDynamicForm />
          </Reveal>
        </div>
      </section>

      <section className="section on-panel">
        <BandQuote
          label="Tavaro Residences"
          quote="A private residence shaped by light, landscape and the rhythms of living."
          ctas={[
            { label: "Explore Leela", href: "/residences/leela" },
            { label: "Back to Residences", href: "/residences", solid: true },
          ]}
        />
      </section>

      <StickyCta
        text="Interested in Bhairavi Nilayam?"
        ctaLabel="Register Interest"
        ctaHref="#register"
      />
    </>
  );
}
