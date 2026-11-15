"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { CONTACT } from "@/lib/env";
import lawnPhoto from "@/public/images/resorts/venues/tavaro-lawn.jpg";
import { DRIVE_TIMES, RESORT_PLACE, directionsUrl } from "../../content/resortLocation";
import styles from "./ResortLocation.module.css";

const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESORT_PLACE)}`;

/*
 * Three drives into Tavaro, drawn as roads with turns. Each road's length is its drive time,
 * and the three points travel at one speed, so they arrive in the order a guest would.
 * Not a scale map: only the times are true.
 */
type Label = "above" | "below" | "left" | "right";
/** A road leg: heading in degrees (0 = right, 90 = down) and its share of the road. */
type Leg = [number, number];
type Geo = {
  view: string;
  /** Where the pin's tip stands. */
  tavaro: { x: number; y: number };
  /** The last stretch every drive shares into Tavaro. */
  lastMile: Leg;
  /** Each drive's legs before the last stretch, in travel order, and where its name goes. */
  from: Record<string, { legs: Leg[]; label: Label }>;
  /** Drawn units per minute of driving. */
  perMinute: number;
  /** Stacked layouts: a short stem from the pin down into the panel. */
  stem?: boolean;
  /** Faint side roads, so the map carries on past the drives. */
  roads?: string[];
};

/** Wide screens: drives come in from the left; the arrival panel takes the right. */
const WIDE: Geo = {
  view: "0 170 1600 560",
  tavaro: { x: 940, y: 450 },
  lastMile: [0, 100],
  from: {
    gachibowli: { legs: [[0, 0.35], [90, 0.65]], label: "above" },
    "jubilee-hills": { legs: [[0, 0.3], [35, 0.35], [0, 0.2], [30, 0.15]], label: "above" },
    rgi: { legs: [[0, 0.25], [-40, 0.3], [0, 0.25], [-20, 0.2]], label: "below" },
  },
  perMinute: 22,
};
/** Tablets and phones: Tavaro at the foot of the drawing, its panel opening straight out of the pin. */
const STACK: Geo = {
  view: "20 50 740 560",
  tavaro: { x: 560, y: 500 },
  lastMile: [0, 120],
  from: {
    gachibowli: { legs: [[0, 0.25], [90, 0.75]], label: "above" },
    "jubilee-hills": { legs: [[90, 0.45], [0, 0.2], [45, 0.35]], label: "above" },
    rgi: { legs: [[90, 0.4], [0, 0.6]], label: "above" },
  },
  perMinute: 20,
  stem: true,
};
/**
 * Phones: a tall map that scrolls down with the drives (see .window in the CSS)
 * and settles on Tavaro, with more road below it.
 */
const PHONE: Geo = {
  view: "-60 -100 620 1450",
  tavaro: { x: 400, y: 1100 },
  lastMile: [0, 100],
  from: {
    gachibowli: { legs: [[180, 0.2], [90, 0.8]], label: "above" },
    "jubilee-hills": { legs: [[90, 0.4], [0, 0.0515], [90, 0.4285], [45, 0.12]], label: "right" },
    rgi: { legs: [[90, 0.45], [45, 0.04], [90, 0.315], [0, 0.195]], label: "above" },
  },
  perMinute: 40,
  stem: true,
  roads: ["M400 1100H560", "M46 1100V1350", "M-60 1260H560", "M520 380V1260", "M150 95V-100"],
};

const SHORT: Record<string, string> = { gachibowli: "Gachibowli", "jubilee-hills": "Jubilee Hills", rgi: "Airport" };

/** Seconds of animation per minute of driving: the same speed for every drive. */
const PACE = 0.1;
const START = 0.6;
const ARRIVE = START + Math.max(...DRIVE_TIMES.map((d) => d.minutes)) * PACE;

const t = (s: number) => `${s.toFixed(2)}s`;
const r1 = (n: number) => Math.round(n * 10) / 10;

const TURN = 26;
const unit = (deg: number) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];

/**
 * A drive as a road: straight legs joined by rounded turns, ending at Tavaro.
 * Its total length is the drive time, so equal speed means honest arrival order.
 * Also returns the start, and the halfway point of the drive's own legs (for its time chip).
 */
function drive(geo: Geo, id: string, minutes: number) {
  const own = minutes * geo.perMinute - geo.lastMile[1];
  const legs = [...geo.from[id].legs.map(([a, f]) => [a, f * own]), geo.lastMile];
  // Walk back from Tavaro to find the start, then lay the corners forward.
  let [x, y] = [geo.tavaro.x, geo.tavaro.y];
  for (const [a, l] of legs) {
    const [ux, uy] = unit(a);
    x -= ux * l;
    y -= uy * l;
  }
  const pts = [[x, y]];
  for (const [a, l] of legs) {
    const [ux, uy] = unit(a);
    const [px, py] = pts[pts.length - 1];
    pts.push([px + ux * l, py + uy * l]);
  }
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = unit(legs[i - 1][0]);
    const [bx, by] = unit(legs[i][0]);
    const r = Math.min(TURN, legs[i - 1][1] / 2, legs[i][1] / 2);
    const [cx, cy] = pts[i];
    d += `L${r1(cx - ax * r)} ${r1(cy - ay * r)}Q${r1(cx)} ${r1(cy)} ${r1(cx + bx * r)} ${r1(cy + by * r)}`;
  }
  d += `L${r1(geo.tavaro.x)} ${r1(geo.tavaro.y)}`;
  // Halfway along the drive's own legs.
  let left = own / 2;
  let mid = pts[0];
  for (let i = 0; i < legs.length - 1; i++) {
    const l = legs[i][1];
    if (left <= l) {
      const [ux, uy] = unit(legs[i][0]);
      mid = [pts[i][0] + ux * left, pts[i][1] + uy * left];
      break;
    }
    left -= l;
  }
  return { from: pts[0], d, mid };
}

/** Where a label sits around its point. */
function place(label: Label, x: number, y: number, gap = 34) {
  switch (label) {
    case "above":
      return { x, y: y - gap - 30, anchor: "middle" as const };
    case "below":
      return { x, y: y + gap + 30, anchor: "middle" as const };
    case "left":
      return { x: x - gap, y: y - 4, anchor: "end" as const };
    case "right":
      return { x: x + gap, y: y - 4, anchor: "start" as const };
  }
}

export function ResortLocation() {
  const [run, setRun] = useState(0);
  const [play, setPlay] = useState(false);
  const [geo, setGeo] = useState<Geo>(WIDE);
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const stacked = window.matchMedia("(max-width: 1024px)");
    const phone = window.matchMedia("(max-width: 600px)");
    const sync = () => setGeo(phone.matches ? PHONE : stacked.matches ? STACK : WIDE);
    sync();
    stacked.addEventListener("change", sync);
    phone.addEventListener("change", sync);
    return () => {
      stacked.removeEventListener("change", sync);
      phone.removeEventListener("change", sync);
    };
  }, []);

  // The drives play once they are on screen.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    svg.current?.pauseAnimations();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPlay(true);
        // Restart the travelling points' clock so they move in step with the lines.
        svg.current?.setCurrentTime(0);
        svg.current?.unpauseAnimations();
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  const T = geo.tavaro;
  const head = T.y - 62;
  const [vx, vy, vw, vh] = geo.view.split(" ").map(Number);
  // Where the pin stands across the drawing, so the panel's pointer lines up under it.
  const tip = `${(((T.x - vx) / vw) * 100).toFixed(2)}%`;

  return (
    <>
      <section className={styles.stage} aria-labelledby="loc-title">
        <div
          ref={stage}
          className={styles.scene}
          data-play={play || undefined}
          key={run}
          style={{ "--tip": tip } as CSSProperties}
        >
          {/* On phones this window scrolls the tall map down with the drives */}
          <div
            className={styles.window}
            style={
              {
                "--pan-delay": t(START),
                "--pan-dur": t(ARRIVE - START),
              } as CSSProperties
            }
          >
            <svg ref={svg} viewBox={geo.view} className={styles.map} role="img" aria-labelledby="loc-map-desc">
              <desc id="loc-map-desc">
                Three drives to Tavaro Resorts in Kokapet, drawn to the same scale of time: 15 minutes from Gachibowli,
                30 minutes from Jubilee Hills Checkpost and 35 minutes from Rajiv Gandhi International Airport. Select a
                starting point for directions from there.
              </desc>

              {geo.roads?.map((d) => (
                <path key={d} d={d} className={styles.road} />
              ))}

              {DRIVE_TIMES.map((d) => {
                const r = drive(geo, d.id, d.minutes);
                const [x, y] = r.from;
                const label = place(geo.from[d.id].label, x, y);
                const arrive = START + d.minutes * PACE;
                const vars = {
                  "--delay": t(START),
                  "--dur": t(d.minutes * PACE),
                  "--at": t(arrive),
                } as CSSProperties;
                return (
                  <g key={`${geo.view}-${d.id}`} className={styles.drive} style={vars}>
                    <path d={r.d} className={styles.ghost} />
                    <path d={r.d} pathLength={1} className={styles.under} />
                    <path d={r.d} pathLength={1} className={styles.line} />

                    {/* The start: dot and name show from the outset, and open directions from there */}
                    <a
                      href={directionsUrl(d.origin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Directions from ${d.name}`}
                      className={styles.start}
                    >
                      <circle cx={x} cy={y} r="18" className={styles.burst} />
                      <circle cx={x} cy={y} r="14" className={styles.dot} />
                      <text x={label.x} y={label.y} textAnchor={label.anchor} className={styles.tagName}>
                        {SHORT[d.id]}
                      </text>
                    </a>

                    {/* The drive time, on its own line, once that point arrives */}
                    <g className={styles.chip}>
                      <rect x={r.mid[0] - 62} y={r.mid[1] - 24} width="124" height="48" rx="24" />
                      <text x={r.mid[0]} y={r.mid[1]}>
                        {d.minutes} min
                      </text>
                    </g>

                    {/* A point travelling this drive at the shared pace */}
                    <circle r="11" className={styles.car} opacity="0">
                      <set attributeName="opacity" to="1" begin={t(START)} />
                      <animateMotion path={r.d} begin={t(START)} dur={t(d.minutes * PACE)} fill="freeze" />
                      <set attributeName="opacity" to="0" begin={t(arrive)} />
                    </circle>
                  </g>
                );
              })}

              {/* Tavaro drops in as a map pin once every drive is in, and keeps a slow heartbeat */}
              <a
                href={mapsSearch}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tavaro Resorts on Google Maps"
                className={styles.home}
                style={{ "--arrive": t(ARRIVE) } as CSSProperties}
              >
                {geo.stem && <line x1={T.x} y1={T.y + 84} x2={T.x} y2={vy + vh} className={styles.stem} />}
                <ellipse cx={T.x} cy={T.y} rx="54" ry="16" className={styles.glow} />
                <ellipse cx={T.x} cy={T.y} rx="30" ry="10" className={styles.ripple} />
                <ellipse cx={T.x} cy={T.y} rx="30" ry="10" className={`${styles.ripple} ${styles.ripple2}`} />
                <path
                  d={`M${T.x} ${T.y}C${T.x - 12} ${T.y - 20} ${T.x - 42} ${head + 26} ${T.x - 42} ${head}A42 42 0 1 1 ${T.x + 42} ${head}C${T.x + 42} ${head + 26} ${T.x + 12} ${T.y - 20} ${T.x} ${T.y}Z`}
                  className={styles.pin}
                />
                <circle cx={T.x} cy={head} r="31" className={styles.pinFace} />
                <image href="/icons/logo-mark.png" x={T.x - 23} y={head - 19} width="46" height="37" />
                <text x={T.x} y={T.y + 70} textAnchor="middle" className={styles.homeName}>
                  Tavaro Resort
                </text>
              </a>
            </svg>
          </div>

          {/* What you need once you're here, in one place */}
          <article className={styles.panel} style={{ "--arrive": t(ARRIVE + 0.2) } as CSSProperties}>
            <a className={styles.panelPhoto} href={mapsSearch} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
              <Image
                src={lawnPhoto}
                alt="Tavaro Resorts at night from above, lit for a wedding"
                fill
                placeholder="blur"
                sizes="(min-width: 1025px) 400px, (min-width: 601px) 45vw, 100vw"
              />
            </a>
            <div className={styles.panelBody}>
              <p className={styles.arrived}>You&apos;ve arrived</p>
              <h1 id="loc-title" className={styles.name}>
                Tavaro Resorts
              </h1>
              <p className={styles.where}>Kokapet, Hyderabad</p>

              <ul className={styles.drives} aria-label="Drive times to Tavaro">
                {DRIVE_TIMES.map((d) => (
                  <li key={d.id}>
                    <a href={directionsUrl(d.origin)} target="_blank" rel="noopener noreferrer">
                      <span className={styles.min}>
                        {d.minutes}
                        <small>min</small>
                      </span>
                      <span className={styles.from}>from {d.name}</span>
                      <span className={styles.go}>Directions</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <a className="btn solid" href={mapsSearch} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
                <a className="btn" href={CONTACT.phoneHref}>
                  Call us
                </a>
              </div>
            </div>
          </article>

          <button
            type="button"
            className={styles.replay}
            style={{ "--arrive": t(ARRIVE) } as CSSProperties}
            onClick={() => {
              setPlay(false);
              setRun((n) => n + 1);
            }}
          >
            Replay the drives
          </button>
        </div>
      </section>

      <section className={styles.find} aria-labelledby="find-title">
        <div className={`container ${styles.findGrid}`}>
          <h2 id="find-title" className={styles.h2}>
            Lost on the way? We&apos;ll talk you in.
          </h2>
          <address className={styles.address}>
            Tavaro Resorts
            <br />
            Kokapet, Hyderabad
            <br />
            Telangana, India
          </address>
          <ul className={styles.contact}>
            <li>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </li>
            <li>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
