import { useNavigate, useLocation } from 'react-router-dom';
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
import dayjs from '@/utils/dayjsConfig';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useEvents } from '@/queries/useEvents';
import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';
import AlmanacHeader from '@/components/AlmanacHeader';
import AlmanacSidebar from '@/components/AlmanacSidebar';

// const { user } = useAuthContext();

const Almanac = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthContext();
  // const guard = !!user && !loading;
  const userId = user?._id;

  const eventsQ = useEvents(false, { enabled: !!user, retry: false });
  const plantsQ = usePlants(false, { enabled: !!user, retry: false });
  const catsQ = useCategories(false, { enabled: !!user, retry: false });

  const events = eventsQ.data ?? [];
  const plants = plantsQ.data ?? [];
  const categories = catsQ.data ?? [];

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
      <AlmanacHeader title="Almanac" />
      <Container component="main" maxWidth="xl" sx={{ mt: 0, pb: 4 }}>
        <Box
          sx={{
            // marginTop: 8,
            // marginBottom: 4,
            // minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={3}>
              <AlmanacSidebar
                events={events}
                plants={plants}
                categories={categories}
                onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
              />
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
                            dayjs(event.occurs_at).format('MMMM') === month && (
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
                                      state: { ...event, from: location.pathname },
                                    })
                                  }
                                >
                                  <PageviewIcon />
                                </IconButton>
                                {dayjs(event.occurs_at).format('D MMM')} - {event.event_name}
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
