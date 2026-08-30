import { useEffect, useState } from 'react';
import Button from '../components/Button';
import FormError from '../components/FormError';
import StatusIndicator from '../components/StatusIndicator';
import { useAuth } from '../contexts/AuthContext';
import { STATUS_LABEL, isOpen, nextStatus } from '../lib/orderStatus';
import { advanceOrder, subscribeToVendorOrders } from '../services/orderService';

export default function Queue() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    // Live, so a new order appears here the moment a student places it.
    const unsubscribe = subscribeToVendorOrders(
      user.uid,
      (loaded) => {
        setOrders(loaded);
        setLoading(false);
      },
      () => {
        setError('Could not load the queue. Check your connection and reload.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  async function handleAdvance(order) {
    setError('');
    try {
      await advanceOrder(order.id, order.status);
    } catch {
      setError('Could not update that order. Try again.');
    }
  }

  // Collected and cancelled orders drop off the queue. Filtered here rather
  // than in the query so it stays a single where clause with no index.
  const openOrders = orders.filter((order) => isOpen(order.status));

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="text-heading font-medium">Queue</h1>

      <FormError message={error} />

      {loading && <p className="text-label text-muted">Loading</p>}

      {!loading && openOrders.length === 0 && !error && (
        <p className="text-body text-muted">No open orders.</p>
      )}

      <div className="flex flex-col">
        {openOrders.map((order) => {
          const target = nextStatus(order.status);
          const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

          return (
            <div key={order.id} className="hairline py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-body text-accent">{order.code}</span>
                <span className="shrink-0 font-mono text-price text-muted">₹{order.total}</span>
              </div>

              <div className="mt-1 flex items-baseline justify-between gap-3">
                <span className="text-body">{order.studentName}</span>
                <span className="shrink-0 font-mono text-price text-muted">
                  {itemCount} items · {order.pickupSlot}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <StatusIndicator status={order.status} />
                {target && (
                  <Button variant="secondary" onClick={() => handleAdvance(order)}>
                    Mark {STATUS_LABEL[target].toLowerCase()}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
