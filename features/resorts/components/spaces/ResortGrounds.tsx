"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/Icon";
import Image, { type StaticImageData } from "next/image";
import { FACILITIES, VENUES } from "../../content/venues";
import styles from "./ResortGrounds.module.css";

const fmt = (n: number) => n.toLocaleString("en-IN");

/* The drawing uses the client's master-plan coordinates; this is the crop we show. */
const VB = { x: 540, y: 390, w: 1130, h: 640 };
/** Zoom steps for the plus and minus buttons. */
const ZOOMS = [1, 1.5, 2, 3];
const GROUND =
  "M560 445 812 415Q1100 395 1500 402L1648 470 1640 560 1612 802 1420 842 1372 1030 1108 1030 1122 842 1060 815 830 800 560 790Z";
const FIELDS = "M548 800 1100 812 1100 1030 548 1030ZM1425 850 1628 806 1668 800 1668 1030 1378 1030Z";
const ROADS = "M1255 846 1240 1030M560 760 830 772 1060 790 1240 822";
const WALKS =
  "M1255 826C1300 800 1318 790 1330 770M1215 790C1205 720 1215 640 1200 560M1120 500C1100 490 1050 480 1010 500M832 650H812M1225 520C1260 540 1300 545 1330 560";

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

/** A small repeatable number from an index, so the drawing is the same on every render. */
const hash = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
/** Rounded to a tenth, so the server and the browser write identical coordinates. */
const q = (n: number) => Math.round(n * 10) / 10;

function Tree({ x, y, r: size, i }: { x: number; y: number; r: number; i: number }) {
  // Two side lobes break the perfect circle, so the canopy reads as foliage.
  const a = hash(i) * Math.PI * 2;
  const r = q(size);
  const tone = i % 3 === 0 ? styles.canopyDark : styles.canopy;
  return (
    <g className={styles.tree}>
      <ellipse cx={q(x + r * 0.35)} cy={q(y + r * 0.45)} rx={q(r * 1.05)} ry={q(r * 0.95)} className={styles.shadow} />
      <circle cx={q(x)} cy={q(y)} r={r} className={tone} />
      <circle cx={q(x + Math.cos(a) * r * 0.55)} cy={q(y + Math.sin(a) * r * 0.55)} r={q(r * 0.62)} className={tone} />
      <circle cx={q(x - Math.cos(a) * r * 0.5)} cy={q(y - Math.sin(a) * r * 0.45)} r={q(r * 0.55)} className={tone} />
      <circle cx={q(x - r * 0.3)} cy={q(y - r * 0.32)} r={q(r * 0.42)} className={styles.canopyLight} />
    </g>
  );
}

/** The 250-year-old tree: a broad canopy of many lobes. */
function OldTree({ x, y }: { x: number; y: number }) {
  const lobes = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    return [q(x + Math.cos(a) * 22), q(y + Math.sin(a) * 17), q(15 + hash(i + 40) * 6)] as const;
  });
  return (
    <g className={styles.tree}>
      <ellipse cx={x + 10} cy={y + 12} rx={44} ry={36} className={styles.shadow} />
      {lobes.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} className={i % 2 ? styles.canopyDark : styles.canopy} />
      ))}
      <circle cx={x} cy={y} r={24} className={styles.canopy} />
      <circle cx={x - 10} cy={y - 9} r={12} className={styles.canopyLight} />
      <circle cx={x + 14} cy={y - 14} r={7} className={styles.canopyLight} />
    </g>
  );
}

/**
 * A hipped roof seen from above: four sloping faces, lit from the top left, over a cast shadow.
 * `tone` picks terracotta (default) or the glass-and-metal of Sanctuary Hall.
 */
