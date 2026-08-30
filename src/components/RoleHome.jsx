import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// The "/" route. One login screen, two home screens: the role on the user
// document decides which one renders.
export default function RoleHome() {
  const { role } = useAuth();
  return <Navigate to={role === 'vendor' ? '/queue' : '/menu'} replace />;
}
