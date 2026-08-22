import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "./Icon";

const PILLARS: { label: string; href: string; icon: IconName }[] = [
  { label: "Resorts", href: "/resorts", icon: "resorts" },
  { label: "Residences", href: "/residences", icon: "residences" },
  { label: "Experiences", href: "/experiences", icon: "experiences" },
  { label: "Wellness", href: "/wellness", icon: "wellness" },
  { label: "Màre", href: "/mare", icon: "mare" },
];

export function HomeHero() {
  return (
    <section className="hero">
      <div className="hero-media ph-1">
        <Image
          src="/photos/drone-hero.jpg"
          alt="Aerial view of a Tavaro celebration at dusk"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-scrim" />

      <div className="hero-inner container">
        <p className="eyebrow hero-eyebrow">Tavaro Group</p>
        <h1 className="hero-title">
          Discover
          <br />
          the world
          <br />
          <em>between worlds</em>
        </h1>
        <p className="hero-sub">
          Hospitality <span className="dot">·</span> Residences <span className="dot">·</span> Experiences{" "}
          <span className="dot">·</span> Wellness
        </p>
        <div className="hero-cta-row">
          <a href="#pillars" className="btn">
            Explore Tavaro <span className="btn-arrow">→</span>
          </a>
          <Link href="/resorts" className="btn solid">
            Book a Stay
          </Link>
        </div>
      </div>

      <span className="scroll-cue">Scroll to discover</span>

      <div className="pillar-strip">
        <div className="container">
          <div className="pillar-grid">
            {PILLARS.map((pillar) => (
              <Link className="pillar-item" href={pillar.href} key={pillar.href}>
                <span className="pillar-icon">
                  <Icon name={pillar.icon} />
                </span>
                <span className="pillar-label">{pillar.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
