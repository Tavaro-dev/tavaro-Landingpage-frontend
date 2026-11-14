import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import LeelaDynamicForm from "./LeelaDynamicForm";
import styles from "../residences.module.css";
import gstyles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Leela by Tavaro Residences — A Home Shaped by Stillness | Tavaro",
  description:
    "Leela by Tavaro Residences — considered architecture, natural materials and light that changes through the day. Floor plans, interiors, gallery and location.",
  path: "/residences/leela",
});

const GALLERY_IMAGES = [
  {
    src: "/images/unsplash/residences-leela.jpg",
    alt: "Architecture — Leela by Tavaro Residences",
    placeholder: "ph-2",
    tall: true,
    caption: "Architecture",
  },
  {
    src: "/images/unsplash/residences-gallery-living-room.jpg",
    alt: "Interiors — living room",
    placeholder: "ph-3",
    tall: false,
    caption: "Interiors",
  },
  {
    src: "/images/unsplash/residences-gallery-courtyard.jpg",
    alt: "Landscape — central courtyard",
    placeholder: "ph-5",
    tall: true,
    caption: "Landscape",
  },
  {
    src: "/images/unsplash/residences-gallery-architectural-detail.jpg",
    alt: "Details — materiality and craft",
    placeholder: "ph-4",
    tall: false,
    caption: "Details",
  },
  {
    src: "/images/unsplash/residences-gallery-balcony.jpg",
    alt: "Terrace — open-air living",
    placeholder: "ph-1",
    tall: false,
    caption: "Terrace",
  },
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

export default function LeelaPage() {
  return (
    <>
      <PageHero
        photoSrc="/images/unsplash/residences-leela.jpg"
        photoAlt="Leela by Tavaro Residences — architectural exterior"
        placeholder="ph-2"
        breadcrumbLabel="Leela by Tavaro Residences"
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
          { label: "Architecture", href: "#architecture", icon: "facilities" },
          { label: "Floor Plans", href: "#floor-plans", icon: "location" },
          { label: "Interiors", href: "#interiors", icon: "photos" },
          { label: "Gallery", href: "#gallery", icon: "compass" },
          { label: "Location", href: "#location", icon: "location" },
        ]}
      />

      {/* A. The Residence Overview */}
      <section className="section on-dark tight">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">The Residence</p>
            <p className="lede">
              Leela is a residence built around calm. It is not simply architecture — it is a way of
              experiencing the day, from the quality of morning light to the ease of an evening
              gathered with people you love.
            </p>
          </Reveal>
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
          <Reveal stagger className={`${styles["principles-grid"]} tw:mt-[40px]`}>
            {ARCHITECTURAL_PRINCIPLES.map((p) => (
              <div className={styles["principle-item"]} key={p.label}>
                <p className="eyebrow no-line">{p.label}</p>
                <p>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* C. Floor Plans */}
      <section className="section on-dark" id="floor-plans">
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
            lede="Floor-wise plans, typical floor plan, terrace plan and 3D volumetric views — each level considered for orientation, privacy and unhindered connection to nature."
          />

          {/* Plan categories overview */}
          <Reveal stagger className={`${styles["principles-grid"]} tw:mt-[40px] tw:mb-[32px]`}>
            <div className={styles["principle-item"]}>
              <p className="eyebrow no-line tw:text-(color:--gold)">
                01 — Typical Floor Plan
              </p>
              <p className="tw:mt-[8px] tw:font-[500] tw:text-(color:--on-surface)">
                Living &amp; Bedroom Suites
              </p>
              <p className="tw:mt-[8px]">
                Generous social living pavilions seamlessly opening onto deep perimeter verandas, with private family sanctuaries buffered from entertaining zones.
              </p>
            </div>
            <div className={styles["principle-item"]}>
              <p className="eyebrow no-line tw:text-(color:--gold)">
                02 — Terrace Plan
              </p>
              <p className="tw:mt-[8px] tw:font-[500] tw:text-(color:--on-surface)">
                Sky Pavilion &amp; Landscape Deck
              </p>
              <p className="tw:mt-[8px]">
                Open-to-sky entertaining terrace with shaded pergolas, lush planters, and panoramic vistas celebrating morning sun and twilight breezes.
              </p>
            </div>
            <div className={styles["principle-item"]}>
              <p className="eyebrow no-line tw:text-(color:--gold)">
                03 — Isometric &amp; 3D Plans
              </p>
              <p className="tw:mt-[8px] tw:font-[500] tw:text-(color:--on-surface)">
                Volumetric Spatial Flow
              </p>
              <p className="tw:mt-[8px]">
                Double-height light shafts, deliberate thermal cross-ventilation pathways, and intuitive circulation connecting every level.
              </p>
            </div>
          </Reveal>

          <Reveal className={gstyles["floor-plan-display"]}>
            <div className={`${gstyles["floor-plan-placeholder"]} ph-2`}>
              <div className={gstyles["floor-plan-overlay"]}>
                <p className="eyebrow no-line tw:text-(color:--gold-light)">
                  Detailed Architectural Plans &amp; Brochure
                </p>
                <p className="tw:mt-[10px] tw:text-[13px] tw:text-(color:--muted-on-dark) tw:max-w-[46ch] tw:mx-auto">
                  Comprehensive architectural schematics including floor-wise layouts, dimensioned room configurations, terrace layouts, and orientation studies are available upon enquiry.
                </p>
                <Link href="#register" className="btn solid tw:mt-[22px]">
                  Request Complete Floor Plans <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
            <div className={gstyles["floor-plan-specs"]}>
              <div className={gstyles["spec-item"]}>
                <span className={gstyles["spec-label"]}>Configuration</span>
                <span className={gstyles["spec-value"]}>Curated multi-level layouts</span>
              </div>
              <div className={gstyles["spec-item"]}>
                <span className={gstyles["spec-label"]}>Floor Plans</span>
                <span className={gstyles["spec-value"]}>Typical, Terrace &amp; Sky Deck</span>
              </div>
              <div className={gstyles["spec-item"]}>
                <span className={gstyles["spec-label"]}>Spatial Models</span>
                <span className={gstyles["spec-value"]}>Isometric &amp; 3D Volumetric</span>
              </div>
              <div className={gstyles["spec-item"]}>
                <span className={gstyles["spec-label"]}>Orientation</span>
                <span className={gstyles["spec-value"]}>Solar &amp; wind-path aligned</span>
              </div>
              <div className={gstyles["spec-item"]}>
                <span className={gstyles["spec-label"]}>Area Information</span>
                <span className={gstyles["spec-value"]}>Provided in brochure</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* D. Interiors */}
      <section className="section on-panel" id="interiors">
        <div className="container">
          <SplitSection
            placeholder="ph-2"
            src="/images/unsplash/residences-gallery-living-room.jpg"
            alt="Leela interiors — living space"
          >
            <OfferHead
              num="Interiors"
              heading={
                <>
                  Form, function
                  <br />
                  and lived beauty
                </>
              }
            />
            <p>
              Leela&apos;s interiors balance refined contemporary detailing with a deep relationship
              to nature. Materials are chosen for how they age — warm, honest and quietly luxurious.
              Each space is designed for the life that happens within it.
            </p>
            <ul className="split-list tw:mt-[20px]">
              <li>Refined contemporary materiality</li>
              <li>Natural textures and honest finishes</li>
              <li>Generous light through considered openings</li>
              <li>Indoor — outdoor connection throughout</li>
            </ul>
          </SplitSection>
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
          <Reveal stagger className={`${styles["gallery-strip"]} tw:mt-[32px]`}>
            {GALLERY_IMAGES.map((item) => (
              <div
                className={`${styles["gallery-item"]} ${item.tall ? "tall " : ""}${item.placeholder}`}
                key={item.src}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 521px) 25vw, 50vw"
                />
                <span className={styles["gallery-item-caption"]}>{item.caption}</span>
              </div>
            ))}
          </Reveal>
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
          <Reveal className={`${gstyles["location-proximity-grid"]} tw:mt-[40px]`}>
            <div className={`${gstyles["proximity-map-placeholder"]} ph-1`}>
              <div className={gstyles["proximity-map-label"]}>
                <p className="eyebrow no-line tw:text-(color:--gold-light)">
                  Location
                </p>
                <p className="tw:text-[12px] tw:text-(color:--muted-on-dark) tw:mt-[6px]">
                  Interactive map available on enquiry
                </p>
              </div>
            </div>
            <div className={gstyles["proximity-list"]}>
              <p
                className="eyebrow no-line tw:mb-[20px] tw:text-(color:--on-surface-muted)"
              >
                Key Destinations
              </p>
              {[
                { place: "Kokapet Financial District", time: "12 min" },
                { place: "HITEC City", time: "18 min" },
                { place: "Rajiv Gandhi International Airport", time: "25 min" },
                { place: "Gachibowli", time: "10 min" },
                { place: "Outer Ring Road Access", time: "5 min" },
              ].map((item) => (
                <div className={gstyles["proximity-item"]} key={item.place}>
                  <span className={gstyles["proximity-place"]}>{item.place}</span>
                  <span className={gstyles["proximity-time"]}>{item.time}</span>
                </div>
              ))}
              <p className="tw:text-[11px] tw:text-(color:--muted-on-dark) tw:mt-[16px]">
                Travel times are indicative. Verified times available on request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* G. Register Your Interest */}
      <section className="section on-dark" id="register">
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
              <p className="tw:mt-[24px] tw:text-[13px] tw:text-(color:--muted-on-dark) tw:leading-[1.7]">
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

      <section className="section on-panel">
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
