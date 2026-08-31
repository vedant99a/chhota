import { useEffect, useState } from 'react';
import FormError from '../components/FormError';
import QueueRow from '../components/QueueRow';
import { useAuth } from '../contexts/AuthContext';
import { isOpen } from '../lib/orderStatus';
import { advanceOrder, cancelOrder, subscribeToVendorOrders } from '../services/orderService';

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

  async function handleCancel(order) {
    setError('');
    try {
      await cancelOrder(order.id);
    } catch {
      setError('Could not cancel that order. Try again.');
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
        {openOrders.map((order) => (
          <QueueRow
            key={order.id}
            order={order}
            onAdvance={handleAdvance}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}
