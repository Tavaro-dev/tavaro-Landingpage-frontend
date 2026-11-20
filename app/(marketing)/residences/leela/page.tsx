import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import heroPhoto from "@/public/images/heroes/leela-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import {
  ResidenceMosaic,
  type MosaicItem,
} from "@/features/residences/components/Residence";
import { ResidenceHero } from "@/features/residences/components/ResidenceHero";
import {
  StoryScroll,
  type StoryStep,
} from "@/features/residences/components/StoryScroll";
import styles from "../residences.module.css";

export const metadata = pageMetadata({
  title: "Leela by Tavaro Residences — Apartments Wrapped in Green | Tavaro",
  description:
    "Leela: 3,027 sq. ft. apartments with planted terraces and a rooftop lounge and yoga deck, 15 minutes from Hyderabad's Financial District. Floor plans, interiors, gallery and brochure.",
  path: "/residences/leela",
});

/** The Leela brochure from Bhairavi Realty: vision, floor plans, interiors, terrace and location. */
const BROCHURE = { href: "/downloads/leela-brochure.pdf", size: "5.4 MB" };

// How Leela answers each of the five Tavaro principles.
const STORY: StoryStep[] = [
  {
    label: "Belong to the place",
    title: "Green on every level",
    body: "Planters and hanging gardens line every terrace, so the building sits among the trees rather than apart from them.",
    src: "/images/residences/leela-exterior.jpg",
    alt: "Leela's terraces with glass balustrades and hanging greenery among tall trees",
  },
  {
    label: "Make room for life",
    title: "Rooms that flow together",
    body: "Living, dining and kitchen open into one another, so cooking, eating and talking happen in the same place.",
    src: "/images/residences/leela-dining.jpg",
    alt: "A timber dining table for eight beside a sage-green kitchen",
  },
  {
    label: "Open and retreat",
    title: "A rooftop to share, rooms to retreat to",
    body: "Evenings with friends happen up on the rooftop lounge. Bedrooms sit apart from it all, kept for quiet and rest.",
    src: "/images/residences/leela-rooftop-lounge.jpg",
    alt: "The rooftop lounge at dusk, beneath a timber canopy and a terracotta screen wall",
  },
  {
    label: "Live well",
    title: "Morning yoga under the sky",
    body: "A yoga and meditation deck on the roof, and large windows that bring light and air into every home below.",
    src: "/images/residences/leela-rooftop-yoga.jpg",
    alt: "Morning yoga on the rooftop deck, beside the spiral stair",
  },
  {
    label: "Age with life",
    title: "Materials that wear well",
    body: "Timber, stone and terracotta, chosen because they soften and settle as the years go by.",
    src: "/images/residences/leela-bedroom-2.jpg",
    alt: "A bedroom with timber wall panels cut in soft waves",
  },
];

const PLAN_CONTENTS = [
  ["Typical floor plan", "In the brochure"],
  ["Terrace floor plan", "In the brochure"],
  ["3D isometric view", "Shown here"],
  ["Super built-up area", "3,027 sq. ft."],
  ["Common area", "303 sq. ft."],
];

const INTERIORS = [
  {
    src: "/images/residences/leela-hallway.jpg",
    alt: "A hallway with timber panelling and stone floors, leading to the living room",
    title: "Hallway",
    body: "From the front door, straight into light.",
  },
  {
    src: "/images/residences/leela-living-room.jpg",
    alt: "A living room with pale stone floors, soft seating and timber shelving",
    title: "Living room",
    body: "Pale stone, warm timber and space to gather.",
  },
  {
    src: "/images/residences/leela-kitchen.jpg",
    alt: "A kitchen in sage green and timber, open to the dining area",
    title: "Kitchen",
    body: "Open to the dining table, so the cook is never alone.",
  },
  {
    src: "/images/residences/leela-lounge.jpg",
    alt: "A home theatre with recliners facing a wall of glass and the city beyond",
    title: "Home theatre",
    body: "Recliners, a bar unit and the city through the glass.",
  },
  {
    src: "/images/residences/leela-bedroom.jpg",
    alt: "A master bedroom with a padded headboard wall, timber ceiling and soft cove light",
    title: "Master bedroom",
    body: "Soft light and timber, away from the living spaces.",
  },
];

