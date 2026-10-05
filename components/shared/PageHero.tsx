"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PlanEventButton } from "@/features/experiences/components/PlanEventButton";
import { OffsiteEditButton } from "@/features/experiences/components/OffsiteEditButton";
import { UnderTheSkyButton } from "@/features/experiences/components/UnderTheSkyButton";

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
  topRightCta,
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
  ctas?: { label: string; href?: string; solid?: boolean; isEventModal?: boolean; isOffsiteModal?: boolean; isUnderTheSkyModal?: boolean }[];
  extraCta?: ReactNode;
  topRightCta?: ReactNode;
  quickNav?: { label: string; href?: string; icon?: IconName; desc?: string; isOffsiteModal?: boolean; isUnderTheSkyModal?: boolean }[];
}) {
  const style: CSSProperties | undefined = minHeight ? { minHeight } : undefined;

  return (
    <section className="page-hero" style={style}>
      <div className={`hero-media ${placeholder}`}>
        <Image src={photoSrc} alt={photoAlt} fill priority sizes="100vw" />
      </div>
      <div className="hero-scrim" />
      <div className="page-hero-inner container">
        <div className="page-hero-top-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", zIndex: 10, marginBottom: 20 }}>
          <div className="breadcrumb" style={{ margin: 0 }}>
            <span>{breadcrumbLabel}</span>
          </div>
          {topRightCta && <div className="hero-top-right">{topRightCta}</div>}
        </div>

        <div className="page-hero-content" style={{ width: "100%" }}>
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

                const isOffsite =
                  cta.isOffsiteModal ||
                  labelLower.includes("offsite edit");

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

                if (isOffsite) {
                  return (
                    <OffsiteEditButton
                      key={cta.label}
                      className={`btn${cta.solid ? " solid" : ""}`}
                    >
                      {cta.label}
                    </OffsiteEditButton>
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
          {quickNav && (
            <div
              className={`hero-quick-nav${quickNav.some((i) => i.desc) ? " with-desc" : ""}`}
              style={{
                gridTemplateColumns: `repeat(${quickNav.length}, 1fr)`,
                maxWidth: "820px",
                width: "100%",
                marginTop: 32,
              }}
            >
              {quickNav.map((item) => {
                const labelLower = item.label.toLowerCase();
                const isOffsite =
                  item.isOffsiteModal ||
                  item.href === "#offsite-edit" ||
                  labelLower.includes("offsite edit");

                const isUnderTheSky =
                  item.isUnderTheSkyModal ||
                  labelLower.includes("under the sky");

                if (isOffsite) {
                  return (
                    <OffsiteEditButton key={item.label} className="hero-quick-nav-item">
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className="hero-quick-desc">{item.desc}</span>}
                    </OffsiteEditButton>
                  );
                }

                if (isUnderTheSky) {
                  return (
                    <UnderTheSkyButton key={item.label} className="hero-quick-nav-item">
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className="hero-quick-desc">{item.desc}</span>}
                    </UnderTheSkyButton>
                  );
                }

                return (
                  <a key={item.label} href={item.href || "#"} className="hero-quick-nav-item">
                    {item.icon && (
                      <span className="hero-quick-icon">
                        <Icon name={item.icon} />
                      </span>
                    )}
                    <span className="hero-quick-label">{item.label}</span>
                    {item.desc && <span className="hero-quick-desc">{item.desc}</span>}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

