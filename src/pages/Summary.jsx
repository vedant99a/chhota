import { useEffect, useState } from 'react';
import FormError from '../components/FormError';
import MetricTile from '../components/MetricTile';
import StatusIndicator from '../components/StatusIndicator';
import { useAuth } from '../contexts/AuthContext';
import { STATUS_FLOW } from '../lib/orderStatus';
import { subscribeToVendorOrders } from '../services/orderService';

// Same calendar day as now, in the browser's timezone.
function isToday(timestamp) {
  if (!timestamp) return true; // a write still pending on the server is today
  const date = timestamp.toDate();
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export default function Summary() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    // The same live listener the queue uses, so the numbers move as orders do.
    const unsubscribe = subscribeToVendorOrders(
      user.uid,
      (loaded) => {
        setOrders(loaded);
        setLoading(false);
      },
      () => {
        setError('Could not load the summary. Check your connection and reload.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const today = orders.filter((order) => isToday(order.createdAt));

  // A cancelled order never happened, so it is not revenue. Everything else
  // counts: the money is taken at the counter on collection.
  const revenue = today
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  const countFor = (status) => today.filter((order) => order.status === status).length;
  const cancelled = countFor('cancelled');

  return (
    <div className="flex flex-col gap-[22px]">
      <h1 className="text-heading font-medium">Today</h1>

      <FormError message={error} />

      {loading && <p className="text-label text-muted">Loading</p>}

      {!loading && !error && (
        <>
          <div className="flex gap-2">
            <MetricTile label="Orders" value={today.length} />
            <MetricTile label="Revenue" value={`₹${revenue}`} />
          </div>

          <div className="flex flex-col">
            {STATUS_FLOW.map((status) => (
              <div
                key={status}
                className="hairline flex items-center justify-between gap-3 py-3"
              >
                <StatusIndicator status={status} />
                <span className="font-mono text-price text-muted">{countFor(status)}</span>
              </div>
            ))}

            {/* Only shown once something has actually been cancelled. */}
            {cancelled > 0 && (
              <div className="hairline flex items-center justify-between gap-3 py-3">
                <StatusIndicator status="cancelled" />
                <span className="font-mono text-price text-muted">{cancelled}</span>
              </div>
            )}
          </div>

          {today.length === 0 && <p className="text-body text-muted">No orders today.</p>}
        </>
      )}
    </div>
  );
}
