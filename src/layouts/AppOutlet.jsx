// src/layouts/AppShell.jsx
import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveAppBar from '@/components/ui/Navbar';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer';

export default function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} />
      <ToastContainer />
      <Outlet />
      {!isAdmin && <Footer />} {/* hide footer on admin */}
    </>
  );
}
