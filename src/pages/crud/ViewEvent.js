import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import instance from '../../utils/axiosClient';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AnimatedPage from '../../components/AnimatedPage';
// import { getCookie } from '../../utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import moment from 'moment'
import { useEventsContext } from '../../contexts/EventsContext';

// const rows = [];

const ViewEvent = () => {
  console.log(useLocation())
  const { state } = useLocation()
  console.log('STATE', state)
  // const { id } = useParams();
  // console.log('ID', id);
  const navigate = useNavigate();



  return (
    <AnimatedPage>
      <Container component='main' maxWidth='sm'>
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
          <h1>Event</h1>

          <Grid item xs={12} sx={{ mt: 5}}>

            <Typography variant='h6' gutterBottom component='div'>
              Event Name: {state.event_name}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Created: {moment(state.created_at).format('D MMM YYYY')}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Description: {state.description}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Occurs: {moment(state.occurs_at).format('D MMM')}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Month: {moment(state.occurs_at).format('MMMM')}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Blank: {}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Every: {state.repeat_frequency} {state.repeat_frequency === 1 ? state.repeat_cycle : state.repeat_cycle + 's'}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
            repeat_frequency: {state.repeat_frequency}
            </Typography>
            <Typography variant='h6' gutterBottom component='div'>
              Description: {state.notes}
            </Typography>
            {/*  <Typography variant='h6' gutterBottom component='div'>
              Sow: {moment(state.sow_at).format('D MMM') || '...............'} and at depth of  {state.depth || '...............'}
            </Typography> */}
            {/* <Typography variant='h6' gutterBottom component='div'>
              Plant: {moment(state.plant_at).format('D MMM') || '...............'} with spacing of {state.spacing || '...............'}
            </Typography> */}
            {/* <Typography variant='h6' gutterBottom component='div'>
              Fertilise: {state.fertilise || '...............'} with {state.fertiliser_type || '...............'}
            </Typography> */}
            {/* <Typography variant='h6' gutterBottom component='div'>
              Harvest from: {moment(state.harvest_at).format('D MMM') || '...............'} to {moment(state.harvest_to).format('D MMM') || '..............'}
            </Typography> */}
          </Grid>
          {/* <Grid container> */}
          {/* <Grid item xs></Grid> */}
          <Grid item>
            <Link component={RouterLink} color='secondary.main' to='/events' variant='body2'>
              {'Back to Events'}
            </Link>
          </Grid>
          {/* </Grid> */}
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ViewEvent;
