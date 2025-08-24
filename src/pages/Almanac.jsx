import { useNavigate } from 'react-router-dom';
import { Container, Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMineList } from '@/hooks/useMineList';
import AnimatedPage from '@/components/AnimatedPage';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import { ButtonGroup, Button } from '@mui/material';
import moment from 'moment';

const Almanac = () => {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const userId = user?._id;

  const eventsQ = useMineList('events', 'events', userId);
  const plantsQ = useMineList('plants', 'plants', userId);
  const catsQ = useMineList('categories', 'categories', userId);

  const events = eventsQ.data || [];
  const plants = plantsQ.data || [];
  const categories = catsQ.data || [];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1>Almanac</h1>
          {(eventsQ.isLoading || plantsQ.isLoading || catsQ.isLoading) && (
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
              Loading your almanac…
            </Typography>
          )}
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
              <Button onClick={() => navigate(`/plants`)}>Plants</Button>
              <Button onClick={() => navigate(`/events`)}>Events</Button>
              <Button onClick={() => navigate(`/categories`)}>Categories</Button>
            </ButtonGroup>
          </Box>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: 'grey.800',
                  height: '100%',
                  color: 'grey.300',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ color: 'primary.light' }}
                  gutterBottom
                  component="div"
                >
                  {moment().format('ddd, Do MMMM YYYY')}
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Events ({events.length} total)
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Plants ({plants.length} total)
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Categories ({categories.length} total)
                </Typography>
                <Divider sx={{ backgroundColor: 'secondary.contrastText', my: 2 }} />
                <Typography
                  variant="h5"
                  sx={{ color: 'primary.light' }}
                  gutterBottom
                  component="div"
                >
                  Coming Events
                </Typography>
                {events?.map((event, index) => {
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  // console.log('EVENT', event);
                  // console.log('NEXT MONTH', moment(nextMonth).month());
                  // console.log('CHECK MONTH', moment(event.occurs_at).month());
                  return (
                    moment(event.occurs_at).month() === moment(nextMonth).month() && (
                      <Typography key={index} variant="body1" gutterBottom component="div">
                        {`${moment(event.occurs_at).format('MMM DD')} - ${event.event_name}`}
                      </Typography>
                    )
                  );
                })}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                {monthNames.map((month, index) => (
                  <Grid key={month} item xs={12} sm={6} md={4} sx={{}}>
                    <Box sx={{ minHeight: '100px' }}>
                      <Paper elevation={1} sx={{ minHeight: '100px' }}>
                        <Typography
                          variant="h5"
                          sx={{ textAlign: 'center', color: 'secondary.main' }}
                        >
                          {month}
                        </Typography>
                        {events?.map(
                          (event) =>
                            moment(event.occurs_at).format('MMMM') === month && (
                              <Typography
                                key={event._id}
                                variant="body1"
                                sx={{ textAlign: 'left' }}
                              >
                                <IconButton
                                  size="small"
                                  component="button"
                                  aria-label="view"
                                  color="info"
                                  onClick={() =>
                                    navigate(`/event/${event._id}`, {
                                      state: event,
                                    })
                                  }
                                >
                                  <PageviewIcon />
                                </IconButton>
                                {moment(event.occurs_at).format('D MMM')} - {event.event_name}
                              </Typography>
                            ),
                        )}
                      </Paper>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Almanac;
