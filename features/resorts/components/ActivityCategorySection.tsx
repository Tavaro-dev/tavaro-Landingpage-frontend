import Image from "next/image";
import type { ActivityCategory } from "../content/thingsToDoData";
import "./ActivityCategorySection.css";

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
    <section className={`activity-block ${isReversed ? "reversed" : ""}`} id={category.id}>

      <div className="container">
        <div className="activity-grid">
          {/* Media Column */}
          <div className="activity-media-container">
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              className="activity-image"
            />
          </div>

          {/* Content Column */}
          <div className="activity-content">
            <span className="activity-num">{numLabel} — {category.title}</span>
            <h3 className="activity-title">{category.title}</h3>
            <p className="activity-tagline">{category.tagline}</p>
            <p className="activity-desc">{category.description}</p>

            <div className="activity-list-container">
              <h4 className="activity-list-title">Featured Activities & Experiences</h4>
              <ul className="activity-list">
                {category.items.map((item) => (
                  <li key={item} className="activity-item">
                    <span className="activity-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isCreatePage && onEnquire && (
              <div className="activity-action">
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
