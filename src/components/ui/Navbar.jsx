// src/components/Navbar.jsx
import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';

import WeatherNavbarTicker from '@/components/weather/WeatherNavbarTicker';
import { useAuthContext } from '@/contexts/AuthContext';
import logo from '@/images/flower.png'; // adjust if your path is different

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return React.cloneElement(children, { elevation: trigger ? 4 : 0 });
}

// Small helper to keep your desktop buttons
function PageButton({ menuTitle, pageUrl, onClick }) {
  return (
    <Button key={menuTitle} onClick={onClick} sx={{ my: 0, color: 'inherit', display: 'block' }}>
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

const iconFor = (title) => {
  const t = title.toLowerCase();
  if (t === 'home') return <HomeIcon />;
  if (t === 'almanac') return <CalendarMonthIcon />;
  if (t === 'contact') return <ContactPageIcon />;
  if (t === 'admin') return <AdminPanelSettingsIcon />;
  if (t === 'profile') return <PersonIcon />;
  if (t === 'events') return <EventNoteIcon />;
  if (t === 'plants') return <LocalFloristIcon />;
  if (t === 'categories') return <CategoryIcon />;
  if (t === 'sign out') return <LogoutIcon />;
  return null;
};

export default function ResponsiveAppBar() {
  const { user, signout } = useAuthContext();
  const navigate = useNavigate();

  // inside component
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSignout = () => {
    signout();
    navigate('/', { replace: true });
  };

  /** Primary pages (top-level nav) */
  const pages = user
    ? [
        { menuTitle: 'Home', pageUrl: '/' },
        { menuTitle: 'Almanac', pageUrl: '/almanac' },
        { menuTitle: 'Contact', pageUrl: '/contact' },
        { menuTitle: 'Sign out', pageUrl: '/signout' }, // handled specially in Drawer
      ]
    : [
        { menuTitle: 'Home', pageUrl: '/' },
        { menuTitle: 'Almanac', pageUrl: '/almanac' },
        { menuTitle: 'Sign in', pageUrl: '/signin' },
        { menuTitle: 'Sign up', pageUrl: '/signup' },
        { menuTitle: 'Contact', pageUrl: '/contact' },
      ];

  /** User pages (account area) */
  const settings = user
    ? [
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

  // Desktop account menu
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Mobile drawer (merged menus)
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggleMobile = (open) => () => setMobileOpen(open);

  // const mobileItems = [
  //   { section: 'Main', items: pages },
  //   ...(user
  //     ? [
  //         {
  //           section: 'Your stuff',
  //           items: settings.filter((s) => !['Sign in', 'Sign up'].includes(s.menuTitle)),
  //         },
  //       ]
  //     : []),
  // ];
  // remove "Sign out" from pages for the mobile drawer
  const mobileItems = [
    { section: 'Main', items: pages.filter((p) => p.menuTitle !== 'Sign out') },
    ...(user
      ? [
          {
            section: 'Your stuff',
            items: settings.filter((s) => !['Sign in', 'Sign up'].includes(s.menuTitle)),
          },
        ]
      : []),
  ];

  return (
    <ElevationScroll>
      <AppBar variant="elevation" position="sticky" color="primary" enableColorOnDark>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minWidth: 0, gap: 1 }}>
            {/* LEFT cluster */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {/* Hamburger (mobile) */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton onClick={toggleMobile(true)} color="inherit" aria-label="open menu">
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Brand (desktop) */}
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  mr: 1,
                }}
              >
                <Box
                  component="img"
                  sx={{ mr: 1, height: 24, position: 'relative', top: 2 }}
                  alt="Logo"
                  src={logo}
                />
                ALMANAC
              </Typography>

              {/* Brand (mobile) */}
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                ALMANAC
              </Typography>
              <WeatherNavbarTicker compact={isXs} />
            </Box>

            {/* MIDDLE – ticker (center, ellipsizes) */}
            <Box
              sx={{
                display: { xs: 'flex', sm: 'flex' }, // hide on very small phones if needed
                alignItems: 'center',
                flexGrow: 1,
                minWidth: 0,
                justifyContent: 'center',
                overflow: 'hidden',
                maxWidth: { xs: 220, sm: 360, md: 520 },
              }}
            >
              {/* <WeatherNavbarTicker compact={isXs} /> */}
            </Box>

            {/* RIGHT cluster (desktop nav + account) */}
            <Box
              sx={{
                // display: 'flex',
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end', // <- push links to the right
                flexGrow: 1,
                gap: 1,
                flexShrink: 0,
              }}
            >
              {/* Desktop menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {pages
                  .filter((p) => !['Sign in', 'Sign up', 'Sign out'].includes(p.menuTitle)) // keep auth in user menu / drawer
                  .map((p) => (
                    <PageButton key={p.menuTitle} {...p} onClick={() => {}} />
                  ))}
              </Box>

              {/* Account icon (desktop only) */}
              {user && (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton onClick={handleOpenUserMenu} aria-label="account" sx={{ ml: 1 }}>
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
                      <MenuItem
                        key={menuTitle}
                        onClick={() => {
                          handleCloseUserMenu();
                          if (menuTitle === 'Sign out') handleSignout();
                          else navigate(pageUrl);
                        }}
                      >
                        <Typography textAlign="center">{menuTitle}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* MOBILE DRAWER (single menu) */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={toggleMobile(false)}
          ModalProps={{ keepMounted: true }}
        >
          <Box
            sx={{ width: 280, pt: 1 }}
            role="presentation"
            onClick={toggleMobile(false)}
            onKeyDown={toggleMobile(false)}
          >
            {mobileItems.map(({ section, items }, idx) => (
              <List
                key={section}
                subheader={
                  <ListSubheader
                    disableSticky
                    sx={{ bgcolor: 'transparent', fontWeight: 700, color: 'text.secondary' }}
                  >
                    {section}
                  </ListSubheader>
                }
              >
                {items.map(({ menuTitle, pageUrl }) => (
                  <ListItemButton
                    key={`${section}-${menuTitle}`}
                    onClick={() => {
                      if (menuTitle === 'Sign out') handleSignout();
                      else navigate(pageUrl);
                    }}
                  >
                    {iconFor(menuTitle) && <ListItemIcon>{iconFor(menuTitle)}</ListItemIcon>}
                    <ListItemText primary={menuTitle} />
                  </ListItemButton>
                ))}
                {idx < mobileItems.length - 1 && <Divider sx={{ my: 1 }} />}
              </List>
            ))}

            {/* Sign out pinned at bottom (optional) */}
            {user && (
              <>
                <Divider />
                <List>
                  <ListItemButton onClick={handleSignout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                  </ListItemButton>
                </List>
              </>
            )}
          </Box>
        </Drawer>
      </AppBar>
    </ElevationScroll>
  );
}

// // src/components/Navbar.jsx
// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import useScrollTrigger from '@mui/material/useScrollTrigger';
// import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
// import WeatherNavbarTicker from '@/components/weather/WeatherNavbarTicker';

// import { useAuthContext } from '@/contexts/AuthContext';
// import './Navbar.css';
// import logo from '../../images/flower.png';

// // Elevation on scroll (unchanged)
// function ElevationScroll(props) {
//   const { children } = props;
//   const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
//   return React.cloneElement(children, { elevation: trigger ? 4 : 0 });
// }

// export default function ResponsiveAppBar() {
//   const { user, signout } = useAuthContext();
//   // console.log('NAVBAR_AUTH_CONTEXT:', user);
//   const navigate = useNavigate();

//   const handleSignout = () => {
//     // use the context’s signout, then go Home
//     signout();
//     navigate('/', { replace: true });
//   };

//   const pages = user
//     ? [
//         { menuTitle: 'Home', pageUrl: '/' },
//         { menuTitle: 'Almanac', pageUrl: '/almanac' },

//         { menuTitle: 'Contact', pageUrl: '/contact' },
//         { menuTitle: 'Sign out', pageUrl: '/signout' }, // handled specially
//       ]
//     : [
//         { menuTitle: 'Home', pageUrl: '/' },
//         { menuTitle: 'Sign in', pageUrl: '/signin' },
//         { menuTitle: 'Sign up', pageUrl: '/signup' },
//         { menuTitle: 'Contact', pageUrl: '/contact' },
//       ];

//   const settings = user
//     ? [
//         // { menuTitle: 'Admin', pageUrl: '/admin' }, // if you want to hide for non-admin, gate below
//         ...(user?.role === 'admin' ? [{ menuTitle: 'Admin', pageUrl: '/admin' }] : []),
//         { menuTitle: 'Profile', pageUrl: '/profile' },
//         { menuTitle: 'Events', pageUrl: '/events' },
//         { menuTitle: 'Plants', pageUrl: '/plants' },
//         { menuTitle: 'Categories', pageUrl: '/categories' },
//       ]
//     : [
//         { menuTitle: 'Sign in', pageUrl: '/signin' },
//         { menuTitle: 'Sign up', pageUrl: '/signup' },
//       ];

//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
//   const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
//   const handleCloseNavMenu = () => setAnchorElNav(null);
//   const handleCloseUserMenu = () => setAnchorElUser(null);

//   // Helper to render a page button (keeps your styles)
//   function PageButton({ menuTitle, pageUrl }) {
//     if (menuTitle === 'Sign out') {
//       return (
//         <Button
//           key={menuTitle}
//           onClick={() => {
//             handleCloseNavMenu();
//             handleSignout();
//           }}
//           sx={{ my: 0, color: 'inherit', display: 'block' }}
//         >
//           {menuTitle}
//         </Button>
//       );
//     }
//     // Hide Admin for non-admin users (optional)
//     if (menuTitle === 'Admin' && user?.role !== 'admin') return null;

//     return (
//       <Button
//         key={menuTitle}
//         onClick={handleCloseNavMenu}
//         sx={{ my: 0, color: 'inherit', display: 'block' }}
//       >
//         <NavLink
//           to={pageUrl}
//           end
//           className={({ isActive }) => (isActive ? 'active' : '')}
//           style={{ textDecoration: 'none' }}
//         >
//           {menuTitle}
//         </NavLink>
//       </Button>
//     );
//   }

//   return (
//     <ElevationScroll>
//       <AppBar
//         variant="elevation"
//         position="sticky"
//         color="primary"
//         enableColorOnDark
//         sx={{ zIndex: (t) => t.zIndex.drawer + 2 }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ minWidth: 0, gap: 1 }}>
//             {/* LEFT cluster: hamburger + brand */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
//               {/* Mobile hamburger */}
//               <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//                 <IconButton
//                   size="large"
//                   aria-label="open navigation"
//                   aria-controls="menu-appbar"
//                   aria-haspopup="true"
//                   onClick={handleOpenNavMenu}
//                   color="inherit"
//                 >
//                   <MenuIcon />
//                 </IconButton>
//               </Box>

//               {/* Brand (desktop) */}
//               <Typography
//                 variant="h6"
//                 noWrap
//                 component={RouterLink}
//                 to="/"
//                 sx={{
//                   display: { xs: 'none', md: 'flex' },
//                   alignItems: 'center',
//                   fontFamily: 'monospace',
//                   fontWeight: 700,
//                   letterSpacing: '.1rem',
//                   color: 'inherit',
//                   textDecoration: 'none',
//                 }}
//               >
//                 <Box component="img" sx={{ mr: 1, height: 24, top: 5 }} alt="Logo" src={logo} />
//                 ALMANAC
//               </Typography>

//               {/* Brand (mobile) */}
//               <Typography
//                 variant="h6"
//                 noWrap
//                 component={RouterLink}
//                 to="/"
//                 sx={{
//                   display: { xs: 'flex', md: 'none' },
//                   fontFamily: 'monospace',
//                   fontWeight: 700,
//                   letterSpacing: '.1rem',
//                   color: 'inherit',
//                   textDecoration: 'none',
//                 }}
//               >
//                 ALMANAC
//               </Typography>
//             </Box>

//             {/* MIDDLE: ticker (gets the remaining space; truncates if needed) */}
//             <Box
//               sx={{
//                 display: { xs: 'none', sm: 'flex' }, // hide on very small phones if you want
//                 alignItems: 'center',
//                 flexGrow: 1,
//                 minWidth: 0,
//                 justifyContent: 'center',
//                 overflow: 'hidden',
//                 mx: 1,
//               }}
//             >
//               <WeatherNavbarTicker />
//             </Box>

//             {/* RIGHT cluster: desktop nav + profile */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
//               {/* Desktop menu */}
//               <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//                 {pages.map((p) => (
//                   <PageButton key={p.menuTitle} {...p} />
//                 ))}
//               </Box>

//               {/* Account icon (signed-in) */}
//               {user && (
//                 <Box sx={{ flexShrink: 0 }}>
//                   <IconButton
//                     onClick={handleOpenUserMenu}
//                     sx={{ p: 0, ml: 1 }}
//                     aria-label="account"
//                   >
//                     <AccountCircle />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>

//             {/* Mobile nav menu (unchanged, just keep it here so it's in the DOM) */}
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//               keepMounted
//               transformOrigin={{ vertical: 'top', horizontal: 'left' }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ mt: '15px', display: { xs: 'block', md: 'none' } }}
//             >
//               {pages.map(({ menuTitle, pageUrl }) => (
//                 <MenuItem key={menuTitle} onClick={handleCloseNavMenu}>
//                   {menuTitle === 'Sign out' ? (
//                     <Button
//                       fullWidth
//                       onClick={() => {
//                         handleCloseNavMenu();
//                         handleSignout();
//                       }}
//                       sx={{ color: 'inherit' }}
//                     >
//                       {menuTitle}
//                     </Button>
//                   ) : (
//                     <Typography textAlign="center">
//                       <NavLink
//                         to={pageUrl}
//                         end
//                         className={({ isActive }) => (isActive ? 'active' : '')}
//                         style={{ textDecoration: 'none', color: 'inherit' }}
//                       >
//                         {menuTitle}
//                       </NavLink>
//                     </Typography>
//                   )}
//                 </MenuItem>
//               ))}
//             </Menu>

//             {/* Profile menu (unchanged) */}
//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-user"
//               anchorEl={anchorElUser}
//               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//               keepMounted
//               transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map(({ menuTitle, pageUrl }) => (
//                 <MenuItem key={menuTitle} onClick={handleCloseUserMenu}>
//                   <Typography textAlign="center">
//                     <NavLink
//                       to={pageUrl}
//                       end
//                       className={({ isActive }) => (isActive ? 'active' : '')}
//                       style={{ textDecoration: 'none', color: 'inherit' }}
//                     >
//                       {menuTitle}
//                     </NavLink>
//                   </Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </ElevationScroll>
//   );
// }
