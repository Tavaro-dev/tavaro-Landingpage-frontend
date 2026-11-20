import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./Residence.module.css";

export type MosaicItem = {
  src: string;
  alt: string;
  caption: string;
  /** lead: 4 columns x 2 rows, tall: 2 x 2, third: 2 x 1, half: 3 x 1 (on the 6-column desktop grid). */
  size: "lead" | "tall" | "third" | "half";
  position?: string;
};

/** Photo mosaic: tiles sized to the photos' own landscape shape, captions always visible. */
export function ResidenceMosaic({ items }: { items: MosaicItem[] }) {
  return (
    <Reveal stagger className={styles.mosaic}>
      {items.map((it) => (
        <figure className={`${styles.tile} ${styles[it.size]} ph-2`} key={it.src}>
          <Image
            src={it.src}
            alt={it.alt}
            fill
            sizes={it.size === "lead" ? "(min-width: 861px) 60vw, 100vw" : "(min-width: 861px) 30vw, 50vw"}
            style={it.position ? { objectPosition: it.position } : undefined}
          />
          <figcaption>
            <span className={styles.diamond} aria-hidden="true" />
            {it.caption}
          </figcaption>
        </figure>
      ))}
    </Reveal>
  );
}
