import Image from "next/image";
import type { ActivityCategory } from "../content/thingsToDoData";

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
      <style>{`
        .activity-block {
          padding: clamp(48px, 6vw, 84px) 0;
          border-bottom: 1px solid var(--surface-line);
          position: relative;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: center;
        }

        .activity-block.reversed .activity-grid {
          direction: rtl;
        }

        .activity-block.reversed .activity-grid > * {
          direction: ltr;
        }

        .activity-media-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius, 2px);
          overflow: hidden;
          background: var(--surface-2);
          border: 1px solid var(--surface-line);
        }

        .activity-image {
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .activity-media-container:hover .activity-image {
          transform: scale(1.03);
        }

        .activity-content {
          display: flex;
          flex-direction: column;
        }

        .activity-num {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .activity-title {
          font-family: var(--font-display, serif);
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 400;
          letter-spacing: 0.03em;
          color: var(--on-surface);
          margin: 0 0 10px;
        }

        .activity-tagline {
          font-family: var(--font-display, serif);
          font-size: clamp(15px, 1.8vw, 18px);
          font-style: italic;
          color: var(--on-surface-muted);
          margin: 0 0 18px;
          line-height: 1.4;
        }

        .activity-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--on-surface-muted);
          margin: 0 0 24px;
        }

        .activity-list-container {
          background: var(--surface-2);
          border: 1px solid var(--surface-line);
          border-left: 3px solid var(--gold);
          border-radius: var(--radius, 2px);
          padding: 18px 24px;
          margin-bottom: 24px;
        }

        [data-theme="light"] .activity-list-container {
          background: #ffffff;
          border-color: rgba(156, 124, 62, 0.3);
          border-left-color: var(--gold-dark);
        }

        .activity-list-title {
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 12px;
        }

        [data-theme="light"] .activity-list-title {
          color: var(--gold-dark);
        }

        .activity-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px 20px;
        }

        .activity-item {
          font-size: 13.5px;
          line-height: 1.45;
          color: var(--on-surface);
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .activity-bullet {
          color: var(--gold);
          font-size: 13px;
          line-height: 1;
        }

        [data-theme="light"] .activity-bullet {
          color: var(--gold-dark);
        }

        .activity-action {
          margin-top: 8px;
        }

        @media (max-width: 860px) {
          .activity-grid,
          .activity-block.reversed .activity-grid {
            grid-template-columns: 1fr;
            direction: ltr;
            gap: 28px;
          }
          .activity-media-container {
            aspect-ratio: 16 / 9;
          }
          .activity-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
