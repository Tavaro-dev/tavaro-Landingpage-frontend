import { PageHero } from "@/components/PageHero";
import { OfferHead } from "@/components/OfferHead";
import { Reveal } from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact & Enquire | Tavaro",
  description:
    "Get in touch with Tavaro — book a stay, plan an event, enquire about a residence, or register for an experience.",
});

const JOURNEYS = [
  { label: "Guest", body: "Discover a resort, explore the rooms, and book your stay." },
  { label: "Event Client", body: "Explore our venues and enquire about weddings & celebrations." },
  { label: "Corporate Client", body: "Explore experiences and enquire about a corporate offsite." },
  { label: "Residence Buyer", body: "Explore Leela or Bhairavi Nilayam and register your interest." },
  { label: "Experience Guest", body: "Discover an upcoming experience and register to attend." },
  { label: "Màre Visitor", body: "Explore Màre and see what's happening this month." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/residences-villa.jpg"
        photoAlt="An evening at Tavaro"
        placeholder="ph-1"
        breadcrumbLabel="Contact"
        eyebrow="Get in Touch"
        title={
          <>
            Let&apos;s plan your
            <br />
            next Tavaro moment
          </>
        }
        titleSize="clamp(34px,5.4vw,64px)"
        titleMaxWidth="20ch"
      />

      {/* Journeys */}
      <section className="section on-dark tight">
        <div className="container">
          <OfferHead
            num="Tell us why you're reaching out"
            heading={
              <>
                Every path leads
                <br />
                somewhere at Tavaro
              </>
            }
          />
          <Reveal stagger className="journey-grid">
            {JOURNEYS.map((journey) => (
              <div className="journey-item" key={journey.label}>
                <p className="eyebrow no-line">{journey.label}</p>
                <p>{journey.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="section on-light">
        <div className="container">
          <Reveal className="split">
            <div className="split-body">
              <p className="eyebrow">Enquire</p>
              <h3 className="display-3">Send us a message</h3>
              <p className="lede" style={{ marginTop: 16 }}>
                Tell us what brings you to Tavaro, and the right team will be in touch within one business
                day.
              </p>
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
                <a
                  href="tel:+914012345678"
                  className="text-link"
                  style={{ borderColor: "rgba(28,23,18,.25)", color: "var(--ink)" }}
                >
                  +91 40 1234 5678
                </a>
                <a
                  href="mailto:hello@tavaro.com"
                  className="text-link"
                  style={{ borderColor: "rgba(28,23,18,.25)", color: "var(--ink)", textTransform: "none" }}
                >
                  hello@tavaro.com
                </a>
                <span style={{ fontSize: 13, color: "var(--muted-on-light)" }}>
                  Tavaro Resorts, Kokapet, Hyderabad
                </span>
              </div>
            </div>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
