import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Vendors work across two screens, so they get links between them.
// Students have one screen for now and get no nav.
const VENDOR_LINKS = [
  { to: '/queue', label: 'Queue' },
  { to: '/manage', label: 'Menu' },
];

// PRD.md: logout is a header button, not a screen.
export default function Header() {
  const { role, logout } = useAuth();

  return (
    <header className="hairline">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between gap-3 px-4">
        <span className="text-heading font-medium">Chhota</span>

        <div className="flex items-center gap-4">
          {role === 'vendor' &&
            VENDOR_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-label transition-colors ${
                    isActive ? 'text-accent' : 'text-muted hover:text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

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
