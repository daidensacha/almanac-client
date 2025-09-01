// src/pages/Almanac.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';

import AnimatedPage from '@/components/AnimatedPage';
import AlmanacHeader from '@/components/AlmanacHeader';
import AlmanacSidebar from '@/components/AlmanacSidebar';

import { useAuthContext } from '@/contexts/AuthContext';
import { useEvents } from '@/queries/useEvents';
import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';

import dayjs from '@/utils/dayjsConfig';
import { expandOccurrences } from '@/utils/recurrence';

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

export default function Almanac() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const [showRepeatingOnly, setShowRepeatingOnly] = React.useState(false);

  const eventsQ = useEvents(false, { enabled: !!user, retry: false });
  const plantsQ = usePlants(false, { enabled: !!user, retry: false });
  const catsQ = useCategories(false, { enabled: !!user, retry: false });

  const events = eventsQ.data ?? [];
  const plants = plantsQ.data ?? [];
  const categories = catsQ.data ?? [];

  const year = dayjs().year();

  const isRepeating = (ev) =>
    !!ev?.repeat_yearly ||
    (Number(ev?.repeat_frequency) > 0 && ['Day', 'Week', 'Month'].includes(ev?.repeat_cycle));

  const filteredEvents = React.useMemo(
    () => (showRepeatingOnly ? events.filter(isRepeating) : events),
    [events, showRepeatingOnly],
  );

  // Keep your isRepeating + filteredEvents as-is above…

  // Build 12 buckets from the *filtered* events for this year
  const monthBuckets = React.useMemo(() => {
    const buckets = Array.from({ length: 12 }, () => []);

    for (const ev of filteredEvents) {
      const occs = expandOccurrences(ev, { year });
      for (const o of occs) {
        const d = dayjs(o.date);
        buckets[d.month()].push({ date: d, ev });
      }
    }

    // Sort each month by date asc, then event name
    for (const bucket of buckets) {
      bucket.sort((a, b) => {
        const t = a.date.valueOf() - b.date.valueOf();
        if (t !== 0) return t;
        return (a.ev?.event_name || '').localeCompare(b.ev?.event_name || '');
      });
    }

    return buckets;
  }, [filteredEvents, year]);

  return (
    <AnimatedPage>
      <AlmanacHeader title={`Almanac ${year}`} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={showRepeatingOnly}
              onChange={(e) => setShowRepeatingOnly(e.target.checked)}
              color="secondary"
            />
          }
          label="Repeating only"
        />
      </Box>
      <Container component="main" maxWidth="xl" sx={{ mt: 0, pb: 4 }}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <AlmanacSidebar
              events={events}
              plants={plants}
              categories={categories}
              onOpen={(ev) =>
                navigate(`/event/${ev._id}`, { state: { ...ev, from: location.pathname } })
              }
              showRepeatingOnly={showRepeatingOnly}
            />
          </Grid>

          {/* Year grid */}
          <Grid item xs={12} lg={9}>
            <Grid container spacing={2}>
              {monthNames.map((monthLabel, idx) => (
                <Grid key={monthLabel} item xs={12} sm={6} md={4}>
                  <Paper elevation={1} sx={{ minHeight: 120, p: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{ textAlign: 'center', color: 'secondary.main', mb: 0.5 }}
                    >
                      {monthLabel}
                    </Typography>

                    {monthBuckets[idx].length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 1 }}
                      >
                        No events
                      </Typography>
                    )}

                    {monthBuckets[idx].map(({ date, ev }) => (
                      <Box
                        key={`${ev._id}-${+date}`}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <IconButton
                          size="small"
                          aria-label="view"
                          color="info"
                          onClick={() =>
                            navigate(`/event/${ev._id}`, {
                              state: { ...ev, from: location.pathname },
                            })
                          }
                          sx={{ p: 0.25 }}
                        >
                          <PageviewIcon fontSize="inherit" />
                        </IconButton>
                        <Typography variant="body2" sx={{ lineHeight: 1.35 }}>
                          {date.format('D MMM')} – {ev.event_name}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

// import { useNavigate, useLocation } from 'react-router-dom';
// import { Container, Divider, Grid } from '@mui/material';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import { useAuthContext } from '@/contexts/AuthContext';
// import { useMineList } from '@/hooks/useMineList';
// import AnimatedPage from '@/components/AnimatedPage';
// import IconButton from '@mui/material/IconButton';
// import PageviewIcon from '@mui/icons-material/Pageview';
// import { ButtonGroup, Button } from '@mui/material';
// import dayjs from '@/utils/dayjsConfig';
// import advancedFormat from 'dayjs/plugin/advancedFormat';
// import { useEvents } from '@/queries/useEvents';
// import { usePlants } from '@/queries/usePlants';
// import { useCategories } from '@/queries/useCategories';
// import AlmanacHeader from '@/components/AlmanacHeader';
// import AlmanacSidebar from '@/components/AlmanacSidebar';

// // const { user } = useAuthContext();

// const Almanac = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user } = useAuthContext();
//   // const guard = !!user && !loading;
//   const userId = user?._id;

//   const eventsQ = useEvents(false, { enabled: !!user, retry: false });
//   const plantsQ = usePlants(false, { enabled: !!user, retry: false });
//   const catsQ = useCategories(false, { enabled: !!user, retry: false });

//   const events = eventsQ.data ?? [];
//   const plants = plantsQ.data ?? [];
//   const categories = catsQ.data ?? [];

//   const monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];

//   return (
//     <AnimatedPage>
//       {/* <AlmanacHeader title="Almanac" /> */}
//       <AlmanacHeader title={`Almanac ${dayjs().format('YYYY')}`} />
//       <Container component="main" maxWidth="xl" sx={{ mt: 0, pb: 4 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Grid container spacing={2} sx={{ mt: 4 }}>
//             <Grid item xs={12} lg={3}>
//               <AlmanacSidebar
//                 events={events}
//                 plants={plants}
//                 categories={categories}
//                 onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
//               />
//             </Grid>
//             <Grid item xs={12} lg={9}>
//               <Grid container spacing={2}>
//                 {monthNames.map((month, index) => (
//                   <Grid key={month} item xs={12} sm={6} md={4} sx={{}}>
//                     <Box sx={{ minHeight: '100px' }}>
//                       <Paper elevation={1} sx={{ minHeight: '100px' }}>
//                         <Typography
//                           variant="h5"
//                           sx={{ textAlign: 'center', color: 'secondary.main' }}
//                         >
//                           {month}
//                         </Typography>
//                         {events?.map(
//                           (event) =>
//                             dayjs(event.occurs_at).format('MMMM') === month && (
//                               <Typography
//                                 key={event._id}
//                                 variant="body1"
//                                 sx={{ textAlign: 'left' }}
//                               >
//                                 <IconButton
//                                   size="small"
//                                   component="button"
//                                   aria-label="view"
//                                   color="info"
//                                   onClick={() =>
//                                     navigate(`/event/${event._id}`, {
//                                       state: { ...event, from: location.pathname },
//                                     })
//                                   }
//                                 >
//                                   <PageviewIcon />
//                                 </IconButton>
//                                 {dayjs(event.occurs_at).format('D MMM')} - {event.event_name}
//                               </Typography>
//                             ),
//                         )}
//                       </Paper>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>
//       </Container>
//     </AnimatedPage>
//   );
// };

// export default Almanac;
