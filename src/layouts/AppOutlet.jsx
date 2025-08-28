// AppOutlet.jsx
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveAppBar from '@/components/ui/Navbar';
import Footer from '@/components/Footer';

export default function AppOutlet() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveAppBar />

      {/* This Box MUST grow to push the footer down */}
      <Box
        component="main"
        sx={{
          flex: '1 1 auto', // same as flexGrow: 1
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // prevents flex overflow issues if a child scrolls
        }}
      >
        <Outlet />
      </Box>

      {!isAdmin && <Footer />}
    </Box>
  );
}
