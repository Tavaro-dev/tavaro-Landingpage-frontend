import Image from "next/image";
import type { ActivityCategory } from "../content/thingsToDoData";
import styles from "./ActivityCategorySection.module.css";

interface ActivityCategorySectionProps {
  category: ActivityCategory;
  index: number;
  onEnquire?: (categoryTitle: string) => void;
  isCreatePage?: boolean;
}

export function ActivityCategorySection({
  category,
  index,
  onEnquire,
  isCreatePage = false,
}: ActivityCategorySectionProps) {
  const isReversed = index % 2 === 1;
  const numLabel = `0${index + 1}`;

  return (
    <section className={`${styles["activity-block"]} ${isReversed ? `${styles.reversed}` : ""}`} id={category.id}>

      <div className="container">
        <div className={styles["activity-grid"]}>
          {/* Media Column */}
          <div className={styles["activity-media-container"]}>
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className={styles["activity-image"]}
            />
          </div>

          {/* Content Column */}
          <div className={styles["activity-content"]}>
            <span className={styles["activity-num"]}>{numLabel} — {category.title}</span>
            <h3 className={styles["activity-title"]}>{category.title}</h3>
            <p className={styles["activity-tagline"]}>{category.tagline}</p>
            <p className={styles["activity-desc"]}>{category.description}</p>

            <div className={styles["activity-list-container"]}>
              <h4 className={styles["activity-list-title"]}>Featured Activities & Experiences</h4>
              <ul className={styles["activity-list"]}>
                {category.items.map((item) => (
                  <li key={item} className={styles["activity-item"]}>
                    <span className={styles["activity-bullet"]}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isCreatePage && onEnquire && (
              <div className={styles["activity-action"]}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onEnquire(category.title)}
                  suppressHydrationWarning
                >
                  Enquire About {category.title} <span className="btn-arrow">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
