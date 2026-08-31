import { useState } from 'react';
import Button from './Button';
import StatusIndicator from './StatusIndicator';
import { STATUS_LABEL, canCancel, nextStatus } from '../lib/orderStatus';

// One order on the vendor queue. Holds its own confirm state, so arming a
// cancel on one row does not arm it on every row.
export default function QueueRow({ order, onAdvance, onCancel }) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const target = nextStatus(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="hairline py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-body text-accent">{order.code}</span>
        <span className="shrink-0 font-mono text-price text-muted">₹{order.total}</span>
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-3">
        <span className="text-body">{order.studentName}</span>
        <span className="shrink-0 font-mono text-price text-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} · {order.pickupSlot}
        </span>
      </div>

      {confirmingCancel ? (
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-label text-muted">Cancel this order?</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className="text-label text-muted transition-colors hover:text-text"
            >
              Keep
            </button>
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="text-label text-danger transition-colors hover:opacity-80"
            >
              Cancel order
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-3">
          <StatusIndicator status={order.status} />
          <div className="flex items-center gap-4">
            {/* Only before the food is ready. */}
            {canCancel(order.status) && (
              <button
                type="button"
                onClick={() => setConfirmingCancel(true)}
                className="text-label text-danger transition-colors hover:opacity-80"
              >
                Cancel
              </button>
            )}
            {target && (
              <Button variant="secondary" onClick={() => onAdvance(order)}>
                Mark {STATUS_LABEL[target].toLowerCase()}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
