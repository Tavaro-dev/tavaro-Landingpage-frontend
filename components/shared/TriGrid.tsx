import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./shared.module.css";

export type TriCardData = {
  id?: string;
  icon?: IconName;
  heading: string;
  subtitle?: string;
  body?: ReactNode;
  tags?: string[];
  cta?: { label: string; href: string };
  bgImage?: string;
  isGoldenSociety?: boolean;
};

/** `list`: on phones and tablets the cards become compact rows (small icon beside the text). */
export function TriGrid({ cards, list = false }: { cards: TriCardData[]; list?: boolean }) {
  const colsClass = cards.length === 4 ? " cols-4" : "";
  return (
    <Reveal stagger className={`${styles["tri-grid"]}${colsClass}${list ? ` ${styles.list}` : ""}`}>
      {cards.map((card) => (
        <div
          className={`${styles["tri-card"]}${card.bgImage ? ` ${styles["with-bg"]}` : ""}${card.isGoldenSociety ? ` ${styles["golden-society-card"]}` : ""}`}
          id={card.id}
          key={card.heading}
        >
          {card.isGoldenSociety ? (
            <div className={styles["golden-society-card-visual"]}>
              <Image
                src="/images/experiences/golden-society.png"
                alt="The Golden Society — Weddings & Celebrations"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="tw:object-contain"
              />
            </div>
          ) : (
            <>
              {card.bgImage && (
                <div className={styles["tri-card-bg-wrap"]}>
                  <Image src={card.bgImage} alt={card.heading} fill sizes="(min-width: 768px) 25vw, 100vw" />
                  <div className={styles["tri-card-scrim"]} />
                </div>
              )}

              <div className={styles["tri-card-inner"]}>
                <div className={styles["tri-card-header"]}>
                  <h3 className={styles["tri-card-title"]}>{card.heading}</h3>
                  {card.subtitle && <p className={styles["tri-card-subtitle"]}>{card.subtitle}</p>}
                </div>

                {card.icon && (
                  <span className="tri-icon">
                    <Icon name={card.icon} />
                  </span>
                )}

                {card.body && <p className={styles["tri-card-body"]}>{card.body}</p>}

                {card.tags && (
                  <div className="tags">
                    {card.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {card.cta && (
                  <div className="tw:mt-auto tw:pt-[16px]">
                    <Link href={card.cta.href} className="text-link">
                      {card.cta.label} <Icon name="arrow" className="icon-arrow" />
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </Reveal>
  );
}
