import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormError from '../components/FormError';
import QuantityStepper from '../components/QuantityStepper';
import SelectField from '../components/SelectField';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { generatePickupSlots } from '../lib/pickupSlots';
import { placeOrder } from '../services/orderService';

export default function Cart() {
  const navigate = useNavigate();
  const { user, name } = useAuth();
  const { lines, setQty, removeItem, clear, total } = useCart();

  // Worked out once when the screen opens. Good enough for a canteen order,
  // and it avoids a timer re-rendering the list every second.
  const slots = useMemo(() => generatePickupSlots(), []);

  const [pickupSlot, setPickupSlot] = useState(slots[0] || '');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  async function handlePlaceOrder() {
    setError('');

    if (lines.length === 0) return setError('Your cart is empty.');
    if (!pickupSlot) return setError('Pick a collection time.');

    setPlacing(true);
    try {
      const orderId = await placeOrder({
        studentId: user.uid,
        studentName: name || 'Student',
        // One canteen, so every line carries the same vendor.
        vendorId: lines[0].vendorId,
        items: lines,
        total,
        pickupSlot,
      });
      clear();
      navigate(`/order/${orderId}`, { replace: true });
    } catch {
      setError('Could not place that order. Try again.');
      setPlacing(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-[18px]">
        <h1 className="text-heading font-medium">Cart</h1>
        <p className="text-body text-muted">Your cart is empty.</p>
        <Button variant="secondary" onClick={() => navigate('/menu')}>
          Browse menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="text-heading font-medium">Cart</h1>

      <div className="flex flex-col">
        {lines.map((line) => (
          <div key={line.menuItemId} className="hairline py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-body">{line.name}</span>
              <span className="shrink-0 font-mono text-price text-muted">
                ₹{line.price * line.qty}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <QuantityStepper qty={line.qty} onChange={(next) => setQty(line.menuItemId, next)} />
              <button
                type="button"
                onClick={() => removeItem(line.menuItemId)}
                className="text-label text-muted transition-colors hover:text-text"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-label text-muted">Total</span>
        <span className="font-mono text-metric">₹{total}</span>
      </div>

      {slots.length > 0 ? (
        <SelectField
          id="pickupSlot"
          label="Collect at"
          mono
          options={slots.map((slot) => ({ value: slot, label: slot }))}
          value={pickupSlot}
          onChange={(event) => setPickupSlot(event.target.value)}
        />
      ) : (
        <p className="text-body text-muted">No collection times available.</p>
      )}

      <FormError message={error} />

      <Button fullWidth disabled={placing || slots.length === 0} onClick={handlePlaceOrder}>
        {placing ? 'Placing order' : 'Place order'}
      </Button>

      <Link to="/menu" className="text-label text-muted transition-colors hover:text-text">
        Add more items
      </Link>
    </div>
  );
}
