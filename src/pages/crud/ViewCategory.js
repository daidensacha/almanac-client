import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import instance from '../../utils/axiosClient';
import { List, ListItem, ListItemText } from '@mui/material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Fade, Zoom } from '@mui/material';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import EventIcon from '@mui/icons-material/Event';
import AnimatedPage from '../../components/AnimatedPage';
import Beetroot from '../../images/beetroot.jpg';
import { useEventsContext } from '../../contexts/EventsContext';

const ViewCategory = () => {
  console.log(useLocation());
  // State category from previous page
  const { state } = useLocation();

  // Get all events from context
  const { events } = useEventsContext();
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();

  // console.log('VIEW CATEGORY CONTEXT EVENTS', events);
  // console.log('VIEW CATEGORY STATE', state);

  // const category_id = state._id;

  const filteredEvents = events.filter(
    event => event.category._id === state._id,
  );
  // console.log('VIEW CATEGORY FILTERED EVENTS', filteredEvents);

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xl'>
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Category</h1>
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
              }}>
              <Fade in={true} timeout={2000}>
                <Box
                  component='img'
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt='image'
                  src={Beetroot}
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
              }}>
              <Box variant='container' sx={{ width: '100%' }}>
                <Stack
                  direction='row'
                  sx={{ justifyContent: 'center' }}
                  spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      '& > *': {
                        m: 1,
                      },
                    }}>
                    <ButtonGroup
                      variant='outlined'
                      color='secondary'
                      size='small'
                      aria-label='small button group'>
                      <Button
                        color='secondary'
                        onClick={() => navigate(`/plants`)}>
                        Plants
                      </Button>
                      <Button
                        color='secondary'
                        onClick={() => navigate('/events')}>
                        Events
                      </Button>
                      <Button
                        variant='outlined'
                        onClick={() => navigate(`/categories`)}>
                        Categories
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Stack>
              </Box>
              <Zoom in={true} timeout={1500}>
                <Card sx={{ width: 345, mx: 'auto', mt: 4 }}>
                  <CardMedia
                    component='img'
                    alt={state.category}
                    height='240px'
                    minwidth='100%'
                    position='center'
                    overflow='hidden'
                    image={`https://source.unsplash.com/featured/?${state.category}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      Category: {state.category}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Description: {state.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ mt: 5 }}>
              <Box
                component='div'
                align='left'
                sx={{ width: '100%', height: 'auto', mt: 4 }}>
                <Box
                  size='small'
                  color='primary'
                  aria-label='tip'
                  align='center'>
                  <EventIcon
                    sx={{ color: 'secondary.main', fontSize: '36px' }}
                  />
                </Box>
                <Typography
                  variant='h3'
                  align='center'
                  sx={{ align: 'center', color: 'secondary.dark' }}>
                  Related Events
                </Typography>
                <List sx={{ dense: 'true', size: 'small' }}>
                  {filteredEvents.map(event => (
                    <ListItem key={event._id} disableGutters>
                      <ListItemIcon>
                        <IconButton
                          edge='end'
                          aria-label='View'
                          onClick={() =>
                            navigate(`/event/${event._id}`, { state: event })
                          }>
                          <PageviewIcon color='info' />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={event.event_name} secondary='' />
                    </ListItem>
                  ))}
                  {filteredEvents.length === 0 && (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge='end' aria-label='View' disabled>
                          <PageviewIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={'No related events'}
                        secondary=''
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Grid>
          </Grid>
          <Grid item sx={{ my: 4 }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => navigate(-1)}>
              Go back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ViewCategory;
