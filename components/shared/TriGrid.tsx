import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/shared/Reveal";

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

export function TriGrid({ cards }: { cards: TriCardData[] }) {
  const colsClass = cards.length === 4 ? " cols-4" : "";
  return (
    <Reveal stagger className={`tri-grid${colsClass}`}>
      {cards.map((card) => (
        <div
          className={`tri-card${card.bgImage ? " with-bg" : ""}${card.isGoldenSociety ? " golden-society-card" : ""}`}
          id={card.id}
          key={card.heading}
        >
          {card.bgImage && (
            <div className="tri-card-bg-wrap">
              <Image src={card.bgImage} alt={card.heading} fill sizes="(min-width: 768px) 25vw, 100vw" />
              <div className="tri-card-scrim" />
            </div>
          )}

          <div className="tri-card-inner">
            <div className="tri-card-header">
              <h3 className="tri-card-title">{card.heading}</h3>
              {card.subtitle && <p className="tri-card-subtitle">{card.subtitle}</p>}
            </div>

            {card.icon && (
              <span className="tri-icon">
                <Icon name={card.icon} />
              </span>
            )}

            {card.body && <p className="tri-card-body">{card.body}</p>}

            {card.tags && (
              <div className="tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {card.cta && (
              <div style={{ marginTop: "auto", paddingTop: 16 }}>
                <Link href={card.cta.href} className="text-link">
                  {card.cta.label} <Icon name="arrow" className="icon-arrow" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </Reveal>
  );
}
