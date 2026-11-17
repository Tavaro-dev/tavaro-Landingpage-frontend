"use client";

import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { FACILITIES, VENUES } from "../../content/venues";
import styles from "./ResortGrounds.module.css";

const fmt = (n: number) => n.toLocaleString("en-IN");

/* The drawing uses the client's master-plan coordinates; this is the crop we show. */
const VB = { x: 540, y: 390, w: 1130, h: 640 };

type Place = {
  id: string;
  mark: string;
  name: string;
  kind: string;
  at: [number, number];
  photo?: StaticImageData | string;
  alt?: string;
  stats: { label: string; value: string }[];
  note: string;
  venue: boolean;
};

const VENUE_PINS: Record<string, [number, number]> = {
  "tavaro-lawn": [1045, 655],
  "sanctuary-lawn": [1408, 628],
  "sanctuary-hall": [1375, 742],
  "pool-deck": [1532, 622],
  "tavaro-house": [950, 466],
  "tree-deck": [1160, 478],
};

const PLACES: Place[] = [
  ...VENUES.map((v, i) => ({
    id: v.id,
    mark: String(i + 1),
    name: v.name,
    kind: v.kind,
    at: VENUE_PINS[v.id],
    photo: v.photo,
    alt: v.alt,
    stats: [
      { label: "Seated", value: fmt(v.seated) },
      { label: "Standing", value: fmt(v.floating) },
      ...(v.sqft ? [{ label: "Sq ft", value: fmt(v.sqft) }] : []),
    ],
    note: v.bestFor,
    venue: true,
  })),
  {
    id: "mare",
    mark: "M",
    name: "Màre Coffee House & Gallery",
    kind: "Café and gallery",
    at: [1518, 757],
    photo: "/images/mare/coffee-house-arch.jpg",
    alt: "The arched front of Màre Coffee House",
    stats: [],
    note: "Coffee and a gallery, a few steps from the pool.",
    venue: false,
  },
  {
    id: "pilates",
    mark: "S",
    name: "Pilates Studio",
    kind: "Wellness",
    at: [1584, 758],
    stats: [],
    note: "A studio for Pilates, beside Màre and a few steps from the pool.",
    venue: false,
  },
  {
    id: "rooms",
    mark: "R",
    name: "Sanctuary Rooms",
    kind: "Rooms",
    at: [1428, 790],
    photo: "/images/resorts/suite.jpg",
    alt: "A suite at Tavaro Resorts",
    stats: [{ label: "Rooms at the resort", value: "13" }],
    note: "6 suites and 7 executive rooms, so the couple and family can stay on site.",
    venue: false,
  },
  {
    id: "kitchen",
    mark: "K",
    name: "Catering kitchen",
    kind: "In-house catering",
    at: [778, 634],
    stats: [{ label: "Sq ft", value: "6,000" }],
    note: "Where our chefs prepare every celebration's menu.",
    venue: false,
  },
  {
    id: "parking",
    mark: "P",
    name: "Parking",
    kind: "On site",
    at: [672, 520],
    stats: [{ label: "Cars", value: "Up to 1,500" }],
    note: "Parking on the west and south sides of the resort.",
    venue: false,
  },
  {
    id: "entrance",
    mark: "E",
    name: "Entrance",
    kind: "Main gate",
    at: [1255, 846],
    stats: [],
    note: "Guests arrive here from the approach road, a short walk from every space.",
    venue: false,
  },
];

/** Points every `step` units along a closed polyline: used to plant the tree ring. */
function along(points: [number, number][], step: number) {
  const out: [number, number][] = [];
  let carry = 0;
  for (let i = 0; i < points.length; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % points.length];
    const len = Math.hypot(bx - ax, by - ay);
    for (let d = carry; d < len; d += step) out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
    carry = (carry - len) % step;
    if (carry < 0) carry += step;
  }
  return out;
}
const TREE_RING = along(
  [
    [1322, 560],
    [1360, 474],
    [1500, 452],
    [1638, 482],
    [1622, 786],
    [1384, 836],
    [1310, 772],
  ],
  27,
);
const TREE_ROW = along(
  [
    [905, 800],
    [1110, 806],
  ],
  30,
).slice(0, -1);

function Tree({ x, y, r, i }: { x: number; y: number; r: number; i: number }) {
  return (
    <g className={styles.tree}>
      <circle cx={x + 2} cy={y + 3} r={r} className={styles.shadow} />
      <circle cx={x} cy={y} r={r} className={i % 3 === 0 ? styles.canopyDark : styles.canopy} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.4} className={styles.canopyLight} />
    </g>
  );
}

