import { useState, useEffect } from 'react';
import {
  useNavigate,
  useParams,
  useLocation,
  Link as RouterLink,
} from 'react-router-dom';
import instance from '../../utils/axiosClient';
// import Container from '@mui/material/Container';
import { List, ListItem, ListItemText } from '@mui/material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { Fade, Zoom } from '@mui/material';
import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AnimatedPage from '../../components/AnimatedPage';
import Broccoli from '../../images/mockup-graphics-q7BJL1qZ1Bw-unsplash.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Tomatoes from '../../images/lewis-wilson-hkN0yoPrpM4-unsplash.jpg';
import { useEventsContext } from '../../contexts/EventsContext';

const ViewCategory = () => {
  console.log(useLocation());
  const { state } = useLocation();

  const { events, setEvents } = useEventsContext();
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();

  console.log('CATEGORY PAGE EVENTS', events);
  console.log('CATEGORY PAGE STATE', state);

  const category_id = state._id;
  const filteredEvents = events.filter(
    event => event.category._id === state._id,
  );
  console.log('FILTERED EVENTS', filteredEvents);

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
                {/* <Typography variant='body1' align="left" sx={{align: 'left',}}>

                    1. <strong>Actions</strong> repesent actions.
                  </Typography> */}
                <List sx={{ dense: 'true', size: 'small' }}>
                  {/* { events.filter((event) => event.category._id === state._id (
                          console.log(event)
                        ))} */}

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
              to='/categories'
              variant='body2'>
              {'Back to Categories'}
            </Link>
          </Grid>
          {/* </Grid> */}
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ViewCategory;
