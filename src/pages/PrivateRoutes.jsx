// src/pages/PrivateRoutes.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

export default function PrivateRoutes() {
  const { user, token } = useAuthContext(); // token should be hydrated from localStorage
  const loc = useLocation();

  // If we already have a user, allow
  if (user) return <Outlet />;

  // If we at least have a token (e.g., on reload before user was re-fetched),
  // allow so pages/contexts can load; don't block with a spinner.
  if (token) return <Outlet />;

  // Otherwise, bounce to signin
  return <Navigate to="/signin" replace state={{ from: loc }} />;
}
