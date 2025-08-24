// src/pages/crud/ViewCategory.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Fade,
  Zoom,
  Button,
  Stack,
  ButtonGroup,
  IconButton,
} from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import EventIcon from '@mui/icons-material/Event';
import AnimatedPage from '@/components/AnimatedPage';
import Beetroot from '@/images/beetroot.jpg';
import Raspberries from '@/images/raspberries.jpg';
import { useUnsplashImage } from '@/utils/unsplash';
import { useAuthContext } from '@/contexts/AuthContext';
import { useEvents } from '@/queries/useEvents'; // 🔑 new hook

export default function ViewCategory() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // fetch this user’s events
  const eventsQ = useEvents(user?._id);
  const events = eventsQ.data || [];

  // filter by category
  const filteredEvents = events.filter((event) => event.category?._id === state._id);

  // image helper
  const { url: imageUrl } = useUnsplashImage(state?.category);

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Category</h1>
          <Grid container spacing={2}>
            {/* left column image */}
            <Grid item xs={12} sm={6} md={4}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Beetroot}
                />
              </Fade>
            </Grid>

            {/* center info */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Stack direction="row" justifyContent="center">
                <ButtonGroup variant="outlined" color="secondary" size="small">
                  <Button onClick={() => navigate('/plants')}>Plants</Button>
                  <Button onClick={() => navigate('/events')}>Events</Button>
                  <Button onClick={() => navigate('/categories')}>Categories</Button>
                </ButtonGroup>
              </Stack>

              <Zoom in timeout={1500}>
                <Card sx={{ width: 345, mx: 'auto', mt: 4 }}>
                  <CardMedia
                    component="img"
                    alt={state.category}
                    height="240"
                    image={imageUrl || Raspberries}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      Category: {state.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description: {state.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>

            {/* right related events */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box sx={{ mt: 4 }}>
                <Box align="center">
                  <EventIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
                </Box>
                <Typography variant="h3" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Events
                </Typography>
                <List>
                  {filteredEvents.map((event) => (
                    <ListItem key={event._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() => navigate(`/event/${event._id}`, { state: event })}
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={event.event_name} />
                    </ListItem>
                  ))}
                  {filteredEvents.length === 0 && (
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
          {/* back button */}
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
