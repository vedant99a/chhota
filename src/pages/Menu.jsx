import { useAuth } from '../contexts/AuthContext';

// Placeholder. The real menu is built in a later session.
export default function Menu() {
  const { name, role } = useAuth();

  return (
    <div className="flex flex-col gap-[18px]">
      <h1 className="text-heading font-medium">Menu</h1>
      <div className="flex flex-col gap-2">
        <span className="text-label text-muted">Signed in as</span>
        <span className="text-body">{name || 'Student'}</span>
        <span className="text-label text-muted">Role</span>
        <span className="text-body">{role || 'unknown'}</span>
      </div>
      <p className="text-body text-muted">Nothing on the menu yet.</p>
    </div>
  );
}
