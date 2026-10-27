import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";
import BhairavDynamicForm from "./BhairavDynamicForm";

export const metadata = pageMetadata({
  title: "Bhairavi Nilayam — A Private Residence Shaped by Light | Tavaro",
  description:
    "Bhairavi Nilayam — a 15,000 sq. ft. private residence by Praveen Architects, West Hyderabad. Shaped by light, landscape and the rhythms of living.",
  path: "/residences/bhairavi-nilayam",
});

const RESIDENCE_SPECS = [
  { label: "Residence", value: "Bhairavi Nilayam" },
  { label: "Area", value: "15,000 sq. ft." },
  { label: "Floors", value: "3" },
  { label: "Bedrooms", value: "5" },
  { label: "Landscape & Lawn", value: "Approx. 7,000 sq. ft." },
  { label: "Planning", value: "Vastu Compliant" },
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

const LIVING_SPACES = [
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

const GALLERY_IMAGES = [
  {
    src: "/images/unsplash/residences-bhairavi-nilayam.jpg",
    alt: "Bhairavi Nilayam exterior",
    placeholder: "ph-4",
    tall: true,
    caption: "Architecture",
  },
  {
    src: "/images/unsplash/residences-gallery-living-room.jpg",
    alt: "Living space",
    placeholder: "ph-2",
    tall: false,
    caption: "Interiors",
  },
  {
    src: "/images/unsplash/residences-gallery-balcony.jpg",
    alt: "Open terrace",
    placeholder: "ph-1",
    tall: false,
    caption: "Terrace",
  },
  {
    src: "/images/unsplash/residences-gallery-courtyard.jpg",
    alt: "Landscaped grounds",
    placeholder: "ph-5",
    tall: true,
    caption: "Landscape",
  },
];

export default function BhairavPage() {
  return (
    <>
      <PageHero
        photoSrc="/images/unsplash/residences-bhairavi-nilayam.jpg"
        photoAlt="Bhairavi Nilayam — exterior view"
        placeholder="ph-4"
        breadcrumbLabel="Bhairavi Nilayam"
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
          { label: "Architecture", href: "#architecture", icon: "facilities" },
          { label: "Spaces", href: "#spaces", icon: "compass" },
          { label: "Gallery", href: "#gallery", icon: "photos" },
          { label: "Details", href: "#details", icon: "location" },
          { label: "Enquire", href: "#register", icon: "mail" },
        ]}
      />

      {/* Overview */}
      <section className="section on-dark tight">
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
        </div>
      </section>

      {/* Architecture Story */}
      <section className="section on-panel" id="architecture">
        <div className="container">
          <SplitSection
            placeholder="ph-4"
            src="/images/unsplash/residences-bhairavi-nilayam.jpg"
            alt="Bhairavi Nilayam — architectural view"
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
            <ul className="split-list" style={{ marginTop: 20 }}>
              <li>Praveen Architects — West Hyderabad</li>
              <li>Vastu conscious contemporary planning</li>
              <li>North-facing glass wall — landscape connection</li>
              <li>Double-height volumes across levels</li>
            </ul>
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
          <Reveal stagger className="principles-grid" style={{ marginTop: 40 }}>
            {DESIGN_PRINCIPLES.map((p) => (
              <div className="principle-item" key={p.label}>
                <p className="eyebrow no-line">{p.label}</p>
                <p>{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Living Spaces */}
      <section className="section on-panel" id="spaces">
        <div className="container">
          <OfferHead
            num="Make Room for Life"
            heading={
              <>
                Every mode of
                <br />
                living, considered
              </>
            }
            lede="These spaces are not a list of amenities. They are the parts of a home designed around how a family actually lives — across mornings, evenings, weekends and years."
          />
          <Reveal stagger className="living-spaces-grid" style={{ marginTop: 40 }}>
            {LIVING_SPACES.map((space) => (
              <div className="living-space-item" key={space.label}>
                <p className="eyebrow no-line">{space.label}</p>
                <p>{space.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Residence Details / Specs */}
      <section className="section on-dark" id="details">
        <div className="container">
          <OfferHead
            num="Residence Details"
            heading={
              <>
                Specifications
                <br />& overview
              </>
            }
          />
          <Reveal className="residence-specs-block" style={{ marginTop: 40 }}>
            <div className="residence-specs-table">
              {RESIDENCE_SPECS.map((spec) => (
                <div className="spec-row" key={spec.label}>
                  <span className="spec-key">{spec.label}</span>
                  <span className="spec-val">{spec.value}</span>
                </div>
              ))}
            </div>
            <div className="residence-specs-media ph-4">
              <Image
                src="/images/unsplash/residences-bhairavi-nilayam.jpg"
                alt="Bhairavi Nilayam"
                fill
                sizes="(min-width: 860px) 40vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="section on-panel" id="gallery">
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
          <Reveal stagger className="gallery-strip" style={{ marginTop: 32 }}>
            {GALLERY_IMAGES.map((item) => (
              <div
                className={`gallery-item ${item.tall ? "tall " : ""}${item.placeholder}`}
                key={item.src}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 521px) 25vw, 50vw"
                />
                <span className="gallery-item-caption">{item.caption}</span>
              </div>
            ))}
          </Reveal>
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
              <p className="lede" style={{ marginTop: 16 }}>
                Bhairavi Nilayam is a residence of singular character. If it speaks to you, we&apos;d
                like to speak with you — personally, discreetly, at your pace.
              </p>
              <div className="residence-details-mini" style={{ marginTop: 28 }}>
                {RESIDENCE_SPECS.map((spec) => (
                  <div key={spec.label} className="mini-spec">
                    <span className="mini-spec-label">{spec.label}</span>
                    <span className="mini-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
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
