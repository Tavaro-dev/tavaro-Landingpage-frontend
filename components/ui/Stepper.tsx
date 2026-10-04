export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="checkout-stepper">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        return (
          <div className="checkout-step" key={label}>
            <span className={`checkout-step-circle${stepNum <= current ? " active" : ""}`}>{stepNum}</span>
            <span className={`checkout-step-label${stepNum <= current ? " active" : ""}`}>{label}</span>
            {i < steps.length - 1 && <span className="checkout-step-line" />}
          </div>
        );
      })}
    </div>
  );
}
