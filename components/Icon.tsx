import Image from "next/image";

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
} as const;

type BrandIconName = keyof typeof BRAND_ICONS;
type SvgIconName = keyof typeof SVG_ICONS;
export type IconName = BrandIconName | SvgIconName;

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  if (name in BRAND_ICONS) {
    const icon = BRAND_ICONS[name as BrandIconName];
    return <Image src={icon.src} alt="" width={icon.width} height={icon.height} className={className} />;
  }
  return <span className={className}>{SVG_ICONS[name as SvgIconName]}</span>;
}
