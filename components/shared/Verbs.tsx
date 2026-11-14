import { Reveal } from "@/components/shared/Reveal";
import styles from "./shared.module.css";

export function Verbs({ items }: { items: { word: string; sub: string }[] }) {
  return (
    <Reveal stagger className={styles.verbs}>
      {items.map((item) => (
        <div className={styles.verb} key={item.word}>
          <p className={styles["verb-word"]}>{item.word}</p>
          <p className={styles["verb-sub"]}>{item.sub}</p>
        </div>
      ))}
    </Reveal>
  );
}
