// src/pages/crud/ViewPlant.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Fade,
  Zoom,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ButtonGroup,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import EventIcon from '@mui/icons-material/Event';
import AnimatedPage from '@/components/AnimatedPage';
import moment from 'moment';

import { useAuthContext } from '@/contexts/AuthContext';
import { useEvents } from '@/queries/useEvents';
import { useUnsplashImage } from '@/utils/unsplash';

import CherryTomatoes from '@/images/cherry_tomatoes.jpg';
import Raspberries from '@/images/raspberries.jpg';

export default function ViewPlant() {
  const { state } = useLocation(); // plant object passed via navigate(..., { state })
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const eventsQ = useEvents(user?._id);
  const events = eventsQ.data || [];

  const plantId = state?._id;
  const relatedEvents = plantId ? events.filter((e) => e?.plant?._id === plantId) : [];

  const { url: imageUrl } = useUnsplashImage(state?.common_name, { fallbackUrl: Raspberries });

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
        <Grid
          sx={{
            mt: 8,
            mb: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Plant</h1>

          <Grid container spacing={2}>
            {/* Left image */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={CherryTomatoes}
                />
              </Fade>
            </Grid>

            {/* Center: plant card */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ mt: 5, display: 'flex', flexDirection: 'column' }}
            >
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="center" spacing={2}>
                  <ButtonGroup
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ mx: 'auto' }}
                  >
                    <Button onClick={() => navigate('/plants')}>Plants</Button>
                    <Button onClick={() => navigate('/events')}>Events</Button>
                    <Button onClick={() => navigate('/categories')}>Categories</Button>
                  </ButtonGroup>
                </Stack>
              </Box>

              <Zoom in timeout={1500}>
                <Card sx={{ width: 345, mx: 'auto', mt: 4 }}>
                  <CardMedia
                    component="img"
                    alt={state?.common_name}
                    height="240"
                    image={imageUrl || Raspberries}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      Name: {state?.common_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Botanical Name:
                      </Box>{' '}
                      {state?.botanical_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Sow:
                      </Box>{' '}
                      {(state?.sow_at && moment(state.sow_at).format('D MMM')) ||
                        ' ______________ '}
                      , at{' '}
                      <Box component="span" fontWeight="bold">
                        depth
                      </Box>{' '}
                      {state?.depth || ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Plant:
                      </Box>{' '}
                      {(state?.plant_at && moment(state.plant_at).format('D MMM')) ||
                        ' ______________ '}{' '}
                      with{' '}
                      <Box component="span" fontWeight="bold">
                        spacing
                      </Box>{' '}
                      {state?.spacing || ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Fertilise:
                      </Box>{' '}
                      {state?.fertilise || ' ______________ '} with{' '}
                      {state?.fertiliser_type || ' ______________ '} fertiliser.
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Harvest from:
                      </Box>{' '}
                      {(state?.harvest_at && moment(state.harvest_at).format('D MMM')) ||
                        ' ______________ '}{' '}
                      to{' '}
                      {(state?.harvest_to && moment(state.harvest_to).format('D MMM')) ||
                        ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Notes:
                      </Box>{' '}
                      {state?.notes || ' ______________ '}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            {/* Right: related events */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box size="small" color="primary" aria-label="tip" align="center">
                  <EventIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Events
                </Typography>

                <List dense>
                  {relatedEvents.map((ev) => (
                    <ListItem key={ev._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() => navigate(`/events/${ev._id}`, { state: ev })}
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={ev.event_name} />
                    </ListItem>
                  ))}

                  {relatedEvents.length === 0 && (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge="end" disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary="No related events" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Grid>
          </Grid>

          <Grid item sx={{ my: 4 }}>
            <Button color="secondary" variant="outlined" size="small" onClick={() => navigate(-1)}>
              <ArrowBackIos fontSize="small" />
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

// // src/pages/crud/ViewPlant.jsx
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Container,
//   Grid,
//   Typography,
//   Button,
//   Fade,
//   Zoom,
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Stack,
//   ButtonGroup,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   IconButton,
// } from '@mui/material';
// import PageviewIcon from '@mui/icons-material/Pageview';
// import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
// import EventIcon from '@mui/icons-material/Event';
// import AnimatedPage from '@/components/AnimatedPage';
// import CherryTomatoes from '@/images/cherry_tomatoes.jpg';
// import moment from 'moment';
// import { useUnsplashImage } from '@/utils/unsplash';
// import Raspberries from '@/images/raspberries.jpg';

// import { useAuthContext } from '@/contexts/AuthContext';
// import { useEvents } from '@/queries/useEvents';

// export default function ViewPlant() {
//   const { state } = useLocation(); // plant object passed via navigate(..., { state })
//   const navigate = useNavigate();

//   const { user } = useAuthContext();
//   const eventsQ = useEvents(user?._id);
//   const events = eventsQ.data || [];

//   // Find related events
//   const filteredEvents = events.filter((event) => event.plant?._id === state._id);

//   // Unsplash fallback image
//   const { url: imageUrl } = useUnsplashImage(state?.common_name, { fallbackUrl: Raspberries });

//   return (
//     <AnimatedPage>
//       <Container component="main" maxWidth="xl">
//         <Grid
//           sx={{
//             marginTop: 8,
//             marginBottom: 4,
//             minHeight: 'calc(100vh - 375px)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <h1>Plant</h1>

//           <Grid container spacing={2}>
//             {/* Left image */}
//             <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
//               <Fade in timeout={2000}>
//                 <Box
//                   component="img"
//                   sx={{ maxWidth: '100%', height: 'auto' }}
//                   alt="image"
//                   src={CherryTomatoes}
//                 />
//               </Fade>
//             </Grid>

//             {/* Middle card */}
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={4}
//               sx={{ mt: 5, display: 'flex', flexDirection: 'column' }}
//             >
//               <Box sx={{ width: '100%' }}>
//                 <Stack direction="row" justifyContent="center" spacing={2}>
//                   <ButtonGroup variant="outlined" color="secondary" size="small">
//                     <Button onClick={() => navigate('/plants')}>Plants</Button>
//                     <Button onClick={() => navigate('/events')}>Events</Button>
//                     <Button onClick={() => navigate('/categories')}>Categories</Button>
//                   </ButtonGroup>
//                 </Stack>
//               </Box>

//               <Zoom in timeout={1500}>
//                 <Card sx={{ width: 345, mx: 'auto', mt: 4 }}>
//                   <CardMedia
//                     component="img"
//                     alt={state?.common_name}
//                     height="240"
//                     image={imageUrl || Raspberries}
//                   />
//                   <CardContent>
//                     <Typography gutterBottom variant="h5">
//                       Name: {state.common_name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Botanical Name:
//                       </Box>{' '}
//                       {state.botanical_name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Sow:
//                       </Box>{' '}
//                       {state.sow_at ? moment(state.sow_at).format('D MMM') : ' ______________ '} at{' '}
//                       <Box component="span" fontWeight="bold">
//                         depth
//                       </Box>{' '}
//                       {state.depth || ' ______________ '}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Plant:
//                       </Box>{' '}
//                       {state.plant_at ? moment(state.plant_at).format('D MMM') : ' ______________ '}{' '}
//                       with{' '}
//                       <Box component="span" fontWeight="bold">
//                         spacing
//                       </Box>{' '}
//                       {state.spacing || ' ______________ '}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Fertilise:
//                       </Box>{' '}
//                       {state.fertilise || ' ______________ '} with{' '}
//                       {state.fertiliser_type || ' ______________ '} fertiliser.
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Harvest from:
//                       </Box>{' '}
//                       {state.harvest_at
//                         ? moment(state.harvest_at).format('D MMM')
//                         : ' ______________ '}{' '}
//                       to{' '}
//                       {state.harvest_to
//                         ? moment(state.harvest_to).format('D MMM')
//                         : ' ______________ '}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       <Box component="span" fontWeight="bold">
//                         Notes:
//                       </Box>{' '}
//                       {state.notes || ' ______________ '}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>

//             {/* Right: related events */}
//             <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
//               <Box align="left" sx={{ width: '100%', mt: 4 }}>
//                 <Box align="center">
//                   <EventIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
//                 </Box>
//                 <Typography variant="h3" align="center" sx={{ color: 'secondary.dark' }}>
//                   Related Events
//                 </Typography>
//                 <List dense>
//                   {filteredEvents.map((event) => (
//                     <ListItem key={event._id} disableGutters>
//                       <ListItemIcon>
//                         <IconButton
//                           edge="end"
//                           aria-label="View"
//                           onClick={() => navigate(`/event/${event._id}`, { state: event })}
//                         >
//                           <PageviewIcon color="info" />
//                         </IconButton>
//                       </ListItemIcon>
//                       <ListItemText primary={event.event_name} />
//                     </ListItem>
//                   ))}
//                   {filteredEvents.length === 0 && (
//                     <ListItem disableGutters>
//                       <ListItemIcon>
//                         <IconButton edge="end" disabled>
//                           <PageviewIcon />
//                         </IconButton>
//                       </ListItemIcon>
//                       <ListItemText primary="No related events" />
//                     </ListItem>
//                   )}
//                 </List>
//               </Box>
//             </Grid>
//           </Grid>

//           <Grid item sx={{ my: 4 }}>
//             <Button color="secondary" variant="outlined" size="small" onClick={() => navigate(-1)}>
//               <ArrowBackIos fontSize="small" /> Back
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </AnimatedPage>
//   );
// }
