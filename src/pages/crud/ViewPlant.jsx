import { useNavigate, useLocation } from 'react-router-dom';
// import instance from '@/utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AnimatedPage from '@/components/AnimatedPage';
import { Fade, Zoom } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useEventsContext } from '@/contexts/EventsContext';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import EventIcon from '@mui/icons-material/Event';
import CherryTomatoes from '@/images/cherry_tomatoes.jpg';
import moment from 'moment';
import { useUnsplashImage } from '@/utils/unsplash';
import Raspberries from '@/images/raspberries.jpg';

const ViewPlant = () => {
  // console.log(useLocation());
  const { state } = useLocation();
  // console.log('STATE', state);

  const { events } = useEventsContext();
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();

  // const plant_id = state._id;
  const filteredEvents = events.filter((event) => event.plant._id === state._id);

  // ViewPlant
  const { url: imageUrl } = useUnsplashImage(state?.common_name, {
    fallbackUrl: Raspberries,
  });
  // <Box component="img" src={imageUrl || Raspberries} ... />

  // console.log('Unsplash key:', import.meta.env.VITE_UNSPLASH_ACCESS_KEY);

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
          <h1>Plant</h1>

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
                  src={CherryTomatoes}
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
                    alt={state?.common_name}
                    height="240px"
                    minwidth="100%"
                    position="center"
                    overflow="hidden"
                    image={imageUrl || Raspberries}
                    // image={`https://source.unsplash.com/featured/?${state?.common_name}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Name: {state.common_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Botanical Name:
                      </Box>{' '}
                      {state.botanical_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Sow:
                      </Box>{' '}
                      {moment(state.sow_at).format('D MMM') || ' ______________ '}, and at{' '}
                      <Box component="span" fontWeight="bold">
                        depth
                      </Box>{' '}
                      of {state.depth || ' ______________ '}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Plant:
                      </Box>{' '}
                      {moment(state.plant_at).format('D MMM') || ' ______________ '} with{' '}
                      <Box component="span" fontWeight="bold">
                        spacing
                      </Box>{' '}
                      of {state.spacing || ' ______________ '}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Fertilise:
                      </Box>{' '}
                      {state.fertilise || ' ______________ '} with{' '}
                      {state.fertiliser_type || ' ______________ '} fertiliser.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" fontWeight="bold">
                        Harvest from:
                      </Box>{' '}
                      {moment(state.harvest_at).format('D MMM') || ' ______________ '} to{' '}
                      {moment(state.harvest_to).format('D MMM') || ' ______________ '}
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
                <Box size="small" color="primary" aria-label="tip" align="center">
                  <EventIcon sx={{ color: 'secondary.main', fontSize: '36px' }} />
                </Box>
                <Typography
                  variant="h3"
                  align="center"
                  sx={{ align: 'center', color: 'secondary.dark' }}
                >
                  Related Events
                </Typography>
                <List sx={{ dense: 'true', size: 'small' }}>
                  {filteredEvents.map((event) => (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="View"
                          onClick={() => navigate(`/event/${event._id}`, { state: event })}
                        >
                          <PageviewIcon color="info" />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={event.event_name} secondary="" />
                    </ListItem>
                  ))}
                  {filteredEvents.length === 0 && (
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

export default ViewPlant;
