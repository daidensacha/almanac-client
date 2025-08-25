import { Outlet, useLocation } from 'react-router-dom';
// import ResponsiveAppBar from '@/components/ui/Navbar';
// import AppToasts from '@/components/ui/AppToasts';
import Footer from '@/components/Footer';

export default function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {/* <ResponsiveAppBar sx={{ bgcolor: 'primary.light' }} />
      <AppToasts /> one global container */}
      <Outlet />
      {!isAdmin && <Footer />}
    </>
  );
}
