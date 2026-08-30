import { STATUS_FLOW, stepsCompleted } from '../lib/orderStatus';

// design.md: four 3px bars with 4px gaps, filling left to right.
// Filled is accent, empty is border. A cancelled order fills none.
export default function ProgressTrack({ status }) {
  const filled = stepsCompleted(status);

  return (
    <div className="flex gap-1" aria-hidden="true">
      {STATUS_FLOW.map((step, index) => (
        <span
          key={step}
          className={`h-[3px] flex-1 transition-colors ${index < filled ? 'bg-accent' : 'bg-border'}`}
        />
      ))}
    </div>
  );
}
