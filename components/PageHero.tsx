import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { PlanEventButton } from "./PlanEventButton";

export function PageHero({
  photoSrc,
  photoAlt,
  placeholder,
  minHeight,
  breadcrumbLabel,
  eyebrow,
  title,
  titleSize,
  titleMaxWidth = "16ch",
  lede,
  ctas,
  extraCta,
  quickNav,
}: {
  photoSrc: string;
  photoAlt: string;
  placeholder: string;
  minHeight?: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: ReactNode;
  titleSize: string;
  titleMaxWidth?: string;
  lede?: ReactNode;
  ctas?: { label: string; href?: string; solid?: boolean; isEventModal?: boolean }[];
  extraCta?: ReactNode;
  quickNav?: { label: string; href?: string; icon?: IconName; desc?: string }[];
}) {
  const style: CSSProperties | undefined = minHeight ? { minHeight } : undefined;

  return (
    <section className="page-hero" style={style}>
      <div className={`hero-media ${placeholder}`}>
        <Image src={photoSrc} alt={photoAlt} fill priority sizes="100vw" />
      </div>
      <div className="hero-scrim" />
      <div className="page-hero-inner container">
        <div className="page-hero-content">
          <div className="breadcrumb">
            <Link href="/">Tavaro</Link> <span>/</span> <span>{breadcrumbLabel}</span>
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="hero-title" style={{ fontSize: titleSize, maxWidth: titleMaxWidth }}>
            {title}
          </h1>
          {lede && (
            <p className="lede" style={{ marginTop: 24, maxWidth: "52ch" }}>
              {lede}
            </p>
          )}
          {(ctas || extraCta) && (
            <div className="hero-cta-row">
              {ctas?.map((cta) => {
                const labelLower = cta.label.toLowerCase();
                const isEvent =
                  cta.isEventModal ||
                  labelLower.includes("plan your event") ||
                  labelLower.includes("plan an event");
                
                if (isEvent) {
                  return (
                    <PlanEventButton
                      key={cta.label}
                      className={`btn${cta.solid ? " solid" : ""}`}
                    >
                      {cta.label}
                    </PlanEventButton>
                  );
                }
                
                return (
                  <Link key={(cta.href || "#") + cta.label} href={cta.href || "#"} className={`btn${cta.solid ? " solid" : ""}`}>
                    {cta.label}
                  </Link>
                );
              })}
              {extraCta}
            </div>
          )}
        </div>

        {quickNav && (
          <div className={`hero-quick-nav${quickNav.some((i) => i.desc) ? " with-desc" : ""}`}>
            {quickNav.map((item) => (
              <a key={item.label} href={item.href || "#"} className="hero-quick-nav-item">
                {item.icon && (
                  <span className="hero-quick-icon">
                    <Icon name={item.icon} />
                  </span>
                )}
                <span className="hero-quick-label">{item.label}</span>
                {item.desc && <span className="hero-quick-desc">{item.desc}</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
