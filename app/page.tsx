import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { SplitSection } from "@/components/SplitSection";
import { Verbs } from "@/components/Verbs";
import { BandQuote } from "@/components/BandQuote";
import { Icon } from "@/components/Icon";
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
    src: "/photos/resorts-horses.jpg",
    alt: "Tavaro Resorts",
    num: "01 — Resorts",
    title: "Resorts",
    line: "A world away, yet close to you",
  },
  {
    href: "/residences",
    placeholder: "ph-2",
    src: "/photos/residences-villa.jpg",
    alt: "Tavaro Residences",
    num: "02 — Residences",
    title: "Residences",
    line: "Come home to yourself",
  },
  {
    href: "/experiences",
    placeholder: "ph-3",
    src: "/photos/experiences-cars.jpg",
    alt: "Tavaro Experiences",
    num: "03 — Experiences",
    title: "Experiences",
    line: "Moments made extraordinary",
  },
  {
    href: "/wellness",
    placeholder: "ph-green",
    src: "/photos/wellness-hands.jpg",
    alt: "Wellness at Tavaro",
    num: "04 — Wellness",
    title: "Wellness",
    line: "A Tavaro way of life",
  },
  {
    href: "/mare",
    placeholder: "ph-gold",
    src: "/photos/mare-cover.jpg",
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
          <Reveal className="center-col">
            <p className="eyebrow center no-line">Welcome to Tavaro</p>
            <p className="intro-quote-mark">&ldquo;</p>
            <p className="display-2 italic">
              Everything we create at Tavaro is guided by one simple belief: Earth is our only true home.
            </p>
            <div style={{ marginTop: 40 }}>
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
              <h2 className="display-2" style={{ marginTop: 18 }}>
                Five expressions.
                <br />
                One philosophy.
              </h2>
            </div>
            <p className="lede" style={{ maxWidth: "38ch" }}>
              Stay at a resort. Live in a residence. Gather through an experience. Restore through wellness.
              Connect at Màre — different ways into the same way of living.
            </p>
          </Reveal>
        </div>

        <Reveal className="pillar-cards">
          {PILLAR_CARDS.map((card) => (
            <Link className="pillar-card" href={card.href} key={card.href}>
              <div className={card.placeholder} style={{ position: "absolute", inset: 0 }} />
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
          <SplitSection placeholder="ph-1" src="/photos/resorts-horses.jpg" alt="Tavaro Resorts, Kokapet">
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
          <SplitSection reverse placeholder="ph-2" src="/photos/residences-villa.jpg" alt="Tavaro Residences">
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

      {/* Stay / Live / Gather / Restore / Connect */}
      <section className="section on-panel tight">
        <div className="container">
          <Reveal>
            <p
              className="eyebrow center no-line"
              style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
            >
              The Core Tavaro Experience
            </p>
            <h2 className="display-2" style={{ textAlign: "center", maxWidth: "22ch", margin: "0 auto" }}>
              A world where you can
            </h2>
          </Reveal>
        </div>
        <div className="container" style={{ marginTop: 56 }}>
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
