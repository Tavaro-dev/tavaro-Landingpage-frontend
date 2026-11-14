import { Reveal } from "@/components/shared/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { THINGS_TO_DO_DATA } from "@/features/resorts/content/thingsToDoData";
import { HeroSquareTilesBackground } from "@/features/resorts/components/HeroSquareTilesBackground";
import { ExpandingPanelsShowcase } from "@/features/resorts/components/ExpandingPanelsShowcase";
import { EXPLORE_SHOWCASE_CATEGORIES } from "@/features/resorts/content/showcaseData";
import StickyCta from "@/components/shared/StickyCta";
import styles from "./explore.module.css";

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

      <div className={styles["explore-page"]}>
        {/* SECTION 1: Immersive Hero with Continuous Small Square Boxes Animation */}
        <section className={styles["explore-hero"]} aria-label="Explore at Your Own Pace Hero">
          <div className={styles["explore-hero-media"]}>
            <HeroSquareTilesBackground
              slides={exploreSlides}
              overlayClassName={styles["explore-hero-overlay"]}
            />
          </div>

          <div className="container">
            <Reveal className={styles["explore-hero-content"]}>
              <div className={styles["explore-breadcrumb"]}>
                Tavaro / Resorts / Things to Do / Explore
              </div>
              <span className={styles["explore-hero-eyebrow"]}>{explore.eyebrow}</span>
              <h1 className={styles["explore-hero-title"]}>{explore.heading}</h1>
              <p className={styles["explore-hero-desc"]}>{explore.description}</p>

              {/* Restrained scroll indicator */}
              <a
                href="#showcase"
                className={styles["explore-scroll-indicator"]}
                aria-label="Scroll to discover experiences"
              >
                <span>Scroll to explore</span>
                <span className={styles["explore-scroll-arrow"]} aria-hidden="true">
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
