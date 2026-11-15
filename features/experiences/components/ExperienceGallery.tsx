import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./experiences.module.css";

/**
 * wide: spans two columns at every width. widePlus: spans two on desktop and phone, one on tablet,
 * which keeps every breakpoint's rows flush (5 x 2 desktop, 3 x 3 tablet, 2-up phone).
 */
type Photo = { src: string; alt: string; caption: string; span?: "wide" | "widePlus"; position?: string };

const DIR = "/images/experiences/gallery";

// The client's selected photographs. Portraits sit in 4:5 cells; the two landscapes span two.
const PHOTOS: Photo[] = [
  { src: `${DIR}/poolside-banquet.jpg`, span: "wide", caption: "Poolside banquet", alt: "An aerial view of a long banquet table set on the pool deck" },
  { src: `${DIR}/bamboo-garden-dinner.jpg`, caption: "Garden dinner", alt: "A low candlelit dinner table under a bamboo frame strung with lights" },
  { src: `${DIR}/sound-bath.jpg`, caption: "Sound bath", alt: "Guests lying on mats during a sound bath in the open-sided hall" },
  { src: `${DIR}/under-the-sky-dinner.jpg`, caption: "Under the Sky", alt: "A long dinner table under festoon lights and a spreading tree at night" },
  { src: `${DIR}/poolside-brunch.jpg`, caption: "Poolside brunch", alt: "A brunch spread on a table by the pool, with Màre Coffee House behind" },
  { src: `${DIR}/lawn-meditation.jpg`, caption: "Stillness", alt: "A guest meditating on the lawn in front of the heritage villa", position: "30% center" },
  { src: `${DIR}/lawn-picnic.jpg`, span: "widePlus", caption: "Lawn picnic", alt: "A picnic table on the lawn with bright flowers, candles and a speaker" },
  { src: `${DIR}/pool-deck-dinner-for-two.jpg`, caption: "Dinner for two", alt: "A private table for two on the lit pool deck at dusk, framed by palms" },
];

/** A flush photo wall of past experiences, captioned, with a slow zoom on hover. */
export function ExperienceGallery() {
  return (
    <Reveal stagger className={styles.wall}>
      {PHOTOS.map((p) => (
        <figure className={`${styles.shot} ${p.span ? styles[p.span] : ""}`} key={p.src}>
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes={p.span ? "(min-width: 1081px) 40vw, (min-width: 601px) 33vw, 100vw" : "(min-width: 1081px) 20vw, (min-width: 601px) 33vw, 50vw"}
            style={p.position ? { objectPosition: p.position } : undefined}
          />
          <figcaption>
            <span className={styles.diamond} aria-hidden="true" />
            {p.caption}
          </figcaption>
        </figure>
      ))}
    </Reveal>
  );
}
