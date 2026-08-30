import { useState } from 'react';
import { Link } from 'react-router-dom';

// design.md: rows are separated by a 0.5px bottom border, not by gaps or
// individual cards. Dense list, not floating cards.

// The small text actions under each item name. 11px, muted, amber-free.
function RowAction({ onClick, tone = 'muted', children }) {
  const tones = {
    muted: 'text-muted hover:text-text',
    danger: 'text-danger hover:opacity-80',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-label transition-colors ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export default function MenuItemRow({ item, onToggleAvailability, onDelete }) {
  // Delete needs a confirm step, so the row arms first and deletes second.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="hairline py-3">
      <div className="flex items-baseline justify-between gap-3">
        {/* An unavailable item stays legible but drops to muted. */}
        <span className={`text-body ${item.available ? 'text-text' : 'text-muted'}`}>
          {item.name}
        </span>
        <span className="shrink-0 font-mono text-price text-muted">₹{item.price}</span>
      </div>

      {!item.available && (
        <div className="mt-1 text-label text-muted">Unavailable</div>
      )}

      {confirmingDelete ? (
        <div className="mt-2 flex items-center gap-4">
          <span className="text-label text-muted">Delete this item?</span>
          <RowAction onClick={() => setConfirmingDelete(false)}>Cancel</RowAction>
          <RowAction tone="danger" onClick={() => onDelete(item)}>
            Delete
          </RowAction>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <RowAction onClick={() => onToggleAvailability(item)}>
            {item.available ? 'Make unavailable' : 'Make available'}
          </RowAction>
          <Link
            to={`/manage/${item.id}`}
            className="text-label text-muted transition-colors hover:text-text"
          >
            Edit
          </Link>
          <RowAction tone="danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </RowAction>
        </div>
      )}
    </div>
  );
}
