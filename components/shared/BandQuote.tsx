import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./shared.module.css";

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
      <Reveal className={styles["band-quote"]}>
        <p
          className="eyebrow center no-line tw:flex tw:justify-center tw:mb-[26px]"
        >
          {label}
        </p>
        <p>{quote}</p>
        {ctas && ctas.length > 0 && (
          <div className={`tw:flex tw:gap-[18px] tw:justify-center tw:flex-wrap ${ctas.length > 1 ? "tw:mt-[40px]" : "tw:mt-[36px]"}`}>
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
