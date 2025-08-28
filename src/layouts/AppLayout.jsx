import { Box, useTheme } from '@mui/material';
// import Footer from '../components/Footer';

export default function AppLayout({ children }) {
  const theme = useTheme();
  const toolbarHeight = theme.mixins.toolbar.minHeight;
  return (
    <Box
      sx={{
        minHeight: '100vh',
        // minHeight: `calc(100vh - ${toolbarHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main content */}
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>

      {/* Footer */}
      {/* <Footer /> */}
    </Box>
  );
}
