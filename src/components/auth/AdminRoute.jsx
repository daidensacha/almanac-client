// AdminRoute.jsx
import { Outlet } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Forbidden from '@/pages/Forbidden'; // import directly

const AdminRoute = () => {
  const { user } = useAuthContext();

  if (!user) return <Forbidden />; // not signed in
  if (user.role !== 'admin') return <Forbidden />; // signed in but not admin

  return <Outlet />; // allowed
};

export default AdminRoute;
