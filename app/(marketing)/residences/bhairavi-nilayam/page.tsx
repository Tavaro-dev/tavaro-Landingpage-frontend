import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import heroPhoto from "@/public/images/heroes/bhairavi-nilayam-hero.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import { ResidenceHero } from "@/features/residences/components/ResidenceHero";
import { StoryScroll, type StoryStep } from "@/features/residences/components/StoryScroll";
import styles from "../residences.module.css";

export const metadata = pageMetadata({
  title: "Bhairavi Nilayam — A Private Residence Shaped by Light | Tavaro",
  description:
    "Bhairavi Nilayam: a 15,000 sq. ft. private residence by Praveen Architects in West Hyderabad. Three floors, five bedrooms and about 7,000 sq. ft. of garden and lawn.",
  path: "/residences/bhairavi-nilayam",
});

// Photographs of the house are still to come. Until then the architect's renders stand in, graded warmer
// than Leela's, and none of them is used on the Leela page.

// The brief's design ideas, one photo each.
const DESIGN: StoryStep[] = [
  {
    label: "Belong to place",
    title: "A garden all around",
    body: "About 7,000 sq. ft. of green space and lawn wraps the house in its own private landscape, with farmland beyond.",
    src: "/images/residences/bhairavi-nilayam-open-terrace.jpg",
    alt: "An open terrace under a wide sky, with clipped trees in planters and a jaali screen",
  },
  {
    label: "Light and openness",
    title: "A wall of glass, facing north",
    body: "A large north-facing glass wall fills the rooms with soft, even daylight and keeps the garden always in view.",
    src: "/images/residences/bhairavi-nilayam-living.jpg",
    alt: "A long living room ending in a full-height window, with soft seating and timber shelves",
  },
  {
    label: "Volume",
    title: "Rooms two storeys high",
    body: "Double-height spaces feel generous and open, and let you see from one floor to the next.",
    src: "/images/residences/bhairavi-nilayam-height.jpg",
    alt: "Looking up a tall marble wall to a slatted timber ceiling",
  },
  {
    label: "Materiality",
    title: "Jaali, timber and stone",
    body: "Terracotta and brick jaali screens, warm timber and natural textures soften the modern lines and filter the sun.",
    src: "/images/residences/bhairavi-nilayam-pooja.jpg",
    alt: "Tall timber doors carved as a jaali, opening to a pooja room",
  },
  {
    label: "Vastu conscious planning",
    title: "Planned to Vastu",
    body: "The layout follows Vastu principles, within a contemporary design, with a quiet place set aside for prayer.",
    src: "/images/residences/bhairavi-nilayam-shrine.jpg",
    alt: "A marble prayer niche with a small Ganesha and brass bells",
  },
  {
    label: "Make room for life",
    title: "Room for every part of life",
    body: "Three floors and five bedrooms, a separate office block, and a terrace gym up on the roof.",
    src: "/images/residences/bhairavi-nilayam-dining.jpg",
    alt: "A dining table for six beneath a timber ceiling, beside a breakfast counter",
  },
];

const INSIDE = [
  {
    src: "/images/residences/bhairavi-nilayam-bedroom.jpg",
    alt: "A bedroom with a painted lotus wall and framed leaf prints",
    title: "Bedrooms",
    body: "Five of them, each calm and full of daylight.",
    position: "44% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-bar.jpg",
    alt: "A bar unit with lit glass shelves, glasses and bottles, beside a cream sofa",
    title: "A bar for evenings in",
    body: "Lit shelves, beside the family lounge.",
    position: "50% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-corridor.jpg",
    alt: "A corridor with a large painting of Krishna under a spotlight",
    title: "Art along the way",
    body: "Corridors that feel like part of the living space.",
    position: "58% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-ceiling.jpg",
    alt: "A slatted timber ceiling with soft light along its edge",
    title: "Warm timber overhead",
    body: "Slatted ceilings that soften the light.",
    position: "50% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-guest-room.jpg",
    alt: "A guest bedroom with a padded headboard wall and a tall window",
    title: "Room for guests",
    body: "So family can come and stay a while.",
    position: "50% center",
  },
  {
    src: "/images/residences/bhairavi-nilayam-wardrobe.jpg",
    alt: "A walk-in wardrobe in dark glass and timber beside a bedroom",
    title: "Walk-in wardrobes",
    body: "Storage that keeps the bedrooms clear.",
    position: "30% center",
  },
];

// The brief asks for the features as parts of daily life, not a list of amenities.
const DAY = [
  {
    time: "Morning",
    tone: "morning",
    title: "Start slowly",
    body: "Stretch in the dedicated yoga room, or train in the terrace gym under an open sky.",
    src: "/images/residences/bhairavi-nilayam-terrace-yoga.jpg",
    alt: "Two people doing yoga on a timber deck under an open terrace roof",
  },
  {
    time: "Day",
    tone: "noon",
    title: "Work, close to home",
    body: "A separate office block keeps work out of the house. Parking sits within the grounds.",
    src: "/images/residences/bhairavi-nilayam-desk.jpg",
    alt: "A desk nook with a lit mirror between tall timber cabinets",
  },
  {
    time: "Evening",
    tone: "evening",
    title: "Cook and gather",
    body: "Family meals in the indoor kitchen, or dinner from the outdoor kitchen, out in the open air.",
    src: "/images/residences/bhairavi-nilayam-evening-terrace.jpg",
    alt: "An outdoor lounge at night, with a swing, sofas and a terracotta jaali wall",
  },
  {
    time: "Night",
    tone: "night",
    title: "Films together",
    body: "A dedicated theatre room for movie nights with family and friends.",
    src: "/images/residences/bhairavi-nilayam-media-room.jpg",
    alt: "A media room with armchairs facing a screen wall and a glass wall onto greenery",
  },
];

