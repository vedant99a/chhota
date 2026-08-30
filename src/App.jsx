import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import RoleHome from './components/RoleHome';
import VendorRoute from './components/VendorRoute';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ManageItem from './pages/ManageItem';
import ManageMenu from './pages/ManageMenu';
import Menu from './pages/Menu';
import OrderStatus from './pages/OrderStatus';
import Orders from './pages/Orders';
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<OrderStatus />} />
        <Route path="/queue" element={<Queue />} />

        {/* Vendor only. The Firestore rules are the real guard; this just
            keeps a student who types the URL out of a screen meant for
            somebody else. */}
        <Route
          path="/manage"
          element={
            <VendorRoute>
              <ManageMenu />
            </VendorRoute>
          }
        />
        <Route
          path="/manage/new"
          element={
            <VendorRoute>
              <ManageItem />
            </VendorRoute>
          }
        />
        <Route
          path="/manage/:id"
          element={
            <VendorRoute>
              <ManageItem />
            </VendorRoute>
          }
        />
      </Route>

      {/* Anything else goes home, which then redirects by role */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
