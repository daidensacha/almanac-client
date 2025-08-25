// src/pages/crud/ViewEvent.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  ListItemIcon,
  Typography,
  Stack,
  ButtonGroup,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { FaLeaf } from 'react-icons/fa';
import AnimatedPage from '@/components/AnimatedPage';
import moment from 'moment';
import Broccoli from '@/images/broccoli.jpg';
import Raspberries from '@/images/raspberries.jpg';
import { useUnsplashImage } from '@/utils/unsplash';

import { useAuthContext } from '@/contexts/AuthContext';
import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';

export default function ViewEvent() {
  const { state } = useLocation(); // expecting full event object via navigate(..., { state })
  const navigate = useNavigate();

  // If someone hit /events/:id directly without state, keep it graceful.
  if (!state?._id) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No event data available.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/events')}>
              Back to Events
            </Button>
          </Box>
        </Container>
      </AnimatedPage>
    );
  }

  const { user } = useAuthContext();
  const plantsQ = usePlants(user?._id);
  const catsQ = useCategories(user?._id);

  const plants = plantsQ.data || [];
  const categories = catsQ.data || [];

  const eventPlantId = state?.plant?._id;
  const eventCategoryId = state?.category?._id;

  const relatedPlant = eventPlantId ? plants.find((p) => p._id === eventPlantId) : null;
  const relatedCategory = eventCategoryId
    ? categories.find((c) => c._id === eventCategoryId)
    : null;

  // Image for the plant name (fallback provided)
  const { url: imageUrl } = useUnsplashImage(state?.plant?.common_name, {
    fallbackUrl: Raspberries,
  });

  // While options load, we can still render the main card; related lists show placeholders
  const plantsLoading = plantsQ.isLoading || plantsQ.error;
  const catsLoading = catsQ.isLoading || catsQ.error;

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
          <h1>Event</h1>

          <Grid container spacing={2}>
            {/* Left image panel */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
            >
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Broccoli}
                />
              </Fade>
            </Grid>

            {/* Center: event card */}
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
                    alt={state?.plant?.common_name}
                    height="240"
                    image={imageUrl || Raspberries}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      Name: {state?.event_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Description:
                      </Box>{' '}
                      {state?.description}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Occurs:
                      </Box>{' '}
                      {state?.occurs_at
                        ? moment(state.occurs_at).format('D MMM')
                        : ' ______________ '}
                      {state?.occurs_to && (
                        <>
                          {' '}
                          <Box component="span" fontWeight="bold">
                            to
                          </Box>{' '}
                          {moment(state.occurs_to).format('D MMM')}
                        </>
                      )}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Plant:
                      </Box>{' '}
                      {(state?.plant?.plant_at && moment(state.plant.plant_at).format('D MMM')) ||
                        ' ______________ '}{' '}
                      with{' '}
                      <Box component="span" fontWeight="bold">
                        spacing
                      </Box>{' '}
                      {state?.plant?.spacing || ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Fertilise:
                      </Box>{' '}
                      {state?.plant?.fertilise || ' ______________ '} with{' '}
                      {state?.plant?.fertiliser_type || ' ______________ '} fertiliser.
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Harvest from:
                      </Box>{' '}
                      {(state?.plant?.harvest_at &&
                        moment(state.plant.harvest_at).format('D MMM')) ||
                        ' ______________ '}{' '}
                      to{' '}
                      {(state?.plant?.harvest_to &&
                        moment(state.plant.harvest_to).format('D MMM')) ||
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

            {/* Right: related plant & category */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" align="center">
                  <FaLeaf />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Plant
                </Typography>
                <List dense>
                  {plantsLoading ? (
                    <ListItem disableGutters>
                      <ListItemText primary="Loading…" />
                    </ListItem>
                  ) : relatedPlant ? (
                    <ListItem key={relatedPlant._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() =>
                            navigate(`/plant/${relatedPlant._id}`, { state: relatedPlant })
                          }
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={relatedPlant.common_name} />
                    </ListItem>
                  ) : (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge="end" disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary="No related plant" />
                    </ListItem>
                  )}
                </List>
              </Box>

              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" align="center">
                  <CategoryIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Category
                </Typography>
                <List dense>
                  {catsLoading ? (
                    <ListItem disableGutters>
                      <ListItemText primary="Loading…" />
                    </ListItem>
                  ) : relatedCategory ? (
                    <ListItem key={relatedCategory._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() =>
                            navigate(`/category/${relatedCategory._id}`, { state: relatedCategory })
                          }
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={relatedCategory.category} />
                    </ListItem>
                  ) : (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge="end" disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary="No related category" />
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
