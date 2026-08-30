import { useAuth } from '../contexts/AuthContext';

// PRD.md: logout is a header button, not a screen.
export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="hairline">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4">
        <span className="text-heading font-medium">Chhota</span>
        <button
          type="button"
          onClick={logout}
          className="text-body text-muted transition-colors hover:text-text"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
