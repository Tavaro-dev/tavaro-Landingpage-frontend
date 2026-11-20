"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/features/residences/components/CountUp";
import { VENUES } from "../../content/venues";
import styles from "./ResortSpaces.module.css";

const fmt = (n: number) => n.toLocaleString("en-IN");
/** Guest counts to check against; a space fits when its standing capacity covers the count. */
const GUESTS = [50, 150, 350, 600, 2500];

/** The resort in five numbers, read before the spaces themselves. */
const GLANCE = [
  { value: "16", label: "acres in Kokapet" },
  { value: "6", label: "spaces for celebrations" },
  { value: "4,000", label: "guests on the largest lawn" },
  { value: "13", label: "rooms for the couple and family" },
  { value: "1,500", label: "cars parked on site" },
];

export function ResortSpaces() {
  const [guests, setGuests] = useState<number | null>(null);
  const fitting = guests === null ? VENUES.length : VENUES.filter((v) => v.floating >= guests).length;

  return (
    <section className={styles.spaces} id="spaces" aria-labelledby="spaces-title">
      <div className="container">
        <dl className={styles.glance}>
          {GLANCE.map((g) => (
            <div key={g.label}>
              <dt>{g.label}</dt>
              <dd>
                <CountUp value={g.value} />
              </dd>
            </div>
          ))}
        </dl>

        <header className={styles.head}>
          <h2 id="spaces-title" className={styles.title}>
            Every celebration can have a space of its own
          </h2>
          <p className={styles.lede}>
            Most celebrations use several: haldi by the pool, sangeet on the Sanctuary Lawn, the wedding on
            Tavaro Lawn. Choose your guest count to see which spaces fit.
          </p>
        </header>

        <div className={styles.filter}>
          <span id="guests-label" className={styles.ask}>
            How many guests?
          </span>
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
              ? `All ${VENUES.length} spaces`
              : `${fitting} ${fitting === 1 ? "space fits" : "spaces fit"} ${fmt(guests)} guests`}
          </p>
        </div>

        <ul className={styles.grid}>
          {VENUES.map((v, i) => {
            const fits = guests === null || v.floating >= guests;
            return (
              <li key={v.id} className={styles.card} data-fits={fits}>
                <div className={styles.photo}>
                  <Image
                    src={v.photo}
                    alt={v.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1025px) 30vw, (min-width: 641px) 46vw, 100vw"
                  />
                  <span className={styles.no} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {guests !== null && fits && <span className={styles.fit}>Fits {fmt(guests)}</span>}
                  <div className={styles.over}>
                    <p className={styles.kind}>{v.kind}</p>
                    <h3 className={styles.name}>{v.name}</h3>
                  </div>
                </div>
                <dl className={styles.cap}>
                  <div>
                    <dt>Seated</dt>
                    <dd>{fmt(v.seated)}</dd>
                  </div>
                  <div>
                    <dt>Standing</dt>
                    <dd>{fmt(v.floating)}</dd>
                  </div>
                  <div>
                    <dt>{v.sqft ? "Area, sq ft" : "Area"}</dt>
                    <dd>{v.sqft ? fmt(v.sqft) : "Villa"}</dd>
                  </div>
                </dl>
                <p className={styles.best}>
                  <span>Best for</span>
                  {v.bestFor}
                </p>
              </li>
            );
          })}
        </ul>

        <p className={styles.note}>
          Standing means a cocktail format. Capacities depend on the set-up.{" "}
          <Link href="/resorts/photos" className={styles.more}>
            See celebrations in the gallery
          </Link>
        </p>
      </div>
    </section>
  );
}
