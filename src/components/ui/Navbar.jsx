// src/components/Navbar.jsx
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import WeatherNavbarTicker from '@/components/weather/WeatherNavbarTicker';

import { useAuthContext } from '@/contexts/AuthContext';
import './Navbar.css';
import logo from '../../images/flower.png';

// Elevation on scroll (unchanged)
function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return React.cloneElement(children, { elevation: trigger ? 4 : 0 });
}

export default function ResponsiveAppBar() {
  const { user, signout } = useAuthContext();
  // console.log('NAVBAR_AUTH_CONTEXT:', user);
  const navigate = useNavigate();

  const handleSignout = () => {
    // use the context’s signout, then go Home
    signout();
    navigate('/', { replace: true });
  };

  const pages = user
    ? [
        { menuTitle: 'Home', pageUrl: '/' },
        { menuTitle: 'Almanac', pageUrl: '/almanac' },

        { menuTitle: 'Contact', pageUrl: '/contact' },
        { menuTitle: 'Sign out', pageUrl: '/signout' }, // handled specially
      ]
    : [
        { menuTitle: 'Home', pageUrl: '/' },
        { menuTitle: 'Sign in', pageUrl: '/signin' },
        { menuTitle: 'Sign up', pageUrl: '/signup' },
        { menuTitle: 'Contact', pageUrl: '/contact' },
      ];

  const settings = user
    ? [
        // { menuTitle: 'Admin', pageUrl: '/admin' }, // if you want to hide for non-admin, gate below
        ...(user?.role === 'admin' ? [{ menuTitle: 'Admin', pageUrl: '/admin' }] : []),
        { menuTitle: 'Profile', pageUrl: '/profile' },
        { menuTitle: 'Events', pageUrl: '/events' },
        { menuTitle: 'Plants', pageUrl: '/plants' },
        { menuTitle: 'Categories', pageUrl: '/categories' },
      ]
    : [
        { menuTitle: 'Sign in', pageUrl: '/signin' },
        { menuTitle: 'Sign up', pageUrl: '/signup' },
      ];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Helper to render a page button (keeps your styles)
  function PageButton({ menuTitle, pageUrl }) {
    if (menuTitle === 'Sign out') {
      return (
        <Button
          key={menuTitle}
          onClick={() => {
            handleCloseNavMenu();
            handleSignout();
          }}
          sx={{ my: 0, color: 'inherit', display: 'block' }}
        >
          {menuTitle}
        </Button>
      );
    }
    // Hide Admin for non-admin users (optional)
    if (menuTitle === 'Admin' && user?.role !== 'admin') return null;

    return (
      <Button
        key={menuTitle}
        onClick={handleCloseNavMenu}
        sx={{ my: 0, color: 'inherit', display: 'block' }}
      >
        <NavLink
          to={pageUrl}
          end
          className={({ isActive }) => (isActive ? 'active' : '')}
          style={{ textDecoration: 'none' }}
        >
          {menuTitle}
        </NavLink>
      </Button>
    );
  }

  return (
    <ElevationScroll>
      <AppBar
        variant="elevation"
        position="sticky"
        color="primary"
        enableColorOnDark
        sx={{ zIndex: (t) => t.zIndex.drawer + 2 }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Brand (desktop) */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex', alignItems: 'center' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Box component="img" sx={{ mr: 1, height: 24, top: 5 }} alt="Logo" src={logo} />
              ALMANAC
            </Typography>
            <WeatherNavbarTicker />

            {/* Mobile menu button */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="open navigation"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ mt: '15px', display: { xs: 'block', md: 'none' } }}
              >
                {pages.map(({ menuTitle, pageUrl }) => (
                  <MenuItem key={menuTitle} onClick={handleCloseNavMenu}>
                    {menuTitle === 'Sign out' ? (
                      <Button
                        fullWidth
                        onClick={() => {
                          handleCloseNavMenu();
                          handleSignout();
                        }}
                        sx={{ color: 'inherit' }}
                      >
                        {menuTitle}
                      </Button>
                    ) : (
                      <Typography textAlign="center">
                        <NavLink
                          to={pageUrl}
                          end
                          className={({ isActive }) => (isActive ? 'active' : '')}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {menuTitle}
                        </NavLink>
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Brand (mobile) */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ALMANAC
            </Typography>

            {/* Desktop menu */}
            <Box
              sx={{ flexGrow: 1, justifyContent: 'flex-end', display: { xs: 'none', md: 'flex' } }}
            >
              {pages.map((p) => (
                <PageButton key={p.menuTitle} {...p} />
              ))}
            </Box>

            {/* Profile menu only when auth is ready & user exists */}
            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 4 }} aria-label="account">
                  <AccountCircle />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map(({ menuTitle, pageUrl }) => (
                    <MenuItem key={menuTitle} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        <NavLink
                          to={pageUrl}
                          end
                          className={({ isActive }) => (isActive ? 'active' : '')}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {menuTitle}
                        </NavLink>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
