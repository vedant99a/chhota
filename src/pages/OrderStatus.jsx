import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FormError from '../components/FormError';
import ProgressTrack from '../components/ProgressTrack';
import StatusIndicator from '../components/StatusIndicator';
import { subscribeToOrder } from '../services/orderService';

// The live screen. The student opens this after placing an order and watches
// it change as the vendor advances the status, with no refresh and no polling.
export default function OrderStatus() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToOrder(
      id,
      (loaded) => {
        setOrder(loaded);
        setLoading(false);
      },
      () => {
        setError('Could not load that order. Check your connection and reload.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [id]);

  if (loading) return <p className="text-label text-muted">Loading</p>;

  if (error || !order) {
    return (
      <div className="flex flex-col items-start gap-[18px]">
        <h1 className="text-heading font-medium">Order</h1>
        <FormError message={error || 'That order no longer exists.'} />
        <Link to="/orders" className="text-label text-muted transition-colors hover:text-text">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-2">
        <span className="text-label text-muted">Order code</span>
        <span className="font-mono text-hero text-accent">{order.code}</span>
      </div>

      <div className="flex flex-col gap-2">
        <StatusIndicator status={order.status} />
        <ProgressTrack status={order.status} />
      </div>

      <div className="flex flex-col">
        {order.items.map((item) => (
          <div
            key={item.menuItemId}
            className="hairline flex items-baseline justify-between gap-3 py-3"
          >
            <span className="text-body">
              {item.name}
              <span className="ml-2 font-mono text-price text-muted">×{item.qty}</span>
            </span>
            <span className="shrink-0 font-mono text-price text-muted">
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-label text-muted">Collect at</span>
          <span className="font-mono text-price">{order.pickupSlot}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-label text-muted">Total</span>
          <span className="font-mono text-metric">₹{order.total}</span>
        </div>
      </div>

      <Link to="/orders" className="text-label text-muted transition-colors hover:text-text">
        All orders
      </Link>
    </div>
  );
}
