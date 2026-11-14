import Image from "next/image";
import styles from "../ExpandingPanelsShowcase.module.css";
import type { ShowcaseCategory } from "../ExpandingPanelsShowcase";

/** One category: a narrow spine when collapsed, a glass card of activity chips when active. */
export function ShowcasePanel({
  cat,
  index,
  isActive,
  onSelect,
  selectedChip,
  onChip,
  onEnquire,
}: {
  cat: ShowcaseCategory;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  selectedChip: string | null;
  onChip: (chip: string | null) => void;
  /** Create mode only: shows the enquiry button. */
  onEnquire?: () => void;
}) {
  return (
    <div
      data-stage={index}
      className={`${styles["showcase-panel"]} ${isActive ? "active" : ""}`}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      aria-label={`${cat.title} Category`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className={styles["showcase-panel-bg"]}>
        <Image
          src={cat.image}
          alt={cat.imageAlt}
          fill
          sizes="(max-width: 900px) 100vw, 70vw"
          loading={index === 0 ? "eager" : undefined}
          className={styles["showcase-panel-image"]}
        />
        <div className={styles["showcase-panel-overlay"]} />
      </div>

      <div className={styles["showcase-panel-collapsed"]}>
        <span className={styles["showcase-collapsed-num"]}>{cat.number}</span>
        <span className={styles["showcase-collapsed-label"]}>{cat.title}</span>
        <span className={styles["showcase-collapsed-indicator"]} />
      </div>

      <div className={styles["showcase-panel-expanded"]}>
        <div className={styles["showcase-glass-card"]}>
          <div className={styles["showcase-card-header"]}>
            <span className={styles["showcase-badge-pill"]}>
              {cat.number} &bull; {cat.badge}
            </span>
            <span className="tw:text-[11px] tw:opacity-[0.65] tw:font-(family-name:--font-sans) tw:tracking-[0.08em]">
              {cat.activities.length} Experiences
            </span>
          </div>

          <h3 className={styles["showcase-card-title"]}>{cat.title}</h3>

          <div className={styles["showcase-chips-wrap"]} role="list" aria-label={`${cat.title} activities`}>
            {cat.activities.map((act) => {
              const isSelected = selectedChip === act;
              return (
                <button
                  key={act}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles["showcase-chip"]} ${isSelected ? "selected" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChip(isSelected ? null : act);
                  }}
                  aria-pressed={isSelected}
                >
                  <span className={styles["showcase-chip-dot"]} />
                  <span>{act}</span>
                </button>
              );
            })}
          </div>

          {onEnquire && (
            <div className={styles["showcase-card-actions"]}>
              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                className={`${styles["showcase-enquire-btn"]} showcase-enquire-btn`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEnquire();
                }}
              >
                Enquire for {cat.title} &rarr;
              </button>
              <span className={styles["showcase-action-hint"]}>Arranged on request with our team</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
