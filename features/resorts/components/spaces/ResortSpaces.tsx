"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SPACES_SHEET, VENUES } from "../../content/venues";
import styles from "./ResortSpaces.module.css";

const fmt = (n: number) => n.toLocaleString("en-IN");
/** Guest counts to check against; a space fits when its standing capacity covers the count. */
const GUESTS = [50, 150, 350, 600, 2500];

export function ResortSpaces() {
  const [guests, setGuests] = useState<number | null>(null);
  const fitting = guests === null ? VENUES.length : VENUES.filter((v) => v.floating >= guests).length;

  return (
    <section className={styles.spaces} id="spaces" aria-labelledby="spaces-title">
      <div className="container">
        <header className={styles.head}>
          <h2 id="spaces-title" className={styles.title}>
            Every function can have a space of its own
          </h2>
          <p className={styles.lede}>
            Six spaces across the resort, from a lawn for 4,000 to a heritage villa for fifty. Most
            celebrations use several: haldi by the pool, sangeet on the Sanctuary Lawn, the wedding on Tavaro
            Lawn.
          </p>
        </header>

        <div className={styles.filter}>
          <span id="guests-label">How many guests?</span>
          <div className={styles.chips} role="group" aria-labelledby="guests-label">
            <button type="button" aria-pressed={guests === null} onClick={() => setGuests(null)}>
              Any
            </button>
            {GUESTS.map((g, i) => (
              <button key={g} type="button" aria-pressed={guests === g} onClick={() => setGuests(g)}>
                {i === GUESTS.length - 1 ? `${fmt(g)}+` : `Up to ${fmt(g)}`}
              </button>
            ))}
          </div>
          <p className={styles.count} aria-live="polite">
            {guests === null
              ? `${VENUES.length} spaces`
              : `${fitting} ${fitting === 1 ? "space fits" : "spaces fit"} ${fmt(guests)} guests`}
          </p>
        </div>

        <ul className={styles.grid}>
          {VENUES.map((v) => {
            const fits = guests === null || v.floating >= guests;
            return (
              <li key={v.id} className={styles.card} data-fits={fits}>
                <div className={styles.photo}>
                  <Image
                    src={v.photo}
                    alt={v.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1025px) 30vw, (min-width: 601px) 46vw, 84vw"
                  />
                </div>
                <div className={styles.body}>
                  <p className={styles.kind}>{v.kind}</p>
                  <h3 className={styles.name}>{v.name}</h3>
                  <dl className={styles.cap}>
                    <div>
                      <dt>Seated</dt>
                      <dd>{fmt(v.seated)}</dd>
                    </div>
                    <div>
                      <dt>Standing</dt>
                      <dd>{fmt(v.floating)}</dd>
                    </div>
                    {v.sqft && (
                      <div>
                        <dt>Sq ft</dt>
                        <dd>{fmt(v.sqft)}</dd>
                      </div>
                    )}
                  </dl>
                  <p className={styles.best}>{v.bestFor}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className={styles.note}>
          Standing means a cocktail format. Capacities depend on the set-up. Also at the resort: 13 rooms for
          the couple and family, and Màre Coffee House &amp; Gallery.{" "}
          <Link href="/resorts/photos" className={styles.more}>
            See celebrations in the gallery
          </Link>
        </p>
        <a className={`btn ${styles.download}`} href={SPACES_SHEET.href} download>
          Download the spaces sheet (PDF, {SPACES_SHEET.size})
        </a>
      </div>
    </section>
  );
}
