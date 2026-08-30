import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import FormError from '../components/FormError';
import QuantityStepper from '../components/QuantityStepper';
import { useCart } from '../contexts/CartContext';
import { groupByCategory } from '../lib/categories';
import { subscribeToMenu } from '../services/menuService';

export default function Menu() {
  const { lines, addItem, setQty, count, total } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Live, so the menu reflects the vendor's edits without a refresh.
    const unsubscribe = subscribeToMenu(
      (loaded) => {
        setItems(loaded);
        setLoading(false);
      },
      () => {
        setError('Could not load the menu. Check your connection and reload.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const qtyOf = (menuItemId) => {
    const line = lines.find((entry) => entry.menuItemId === menuItemId);
    return line ? line.qty : 0;
  };

  const groups = groupByCategory(items);

  return (
    <div className="flex flex-col gap-[18px] pb-20">
      <h1 className="text-heading font-medium">Menu</h1>

      <FormError message={error} />

      {loading && <p className="text-label text-muted">Loading</p>}

      {!loading && items.length === 0 && !error && (
        <p className="text-body text-muted">Nothing on the menu yet.</p>
      )}

      {groups.map((group) => (
        <CategorySection key={group.value} label={group.label}>
          {group.items.map((item) => {
            const qty = qtyOf(item.id);

            return (
              <div key={item.id} className="hairline py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className={`text-body ${item.available ? 'text-text' : 'text-muted'}`}>
                    {item.name}
                  </span>
                  <span className="shrink-0 font-mono text-price text-muted">₹{item.price}</span>
                </div>

                <div className="mt-2">
                  {!item.available ? (
                    <span className="text-label text-muted">Unavailable</span>
                  ) : qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      className="text-label text-muted transition-colors hover:text-text"
                    >
                      Add
                    </button>
                  ) : (
                    <QuantityStepper qty={qty} onChange={(next) => setQty(item.id, next)} />
                  )}
                </div>
              </div>
            );
          })}
        </CategorySection>
      ))}

      {/* One primary action on this screen, and it only appears once there is
          something to act on. 153 items is a long scroll back to the header. */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-canvas">
          <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-3">
            <Link
              to="/cart"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-body text-canvas transition-colors hover:bg-[#E09B33]"
            >
              <span>View cart</span>
              <span className="font-mono text-price">
                {count} · ₹{total}
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
