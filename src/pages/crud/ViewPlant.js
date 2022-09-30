import { useState, useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useLocation,
  Link as RouterLink,
} from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AnimatedPage from '../../components/AnimatedPage';
import { Fade, Zoom } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useEventsContext } from '../../contexts/EventsContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import EventIcon from '@mui/icons-material/Event';
import Broccoli from '../../images/mockup-graphics-q7BJL1qZ1Bw-unsplash.jpg';

// import { getCookie } from '../../utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import moment from 'moment';

// const rows = [];

const ViewPlant = () => {
  console.log(useLocation());
  const { state } = useLocation();
  console.log('STATE', state);

  const { events, setEvents } = useEventsContext();
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();

  const plant_id = state._id;
  const filteredEvents = events.filter(event => event.plant._id === state._id);

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='xl'>
        {/* <ToastContainer /> */}
        <Grid
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
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
              }}>
              <Fade in={true} timeout={2000}>
                <Box
                  component='img'
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt='image'
                  // marginLeft='auto'
                  // maxWidth='50%'
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
                justifyContent: 'center',
                alignSelf: 'flex-start',
              }}>
              <Card sx={{ width: 345 }}>
                <CardMedia
                  component='img'
                  alt='Tomatoes'
                  height='240px'
                  // maxHeight='140px'
                  minWidth='100%'
                  position='center'
                  overflow='hidden'
                  // image={Tomatoes}
                  // verticalAlign='middle'
                  image={`https://source.unsplash.com/featured/?${state.common_name}`}
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    Name: {state.common_name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Botanical Name:
                    </Box>{' '}
                    {state.botanical_name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Sow:
                    </Box>{' '}
                    {moment(state.sow_at).format('D MMM') || '...............'},
                    and at{' '}
                    <Box component='span' fontWeight='bold'>
                      depth
                    </Box>{' '}
                    of {state.depth || '...............'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Plant:
                    </Box>{' '}
                    {moment(state.plant_at).format('D MMM') ||
                      '...............'}{' '}
                    with{' '}
                    <Box component='span' fontWeight='bold'>
                      spacing
                    </Box>{' '}
                    of {state.spacing || '<...............>'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Fertilise:
                    </Box>{' '}
                    {state.fertilise || '...............'} with{' '}
                    {state.fertiliser_type || '...............'} fertiliser.
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Harvest from:
                    </Box>{' '}
                    {moment(state.harvest_at).format('D MMM') ||
                      '...............'}{' '}
                    to{' '}
                    {moment(state.harvest_to).format('D MMM') ||
                      '..............'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    <Box component='span' fontWeight='bold'>
                      Notes:
                    </Box>{' '}
                    {state.notes || '...............'}
                  </Typography>
                </CardContent>
                {/* <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions> */}
              </Card>

              {/* <Typography variant='h6' gutterBottom component='div'>
              Category: {state.category}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Description: {state.description}
            </Typography> */}
            </Grid>
            {/* <Grid container> */}
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
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge='end' aria-label='View'>
                          <PageviewIcon
                            color='info'
                            onClick={() =>
                              navigate(`/event/${event._id}`, { state: event })
                            }
                          />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText primary={event.event_name} secondary='' />
                    </ListItem>
                  ))}
                  {filteredEvents.length === 0 && (
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <IconButton edge='end' aria-label='View'>
                          <PageviewIcon color='muted' />
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

          <Grid item>
            <Link
              component={RouterLink}
              color='secondary.main'
              to='/plants'
              variant='body2'>
              {'Back to Plants'}
            </Link>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ViewPlant;
