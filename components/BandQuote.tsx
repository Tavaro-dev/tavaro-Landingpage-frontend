import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function BandQuote({
  label,
  quote,
  ctas,
}: {
  label: string;
  quote: ReactNode;
  ctas?: { label: string; href: string; solid?: boolean }[];
}) {
  return (
    <div className="container">
      <Reveal className="band-quote">
        <p
          className="eyebrow center no-line"
          style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}
        >
          {label}
        </p>
        <p>{quote}</p>
        {ctas && ctas.length > 0 && (
          <div
            style={{
              marginTop: ctas.length > 1 ? 40 : 36,
              display: "flex",
              gap: 18,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {ctas.map((cta) => (
              <Link key={cta.href + cta.label} href={cta.href} className={`btn${cta.solid ? " solid" : ""}`}>
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
