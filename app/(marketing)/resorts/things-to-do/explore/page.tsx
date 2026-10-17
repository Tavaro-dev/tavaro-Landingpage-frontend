import { Reveal } from "@/components/shared/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { THINGS_TO_DO_DATA } from "@/features/resorts/content/thingsToDoData";
import { HeroSquareTilesBackground } from "@/features/resorts/components/HeroSquareTilesBackground";
import { ExpandingPanelsShowcase } from "@/features/resorts/components/ExpandingPanelsShowcase";
import { EXPLORE_SHOWCASE_CATEGORIES } from "@/features/resorts/content/showcaseData";
import StickyCta from "@/components/shared/StickyCta";

export const metadata = pageMetadata({
  title: "Explore at Your Own Pace — Tavaro Resorts | Tavaro",
  description:
    "Wander, dine, swim, play and unwind at your own rhythm across the tranquil grounds of Tavaro Resorts in Kokapet.",
  path: "/resorts/things-to-do/explore",
});

export default function ExploreAtYourOwnPacePage() {
  const { explore } = THINGS_TO_DO_DATA;
  const [dine, unwind, play, exploreCat] = explore.categories;

  const exploreSlides = [
    {
      title: dine.title,
      image: dine.image,
      alt: dine.imageAlt,
      tagline: dine.tagline,
    },
    {
      title: unwind.title,
      image: unwind.image,
      alt: unwind.imageAlt,
      tagline: unwind.tagline,
    },
    {
      title: play.title,
      image: play.image,
      alt: play.imageAlt,
      tagline: play.tagline,
    },
    {
      title: exploreCat.title,
      image: exploreCat.image,
      alt: exploreCat.imageAlt,
      tagline: exploreCat.tagline,
    },
  ];

  return (
    <>
      <style>{`
        /* Editorial Luxury Tokens & Typography */
        .explore-page {
          background: var(--surface);
          color: var(--on-surface);
          overflow-x: clip;
        }

        /* Hero Section */
        .explore-hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: flex-end;
          padding: clamp(80px, 12vh, 140px) 0 clamp(48px, 8vh, 80px);
          overflow: hidden;
        }

        .explore-hero-media {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .explore-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.35) 0%,
            rgba(15, 13, 10, 0.45) 45%,
            rgba(15, 13, 10, 0.88) 100%
          );
        }

        [data-theme="light"] .explore-hero-overlay {
          background: linear-gradient(
            to bottom,
            rgba(15, 13, 10, 0.3) 0%,
            rgba(15, 13, 10, 0.5) 45%,
            rgba(15, 13, 10, 0.9) 100%
          );
        }

        .explore-hero-content {
          position: relative;
          z-index: 3;
          max-width: 820px;
          color: #ffffff;
        }

        .explore-breadcrumb {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
        }

        .explore-hero-eyebrow {
          display: inline-block;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .explore-hero-title {
          font-family: var(--font-display, serif);
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: 0.015em;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .explore-hero-desc {
          font-family: var(--font-display, serif);
          font-size: clamp(19px, 2.2vw, 26px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.88);
          max-width: 680px;
          margin-bottom: 36px;
        }

        .explore-scroll-indicator {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition: color 0.25s ease, transform 0.25s ease;
          padding: 8px 0;
        }

        .explore-scroll-indicator:hover,
        .explore-scroll-indicator:focus-visible {
          color: var(--gold);
          transform: translateY(3px);
          outline: none;
        }

        .explore-scroll-arrow {
          font-size: 15px;
          line-height: 1;
          color: var(--gold);
          animation: floatArrow 2.4s ease-in-out infinite;
        }

        @keyframes floatArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        @media (max-width: 640px) {
          .explore-hero {
            min-height: 75vh;
            padding-bottom: 40px;
          }
        }
      `}</style>

      <div className="explore-page">
        {/* SECTION 1: Immersive Hero with Continuous Small Square Boxes Animation */}
        <section className="explore-hero" aria-label="Explore at Your Own Pace Hero">
          <div className="explore-hero-media">
            <HeroSquareTilesBackground
              slides={exploreSlides}
              overlayClassName="explore-hero-overlay"
            />
          </div>

          <div className="container">
            <Reveal className="explore-hero-content">
              <div className="explore-breadcrumb">
                Tavaro / Resorts / Things to Do / Explore
              </div>
              <span className="explore-hero-eyebrow">{explore.eyebrow}</span>
              <h1 className="explore-hero-title">{explore.heading}</h1>
              <p className="explore-hero-desc">{explore.description}</p>

              {/* Restrained scroll indicator */}
              <a
                href="#showcase"
                className="explore-scroll-indicator"
                aria-label="Scroll to discover experiences"
              >
                <span>Scroll to explore</span>
                <span className="explore-scroll-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* SECTION 2: Expanding Panels Showcase (Hover, Scroll, and Click) */}
        <div id="showcase">
          <ExpandingPanelsShowcase
            mode="explore"
            pageTitle={explore.title}
            categories={EXPLORE_SHOWCASE_CATEGORIES}
            closing={{
              title: "Explore at Your Own Pace",
              tagline:
                "Wander, dine, swim, play and unwind — at your own rhythm.",
              primaryBtnText: "Create Your Experience (On Request)",
              primaryBtnHref: "/resorts/things-to-do/create",
              secondaryBtnText: "Resorts Overview",
              secondaryBtnHref: "/resorts",
            }}
          />
        </div>

        <StickyCta
          text="Ready to experience Tavaro at your own rhythm?"
          ctaLabel="Book Your Stay"
          ctaHref="/contact"
        />
      </div>
    </>
  );
}
