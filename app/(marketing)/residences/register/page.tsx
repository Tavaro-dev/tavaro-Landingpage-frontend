import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { pageMetadata } from "@/lib/metadata";
import ResidenceInterestForm from "@/features/residences/components/ResidenceInterestForm";

export const metadata = pageMetadata({
  title: "Register Your Interest — Tavaro Residences | Tavaro",
  description:
    "Register your interest in Leela by Tavaro Residences or Bhairavi Nilayam. A discreet, personal enquiry journey.",
  path: "/residences/register",
});

export default function ResidencesRegisterPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/residences-villa.jpg"
        photoAlt="A Tavaro Residence"
        placeholder="ph-2"
        breadcrumbLabel="Register Your Interest"
        eyebrow="Register Your Interest"
        title={
          <>
            A discreet enquiry,
            <br />
            at your pace
          </>
        }
        titleSize="clamp(30px,4.8vw,60px)"
        lede="Tell us what you'd like to know. We'll follow up personally — a conversation, not a sales call."
      />

      <section className="section on-dark">
        <div className="container">
          <Reveal className="split">
            <div className="split-body">
              <p className="eyebrow">The Residences</p>
              <h2 className="display-3">
                Leela &amp;
                <br />
                Bhairavi Nilayam
              </h2>
              <p style={{ marginTop: 18, lineHeight: 1.8, color: "var(--muted-on-dark)" }}>
                Whether you&apos;d like the brochure, pricing information, a private viewing or
                simply a conversation with our team — we&apos;re here to help you understand which
                residence is right for you.
              </p>
              <p
                style={{
                  marginTop: 24,
                  fontSize: 13,
                  color: "var(--muted-on-dark)",
                  lineHeight: 1.7,
                }}
              >
                Your enquiry is handled with complete discretion. We will never share your
                information or contact you without your permission.
              </p>
            </div>
            <ResidenceInterestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
