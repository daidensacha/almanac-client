// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import DnsIcon from '@mui/icons-material/Dns';
import ScienceIcon from '@mui/icons-material/Science';
import WbSunny from '@mui/icons-material/WbSunny';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Toolbar,
  Stack,
} from '@mui/material';
import { useState } from 'react';

// ...imports unchanged...

// ...imports unchanged...
const drawerWidth = 240;

// Tweak these to match your app
const APPBAR_H_XS = 56; // global navbar height on xs
const APPBAR_H_SM = 64; // global navbar height >= sm
const FOOTER_H = 64; // your footer’s height (adjust if needed)

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const toggle = () => setMobileOpen((v) => !v);

  const menu = [
    { to: '/admin/overview', label: 'Overview', icon: <SpaceDashboardIcon /> },
    { to: '/admin/users', label: 'Users', icon: <PeopleIcon /> },
    { to: '/admin/almanac', label: 'Almanac', icon: <LocalFloristIcon /> },
    { to: '/admin/dev', label: 'Dev Tools', icon: <DnsIcon /> },
    { to: '/admin/lab', label: 'Lab', icon: <ScienceIcon /> },
    { to: '/admin/weather', label: 'Weather', icon: <WbSunny /> },
  ];

  const drawer = (
    <div>
      {/* space equal to global navbar height */}
      <Toolbar />
      <Divider />
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={loc.pathname === item.to}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin folders"
      >
        {/* Mobile drawer (overlays content) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: APPBAR_H_XS,
              bottom: FOOTER_H,
              height: `calc(100vh - ${APPBAR_H_XS}px - ${FOOTER_H}px)`,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer (permanent) */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: APPBAR_H_SM,
              bottom: FOOTER_H,
              height: `calc(100vh - ${APPBAR_H_SM}px - ${FOOTER_H}px)`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          // keep main content clear of navbar + footer too
          minHeight: {
            xs: `calc(100vh - ${APPBAR_H_XS}px - ${FOOTER_H}px)`,
            sm: `calc(100vh - ${APPBAR_H_SM}px - ${FOOTER_H}px)`,
          },
          pb: `${FOOTER_H}px`, // extra breathing room above footer
        }}
      >
        {/* spacer to drop content under the global navbar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