const GALLERY: MosaicItem[] = [
  {
    src: "/images/residences/leela-aerial.jpg",
    alt: "Leela from above at night, its terraces lit along the street",
    caption: "From above",
    size: "lead",
  },
  {
    src: "/images/residences/leela-night.jpg",
    alt: "Leela at night, every terrace lit warm against the dark",
    caption: "By night",
    size: "tall",
  },
  {
    src: "/images/residences/leela-elevation.jpg",
    alt: "The full elevation of Leela at dusk, with its roof canopy",
    caption: "Elevation",
    size: "tall",
  },
  {
    src: "/images/residences/leela-facade.jpg",
    alt: "Leela's street facade by day, its balconies stepping up to the roof canopy",
    caption: "Facade",
    size: "tall",
  },
  {
    src: "/images/residences/leela-entrance.jpg",
    alt: "The planted entrance and front steps at night",
    caption: "Entrance",
    size: "tall",
  },
  {
    src: "/images/residences/leela-terrace.jpg",
    alt: "Leela's lit terraces at dusk",
    caption: "Terraces",
    size: "half",
  },
  {
    src: "/images/residences/leela-detail.jpg",
    alt: "The main door in timber panelling, beside the stair and a planter",
    caption: "Main door",
    size: "half",
  },
];

// Drive times from the brochure, in minutes.
const NEARBY: [string, number][] = [
  ["Financial District", 15],
  ["Microsoft and Amazon campuses", 15],
  ["KIMS and Continental hospitals", 15],
  ["Indus and Birla international schools", 15],
  ["Inorbit Mall", 15],
  ["Outer Ring Road", 15],
  ["IKEA", 30],
  ["Rajiv Gandhi International Airport", 45],
];

