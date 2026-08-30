import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

// The opposite of ProtectedRoute: /login and /signup are for signed-out users.
// Anyone already signed in gets sent to their own home screen.
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/" replace />;
  return children;
}
