import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";

export type TriCardData = {
  id?: string;
  icon: IconName;
  heading: string;
  body: ReactNode;
  tags?: string[];
  cta?: { label: string; href: string };
};

export function TriGrid({ cards }: { cards: TriCardData[] }) {
  return (
    <Reveal stagger className="tri-grid">
      {cards.map((card) => (
        <div className="tri-card" id={card.id} key={card.heading}>
          <span className="tri-icon">
            <Icon name={card.icon} />
          </span>
          <h4>{card.heading}</h4>
          <p>{card.body}</p>
          {card.tags && (
            <div className="tags">
              {card.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          {card.cta && (
            <Link href={card.cta.href} className="text-link">
              {card.cta.label}{" "}
              <Icon name="arrow" className="icon-arrow" />
            </Link>
          )}
        </div>
      ))}
    </Reveal>
  );
}
