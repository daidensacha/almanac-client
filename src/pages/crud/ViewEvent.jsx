import { useNavigate, useLocation } from 'react-router-dom';
// import instance from '@/utils/axiosClient';
import { Container, Grid, Box } from '@mui/material';
import { Fade, Zoom } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { Card, CardContent, CardMedia } from '@mui/material';
import { Button, IconButton, ListItemIcon } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FaLeaf } from 'react-icons/fa';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Typography from '@mui/material/Typography';
import AnimatedPage from '@/components/AnimatedPage';
import moment from 'moment';
// import { useEventsContext } from '@/contexts/EventsContext';
import { usePlantsContext } from '@/contexts/PlantsContext';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import Broccoli from '@/images/broccoli.jpg';
import { useUnsplashImage } from '@/utils/unsplash';
import Raspberries from '@/images/raspberries.jpg';

const ViewEvent = () => {
  // console.log(useLocation());
  const { state } = useLocation();
  // console.log('STATE', state);
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();

  // const { events, setEvents } = useEventsContext();
  const { plants } = usePlantsContext();
  const { categories } = useCategoriesContext();

  // const plant_name = state.plant.common_name;
  const filteredPlants = plants.filter((plant) => plant._id === state.plant._id);

  // const category_id = state.category._id;
  const filteredCategories = categories.filter((category) => category._id === state.category._id);

  // ViewEvent
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Fade in={true} timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Broccoli}
                />
              </Fade>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                mt: 5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
              }}
            >
              <Box variant="container" sx={{ width: '100%' }}>
                <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      '& > *': {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      color="secondary"
                      size="small"
                      aria-label="small button group"
                    >
                      <Button color="secondary" onClick={() => navigate(`/plants`)}>
                        Plants
                      </Button>
                      <Button color="secondary" onClick={() => navigate('/events')}>
                        Events
                      </Button>
                      <Button variant="outlined" onClick={() => navigate(`/categories`)}>
                        Categories
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
              </Box>
              <Zoom in={true} timeout={1500}>
                <Card sx={{ width: 345, mx: 'auto', mt: 4 }}>
                  <CardMedia
                    component="img"
                    alt={state.plant.common_name}
                    height="240px"
                    minwidth="100%"
                    position="center"
                    overflow="hidden"
                    image={imageUrl || Raspberries}
                    // image={`https://source.unsplash.com/featured/?${state.plant.common_name}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Name: {state.event_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Description:
                      </Box>{' '}
                      {state.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Occurs:
                      </Box>{' '}
                      {moment(state.occurs_at).format('D MMM') || ' ______________ '}{' '}
                      {state.occurs_to && (
                        <Box component="span" fontWeight="bold">
                          to
                        </Box>
                      )}{' '}
                      {state.occurs_to && moment(state.occurs_to).format('D MMM')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Plant:
                      </Box>{' '}
                      {moment(state.plant.plant_at).format('D MMM') || ' ______________ '} with{' '}
                      <Box component="span" fontWeight="bold">
                        spacing
                      </Box>{' '}
                      of {state.plant.spacing || ' ______________ '}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Fertilise:
                      </Box>{' '}
                      {state.plant.fertilise || ' ______________ '} with{' '}
                      {state.plant.fertiliser_type || ' ______________ '} fertiliser.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Harvest from:
                      </Box>{' '}
                      {moment(state.plant.harvest_at).format('D MMM') || ' ______________ '} to{' '}
                      {moment(state.plant.harvest_to).format('D MMM') || ' ______________ '}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Notes:
                      </Box>{' '}
                      {state.notes || ' ______________ '}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box component="div" align="left" sx={{ width: '100%', height: 'auto', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" aria-label="Plants" align="center">
                  <FaLeaf sx={{ color: 'secondary.main', fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ align: 'center', color: 'secondary.dark' }}
                >
                  Related Plant
                </Typography>
                <List sx={{ dense: 'true', size: 'small' }}>
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
                      <ListItemText primary={plant.common_name} secondary="" />
                    </ListItem>
                  ))}
                  {filteredPlants.length === 0 && (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge="end" aria-label="View" disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={'No related events'} secondary="" />
                    </ListItem>
                  )}
                </List>
              </Box>
              <Box component="div" align="left" sx={{ width: '100%', height: 'auto', mt: 4 }}>
                <Box fontSize={36} color="secondary.dark" aria-label="Plants" align="center">
                  <CategoryIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ align: 'center', color: 'secondary.dark' }}
                >
                  Related Category
                </Typography>
                <List sx={{ dense: 'true', size: 'small' }}>
                  {filteredCategories.map((category) => (
                    <ListItem key={category._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() =>
                            navigate(`/category/${category._id}`, {
                              state: category,
                            })
                          }
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={category.category} secondary="" />
                    </ListItem>
                  ))}
                  {filteredCategories.length === 0 && (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge="end" aria-label="View" disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={'No related events'} secondary="" />
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
};

export default ViewEvent;
