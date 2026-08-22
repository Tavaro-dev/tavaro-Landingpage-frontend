import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

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
  ctas?: { label: string; href: string; solid?: boolean }[];
}) {
  const style: CSSProperties | undefined = minHeight ? { minHeight } : undefined;

  return (
    <section className="page-hero" style={style}>
      <div className={`hero-media ${placeholder}`}>
        <Image src={photoSrc} alt={photoAlt} fill priority sizes="100vw" />
      </div>
      <div className="hero-scrim" />
      <div className="page-hero-inner container">
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
        {ctas && (
          <div className="hero-cta-row">
            {ctas.map((cta) => (
              <Link key={cta.href + cta.label} href={cta.href} className={`btn${cta.solid ? " solid" : ""}`}>
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
