// src/pages/crud/ViewEvent.jsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
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
  Modal,
  CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { FaLeaf } from 'react-icons/fa';
import AnimatedPage from '@/components/AnimatedPage';
import dayjs from 'dayjs';
import Raspberries from '@/images/raspberries.jpg';
import Broccoli from '@/images/broccoli.jpg';
import { useUnsplashImage } from '@/utils/unsplash';

import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';
import { useEvent } from '@/queries/useEvents';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { keys as eventKeys } from '@/queries/useEvents';

export default function ViewEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viewState = location.state; // event if navigated with state
  const { user } = useAuthContext();

  // delete/confirm modal (like Events.jsx)
  const [open, setOpen] = useState(false);
  const [deleteCurrentEvent, setDeleteCurrentEvent] = useState(null);
  const handleClose = () => setOpen(false);

  const shouldFetch = !viewState?._id && !!id;

  const eventQ = useEvent(id, {
    enabled: !!id,
    retry: false,
    initialData: viewState?._id ? viewState : undefined,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const ev = eventQ.data ?? viewState;

  const qc = useQueryClient();
  const archiveMutation = useMutation({
    mutationFn: async (eventId) => {
      const { data } = await api.patch(`/event/archive/${eventId}`, { archived: true });
      return data;
    },
    onSuccess: () => {
      toast.success('Event deleted');
      qc.invalidateQueries({ queryKey: eventKeys.all, exact: false });
      // go back to where user came from, or events
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/events', { replace: true });
      }
      handleClose();
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Failed to delete event'),
  });

  const deleteHandler = (_e, eid) => {
    setDeleteCurrentEvent(eid);
    setOpen(true);
  };

  const handleBack = () => {
    if (location.state?.from) return navigate(location.state.from, { replace: true });
    if (window.history.length > 1) return navigate(-1);
    return navigate('/events');
  };

  if (shouldFetch && eventQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center' }}>Loading event…</Box>
        </Container>
      </AnimatedPage>
    );
  }
  if (shouldFetch && eventQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="md">
          <Box sx={{ mt: 10, textAlign: 'center', color: 'error.main' }}>
            Failed to load event.
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
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
              <Button variant="outlined" onClick={handleBack}>
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

  const plantId = ev?.plant?._id ?? ev?.plant_id ?? null;
  const categoryId = ev?.category?._id ?? ev?.category_id ?? null;

  const relatedPlant = plantId
    ? plants.find((p) => String(p._id) === String(plantId)) ?? ev.plant ?? null
    : null;
  const relatedCategory = categoryId
    ? categories.find((c) => String(c._id) === String(categoryId)) ?? ev.category ?? null
    : null;

  const { url: imageUrl } = useUnsplashImage(ev.plant?.common_name, { fallbackUrl: Raspberries });

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
                <Card sx={{ width: 345, mx: 'auto', mt: 4, position: 'relative' }}>
                  {/* Top-right overlay */}
                  <CardMedia
                    component="img"
                    alt={ev?.plant?.common_name || 'Plant image'}
                    height="240"
                    image={imageUrl || Raspberries}
                  />

                  <CardContent>
                    <Typography gutterBottom variant="h5">
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

                  {/* Bottom actions (optional; you already have top overlay) */}
                  <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() =>
                        navigate(`/event/edit/${ev._id}`, {
                          state: { ...ev, from: location.pathname },
                        })
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => deleteHandler(e, ev._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Zoom>
            </Grid>

            {/* Related plant & category */}
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box align="left" sx={{ width: '100%', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" align="center">
                  <FaLeaf />
                </Box>
                <Typography variant="h4" align="center" sx={{ color: 'secondary.dark' }}>
                  Related Plant
                </Typography>
                <List dense>
                  {plantsQ.isLoading ? (
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
                        <IconButton edge="end" disabled={!plantId}>
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
                  {catsQ.isLoading ? (
                    <ListItem>
                      <ListItemText primary="Loading…" />
                    </ListItem>
                  ) : relatedCategory ? (
                    <ListItem key={relatedCategory._id}>
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
                      <ListItemText
                        primary={relatedCategory.category_name || relatedCategory.category}
                      />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <IconButton edge="end" disabled={!categoryId}>
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
            <Button color="secondary" variant="outlined" size="small" onClick={handleBack}>
              <ArrowBackIos fontSize="small" /> Back
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirm Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 380,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete this event?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => archiveMutation.mutate(deleteCurrentEvent)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </AnimatedPage>
  );
}
