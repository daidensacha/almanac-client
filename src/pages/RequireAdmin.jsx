// src/pages/RequireAdmin.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

export default function RequireAdmin() {
  const { user, ready } = useAuthContext();
  if (!ready) return null;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