export default function BhairavPage() {
  return (
    <>
      <ResidenceHero
        name="Bhairavi Nilayam"
        tagline="A private residence shaped by light, landscape and the rhythms of living."
        photo={heroPhoto}
        photoAlt="An open-air terrace at dusk, wrapped in a terracotta jaali wall, with two people at yoga"
        figures={[
          { value: "15,000", label: "sq. ft. of home" },
          { value: "3", label: "floors" },
          { value: "5", label: "bedrooms" },
          { value: "7,000", label: "sq. ft. of garden and lawn" },
        ]}
        ctas={[
          { label: "Register Interest", href: "#register-interest", solid: true },
          { label: "How it's designed", href: "#design" },
        ]}
      />

      {/* The house: the photo runs out to the screen edge */}
      <section className="offer-block on-panel" id="house">
        <div className="container">
          <SplitSection
            reverse
            placeholder="ph-3"
            src="/images/residences/bhairavi-nilayam-lounge.jpg"
            alt="A family lounge with deep cream sofas, a bar wall and timber panelling"
          >
            <h2 className={styles.statement}>A home among farmland.</h2>
            <div className={`${styles.muted} tw:mt-[24px]`}>
              <p>
                Bhairavi Nilayam is a 15,000 sq. ft. private house designed by Praveen Architects.
                It sits on the outskirts of West Hyderabad, surrounded by farmland and close to
                nature.
              </p>
              <p className="tw:mt-[16px]">
                The design answers that setting with a generous garden, plenty of natural light,
                rooms that open to the outdoors, and spaces built around the people who live there.
              </p>
            </div>
          </SplitSection>
        </div>
      </section>

      {/* The design, one idea and one photo at a time */}
      <section className="section on-dark" id="design">
        <div className="container">
          <OfferHead
            num="The design"
            heading={
              <>
                How the house
                <br />
                is put together
              </>
            }
            lede="Six ideas from the architect, and what each one feels like to live with."
          />
          <StoryScroll steps={DESIGN} />
        </div>
      </section>

      {/* Inside the house, in arched frames */}
      <section className="section on-panel" id="inside">
        <div className="container">
          <OfferHead
            num="Inside the house"
            heading={
              <>
                Rooms with
                <br />
                a quiet character
              </>
            }
            lede="Warm timber, marble and art, with space set aside for prayer, rest and the open sky."
          />
          <div className={styles.arches}>
            {INSIDE.map((r) => (
              <figure className={styles.arch} key={r.src}>
                <div className={`${styles["arch-frame"]} ph-3`}>
                  <Image
                    src={r.src}
                    alt={r.alt}
                    fill
                    sizes="(min-width: 861px) 30vw, (max-width: 600px) 68vw, 45vw"
                    style={{ objectPosition: r.position }}
                  />
                </div>
                <figcaption>
                  <strong>{r.title}</strong>
                  <span>{r.body}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* A day in the house */}
      <section className="section on-dark" id="day">
        <div className="container">
          <OfferHead
            num="Life in the house"
            heading={
              <>
                A day at
                <br />
                Bhairavi Nilayam
              </>
            }
            lede="Every room has a reason to be there. Here is how they fit into a day."
          />
          <Reveal className={styles.sky}>
            {DAY.map((d, i) => (
              <div key={d.time} className={styles[d.tone]} style={{ "--i": i } as CSSProperties}>
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  sizes="(min-width: 1081px) 24vw, (max-width: 600px) 100vw, 50vw"
                />
                <span className={styles.time}>{d.time}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Register interest */}
      <section className="section on-dark" id="register">
        <div className="container">
          <Reveal className="tw:mx-auto tw:max-w-[640px] tw:text-center">
            <div>
              <p className="eyebrow no-line">Register Your Interest</p>
              <h2 className="display-3">
                A private home,
                <br />
                a private conversation
              </h2>
              <p className="lede tw:mt-[16px]">
                Photographs, plans and a private viewing are shared on enquiry. We&apos;ll get back
                to you personally.
              </p>
              <Link href="#register-interest" className="btn solid tw:mt-[28px]">
                Register interest <span className="btn-arrow">→</span>
              </Link>
              <p className="tw:mt-[24px] tw:text-[13px] tw:text-(color:--on-surface-muted) tw:leading-[1.7]">
                Prefer an apartment? See{" "}
                <Link href="/residences/leela" className="text-link">
                  Leela
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyCta
        text="Interested in Bhairavi Nilayam?"
        ctaLabel="Register Interest"
        ctaHref="#register-interest"
      />
    </>
  );
}
