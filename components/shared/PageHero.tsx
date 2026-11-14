"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PlanEventButton } from "@/features/experiences/components/PlanEventButton";
import { OffsiteEditButton } from "@/features/experiences/components/OffsiteEditButton";
import { UnderTheSkyButton } from "@/features/experiences/components/UnderTheSkyButton";
import { ThingsToDoButton } from "@/features/resorts/components/things-to-do/ThingsToDoButton";
import styles from "./shared.module.css";

export function PageHero({
  photoSrc,
  photoAlt,
  photoPosition,
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
  /** CSS object-position for the photo, e.g. "68% center" to keep a subject in a narrow (phone) crop. */
  photoPosition?: string;
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
  quickNav?: { label: string; href?: string; icon?: IconName; desc?: string; isOffsiteModal?: boolean; isUnderTheSkyModal?: boolean; isThingsToDoModal?: boolean }[];
}) {
  const style: CSSProperties | undefined = minHeight ? { minHeight } : undefined;

  return (
    <section className="page-hero" style={style}>
      <div className={`${styles["hero-media"]} ${placeholder}`}>
        <Image src={photoSrc} alt={photoAlt} fill preload sizes="100vw" quality={90} style={photoPosition ? { objectPosition: photoPosition } : undefined} />
      </div>
      <div className={styles["hero-scrim"]} />
      <div className="page-hero-inner container">
        <div className="page-hero-top-row tw:flex tw:items-center tw:justify-between tw:w-full tw:z-[10] tw:mb-[20px]">
          <div className={`${styles.breadcrumb} tw:m-[0]`}>
            <span>{breadcrumbLabel}</span>
          </div>
          {topRightCta && <div className={styles["hero-top-right"]}>{topRightCta}</div>}
        </div>

        <div className={`${styles["page-hero-content"]} tw:w-full`}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles["hero-title"]} style={{ fontSize: titleSize, maxWidth: titleMaxWidth }}>
            {title}
          </h1>
          {lede && (
            <p className="lede tw:mt-[24px] tw:max-w-[52ch]">
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
              className={`${styles["hero-quick-nav"]}${quickNav.some((i) => i.desc) ? ` ${styles["with-desc"]}` : ""}`}
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

                const isThingsToDo =
                  item.isThingsToDoModal ||
                  item.href === "#things-to-do" ||
                  labelLower.includes("things to do");

                if (isOffsite) {
                  return (
                    <OffsiteEditButton key={item.label} className={styles["hero-quick-nav-item"]}>
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className={styles["hero-quick-desc"]}>{item.desc}</span>}
                    </OffsiteEditButton>
                  );
                }

                if (isUnderTheSky) {
                  return (
                    <UnderTheSkyButton key={item.label} className={styles["hero-quick-nav-item"]}>
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className={styles["hero-quick-desc"]}>{item.desc}</span>}
                    </UnderTheSkyButton>
                  );
                }

                if (isThingsToDo) {
                  return (
                    <ThingsToDoButton key={item.label} className={styles["hero-quick-nav-item"]}>
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className={styles["hero-quick-desc"]}>{item.desc}</span>}
                    </ThingsToDoButton>
                  );
                }

                if (item.href?.startsWith("#")) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={styles["hero-quick-nav-item"]}
                      onClick={(e) => {
                        e.preventDefault();
                        const id = item.href!.slice(1);
                        const element = document.getElementById(id);
                        if (element) {
                          const header = document.getElementById("site-header");
                          const headerH = header ? header.offsetHeight : 72;
                          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                          const offsetPosition = elementPosition - headerH;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                          window.history.pushState(null, "", item.href!);
                        }
                      }}
                    >
                      {item.icon && (
                        <span className="hero-quick-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}
                      <span className="hero-quick-label">{item.label}</span>
                      {item.desc && <span className={styles["hero-quick-desc"]}>{item.desc}</span>}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    className={styles["hero-quick-nav-item"]}
                  >
                    {item.icon && (
                      <span className="hero-quick-icon">
                        <Icon name={item.icon} />
                      </span>
                    )}
                    <span className="hero-quick-label">{item.label}</span>
                    {item.desc && <span className={styles["hero-quick-desc"]}>{item.desc}</span>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