/** Each place's drawn shapes; they light up with the pin. */
const SHAPES: Record<string, ReactNode> = {
  "tavaro-lawn": (
    <>
      <ellipse cx="1045" cy="655" rx="195" ry="152" className={styles.lawn} />
      <ellipse cx="1045" cy="655" rx="160" ry="120" className={styles.mow} />
    </>
  ),
  "sanctuary-lawn": (
    <>
      <rect x="1335" y="552" width="146" height="160" rx="8" className={styles.lawn} />
      <rect x="1350" y="567" width="116" height="130" rx="4" className={styles.mow} />
    </>
  ),
  "sanctuary-hall": (
    <>
      <rect x="1418" y="715" width="62" height="54" className={styles.wood} />
      <rect x="1335" y="715" width="80" height="54" className={styles.roof} />
      <path d="M1335 742h80" className={styles.ridge} />
    </>
  ),
  "pool-deck": (
    <>
      <rect x="1488" y="576" width="88" height="92" rx="6" className={styles.lawn} />
      <rect x="1490" y="672" width="80" height="62" className={styles.wood} />
      <rect x="1500" y="684" width="50" height="30" rx="6" className={styles.water} />
      <circle cx="1558" cy="722" r="7" className={styles.water} />
    </>
  ),
  "tavaro-house": (
    <>
      <ellipse cx="962" cy="512" rx="58" ry="20" className={styles.lawn} />
      <g transform="rotate(-18 950 466)">
        <rect x="905" y="442" width="90" height="48" className={styles.roof} />
        <path d="M905 466h90" className={styles.ridge} />
      </g>
    </>
  ),
  "tree-deck": (
    <>
      <ellipse cx="1160" cy="482" rx="72" ry="47" className={styles.lawn} />
      <ellipse cx="1160" cy="482" rx="56" ry="35" className={styles.terrace} />
      <ellipse cx="1160" cy="482" rx="42" ry="25" className={styles.terrace} />
      <Tree x={1160} y={478} r={30} i={1} />
    </>
  ),
  mare: <rect x="1492" y="740" width="52" height="34" className={styles.roof} />,
  pilates: (
    <>
      <rect x="1562" y="736" width="44" height="44" className={styles.roof} />
      <path d="M1562 758h44" className={styles.ridge} />
    </>
  ),
  rooms: (
    <>
      <rect x="1385" y="778" width="88" height="22" className={styles.roof} />
      <path d="M1385 789h88" className={styles.ridge} />
    </>
  ),
  kitchen: (
    <>
      <rect x="745" y="578" width="65" height="112" className={styles.roof} />
      <path d="M777 578v112" className={styles.ridge} />
    </>
  ),
  parking: (
    <>
      <rect x="565" y="450" width="160" height="240" className={styles.park} />
      <path d="M1135 925 1360 945 1352 1030 1120 1030Z" className={styles.park} />
    </>
  ),
  entrance: <path d="M1255 808 1280 826 1255 844 1230 826Z" className={styles.roof} />,
};

