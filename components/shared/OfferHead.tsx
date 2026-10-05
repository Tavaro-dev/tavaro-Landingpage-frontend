import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

export function OfferHead({
  eyebrow,
  num,
  heading,
  lede,
}: {
  eyebrow?: string;
  num?: string;
  heading: ReactNode;
  lede?: ReactNode;
}) {
  const label = num ? <span className="offer-num">{num}</span> : <p className="eyebrow">{eyebrow}</p>;

  return (
    <Reveal className="offer-head">
      <div>
        {label}
        <h2 className="display-2" style={{ marginTop: 18 }}>
          {heading}
        </h2>
      </div>
      {lede && <p className="lede" style={{ maxWidth: "38ch" }}>{lede}</p>}
    </Reveal>
  );
}
