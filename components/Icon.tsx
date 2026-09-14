import Image from "next/image";
import type { CSSProperties } from "react";

const BRAND_ICONS = {
  logo: { src: "/icons/logo-mark.png", width: 300, height: 242 },
  resorts: { src: "/icons/icon-resorts-tree.png", width: 400, height: 400 },
  residences: { src: "/icons/icon-residences-heart.png", width: 400, height: 400 },
  experiences: { src: "/icons/icon-experiences-sun.png", width: 400, height: 400 },
  wellness: { src: "/icons/icon-wellness-bird.png", width: 400, height: 400 },
  mare: { src: "/icons/icon-mare-keys.png", width: 400, height: 400 },
  sun: { src: "/icons/icon-experiences-sun.png", width: 400, height: 400 },
  leaf: { src: "/icons/icon-resorts-tree.png", width: 400, height: 400 },
  heart: { src: "/icons/icon-residences-heart.png", width: 400, height: 400 },
} as const;

const SVG_ICONS = {
  arrow: (
    <svg viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6h18M13 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 42V16l16-10 16 10v26" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 42h32" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 42V26h12v16" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="16" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="31" cy="16" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 40c0-7 5-12 11-12s11 5 11 12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 40c0-7 5-12 11-12s7 3 7 8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6a18 18 0 1 0 12 30 14 14 0 0 1-12-30Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20h22v10a11 11 0 0 1-22 0V20Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M32 22h4a5 5 0 0 1 0 10h-4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M14 8c-2 3 2 4 0 7" stroke="currentColor" strokeWidth="1" />
      <path d="M21 8c-2 3 2 4 0 7" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 44S10 29 10 19a14 14 0 0 1 28 0c0 10-14 25-14 25Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="19" r="4.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  bed: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 18v2M22 18v2M2 13h20" stroke="currentColor" strokeWidth="1.3" />
      <rect x="4" y="9" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3H3v6M15 3h6v6M15 21h6v-6M9 21H3v-6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "chevron-left": (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "chevron-right": (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4.5v15l14-7.5-14-7.5Z" fill="currentColor" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" fill="currentColor" stroke="none" />
      <path d="M12 2a10 10 0 0 0-8.58 15.15L2 22l4.95-1.3A10 10 0 1 0 12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  celebration: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4c0 7.732-6.268 14-14 14 7.732 0 14 6.268 14 14 0-7.732 6.268-14 14-14-7.732 0-14-6.268-14-14Z"
        fill="currentColor"
      />
      <path
        d="M37 6c0 3.314-2.686 6-6 6 3.314 0 6 2.686 6 6 0-3.314 2.686-6 6-6-3.314 0-6-2.686-6-6Z"
        fill="currentColor"
      />
      <path
        d="M13 32c0 2.761-2.239 5-5 5 2.761 0 5 2.239 5 5 0-2.761 2.239-5 5-5-2.761 0-5-2.239-5-5Z"
        fill="currentColor"
      />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="39" cy="35" r="1.5" fill="currentColor" />
      <circle cx="28" cy="41" r="1.2" fill="currentColor" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  photos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  facilities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 9h1" />
      <path d="M14 9h1" />
      <path d="M9 13h1" />
      <path d="M14 13h1" />
      <path d="M11 21v-4h2v4" />
    </svg>
  ),
  dining: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2v20" />
      <path d="M21 2v6a3 3 0 0 1-3 3" />
      <path d="M6 2v7a3 3 0 0 0 3 3v10" />
      <path d="M9 2v7" />
      <path d="M12 2v7a3 3 0 0 1-3 3" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
} as const;

type BrandIconName = keyof typeof BRAND_ICONS;
type SvgIconName = keyof typeof SVG_ICONS;
export type IconName = BrandIconName | SvgIconName;

export function Icon({
  name,
  className,
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  if (name in BRAND_ICONS) {
    const icon = BRAND_ICONS[name as BrandIconName];
    return <Image src={icon.src} alt="" width={icon.width} height={icon.height} className={className} style={style} />;
  }
  return <span className={className} style={style}>{SVG_ICONS[name as SvgIconName]}</span>;
}
