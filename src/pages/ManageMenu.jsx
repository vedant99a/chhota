import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import CategorySection from '../components/CategorySection';
import FormError from '../components/FormError';
import MenuItemRow from '../components/MenuItemRow';
import { useAuth } from '../contexts/AuthContext';
import { groupByCategory } from '../lib/categories';
import {
  deleteMenuItem,
  setMenuItemAvailability,
  subscribeToVendorItems,
} from '../services/menuService';

export default function ManageMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    // A live listener rather than a one-off read: after an edit, a toggle or a
    // delete the list updates itself, so there is no re-fetch to remember.
    const unsubscribe = subscribeToVendorItems(
      user.uid,
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
  }, [user]);

  async function handleToggleAvailability(item) {
    setError('');
    try {
      await setMenuItemAvailability(item.id, !item.available);
    } catch {
      setError('Could not update that item. Try again.');
    }
  }

  async function handleDelete(item) {
    setError('');
    try {
      await deleteMenuItem(item.id);
    } catch {
      setError('Could not delete that item. Try again.');
    }
  }

  const groups = groupByCategory(items);

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-heading font-medium">Menu</h1>
        <Button onClick={() => navigate('/manage/new')}>Add item</Button>
      </div>

      <FormError message={error} />

      {loading && <p className="text-label text-muted">Loading</p>}

      {!loading && items.length === 0 && (
        <p className="text-body text-muted">No items on the menu yet.</p>
      )}

      {groups.map((group) => (
        <CategorySection key={group.value} label={group.label}>
          {group.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDelete}
            />
          ))}
        </CategorySection>
      ))}
    </div>
  );
}
