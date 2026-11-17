import { HeroImage } from "@/components/shared/HeroImage";
import { useState, type CSSProperties } from "react";
import styles from "../ExpandingPanelsShowcase.module.css";
import type { ShowcaseCategory } from "../ExpandingPanelsShowcase";

/**
 * One moment on the stage: a full-bleed photo with its title and activities.
 * All moments are stacked; only the active one is shown, and it fades and settles in.
 */
export function ShowcasePanel({
  cat,
  index,
  isActive,
  near,
  selectedChip,
  onChip,
  onEnquire,
}: {
  cat: ShowcaseCategory;
  index: number;
  isActive: boolean;
  /**
   * Showing now or next. The panels are stacked in one place, so the browser would fetch every photo at once
   * (lazy loading counts them all as on screen); each photo is requested only once its panel is near, then kept.
   */
  near: boolean;
  selectedChip: string | null;
  onChip: (chip: string | null) => void;
  /** Create mode only: shows the enquiry button. */
  onEnquire?: () => void;
}) {
  const [seen, setSeen] = useState(near);
  if (near && !seen) setSeen(true);
  return (
    <div
      data-stage={index}
      data-active={isActive}
      className={styles["showcase-panel"]}
      role="group"
      aria-roledescription="moment"
      aria-label={cat.title}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <div className={styles["showcase-panel-bg"]}>
        {seen && (
          <HeroImage
            src={cat.image}
            alt={cat.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 1360px"
            className={styles["showcase-panel-image"]}
          />
        )}
        <div className={styles["showcase-panel-overlay"]} />
      </div>

      <span className={styles["showcase-numeral"]} aria-hidden="true">
        {cat.number}
      </span>

      <div className={styles["showcase-panel-content"]}>
        <span className={`${styles["showcase-kicker"]} ${styles.rise}`}>{cat.number}</span>
        <h3 className={`${styles["showcase-card-title"]} ${styles.rise}`}>{cat.title}</h3>
        {cat.tagline && <p className={`${styles["showcase-tagline"]} ${styles.rise}`}>{cat.tagline}</p>}

        <ul className={styles["showcase-chips-wrap"]} aria-label={`${cat.title} activities`}>
          {cat.activities.map((act, i) => {
            const isSelected = selectedChip === act;
            return (
              <li key={act} className={styles.rise} style={{ "--i": i } as CSSProperties}>
                <button
                  type="button"
                  className={styles["showcase-chip"]}
                  data-selected={isSelected}
                  onClick={() => onChip(isSelected ? null : act)}
                  aria-pressed={isSelected}
                >
                  <span className={styles["showcase-chip-dot"]} aria-hidden="true" />
                  {act}
                </button>
              </li>
            );
          })}
        </ul>

        {onEnquire && (
          <div className={`${styles["showcase-card-actions"]} ${styles.rise}`}>
            <button
              type="button"
              className={`${styles["showcase-enquire-btn"]} showcase-enquire-btn`}
              onClick={onEnquire}
            >
              Enquire for {cat.title} <span aria-hidden="true">&rarr;</span>
            </button>
            <span className={styles["showcase-action-hint"]}>Arranged on request with our team</span>
          </div>
        )}
      </div>
    </div>
  );
}
