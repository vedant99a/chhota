import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const STUDENT_LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'Orders' },
];

const VENDOR_LINKS = [
  { to: '/queue', label: 'Queue' },
  { to: '/manage', label: 'Menu' },
  { to: '/summary', label: 'Today' },
];

function linkClass({ isActive }) {
  return `text-label transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-text'}`;
}

// PRD.md: logout is a header button, not a screen.
export default function Header() {
  const { role, logout } = useAuth();
  const { count } = useCart();

  const links = role === 'vendor' ? VENDOR_LINKS : STUDENT_LINKS;

  return (
    <header className="hairline">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-3 px-4">
        <span className="text-heading font-medium">Chhota</span>

        <div className="flex items-center gap-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {/* Cart count badge. Students only, and only once there is one. */}
          {role !== 'vendor' && count > 0 && (
            <NavLink to="/cart" className={linkClass}>
              Cart <span className="font-mono">{count}</span>
            </NavLink>
          )}

          <button
            type="button"
            onClick={logout}
            className="text-label text-muted transition-colors hover:text-text"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
