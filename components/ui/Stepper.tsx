import styles from "./ui.module.css";
export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className={styles["checkout-stepper"]}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        return (
          <div className={styles["checkout-step"]} key={label}>
            <span className={`${styles["checkout-step-circle"]}${stepNum <= current ? " active" : ""}`}>{stepNum}</span>
            <span className={`${styles["checkout-step-label"]}${stepNum <= current ? " active" : ""}`}>{label}</span>
            {i < steps.length - 1 && <span className={styles["checkout-step-line"]} />}
          </div>
        );
      })}
    </div>
  );
}
