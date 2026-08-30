import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import RoleHome from './components/RoleHome';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Queue from './pages/Queue';
import Signup from './pages/Signup';

export default function App() {
  return (
    <Routes>
      {/* Signed out */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />

      {/* Signed in: everything below shares the header and the 420px column */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleHome />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/queue" element={<Queue />} />
      </Route>

      {/* Anything else goes home, which then redirects by role */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
