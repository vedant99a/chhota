// Minus, a monospace count, plus. Used on the menu row and in the cart.
export default function QuantityStepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label="Reduce quantity"
        className="h-7 w-7 rounded-lg border border-border text-body text-muted transition-colors hover:border-muted hover:text-text"
      >
        &minus;
      </button>
      <span className="min-w-4 text-center font-mono text-price">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Increase quantity"
        className="h-7 w-7 rounded-lg border border-border text-body text-muted transition-colors hover:border-muted hover:text-text"
      >
        +
      </button>
    </div>
  );
}
