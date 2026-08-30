import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormError from '../components/FormError';
import StatusIndicator from '../components/StatusIndicator';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToStudentOrders } from '../services/orderService';

// A timestamp is still null for a moment after placing, while the write is
// pending on the server.
function shortDate(timestamp) {
  if (!timestamp) return '—';
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    const unsubscribe = subscribeToStudentOrders(
      user.uid,
      (loaded) => {
        setOrders(loaded);
        setLoading(false);
      },
      () => {
        setError('Could not load your orders. Check your connection and reload.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="text-heading font-medium">Orders</h1>

      <FormError message={error} />

      {loading && <p className="text-label text-muted">Loading</p>}

      {!loading && orders.length === 0 && !error && (
        <div className="flex flex-col items-start gap-[18px]">
          <p className="text-body text-muted">No orders yet.</p>
          <Button variant="secondary" onClick={() => navigate('/menu')}>
            Browse menu
          </Button>
        </div>
      )}

      <div className="flex flex-col">
        {orders.map((order) => (
          <Link key={order.id} to={`/order/${order.id}`} className="hairline block py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-body text-accent">{order.code}</span>
              <span className="shrink-0 font-mono text-price text-muted">₹{order.total}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <StatusIndicator status={order.status} />
              <span className="font-mono text-price text-muted">{shortDate(order.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