function Roof({ x, y, w, h, tone = "tile" }: { x: number; y: number; w: number; h: number; tone?: "tile" | "glass" }) {
  const along = w >= h;
  const i = (along ? h : w) / 2;
  const [cx, cy] = [x + w / 2, y + h / 2];
  const pts = (p: number[][]) => p.map((q) => q.join(",")).join(" ");
  const [a, b, c, d] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const [r1, r2] = along
    ? [
        [x + i, cy],
        [x + w - i, cy],
      ]
    : [
        [cx, y + i],
        [cx, y + h - i],
      ];
  const t = tone === "glass" ? styles.glass : "";
  return (
    <g>
      <rect x={x + 5} y={y + 6} width={w} height={h} className={styles.shadow} />
      {along ? (
        <>
          <polygon points={pts([a, b, r2, r1])} className={`${styles.roofLight} ${t}`} />
          <polygon points={pts([d, c, r2, r1])} className={`${styles.roofDark} ${t}`} />
          <polygon points={pts([a, r1, d])} className={`${styles.roofMid} ${t}`} />
          <polygon points={pts([b, r2, c])} className={`${styles.roofDark} ${t}`} />
        </>
      ) : (
        <>
          <polygon points={pts([a, d, r2, r1])} className={`${styles.roofLight} ${t}`} />
          <polygon points={pts([b, c, r2, r1])} className={`${styles.roofDark} ${t}`} />
          <polygon points={pts([a, r1, b])} className={`${styles.roofMid} ${t}`} />
          <polygon points={pts([d, r2, c])} className={`${styles.roofDark} ${t}`} />
        </>
      )}
      <path d={`M${r1.join(" ")}L${r2.join(" ")}M${a.join(" ")}L${r1.join(" ")}L${d.join(" ")}M${b.join(" ")}L${r2.join(" ")}L${c.join(" ")}`} className={styles.ridge} />
    </g>
  );
}

const CAR_TONES = ["carLight", "carSilver", "carDark", "carRed"] as const;

/** Cars in some of the bays, nose in, so the parking reads as parking. */
function Cars({ x, y, cols, rows, seed }: { x: number; y: number; cols: number; rows: number; seed: number }) {
  const cars = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const n = seed + r * cols + c;
      const [cx, cy] = [x + c * 18 + 3, y + r * 40 + 7];
      // Some bays stand empty, and none sit on the approach road through the south car park.
      if (hash(n) > 0.55 || (cx > 1222 && cx < 1262)) continue;
      cars.push(
        <g key={n} className={styles[CAR_TONES[Math.floor(hash(n + 7) * 4)]]}>
          <rect x={cx} y={cy} width={12} height={26} rx={3.5} />
          <rect x={cx + 2} y={cy + (r % 2 ? 15 : 5)} width={8} height={6} rx={1.5} className={styles.windscreen} />
        </g>,
      );
    }
  return <g className={styles.tree}>{cars}</g>;
}

/** Trees scattered over the farmland and verges around the site. */
const SCATTER: [number, number][] = [
  [575, 820], [640, 850], [700, 905], [760, 860], [820, 940], [905, 880], [980, 960], [1050, 900],
  [600, 990], [690, 1000], [880, 1010], [1430, 905], [1500, 940], [1470, 1000], [1640, 880],
  [1652, 640], [1655, 540], [840, 408], [1240, 404], [1385, 410],
];

