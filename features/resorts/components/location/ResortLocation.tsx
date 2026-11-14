import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { CONTACT } from "@/lib/env";
import { DRIVE_TIMES, RESORT_PLACE, directionsUrl } from "../../content/resortLocation";
import styles from "./ResortLocation.module.css";

/** The drive-time scale runs from the gate to this many minutes. */
const SCALE_MINUTES = 40;
const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESORT_PLACE)}`;

export function ResortLocation() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          src="/gallery/weddings/fbfcf89524.webp"
          alt="The Tavaro lawn at night from above, with Hyderabad's skyline behind it"
          fill
          preload
          sizes="100vw"
          className={styles["hero-img"]}
        />
        <div className={`container ${styles["hero-body"]}`}>
          <p className={styles.where}>Kokapet, Hyderabad</p>
          <h1 className={styles.title}>Getting to Tavaro</h1>
          <p className={styles.lede}>
            On the western edge of the city: fifteen minutes from Gachibowli, thirty-five from the
            airport.
          </p>
          <div className={styles.actions}>
            <a className="btn solid" href={directionsUrl()} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
            <a className="btn" href={CONTACT.phoneHref}>
              Call {CONTACT.phone}
            </a>
          </div>
        </div>
      </section>

      <section className={styles.drive} aria-labelledby="drive-title">
        <div className="container">
          <div className={styles["drive-head"]}>
            <h2 id="drive-title" className={styles.h2}>
              How far we are
            </h2>
            <p className={styles.note}>Typical drive times by car. Tap a place for directions from there.</p>
          </div>

          <Reveal className={styles.route}>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.line} />
            </div>
            <div className={styles.origin}>
              <span className={styles.pin} aria-hidden="true" />
              <span className={styles["origin-label"]}>Tavaro Resorts</span>
            </div>
            <ol className={styles.stops}>
              {DRIVE_TIMES.map((d) => (
                <li
                  key={d.id}
                  className={styles.stop}
                  style={{ "--at": `${(d.minutes / SCALE_MINUTES) * 100}%`, "--d": `${(d.minutes / SCALE_MINUTES) * 1.4}s` } as CSSProperties}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <a href={directionsUrl(d.origin)} target="_blank" rel="noopener noreferrer" className={styles.card}>
                    <span className={styles.minutes}>
                      {d.minutes}
                      <small> min</small>
                    </span>
                    <span className={styles.place}>{d.name}</span>
                    <span className={styles.link}>Directions from here</span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className={styles["map-section"]} aria-labelledby="map-title">
        <div className={`container ${styles["map-wrap"]}`}>
          <div className={styles.map}>
            <iframe
              title="Map showing Tavaro Resorts in Kokapet"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(RESORT_PLACE)}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className={styles.panel}>
            <h2 id="map-title" className={styles.h2}>
              Find us
            </h2>
            <address className={styles.address}>
              Tavaro Resorts
              <br />
              Kokapet, Hyderabad
              <br />
              Telangana, India
            </address>
            <a className="btn solid" href={mapsSearch} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
            <div className={styles.help}>
              <p>Lost on the way? We&apos;ll talk you in.</p>
              <ul>
                <li>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
