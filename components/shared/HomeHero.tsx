import { HeroImage } from "@/components/shared/HeroImage";
import poster from "@/public/photos/home-hero-poster.jpg";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { HeroVideo } from "./HeroVideo";
import styles from "./shared.module.css";

const PILLARS: { label: string; href: string; icon: IconName }[] = [
  { label: "Resorts", href: "/resorts", icon: "resorts" },
  { label: "Residences", href: "/residences", icon: "residences" },
  { label: "Experiences", href: "/experiences", icon: "experiences" },
  { label: "Wellness", href: "/wellness", icon: "wellness" },
  { label: "Màre", href: "/mare", icon: "mare" },
];

export function HomeHero() {
  return (
    <section className={`hero ${styles["home-hero"]}`}>
      <div className={`${styles["hero-media"]} ph-1`}>
        <HeroImage
          src={poster}
          alt="Aerial view of the Tavaro resort lit up at night"
          fill
          preload
          sizes="100vw"
        />
      </div>
      <HeroVideo src="/videos/home-hero" />
      <div className={styles["hero-scrim"]} />

      <div className="hero-inner container">
        <p className={`eyebrow ${styles["hero-eyebrow"]}`}>Tavaro Group</p>
        <h1 className={styles["hero-title"]}>
          Discover
          <br />
          the world
          <br />
          <em>between worlds</em>
        </h1>

        <div className="hero-cta-row">
          <a href="#pillars" className="btn">
            Explore Tavaro <span className="btn-arrow">→</span>
          </a>
          <Link href="/resorts" className="btn solid">
            Book a Stay
          </Link>
        </div>
      </div>

      <span className={styles["scroll-cue"]}>Scroll to discover</span>

      <div className="pillar-strip">
        {/* HeroVideo portals its sound button here: always just above the strip, whatever its height */}
        <div id="hero-sound-slot" className={styles["hero-sound-slot"]} />
        <div className="container">
          <div className={styles["pillar-grid"]}>
            {PILLARS.map((pillar) => (
              <Link className={styles["pillar-item"]} href={pillar.href} key={pillar.href}>
                <span className={styles["pillar-icon"]}>
                  <Icon name={pillar.icon} />
                </span>
                <span className={styles["pillar-label"]}>{pillar.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