function Card({ place }: { place: Place }) {
  return (
    <>
      {place.photo && (
        <div className={styles.cardPhoto}>
          <Image
            src={place.photo}
            alt={place.alt ?? ""}
            fill
            sizes="320px"
            placeholder={typeof place.photo === "string" ? "empty" : "blur"}
          />
        </div>
      )}
      <div className={styles.cardBody}>
        <p className={styles.cardKind}>{place.kind}</p>
        <h3 className={styles.cardName}>{place.name}</h3>
        {place.stats.length > 0 && (
          <dl className={styles.cardStats}>
            {place.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className={styles.cardNote}>{place.note}</p>
      </div>
    </>
  );
}

export function ResortGrounds() {
  const [active, setActive] = useState<string | null>(null);
  const place = PLACES.find((p) => p.id === active);
  const pick = (id: string) => () => setActive(id);
  // Only a real mouse previews on hover; a tap selects through onClick.
  const hover = (id: string) => (e: PointerEvent) => {
    if (e.pointerType === "mouse") setActive(id);
  };

  // Where the floating card sits: beside the pin, flipped near the edges.
  let pop: CSSProperties = {};
  if (place) {
    const left = ((place.at[0] - VB.x) / VB.w) * 100;
    const top = ((place.at[1] - VB.y) / VB.h) * 100;
    pop = {
      left: `${left}%`,
      top: `${top}%`,
      transform: `translate(${left > 55 ? "calc(-100% - 28px)" : "28px"}, ${top > 55 ? "-85%" : "-15%"})`,
    };
  }

  return (
    <section className={styles.grounds} aria-labelledby="grounds-title">
      <div className="container">
        <header className={styles.head}>
          <h2 id="grounds-title" className={styles.title}>
            16 acres, laid out for celebrations
          </h2>
          <p className={styles.lede}>
            Mediterranean design and Indian hospitality, with every space a short walk from the next. Choose a
            place on the map to see it. Your moments, your way.
          </p>
        </header>

        <div className={styles.wrap}>
          <figure className={styles.map} onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}>
            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-labelledby="map-desc" role="group">
              <desc id="map-desc">
                Site plan of Tavaro Resorts. Tavaro Lawn sits at the centre, with Tavaro House and the Tree Deck
                to its north. Sanctuary Lawn, Sanctuary Hall, the pool, Màre and the Pilates Studio are to the east, inside a ring of
                trees. The entrance is to the south, with parking to the west and south.
              </desc>
              <defs>
                <pattern id="stalls" width="18" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 0v40" className={styles.stall} />
                </pattern>
                <radialGradient id="lawnShade" cx="45%" cy="40%" r="70%">
                  <stop offset="0" className={styles.lawnLight} />
                  <stop offset="1" className={styles.lawnDark} />
                </radialGradient>
              </defs>

              {/* Grounds, roads and walkways */}
              <path
                className={styles.ground}
                d="M560 445 812 415Q1100 395 1500 402L1648 470 1640 560 1612 802 1420 842 1372 1030 1108 1030 1122 842 1060 815 830 800 560 790Z"
              />
              <path className={styles.road} d="M1255 846 1240 1030" />
              <path className={styles.road} d="M560 760 830 772 1060 790 1240 822" />
              <ellipse cx="1045" cy="655" rx="214" ry="170" className={styles.walk} />
              <path
                className={styles.walk}
                d="M1255 826C1300 800 1318 790 1330 770M1215 790C1205 720 1215 640 1200 560M1120 500C1100 490 1050 480 1010 500M832 650H812M1225 520C1260 540 1300 545 1330 560"
              />
              {/* Planted mounds from the plan */}
              <ellipse cx="880" cy="720" rx="22" ry="48" transform="rotate(-25 880 720)" className={styles.shrub} />
              <ellipse cx="1130" cy="725" rx="22" ry="44" transform="rotate(35 1130 725)" className={styles.shrub} />
              <ellipse cx="1172" cy="625" rx="18" ry="46" className={styles.shrub} />
              <path d="M1150 540c18-14 34 4 28 22s-24 28-34 12 6-34 6-34Z" className={styles.roof} />
              <rect x="1100" y="806" width="50" height="22" className={styles.roof} />

              {PLACES.map((p) => (
                <g
                  key={p.id}
                  className={styles.place}
                  data-active={active === p.id || undefined}
                  onPointerEnter={hover(p.id)}
                  onClick={pick(p.id)}
                >
                  {SHAPES[p.id]}
                </g>
              ))}

              {TREE_RING.map(([x, y], i) => (
                <Tree key={`r${i}`} x={x} y={y} r={11 + (i % 3) * 2} i={i} />
              ))}
              {TREE_ROW.map(([x, y], i) => (
                <Tree key={`w${i}`} x={x} y={y} r={10} i={i} />
              ))}

              {PLACES.map((p) => (
                <g
                  key={p.id}
                  className={`${styles.pin} ${p.venue ? "" : styles.pinMuted}`}
                  data-active={active === p.id || undefined}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}, ${p.kind}`}
                  aria-pressed={active === p.id}
                  onPointerEnter={hover(p.id)}
                  onFocus={pick(p.id)}
                  onClick={pick(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setActive(null);
                  }}
                >
                  <circle cx={p.at[0]} cy={p.at[1]} r={p.venue ? 44 : 38} className={styles.halo} />
                  <circle cx={p.at[0]} cy={p.at[1]} r={p.venue ? 28 : 22} />
                  <text x={p.at[0]} y={p.at[1]}>
                    {p.mark}
                  </text>
                </g>
              ))}
            </svg>

            {place && (
              <div key={place.id} className={`${styles.card} ${styles.pop}`} style={pop} aria-live="polite">
                <Card place={place} />
              </div>
            )}
          </figure>

          <div className={styles.side}>
            {/* Phones and tablets: the chosen place shows here instead of floating over the map. */}
            <div className={styles.below} aria-live="polite">
              {place ? (
                <div key={place.id} className={styles.card}>
                  <Card place={place} />
                </div>
              ) : (
                <p className={styles.hint}>Tap a number on the map to see that place.</p>
              )}
            </div>

            <ul className={styles.legend} aria-label="Places on the map">
              {PLACES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active === p.id}
                    onPointerEnter={hover(p.id)}
                    onFocus={pick(p.id)}
                    onClick={pick(p.id)}
                  >
                    <span className={`${styles.badge} ${p.venue ? "" : styles.badgeMuted}`} aria-hidden="true">
                      {p.mark}
                    </span>
                    <span>{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h3 className={styles.factsTitle}>Around the resort</h3>
            <ul className={styles.facts}>
              {FACILITIES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
