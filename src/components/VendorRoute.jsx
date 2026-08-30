import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

// The menu manager is vendor-only. A student who types /manage goes home.
// This is a convenience, not the real guard — the Firestore rules are, since
// anyone can call the database directly from the browser console.
export default function VendorRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) return <Loading />;
  if (role !== 'vendor') return <Navigate to="/" replace />;
  return children;
}
