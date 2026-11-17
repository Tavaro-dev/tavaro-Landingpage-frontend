import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

export function OfferHead({
  eyebrow,
  num,
  heading,
  lede,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  num?: string;
  heading: ReactNode;
  lede?: ReactNode;
  /** The page's main heading uses "h1". */
  as?: "h1" | "h2";
}) {
  const label = num ? <span className="offer-num">{num}</span> : <p className="eyebrow">{eyebrow}</p>;

  return (
    <Reveal className="offer-head">
      <div>
        {label}
        <Heading className="display-2 tw:mt-[18px]">
          {heading}
        </Heading>
      </div>
      {lede && <p className="lede tw:max-w-[38ch]">{lede}</p>}
    </Reveal>
  );
}
