// src/pages/crud/ViewEvent.jsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
import dayjs from 'dayjs';
import Broccoli from '@/images/broccoli.jpg';
import Raspberries from '@/images/raspberries.jpg';
import { useUnsplashImage } from '@/utils/unsplash';

import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';
import { useEvent } from '@/queries/useEvents';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { serializeCategory } from '@/utils/normalizers';
import { keys as categoryKeys } from '@/queries/useCategories';
import { isInSeason, formatRangeThisYear, recurrenceText } from '@utils/dateHelpers';

export default function ViewEvent() {
  const { state } = useLocation(); // optional event object passed by navigate
  const { id } = useParams(); // /event/:id
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Fallback fetch if no state provided
  // const eventQ = useEvent(id, { enabled: !state?._id, retry: false });

  // Only fetch when there's no event in state, AND we have an id
  const shouldFetch = !state?._id && !!id;
  // const eventQ = useEvent(id, { enabled: shouldFetch, retry: false });
  // const eventQ = useEvent(id, {
  //   enabled: !!id,
  //   initialData: state?._id ? state : undefined,
  //   refetchOnMount: 'always', // <- forces queryFn to run
  //   staleTime: 0, // treat cache as stale
  //   retry: false,
  // });

  // // Event source: either state or fetched
  // const ev = state?._id ? state : eventQ.data?.event ?? eventQ.data;

  const eventQ = useEvent(id, {
    enabled: !!id,
    retry: false,
    initialData: state?._id ? state : undefined, // paint instantly
    refetchOnMount: 'always',
    staleTime: 0,
  });

  // ✅ Prefer fetched/normalized data; fallback to state only if needed
  const ev = eventQ.data ?? state;

  // ...inside ViewEvent component, after computing `ev`
  useEffect(() => {
    console.log('[ViewEvent] handoff →', {
      from: eventQ.data ? 'query(data)' : state?._id ? 'state' : 'none',
      plant: (eventQ.data ?? state)?.plant,
    });
  }, [eventQ.data, state]);

  console.log('[ViewEvent] ev:', ev);
  // Loading / error only when fetching
  if (!state?._id && eventQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center' }}>Loading event…</Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (!state?._id && eventQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center', color: 'error.main' }}>
            Failed to load event.
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/events')}>
                Back to Events
              </Button>
            </Box>
          </Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (!ev?._id) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            No event data available.
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/events')}>
                Back to Events
              </Button>
            </Box>
          </Box>
        </Container>
      </AnimatedPage>
    );
  }

  // Related lists
  const plantsQ = usePlants(false, { enabled: true });
  const catsQ = useCategories(false, { enabled: true });

  const plants = plantsQ.data || [];
  const categories = catsQ.data || [];

  // Normalized IDs
  const plantId = ev?.plant?._id ?? ev?.plant_id ?? null;
  const categoryId = ev?.category?._id ?? ev?.category_id ?? null;

  // Try to find in options, fall back to embedded object
  const relatedPlant = plantId
    ? plants.find((p) => String(p._id) === String(plantId)) ?? ev.plant ?? null
    : null;
  const relatedCategory = categoryId
    ? categories.find((c) => String(c._id) === String(categoryId)) ?? ev.category ?? null
    : null;

  const { url: imageUrl } = useUnsplashImage(ev.plant?.common_name, { fallbackUrl: Raspberries });

  const plantsLoading = plantsQ.isLoading || plantsQ.error;
  const catsLoading = catsQ.isLoading || catsQ.error;

  const p = ev.plant || {};
  const inSeason = isInSeason(ev.occurs_at, ev.occurs_to);
  const occurs = formatRangeThisYear(ev.occurs_at, ev.occurs_to);
  const recur = recurrenceText(ev);

  console.log('inSeason:', inSeason);
  console.log('occurs:', occurs);
  console.log('recur:', recur);

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
            {/* Left image */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Broccoli}
                />
              </Fade>
            </Grid>

            {/* Event card */}
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
                    alt={ev?.plant?.common_name || 'Plant image'}
                    height="240"
                    image={imageUrl || Raspberries}
                  />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Name: {ev.event_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Description:
                      </Box>{' '}
                      {ev.description || ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Occurs:
                      </Box>{' '}
                      {ev.occurs_at ? dayjs(ev.occurs_at).format('D MMM') : ' ______________ '}
                      {ev.occurs_to && (
                        <>
                          {' '}
                          <Box component="span" fontWeight="bold">
                            to
                          </Box>{' '}
                          {dayjs(ev.occurs_to).format('D MMM')}
                        </>
                      )}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Plant:
                      </Box>{' '}
                      {ev.plant?.plant_at
                        ? dayjs(ev.plant?.plant_at).format('D MMM')
                        : ' ______________ '}
                      {' with '}
                      <Box component="span" fontWeight="bold">
                        spacing
                      </Box>{' '}
                      {ev.plant?.spacing || ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Fertilise:
                      </Box>{' '}
                      {ev.plant?.fertilise || ' ______________ '} with{' '}
                      {ev.plant?.fertiliser_type || ' ______________ '} fertiliser.
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Harvest from:
                      </Box>{' '}
                      {ev.plant?.harvest_at
                        ? dayjs(ev.plant?.harvest_at).format('D MMM')
                        : ' ______________ '}
                      {' to '}
                      {ev.plant?.harvest_to
                        ? dayjs(ev.plant?.harvest_to).format('D MMM')
                        : ' ______________ '}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Notes:
                      </Box>{' '}
                      {ev.notes || ' ______________ '}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
              {/* <CardContent>
                    <Typography gutterBottom variant="h5">
                      Name: {ev.event_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Description:</b> {ev.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Occurs:</b> {ev.occurs_at ? dayjs(ev.occurs_at).format('D MMM') : ' __ '}
                      {ev.occurs_to && (
                        <>
                          {' '}
                          <b>to</b> {dayjs(ev.occurs_to).format('D MMM')}
                        </>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Notes:</b> {ev.notes || ' __ '}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom> */}
            </Grid>

            {/* Related plant & category */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              {/* Plant */}
              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" align="center">
                  <FaLeaf />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Plant
                </Typography>
                <List dense>
                  {plantsLoading ? (
                    <ListItem>
                      <ListItemText primary="Loading…" />
                    </ListItem>
                  ) : relatedPlant ? (
                    <ListItem key={relatedPlant._id}>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() =>
                            navigate(`/plant/${String(relatedPlant._id)}`, { state: relatedPlant })
                          }
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={relatedPlant.common_name} />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          disabled={!plantId}
                          onClick={() => plantId && navigate(`/plant/${relatedPlant._id}`)}
                        >
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary="No related plant" />
                    </ListItem>
                  )}
                </List>
              </Box>

              {/* Category */}
              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" align="center">
                  <CategoryIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Category
                </Typography>
                <List dense>
                  {catsLoading ? (
                    <ListItem>
                      <ListItemText primary="Loading…" />
                    </ListItem>
                  ) : // {filteredCategories.map(category => should be a mapping function here
                  relatedCategory ? (
                    <ListItem key={relatedCategory._id}>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() =>
                            navigate(`/category/${relatedCategory._id}`, {
                              state: relatedCategory.category_name,
                            })
                          }
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={relatedCategory.category_name || relatedCategory.category}
                      />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          disabled={!categoryId}
                          onClick={() => categoryId && navigate(`/category/${String(categoryId)}`)}
                        >
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary="No related category" />
                    </ListItem>
                  )}
                </List>
              </Box>

              {/* End category box */}
            </Grid>
          </Grid>

          <Grid item sx={{ my: 4 }}>
            <Button color="secondary" variant="outlined" size="small" onClick={() => navigate(-1)}>
              <ArrowBackIos fontSize="small" /> Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}
