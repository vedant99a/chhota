import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import FormError from '../components/FormError';
import SelectField from '../components/SelectField';
import TextField from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES } from '../lib/categories';
import { createMenuItem, getMenuItem, updateMenuItem } from '../services/menuService';

// One component serves both /manage/new and /manage/:id. The only difference is
// whether there is an id in the URL: if there is, we load that item first and
// update on submit instead of creating.
export default function ManageItem() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  // Set when the item could not be loaded at all, so we show the reason
  // instead of an empty form pretending to edit something.
  const [loadFailed, setLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !user) return undefined;

    let active = true;
    getMenuItem(id)
      .then((item) => {
        if (!active) return;
        if (!item) {
          setError('That item no longer exists.');
          setLoadFailed(true);
        } else if (item.vendorId !== user.uid) {
          // Belt and braces. The Firestore rules are the real guard.
          setError('That item belongs to another vendor.');
          setLoadFailed(true);
        } else {
          setName(item.name);
          setPrice(String(item.price));
          setCategory(item.category);
          setAvailable(item.available);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Could not load that item. Check your connection and reload.');
        setLoadFailed(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEdit, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const priceInRupees = Number(price);

    if (!trimmedName) return setError('Enter an item name.');
    if (!Number.isInteger(priceInRupees) || priceInRupees <= 0) {
      return setError('Price must be a whole number of rupees, above zero.');
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateMenuItem(id, {
          name: trimmedName,
          price: priceInRupees,
          category,
          available,
        });
      } else {
        await createMenuItem({
          name: trimmedName,
          price: priceInRupees,
          category,
          available,
          vendorId: user.uid,
        });
      }
      navigate('/manage');
    } catch {
      setError('Could not save that item. Try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-label text-muted">Loading</p>;
  }

  if (loadFailed) {
    return (
      <div className="flex flex-col items-start gap-[18px]">
        <h1 className="text-heading font-medium">Edit item</h1>
        <FormError message={error} />
        <Button variant="secondary" onClick={() => navigate('/manage')}>
          Back to menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="text-heading font-medium">{isEdit ? 'Edit item' : 'Add item'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <TextField
          id="name"
          label="Name"
          type="text"
          placeholder="Maggi, extra masala"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <TextField
          id="price"
          label="Price in rupees"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="40"
          mono
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />

        <SelectField
          id="category"
          label="Category"
          options={CATEGORIES}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />

        {/* Availability is set here and also toggled straight from the list. */}
        <div className="flex flex-col gap-2">
          <span className="text-label text-muted">Availability</span>
          <div className="flex gap-2">
            {[
              { value: true, label: 'Available' },
              { value: false, label: 'Unavailable' },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAvailable(option.value)}
                aria-pressed={available === option.value}
                className={[
                  'h-11 flex-1 rounded-lg border text-body transition-colors',
                  available === option.value
                    ? 'border-accent bg-surface text-accent'
                    : 'border-border bg-transparent text-muted hover:border-muted',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <FormError message={error} />

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Saving' : 'Save item'}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => navigate('/manage')}
        className="text-label text-muted transition-colors hover:text-text"
      >
        Cancel
      </button>
    </div>
  );
}
