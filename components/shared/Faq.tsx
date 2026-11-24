import { JsonLd } from "./JsonLd";
import styles from "./Faq.module.css";

export type FaqItem = { q: string; a: string };

/** Plain-language questions and answers, shown to people and marked up (FAQPage) for search and AI answers. */
export function Faq({ items, title = "Questions, answered" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className={styles.faq} aria-labelledby="faq-title">
      <div className="container">
        <span className="eyebrow">FAQ</span>
        <h2 id="faq-title" className={styles.title}>{title}</h2>
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </section>
  );
}