export default function LeelaPage() {
  return (
    <>
      <ResidenceHero
        name="Leela"
        tagline="Apartments wrapped in planted terraces, with a rooftop made for yoga, gatherings and quiet evenings."
        photo={heroPhoto}
        photoAlt="Leela at dusk: the street front, planted terraces and entrance"
        figures={[
          { value: "3,027 sq. ft.", label: "Each home, super built-up" },
          { value: "15 min", label: "To the Financial District" },
          { value: "Rooftop", label: "Lounge, yoga deck and gazebo" },
        ]}
        ctas={[
          { label: "Register Interest", href: "#register-interest", solid: true },
          { label: "See the floor plans", href: "#floor-plans" },
        ]}
      />

      {/* A. The residence in a sentence: the photo runs out to the screen edge */}
      <section className="offer-block on-dark" id="overview">
        <div className="container">
          <SplitSection
            placeholder="ph-2"
            src="/images/residences/leela-dusk.jpg"
            alt="Leela's terraces at dusk, each one planted and lit"
          >
            <h2 className={styles.statement}>
              A calm, green building, close to the city.
            </h2>
            <div className={`${styles.muted} tw:mt-[24px]`}>
              <p>
                Leela is a building of large homes, each about 3,027 sq. ft.,
                with terraces full of plants and a shared rooftop where the day
                can start with yoga and end with friends.
              </p>
              <p className="tw:mt-[16px]">
                It sits west of Hyderabad&apos;s Financial District: fifteen
                minutes from work, schools and hospitals, and far enough to feel
                quiet.
              </p>
            </div>
          </SplitSection>
        </div>
      </section>

      {/* B. The architectural story, one principle at a time */}
      <section className="section on-panel" id="story">
        <div className="container">
          <OfferHead
            num="The idea behind Leela"
            heading={
              <>
                Five Tavaro ideas,
                <br />
                built into one home
              </>
            }
          />
          <StoryScroll steps={STORY} />
        </div>
      </section>

      {/* C. Floor plans */}
      <section className="section on-dark" id="floor-plans">
        <div className="container">
          <div className={styles["plan-split"]}>
            <div className={`${styles.media} ${styles.float}`}>
              <Image
                className="tw:object-contain"
                src="/images/residences/leela-floor-plan-3d.webp"
                alt="A 3D cut-away of a Leela apartment: living and dining, kitchen, bedrooms and balconies"
                fill
                sizes="(min-width: 861px) 55vw, 100vw"
              />
            </div>
            <Reveal>
              <span className="offer-num">Floor Plans</span>
              <h2 className="display-2 tw:mt-[18px]">
                See how a home is laid out
              </h2>
              <p className={`${styles.muted} tw:mt-[16px]`}>
                The 3D view shows one full home: living and dining, kitchen,
                bedrooms and balconies. The brochure has every plan.
              </p>
              <ul className={styles.ticks}>
                {PLAN_CONTENTS.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              <div className="tw:mt-[28px] tw:flex tw:flex-wrap tw:gap-[12px]">
                <a href={BROCHURE.href} className="btn solid" download>
                  Download the brochure (PDF, {BROCHURE.size})
                </a>
                <Link href="#register-interest" className="btn">
                  Ask for detailed plans
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* D. Interiors: on a wide screen the row pins and scrolling walks through it */}
      <section className={`on-panel ${styles.pin}`} id="interiors">
        <div className={styles["pin-inner"]}>
          <div className="container">
            <OfferHead
              num="Interiors"
              heading={
                <>
                  Walk through
                  <br />a Leela home
                </>
              }
              lede="From the front door to the bedroom: light floors, warm timber and soft colours, made for everyday life."
            />
          </div>
          <div
            className={styles.track}
            tabIndex={0}
            role="region"
            aria-label="Leela interiors"
          >
            {INTERIORS.map((it) => (
              <figure key={it.src}>
                <div className={`${styles.media} ph-3`}>
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 861px) 56vw, 84vw"
                  />
                </div>
                <figcaption>
                  <strong>{it.title}</strong>
                  <span>{it.body}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* E. Gallery: the building and its terraces */}
      <section className="section on-dark" id="gallery">
        <div className="container">
          <OfferHead
            num="Gallery"
            heading={
              <>
                The building,
                <br />
                day and night
              </>
            }
          />
          <ResidenceMosaic items={GALLERY} />
        </div>
      </section>

      {/* F. Location */}
      <section className="section on-panel" id="location">
        <div className="container">
          <OfferHead
            num="Location"
            heading={
              <>
                Close to the city,
                <br />
                quiet at home
              </>
            }
            lede="Leela sits off Radial Road 7 towards Gandipet, west of the Financial District. Each line is the drive time."
          />
          <Reveal>
            <ul className={styles.bars}>
              {NEARBY.map(([place, min], i) => (
                <li
                  key={place}
                  style={{ "--m": min, "--i": i } as CSSProperties}
                >
                  <span>{place}</span>
                  <span>{min} min</span>
                  <span className={styles.bar} aria-hidden="true">
                    <span />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="tw:mt-[20px] tw:text-[12.5px] tw:text-(color:--on-surface-muted)">
            Driving times from the brochure; they change with traffic.
          </p>
        </div>
      </section>

      {/* G. Register your interest */}
      <section className="section on-dark" id="register">
        <div className="container">
          <Reveal className="tw:mx-auto tw:max-w-[640px] tw:text-center">
            <div>
              <p className="eyebrow no-line">Register Your Interest</p>
              <h2 className="display-3">
                Ask us anything
                <br />
                about Leela
              </h2>
              <p className="lede tw:mt-[16px]">
                Pricing, availability, plans or a private viewing. We&apos;ll
                get back to you personally, without pressure.
              </p>
              <Link href="#register-interest" className="btn solid tw:mt-[28px]">
                Register interest <span className="btn-arrow">→</span>
              </Link>
              <p className="tw:mt-[24px] tw:text-[13px] tw:text-(color:--on-surface-muted) tw:leading-[1.7]">
                The{" "}
                <a href={BROCHURE.href} className="text-link" download>
                  brochure
                </a>{" "}
                is ready to download now. Looking for a private house instead?
                See{" "}
                <Link href="/residences/bhairavi-nilayam" className="text-link">
                  Bhairavi Nilayam
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyCta
        text="Interested in Leela by Tavaro?"
        ctaLabel="Register Interest"
        ctaHref="#register-interest"
      />
    </>
  );
}
