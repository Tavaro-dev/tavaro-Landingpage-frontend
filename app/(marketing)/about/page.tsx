import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Verbs } from "@/components/shared/Verbs";
import { BandQuote } from "@/components/shared/BandQuote";
import { pageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "About Tavaro — A Hospitality & Lifestyle Group",
  description:
    "Tavaro creates places for people to stay, live, gather and grow. Discover why Resorts, Residences, Experiences, Wellness and Màre belong together.",
  path: "/about",
});

const IDEAS = [
  {
    num: "01",
    icon: "leaf" as const,
    title: "Place",
    body: "Thoughtfully designed environments — resorts, residences and rooms built with care for materials, light and land.",
  },
  {
    num: "02",
    icon: "people" as const,
    title: "People",
    body: "Spaces that encourage connection and community, between guests, residents and the people who welcome them.",
  },
  {
    num: "03",
    icon: "sun" as const,
    title: "Experience",
    body: "Reasons to come together — curated gatherings, celebrations and moments made extraordinary.",
  },
  {
    num: "04",
    icon: "wellness" as const,
    title: "Wellness",
    body: "A way of living integrated into everyday life — not a facility to visit, but a philosophy to live by.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        photoSrc="/photos/drone-hero.jpg"
        photoAlt="The Tavaro world, from above"
        placeholder="ph-1"
        breadcrumbLabel="About"
        eyebrow="About Tavaro"
        title={
          <>
            Places for people to
            <br />
            stay, live, gather and grow
          </>
        }
        titleSize="clamp(36px,5.6vw,72px)"
        titleMaxWidth="20ch"
      />

      {/* Positioning */}
      <section className="section on-dark">
        <div className="container">
          <Reveal className="center-col">
            <p className="eyebrow center no-line tw:flex tw:justify-center">
              Why Tavaro
            </p>
            <p className="display-2 tw:mt-[24px] tw:max-w-[22ch] tw:mx-auto">
              Tavaro creates places for people
              <br />
              to stay, live, gather and grow.
            </p>
            <p className="lede tw:mt-[28px] tw:max-w-[56ch] tw:ml-auto tw:mr-auto">
              Resorts, Residences, Experiences, Wellness and Màre can look like five different businesses.
              At Tavaro, they are five expressions of the same idea — that where and how you spend your
              time should bring you closer to yourself, not further away.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Four Ideas */}
      <section className="section on-panel">
        <div className="container">
          <Reveal className="offer-head">
            <span className="offer-num">The Tavaro Idea</span>
            <h2 className="display-2">
              Four ideas that hold
              <br />
              the group together
            </h2>
          </Reveal>
        </div>
        <Reveal stagger className={styles["idea-grid"]}>
          {IDEAS.map((idea) => (
            <div className={styles["idea-card"]} key={idea.num}>
              <div className={styles["idea-num"]}>{idea.num}</div>
              <span
                className="tri-icon tw:w-[30px] tw:h-[30px] tw:text-(color:--gold) tw:mb-[18px] tw:inline-block"
              >
                <Icon name={idea.icon} />
              </span>
              <h4>{idea.title}</h4>
              <p>{idea.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Five Pillars recap */}
      <section className="section on-dark">
        <div className="container">
          <Reveal className="offer-head">
            <span className="offer-num">The Ecosystem</span>
            <h2 className="display-2">
              One philosophy,
              <br />
              five expressions
            </h2>
          </Reveal>
        </div>
        <Verbs
          items={[
            { word: "Resorts", sub: "A world away, yet close to you" },
            { word: "Residences", sub: "Come home to yourself" },
            { word: "Experiences", sub: "Moments made extraordinary" },
            { word: "Wellness", sub: "A Tavaro way of life" },
            { word: "Màre", sub: "Where life comes together" },
          ]}
        />
      </section>

      <section className="section on-panel">
        <BandQuote
          label="Tavaro"
          quote="In a world that pulls you outward, Tavaro gives you a place to slow down, reconnect and come home to yourself."
          ctas={[{ label: "Get in Touch", href: "/contact", solid: true }]}
        />
      </section>
    </>
  );
}
