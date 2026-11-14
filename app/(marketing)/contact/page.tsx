import { PageHero } from "@/components/shared/PageHero";
import { OfferHead } from "@/components/shared/OfferHead";
import { Reveal } from "@/components/shared/Reveal";
import ContactForm from "@/features/contact/components/ContactForm";
import { Icon } from "@/components/ui/Icon";
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
      <section className="section on-dark">
        <div className="container">
          <Reveal className="split">
            <div className="split-body">
              <p className="eyebrow">Enquire</p>
              <h3 className="display-3">Send us a message</h3>
              <p className="lede tw:mt-[16px]">
                Tell us what brings you to Tavaro, and the right team will be in touch within one business
                day.
              </p>
              <div className="tw:mt-[40px] tw:flex tw:flex-col tw:gap-[16px]">
                <a
                  href="tel:+919989983029"
                  className="text-link tw:inline-flex tw:items-center tw:gap-[8px]"
                >
                  +91 998 998 3029
                </a>
                <a
                  href="https://wa.me/919989983029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link tw:inline-flex tw:items-center tw:gap-[8px]"
                >
                  <Icon name="whatsapp" className="tw:w-[16px] tw:h-[16px]" /> WhatsApp: +91 998 998 3029
                </a>
                <a
                  href="mailto:celebrate@tavaro.in"
                  className="text-link tw:normal-case tw:inline-flex tw:items-center tw:gap-[8px]"
                >
                  <Icon name="mail" className="tw:w-[16px] tw:h-[16px]" /> celebrate@tavaro.in
                </a>
                <div className="tw:flex tw:gap-[16px] tw:mt-[12px]">
                  <a
                    href="https://www.instagram.com/tavaro.resorts?stkn=anQwdWZkbmd1NmE5"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Icon name="instagram" className="tw:w-[20px] tw:h-[20px]" />
                  </a>
                  <a
                    href="https://www.facebook.com/p/Tavaro-Resorts-61588547362755/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Icon name="facebook" className="tw:w-[20px] tw:h-[20px]" />
                  </a>
                  <a
                    href="https://wa.me/919989983029"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <Icon name="whatsapp" className="tw:w-[20px] tw:h-[20px]" />
                  </a>
                  <a
                    href="mailto:celebrate@tavaro.in"
                    aria-label="Email"
                  >
                    <Icon name="mail" className="tw:w-[20px] tw:h-[20px]" />
                  </a>
                </div>
                <span className="tw:text-[13px] tw:text-(color:--muted) tw:mt-[4px]">
                  Kokapet, Hyderabad
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
