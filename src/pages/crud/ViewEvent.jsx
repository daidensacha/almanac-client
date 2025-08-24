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

export default function ViewEvent() {
  const { state } = useLocation(); // event object passed via navigate(..., { state })
  const navigate = useNavigate();

  const filteredPlants = state?.plant ? [state.plant] : [];
  const filteredCategories = state?.category ? [state.category] : [];

  // Image for the plant name (fallback provided)
  const { url: imageUrl } = useUnsplashImage(state?.plant?.common_name, {
    fallbackUrl: Raspberries,
  });

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
                  {filteredPlants.map((plant) => (
                    <ListItem key={plant._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() => navigate(`/plant/${plant._id}`, { state: plant })}
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={plant.common_name} />
                    </ListItem>
                  ))}
                  {filteredPlants.length === 0 && (
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
                  {filteredCategories.map((category) => (
                    <ListItem key={category._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() => navigate(`/category/${category._id}`, { state: category })}
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={category.category} />
                    </ListItem>
                  ))}
                  {filteredCategories.length === 0 && (
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
