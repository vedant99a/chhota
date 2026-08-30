import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

// Wraps the signed-in part of the app. Waits for auth to resolve first,
// otherwise a refresh would bounce a logged-in user to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