/** Each place's drawn shapes; they light up with the pin. */
const SHAPES: Record<string, ReactNode> = {
  "tavaro-lawn": (
    <>
      <ellipse cx="1045" cy="655" rx="195" ry="152" className={styles.lawn} />
      <ellipse cx="1045" cy="655" rx="195" ry="152" className={styles.stripes} />
      <ellipse cx="1045" cy="655" rx="178" ry="136" className={styles.edging} />
    </>
  ),
  "sanctuary-lawn": (
    <>
      <rect x="1335" y="552" width="146" height="160" rx="8" className={styles.lawn} />
      <rect x="1335" y="552" width="146" height="160" rx="8" className={styles.stripes} />
      <rect x="1347" y="564" width="122" height="136" rx="4" className={styles.edging} />
    </>
  ),
  "sanctuary-hall": (
    <>
      <rect x="1418" y="715" width="62" height="54" className={styles.deck} />
      <Roof x={1335} y={715} w={80} h={54} tone="glass" />
    </>
  ),
  "pool-deck": (
    <>
      <rect x="1488" y="576" width="88" height="92" rx="6" className={styles.lawn} />
      <rect x="1488" y="576" width="88" height="92" rx="6" className={styles.stripes} />
      <rect x="1490" y="672" width="80" height="62" className={styles.deck} />
      <rect x="1500" y="684" width="50" height="30" rx="4" className={styles.water} />
      <path d="M1505 693q5-3 10 0t10 0 10 0 10 0M1507 705q5-3 10 0t10 0 10 0 10 0" className={styles.caustic} />
      <circle cx="1558" cy="722" r="7" className={styles.water} />
      {[1503, 1512, 1521, 1530].map((x) => (
        <rect key={x} x={x} y="719" width="5" height="11" rx="1.5" className={styles.lounger} />
      ))}
    </>
  ),
  "tavaro-house": (
    <>
      <ellipse cx="962" cy="512" rx="58" ry="20" className={styles.lawn} />
      <g transform="rotate(-18 950 466)">
        <Roof x={905} y={442} w={90} h={48} />
      </g>
    </>
  ),
  "tree-deck": (
    <>
      <ellipse cx="1160" cy="482" rx="72" ry="47" className={styles.lawn} />
      <ellipse cx="1160" cy="482" rx="56" ry="35" className={styles.terrace} />
      <ellipse cx="1160" cy="482" rx="42" ry="25" className={styles.terrace} />
      <OldTree x={1160} y={478} />
    </>
  ),
  mare: <Roof x={1492} y={740} w={52} h={34} />,
  pilates: <Roof x={1562} y={736} w={44} h={44} />,
  rooms: <Roof x={1385} y={778} w={88} h={22} />,
  kitchen: <Roof x={745} y={578} w={65} h={112} />,
  parking: (
    <>
      <rect x="565" y="450" width="160" height="240" className={styles.park} />
      <Cars x={565} y={450} cols={8} rows={6} seed={1} />
      <path d="M1135 925 1360 945 1352 1030 1120 1030Z" className={styles.park} />
      <Cars x={1142} y={950} cols={11} rows={2} seed={60} />
    </>
  ),
  entrance: <path d="M1255 808 1280 826 1255 844 1230 826Z" className={styles.roof} />,
};

