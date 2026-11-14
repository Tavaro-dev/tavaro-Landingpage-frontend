import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/shared/HomeHero";
import { Reveal } from "@/components/shared/Reveal";
import { SplitSection } from "@/components/shared/SplitSection";
import { Verbs } from "@/components/shared/Verbs";
import { BandQuote } from "@/components/shared/BandQuote";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Tavaro — Discover the World Between Worlds",
  description:
    "Tavaro is a hospitality and lifestyle group creating places and experiences around a more meaningful way of living — Resorts, Residences, Experiences, Wellness and Màre.",
  path: "/",
});

const PILLAR_CARDS = [
  {
    href: "/resorts",
    placeholder: "ph-1",
    src: "/images/home/resorts.jpg",
    alt: "Tavaro Resorts",
    num: "01 — Resorts",
    title: "Resorts",
    line: "A world away, yet close to you",
  },
  {
    href: "/residences",
    placeholder: "ph-2",
    src: "/images/residences/leela-exterior.jpg",
    alt: "Tavaro Residences",
    num: "02 — Residences",
    title: "Residences",
    line: "Come home to yourself",
  },
  {
    href: "/experiences",
    placeholder: "ph-3",
    src: "/images/home/experiences.jpg",
    alt: "Tavaro Experiences",
    num: "03 — Experiences",
    title: "Experiences",
    line: "Moments made extraordinary",
  },
  {
    href: "/wellness",
    placeholder: "ph-green",
    src: "/images/home/wellness.jpg",
    alt: "Wellness at Tavaro",
    num: "04 — Wellness",
    title: "Wellness",
    line: "A Tavaro way of life",
  },
  {
    href: "/mare",
    placeholder: "ph-gold",
    src: "/images/home/mare.jpg",
    alt: "Màre Coffee House",
    num: "05 — Màre",
    title: "Màre",
    line: "Where life comes together",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Introduction */}
      <section className="section on-dark">
        <div className="container">
          <Reveal className="center-col intro-quote">
            <p className="eyebrow center no-line">Welcome to Tavaro</p>
            <p className="intro-quote-mark">&ldquo;</p>
            <p className="intro-quote-text">
              Everything we create at Tavaro is guided by one simple belief: Earth is our only true home.
            </p>
            <div className="intro-quote-cta">
              <Link href="/about" className="text-link">
                Discover Tavaro <Icon name="arrow" className="icon-arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* Five Pillars */}
      <section className="section on-dark" id="pillars">
        <div className="container">
          <Reveal className="offer-head">
            <div>
              <p className="eyebrow">The Tavaro World</p>
              <h2 className="display-2 tw:mt-[18px]">
                Five expressions.
                <br />
                One philosophy.
              </h2>
            </div>
            <p className="lede tw:max-w-[38ch]">
              Stay at a resort. Live in a residence. Gather through an experience. Restore through wellness.
              Connect at Màre — different ways into the same way of living.
            </p>
          </Reveal>
        </div>

        <Reveal stagger className="pillar-cards">
          {PILLAR_CARDS.map((card) => (
            <Link className="pillar-card" href={card.href} key={card.href}>
              <div className={`${card.placeholder} tw:absolute tw:inset-0`} />
              <Image src={card.src} alt={card.alt} fill sizes="(min-width: 861px) 20vw, 50vw" />
              <div className="pillar-card-body">
                <span className="pillar-card-num">{card.num}</span>
                <h3 className="pillar-card-title">{card.title}</h3>
                <p className="pillar-card-line">{card.line}</p>
                <span className="pillar-card-go">Explore →</span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Featured: Resorts */}
      <section className="section on-panel">
        <div className="container">
          <SplitSection placeholder="ph-1" src="/images/home/resorts.jpg" alt="Tavaro Resorts, Kokapet">
            <p className="eyebrow">Resorts</p>
            <h3 className="display-3">
              A world away,
              <br />
              yet close to you
            </h3>
            <p className="lede">
              Stays, celebrations, culinary journeys, coffee and movement — Tavaro Resorts, Kokapet, and
              Leaf by Tavaro, Mahalingapuram, coming soon.
            </p>
            <Link href="/resorts" className="btn">
              Explore Resorts <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Featured: Residences */}
      <section className="section on-dark">
        <div className="container">
          <SplitSection reverse placeholder="ph-2" src="/images/residences/leela-exterior.jpg" alt="Tavaro Residences">
            <p className="eyebrow">Residences</p>
            <h3 className="display-3">
              Come home
              <br />
              to yourself
            </h3>
            <p className="lede">
              Leela by Tavaro Residences and Bhairavi Nilayam — thoughtfully designed homes built around
              belonging, privacy and everyday beauty.
            </p>
            <Link href="/residences" className="btn">
              Explore Residences <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Featured: Experiences */}
      <section className="section on-panel">
        <div className="container">
          <SplitSection placeholder="ph-3" src="/images/home/experiences.jpg" alt="Tavaro Experiences">
            <p className="eyebrow">Experiences</p>
            <h3 className="display-3">
              Moments made
              <br />
              extraordinary
            </h3>
            <p className="lede">
              Social and cultural gatherings, curated corporate offsites, and wellness retreats designed as
              an ongoing platform of moments. Where people gather with intention and celebration.
            </p>
            <Link href="/experiences" className="btn">
              Explore Experiences <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Featured: Wellness */}
      <section className="section on-dark">
        <div className="container">
          <SplitSection reverse placeholder="ph-green" src="/images/home/wellness.jpg" alt="Wellness at Tavaro">
            <p className="eyebrow">Wellness</p>
            <h3 className="display-3">
              A Tavaro way
              <br />
              of life
            </h3>
            <p className="lede">
              Physical vitality, mental clarity, and restorative living woven into everyday life — mindful
              movement, breathwork, stillness and retreats designed to help you slow down and restore.
            </p>
            <Link href="/wellness" className="btn">
              Explore Wellness <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Featured: Màre */}
      <section className="section on-panel">
        <div className="container">
          <SplitSection placeholder="ph-gold" src="/images/home/mare.jpg" alt="Màre Coffee House">
            <p className="eyebrow">Màre Coffee House</p>
            <h3 className="display-3">
              Where life
              <br />
              comes together
            </h3>
            <p className="lede">
              An artisanal coffee house and culinary destination built around quiet luxury, craftsmanship,
              slow mornings, and spaces for creative conversation and community.
            </p>
            <Link href="/mare" className="btn">
              Explore Màre <span className="btn-arrow">→</span>
            </Link>
          </SplitSection>
        </div>
      </section>

      {/* Stay / Live / Gather / Restore / Connect */}
      <section className="section on-dark tight">
        <div className="container">
          <Reveal>
            <p
              className="eyebrow center no-line tw:flex tw:justify-center tw:mb-[16px]"
            >
              The Core Tavaro Experience
            </p>
            <h2 className="display-2 tw:text-center tw:max-w-[22ch] tw:my-[0] tw:mx-auto">
              A world where you can
            </h2>
          </Reveal>
        </div>
        <div className="container tw:mt-[56px]">
          <Verbs
            items={[
              { word: "Stay", sub: "at a Tavaro resort" },
              { word: "Live", sub: "in a Tavaro residence" },
              { word: "Gather", sub: "through Tavaro experiences" },
              { word: "Restore", sub: "through Tavaro wellness" },
              { word: "Connect", sub: "at Màre" },
            ]}
          />
        </div>
      </section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* Closing */}
      <section className="section on-dark">
        <BandQuote
          label="Tavaro"
          quote="In a world that pulls you outward, Tavaro gives you a place to slow down, reconnect and come home to yourself."
          ctas={[
            { label: "About Tavaro", href: "/about" },
            { label: "Plan Your Visit", href: "/contact", solid: true },
          ]}
        />
      </section>
    </>
  );
}
