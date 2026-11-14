import { FACILITIES, VENUES } from "../../content/venues";
import styles from "./ResortGrounds.module.css";

/** Pin position for each venue on the drawn map, in the master plan's own coordinates. */
const PINS: Record<string, [number, number]> = {
  "tavaro-lawn": [1045, 655],
  "sanctuary-lawn": [1408, 628],
  "sanctuary-hall": [1375, 742],
  "pool-deck": [1530, 704],
  "tavaro-house": [950, 470],
  "tree-deck": [1160, 480],
};
const KEY = [
  { mark: "E", label: "Entrance", at: [1255, 822] },
  { mark: "P", label: "Parking", at: [682, 570] },
  { mark: "K", label: "Catering kitchen", at: [778, 632] },
  { mark: "M", label: "Màre Coffee House & Gallery", at: [1518, 790] },
] as const;

const fmt = (n: number) => n.toLocaleString("en-IN");

export function ResortGrounds() {
  return (
    <section className={styles.grounds} aria-labelledby="grounds-title">
      <div className="container">
        <header className={styles.head}>
          <h2 id="grounds-title" className={styles.title}>
            15 acres, laid out for celebrations
          </h2>
          <p className={styles.lede}>
            Mediterranean design and Indian hospitality, with every space a short walk from the next. Your
            moments, your way.
          </p>
        </header>

        <div className={styles.wrap}>
          <figure className={styles.map}>
            {/* Traced from the client's master plan; positions are approximate. */}
            <svg viewBox="540 390 1130 620" role="img" aria-labelledby="map-desc">
              <desc id="map-desc">
                Site map of Tavaro Resorts. Tavaro Lawn sits at the centre, with Tavaro House and the Tree Deck
                to its north. Sanctuary Lawn, Sanctuary Hall, the pool and Màre are to the east, inside a ring of
                trees. The entrance is to the south, with parking to the west and south.
              </desc>
              <path
                className={styles.ground}
                d="M560 440 810 412 1500 400 1650 470 1640 560 1612 800 1420 840 1365 1010 1110 1010 1120 842 830 800 560 790Z"
              />
              <path className={styles.road} d="M1255 822 1240 1010" />
              <rect className={styles.park} x="565" y="450" width="235" height="240" />
              <path className={styles.park} d="M1135 925 1360 945 1350 1010 1120 1010Z" />
              <rect className={styles.block} x="745" y="578" width="65" height="112" />
              <ellipse className={styles.lawn} cx="1045" cy="655" rx="195" ry="152" />
              <ellipse className={styles.lawn} cx="1160" cy="480" rx="62" ry="42" />
              <rect className={styles.block} x="900" y="440" width="100" height="62" transform="rotate(-18 950 471)" />
              <rect className={styles.lawn} x="1335" y="552" width="146" height="160" />
              <rect className={styles.block} x="1335" y="715" width="80" height="54" />
              <rect className={styles.block} x="1418" y="715" width="62" height="54" />
              <rect className={styles.lawn} x="1488" y="576" width="88" height="92" />
              <rect className={styles.water} x="1494" y="674" width="72" height="58" />
              <rect className={styles.block} x="1492" y="738" width="52" height="36" />
              <path
                className={styles.trees}
                d="M1322 560 1362 472 1500 452 1640 482 1622 784 1382 836 1308 772Z"
              />
              <circle className={styles.trunk} cx="1160" cy="480" r="14" />

              {VENUES.map((v, i) => {
                const [x, y] = PINS[v.id];
                return (
                  <g key={v.id} className={styles.pin}>
                    <circle cx={x} cy={y} r="30" />
                    <text x={x} y={y}>
                      {i + 1}
                    </text>
                  </g>
                );
              })}
              {KEY.map((k) => (
                <g key={k.mark} className={`${styles.pin} ${styles.pinMuted}`}>
                  <circle cx={k.at[0]} cy={k.at[1]} r="24" />
                  <text x={k.at[0]} y={k.at[1]}>
                    {k.mark}
                  </text>
                </g>
              ))}
            </svg>
            <figcaption>Not to scale. Traced from the resort&apos;s master plan.</figcaption>
          </figure>

          <div className={styles.side}>
            <ol className={styles.legend}>
              {VENUES.map((v, i) => (
                <li key={v.id}>
                  <span className={styles.badge} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    {v.name}
                    {v.sqft && <small>{fmt(v.sqft)} sq ft</small>}
                  </span>
                </li>
              ))}
            </ol>
            <ul className={styles.legend}>
              {KEY.map((k) => (
                <li key={k.mark}>
                  <span className={`${styles.badge} ${styles.badgeMuted}`} aria-hidden="true">
                    {k.mark}
                  </span>
                  <span>{k.label}</span>
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