function Card({ place }: { place: Place }) {
  return (
    <>
      {/* Places without a photo keep the same shape, with their map letter, so the card never jumps. */}
      <div className={`${styles.cardPhoto} ${place.photo ? "" : styles.cardMark}`}>
        {place.photo ? (
          <Image
            src={place.photo}
            alt={place.alt ?? ""}
            fill
            sizes="(max-width: 600px) 100vw, 320px"
            placeholder={typeof place.photo === "string" ? "empty" : "blur"}
          />
        ) : (
          <span aria-hidden="true">{place.mark}</span>
        )}
      </div>
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
  // The plan draws itself in once, the first time it comes into view.
  const [seen, setSeen] = useState(false);
  const mapRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Zoom (plus and minus) and full screen. The plan sits in a scrolling viewport; zooming keeps its centre.
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const centre = useRef<[number, number] | null>(null);
  const keepCentre = () => {
    const v = view.current;
    if (v) centre.current = [(v.scrollLeft + v.clientWidth / 2) / v.scrollWidth, (v.scrollTop + v.clientHeight / 2) / v.scrollHeight];
  };
  const zoomBy = (dir: 1 | -1) => {
    const next = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, ZOOMS.indexOf(zoom) + dir))];
    if (next === zoom) return;
    keepCentre();
    setZoom(next);
  };
  const toggleFull = () => {
    // Full screen opens (and closes) on the whole plan, at its fitted size.
    keepCentre();
    setZoom(1);
    setFull((f) => !f);
  };
  useLayoutEffect(() => {
    const v = view.current;
    const c = centre.current;
    if (!v || !c) return;
    centre.current = null;
    v.scrollLeft = c[0] * v.scrollWidth - v.clientWidth / 2;
    v.scrollTop = c[1] * v.scrollHeight - v.clientHeight / 2;
  }, [zoom, full]);

  // The plan's drawn scale, so pins stay one size on screen at any zoom, full screen or not.
  useEffect(() => {
    const svg = view.current?.firstElementChild;
    const map = mapRef.current;
    if (!svg || !map) return;
    const ro = new ResizeObserver(() => map.style.setProperty("--unit", String(svg.clientWidth / VB.w)));
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Full screen: the page behind stops scrolling, and Escape closes it.
  useEffect(() => {
    if (!full) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  const trapTab = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = [...(mapRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]') ?? [])];
    const [first, last] = [items[0], items[items.length - 1]];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first)?.focus();
    }
  };

  // With a mouse, a zoomed plan can be dragged; touch screens pan it natively.
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && zoom > 1) drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    const v = view.current;
    if (!d || !v) return;
    const [dx, dy] = [e.clientX - d.x, e.clientY - d.y];
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    v.scrollBy(-dx, -dy);
    drag.current = { x: e.clientX, y: e.clientY, moved: true };
  };
  const onUp = () => {
    // A drag that moved should not also count as a click on a pin.
    const moved = drag.current?.moved;
    drag.current = null;
    if (moved) {
      const stop = (ev: Event) => ev.stopPropagation();
      window.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", stop, { capture: true }), 0);
    }
  };
  const place = PLACES.find((p) => p.id === active);
  // Below the map (tablets and phones) a place is always shown, starting with the main lawn.
  const shown = place ?? PLACES[0];
  const below = useRef<HTMLDivElement>(null);
  const reveal = useRef(false);
  const pick = (id: string) => () => setActive(id);
  // From the list, the card is out of sight above: bring it (and its pin) into view.
  const pickFromList = (id: string) => () => {
    reveal.current = true;
    setActive(id);
  };

  // Phones and tablets show the chosen place under the map: after a pick from the list, bring the card into view
  // (the plan sits just above it), with the plan slid to the pin.
  useEffect(() => {
    if (!reveal.current || !active) return;
    reveal.current = false;
    const card = below.current;
    const v = view.current;
    if (!card?.offsetParent || !v) return;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    card.scrollIntoView({ behavior, block: "end" });
    const pin = v.querySelector<SVGGElement>(`[data-id="${active}"]`);
    if (pin) {
      const box = pin.getBoundingClientRect();
      const frame = v.getBoundingClientRect();
      v.scrollBy({
        left: box.left + box.width / 2 - (frame.left + frame.width / 2),
        top: box.top + box.height / 2 - (frame.top + frame.height / 2),
        behavior,
      });
    }
  }, [active]);
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
            Mediterranean design and Indian hospitality, with every space a short walk from the next. Tap a number
            on the map, or a name in the list, to see that place.
          </p>
        </header>

        <div className={styles.wrap}>
          <figure
            ref={mapRef}
            className={styles.map}
            data-seen={seen || undefined}
            data-full={full || undefined}
            data-zoomed={zoom > 1 || undefined}
            style={{ "--zoom": zoom } as CSSProperties}
            role={full ? "dialog" : undefined}
            aria-modal={full || undefined}
            aria-label={full ? "Site plan of Tavaro Resorts" : undefined}
            onPointerLeave={(e) => e.pointerType === "mouse" && zoom === 1 && !full && setActive(null)}
            onKeyDown={full ? trapTab : undefined}
          >
            <div
              ref={view}
              className={styles.viewport}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-labelledby="map-desc" role="group">
              <desc id="map-desc">
                Site plan of Tavaro Resorts. Tavaro Lawn sits at the centre, with Tavaro House and the Tree Deck
                to its north. Sanctuary Lawn, Sanctuary Hall, the pool, Màre and the Pilates Studio are to the east, inside a ring of
                trees. The entrance is to the south, with parking to the west and south.
              </desc>
              <defs>
                <pattern id="stalls" width="18" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 0v40M0 40h18" className={styles.stall} />
                </pattern>
                {/* Mowing stripes, light and dark bands across each lawn. */}
                <pattern id="rg-stripes" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
                  <rect width="14" height="28" className={styles.stripe} />
                </pattern>
                <pattern id="rg-planks" width="40" height="5" patternUnits="userSpaceOnUse">
                  <rect width="40" height="5" className={styles.deckBase} />
                  <path d="M0 4.5h40M12 0v5" className={styles.plank} />
                </pattern>
                <pattern id="rg-crops" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
                  <path d="M0 7h14" className={styles.cropRow} />
                </pattern>
                <pattern id="rg-grass" width="46" height="46" patternUnits="userSpaceOnUse">
                  <path d="M6 9l2-4M21 30l1-4M38 14l2-4M30 41l1-3M12 36l2-3" className={styles.blade} />
                </pattern>
                <linearGradient id="rg-water" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" className={styles.waterLight} />
                  <stop offset="1" className={styles.waterDeep} />
                </linearGradient>
                <radialGradient id="lawnShade" cx="45%" cy="40%" r="70%">
                  <stop offset="0" className={styles.lawnLight} />
                  <stop offset="1" className={styles.lawnDark} />
                </radialGradient>
              </defs>

              {/* Farmland around the resort */}
              <path d={FIELDS} className={styles.field} />
              <path d={FIELDS} className={styles.crops} />

              {/* Grounds, inside a boundary wall */}
              <path className={styles.ground} d={GROUND} />
              <path className={styles.groundTex} d={GROUND} />
              <path className={styles.wall} d={GROUND} />

              {/* Roads: kerb, asphalt, centre line */}
              <path className={styles.roadEdge} d={ROADS} />
              <path className={styles.road} d={ROADS} />
              <path className={styles.roadLine} d={ROADS} />

              {/* Paved walks, with their edging */}
              <ellipse cx="1045" cy="655" rx="214" ry="170" className={styles.walkEdge} />
              <path className={styles.walkEdge} d={WALKS} />
              <ellipse cx="1045" cy="655" rx="214" ry="170" className={styles.walk} />
              <path className={styles.walk} d={WALKS} />

              {SCATTER.map(([x, y], i) => (
                <Tree key={`s${i}`} x={x} y={y} r={10 + hash(i + 90) * 7} i={i} />
              ))}
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

              {/* North arrow */}
              <g className={styles.compass} transform="translate(1590 958)">
                <circle r="26" />
                <path d="M0-20 7 4 0-1-7 4Z" />
                <text y="20">N</text>
              </g>

              {PLACES.map((p, i) => (
                <g
                  key={p.id}
                  style={{ "--i": i } as CSSProperties}
                  className={`${styles.pin} ${p.venue ? "" : styles.pinMuted}`}
                  data-id={p.id}
                  data-active={active === p.id || undefined}
                  data-current={shown.id === p.id || undefined}
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

            </div>

            <div className={styles.tools}>
              <button type="button" onClick={() => zoomBy(1)} disabled={zoom === ZOOMS[ZOOMS.length - 1]} aria-label="Zoom in">
                <span aria-hidden="true">+</span>
              </button>
              <button type="button" onClick={() => zoomBy(-1)} disabled={zoom === 1} aria-label="Zoom out">
                <span aria-hidden="true">&minus;</span>
              </button>
              <button type="button" onClick={toggleFull} aria-label={full ? "Close full screen" : "Open the plan full screen"}>
                <Icon name={full ? "close" : "expand"} />
              </button>
            </div>

            {/* At its normal size the card floats beside the pin; zoomed or full screen, it sits in a corner. */}
            {place && zoom === 1 && !full && (
              <div key={place.id} className={`${styles.card} ${styles.pop}`} style={pop} aria-live="polite">
                <Card place={place} />
              </div>
            )}
            {(zoom > 1 || full) && (
              <div key={`sheet-${shown.id}`} className={`${styles.card} ${styles.sheet}`} aria-live="polite">
                <Card place={shown} />
              </div>
            )}
          </figure>

          <div className={styles.side}>
            {/* Phones and tablets: the chosen place shows here instead of floating over the map. */}
            <div ref={below} className={styles.below} aria-live="polite">
              <div key={shown.id} className={styles.card}>
                <Card place={shown} />
              </div>
            </div>

            {[
              { title: "Celebration spaces", list: PLACES.filter((p) => p.venue), wide: false },
              { title: "Also on the grounds", list: PLACES.filter((p) => !p.venue), wide: true },
            ].map((group) => (
              <div key={group.title} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <ul className={`${styles.legend} ${group.wide ? styles.legendPair : ""}`}>
                  {group.list.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        aria-pressed={shown.id === p.id}
                        onPointerEnter={hover(p.id)}
                        onFocus={pickFromList(p.id)}
                        onClick={pickFromList(p.id)}
                      >
                        <span className={`${styles.badge} ${p.venue ? "" : styles.badgeMuted}`} aria-hidden="true">
                          {p.mark}
                        </span>
                        <span>{p.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ul className={styles.facts} aria-label="Around the resort">
          <li className={styles.factsTitle} aria-hidden="true">
            Around the resort
          </li>
          {FACILITIES.map((f, i) => (
            <li key={f} style={{ "--i": i } as CSSProperties}>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
