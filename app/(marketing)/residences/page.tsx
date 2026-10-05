import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { OfferHead } from "@/components/shared/OfferHead";
import { SplitSection } from "@/components/shared/SplitSection";
import { BandQuote } from "@/components/shared/BandQuote";
import StickyCta from "@/components/shared/StickyCta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Residences — Come Home to Yourself | Tavaro",
  description:
    "Tavaro Residences — Leela by Tavaro Residences and Bhairavi Nilayam. Thoughtfully designed homes built around belonging and everyday beauty.",
  path: "/residences",
});

const GALLERY = [
  { src: "/images/unsplash/residences-gallery-living-room.jpg", alt: "Living room interior", placeholder: "ph-2", tall: true },
  { src: "/images/unsplash/residences-gallery-architectural-detail.jpg", alt: "Architectural detail", placeholder: "ph-4", tall: false },
  { src: "/images/unsplash/residences-gallery-balcony.jpg", alt: "Residence balcony", placeholder: "ph-1", tall: false },
  { src: "/images/unsplash/residences-gallery-courtyard.jpg", alt: "Landscaped courtyard", placeholder: "ph-5", tall: true },
];

export default function ResidencesPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/residences-villa.jpg"
        photoAlt="A Tavaro Residence exterior in the evening"
        placeholder="ph-2"
        breadcrumbLabel="Residences"
        eyebrow="Residences"
        title={
          <>
            Come home
            <br />
            to yourself
          </>
        }
        titleSize="clamp(38px,6.4vw,84px)"
        lede="Homes built around belonging, personal space and thoughtful living — quieter, more architectural, more intimate than a stay."
        ctas={[
          { label: "Explore Leela", href: "#leela", solid: true },
          { label: "Discover Bhairavi Nilayam", href: "#bhairavi" },
        ]}
      />

      <section className="section on-dark tight">
        <div className="container">
          <Reveal className="two-col-text">
            <p className="eyebrow">Tavaro Residences</p>
            <p className="lede">
              Every Tavaro residence begins with the same question — what does it mean to truly come home?
              The answer shapes the architecture, the materials, the light and the quiet that follows.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Leela */}
      <section className="offer-block on-dark" id="leela">
        <div className="container">
          <SplitSection placeholder="ph-2" src="/images/unsplash/residences-leela.jpg" alt="Leela by Tavaro Residences">
            <OfferHead
              num="01 — Leela by Tavaro Residences"
              heading={
                <>
                  A home shaped
                  <br />
                  by stillness
                </>
              }
            />
            <p>
              Leela is a residence built around calm — considered architecture, natural materials and light
              that changes through the day. Every detail, from the amenities to the landscaping, is
              designed to make ordinary days feel unhurried.
            </p>
            <ul className="split-list">
              <li>Architecture &amp; design story</li>
              <li>Curated amenities &amp; common spaces</li>
              <li>Location &amp; connectivity</li>
              <li>Residence gallery on request</li>
            </ul>
            <Link href="/contact" className="btn">
              Explore Leela <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Bhairavi Nilayam */}
      <section className="offer-block on-panel" id="bhairavi">
        <div className="container">
          <SplitSection
            reverse
            placeholder="ph-4"
            src="/images/unsplash/residences-bhairavi-nilayam.jpg"
            alt="Bhairavi Nilayam residence"
          >
            <OfferHead
              num="02 — Bhairavi Nilayam"
              heading={
                <>
                  Rooted in place,
                  <br />
                  built for living
                </>
              }
            />
            <p>
              Bhairavi Nilayam brings together a strong sense of place with a design philosophy centred on
              privacy, craft and quiet luxury — a residence conceived as a long-term home, not a
              transaction.
            </p>
            <ul className="split-list">
              <li>Project story &amp; philosophy</li>
              <li>Architecture &amp; residence plans</li>
              <li>Location &amp; surrounds</li>
              <li>Gallery &amp; enquiry</li>
            </ul>
            <Link href="/contact" className="btn">
              Discover Bhairavi Nilayam <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="section on-dark">
        <div className="container">
          <OfferHead num="A closer look" heading="Life at a Tavaro Residence" />
          <Reveal stagger className="gallery-strip">
            {GALLERY.map((item) => (
              <div className={`gallery-item ${item.tall ? "tall " : ""}${item.placeholder}`} key={item.src}>
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 521px) 25vw, 50vw" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section on-panel">
        <BandQuote
          label="Register Your Interest"
          quote="A home is not just where you live. It is who you become when you're there."
          ctas={[{ label: "Register Interest", href: "/contact", solid: true }]}
        />
      </section>

      <StickyCta text="Interested in a Tavaro Residence?" ctaLabel="Register Interest" ctaHref="/contact" />
    </>
  );
}
