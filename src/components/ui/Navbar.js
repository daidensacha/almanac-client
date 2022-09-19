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
import { Link, NavLink } from 'react-router-dom';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import './Navbar.css';
import logo from '../../images/flower.png';

// Set elevation scroll
function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

// Set user for testing
const user = false;

// Define menu items
const pages = user
  ? [
      { menuTitle: 'Home', pageUrl: '/' },
      { menuTitle: 'Almanac', pageUrl: 'almanac' },
      { menuTitle: 'Logout', pageUrl: 'logout' },
      { menuTitle: 'Contact', pageUrl: 'contact' },
    ]
  : [
      { menuTitle: 'Home', pageUrl: '/' },
      { menuTitle: 'Sign in', pageUrl: 'login' },
      { menuTitle: 'Register', pageUrl: 'register' },
      { menuTitle: 'Contact', pageUrl: 'contact' },
    ];

const settings = user
  ? [
      { menuTitle: 'Profile', pageUrl: 'profile' },
      { menuTitle: 'Calendar', pageUrl: 'calendar' },
      { menuTitle: 'Events', pageUrl: 'events' },
      { menuTitle: 'Plants', pageUrl: 'plants' },
      { menuTitle: 'Categories', pageUrl: 'categories' },
    ]
  : [
      { menuTitle: 'Sign in', pageUrl: 'login' },
      { menuTitle: 'Register', pageUrl: 'register' },
    ];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ElevationScroll>
      <AppBar
        variant='elevation'
        position='sticky'
        color='primary'
        enableColorOnDark>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='a'
              href='/'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex', alignItems: 'center' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
                <Box
                  component="img"
                  sx={{ mr: 1, height: 24, top: 5 }}
                  alt="Logo"
                  src={logo}
                />
              ALMANAC
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'>
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  mt: '15px',
                  display: { xs: 'block', md: 'none' },
                }}>
                {pages.map(({ menuTitle, pageUrl }) => (
                  <MenuItem key={menuTitle} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>
                      <NavLink
                        to={pageUrl} end
                        className = {({isActive}) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}>
                        {menuTitle}
                      </NavLink>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h5'
              noWrap
              component='a'
              href=''
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              ALMANAC
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: 'flex-end',
                display: { xs: 'none', md: 'flex' },
              }}>
              {pages.map(({ menuTitle, pageUrl }) => (
                <Button
                  key={menuTitle}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'inherit', display: 'block' }}>
                  <NavLink
                    to={`${pageUrl}`} end
                    className = {({isActive}) => isActive ? 'active' : ''}
                    style={{ textDecoration: 'none' }}
                    >
                    {menuTitle}
                  </NavLink>
                </Button>
              ))}
            </Box>
            {user && (
              <Box sx={{ flexGrow: 0 }}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 4 }}>
                    <AccountCircle />
                  </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.map(({ menuTitle, pageUrl }) => (
                    <MenuItem key={menuTitle} onClick={handleCloseUserMenu}>
                      <Typography textAlign='center'>
                        <Link
                          to={`/${pageUrl}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}>
                          {menuTitle}
                        </Link>
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
};

export default ResponsiveAppBar;
