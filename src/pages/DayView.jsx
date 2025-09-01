// src/pages/DayView.jsx
import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Stack } from '@mui/material';
import {
  Grid,
  Typography,
  IconButton,
  Paper,
  Container,
  Box,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import dayjs from '@/utils/dayjsConfig';
import { useEvents } from '@/queries/useEvents';
import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';
import AlmanacSidebar from '@/components/AlmanacSidebar';
import AlmanacHeader from '@/components/AlmanacHeader';
import AnimatedPage from '@/components/AnimatedPage';
import { expandOccurrences } from '@/utils/recurrence';

const FILTERS = [
  { label: 'Next 7 days', days: 7 },
  { label: 'Next 14 days', days: 14 },
  { label: 'Next 21 days', days: 21 },
  { label: 'Next 1 month', days: 30 },
  { label: 'Next 2 months', days: 60 },
];

export default function DayView() {
  const { data: events = [] } = useEvents();
  const { data: plants = [] } = usePlants();
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [params] = useSearchParams();
  const picked = params.get('d');
  const today = picked ? dayjs(picked) : dayjs();
  const isRealToday = dayjs().isSame(today, 'day');
  const dayLabel = isRealToday ? 'Today' : today.format('dddd D MMM');
  const fullDayLabel = today.format('ddd D MMM YYYY');

  const goToToday = () => navigate('/almanac/day'); // clears ?d=

  const [showRepeatingOnly, setShowRepeatingOnly] = React.useState(false);

  const isRepeating = (ev) =>
    !!ev?.repeat_yearly ||
    (Number(ev?.repeat_frequency) > 0 && ['Day', 'Week', 'Month'].includes(ev?.repeat_cycle));

  const [range, setRange] = React.useState(14); // default: 2 weeks

  const filteredEvents = React.useMemo(
    () => (showRepeatingOnly ? events.filter(isRepeating) : events),
    [events, showRepeatingOnly],
  );

  // Today’s agenda
  const todays = filteredEvents
    .flatMap((ev) => expandOccurrences(ev, { year: today.year() }))
    .filter((o) => dayjs(o.date).isSame(today, 'day'))
    .sort((a, b) => +a.date - +b.date);

  const end = today.add(range, 'day').endOf('day');
  const upcoming = filteredEvents
    .flatMap((ev) => expandOccurrences(ev, { year: today.year() }))
    .filter((o) => dayjs(o.date).isAfter(today, 'day') && dayjs(o.date).isBefore(end, 'day'))
    .sort((a, b) => +a.date - +b.date);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AnimatedPage>
      <AlmanacHeader title={`Almanac – ${today.format('YYYY')}`} />
      <Container component="main" maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} lg={3}>
            <AlmanacSidebar
              events={events}
              plants={plants}
              categories={categories}
              onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
              showRepeatingOnly={showRepeatingOnly}
            />
          </Grid>

          <Grid item xs={12} lg={9}>
            <Paper
              elevation={1}
              sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Typography variant="h6" sx={{ mr: 'auto' }}>
                {dayLabel}{' '}
                <Typography component="span" variant="body2" sx={{ opacity: 0.7, ml: 1 }}>
                  {fullDayLabel}
                </Typography>
              </Typography>

              <Button size="small" onClick={goToToday}>
                Today
              </Button>

              <TextField
                select
                size="small"
                label="Range"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                sx={{ minWidth: 180 }}
              >
                {FILTERS.map((f) => (
                  <MenuItem key={f.days} value={f.days}>
                    {f.label}
                  </MenuItem>
                ))}
              </TextField>

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
            </Paper>
            {/* Agenda for today */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                {dayLabel}
              </Typography> */}
              {todays.length === 0 && (
                <Typography variant={isSm ? 'subtitle2' : 'body1'} color="text.secondary">
                  No events today.
                </Typography>
              )}
              {todays.map(({ date, ev }) => (
                <Typography
                  key={`${ev._id}-${+date}`}
                  variant={isSm ? 'subtitle2' : 'body1'}
                  sx={{ textAlign: 'left' }}
                >
                  <IconButton
                    size={isSm ? 'small' : 'medium'}
                    aria-label="view"
                    color="info"
                    onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
                  >
                    <PageviewIcon fontSize="small" />
                  </IconButton>
                  {dayjs(date).format('ddd, D MMM') || 'All day'} – {ev.event_name}
                </Typography>
              ))}
            </Paper>

            {/* Upcoming with filter */}
            <Paper elevation={1} sx={{ p: 2 }}>
              <Stack
                direction={isSm ? 'column' : 'row'}
                spacing={2}
                alignItems={isSm ? 'stretch' : 'center'}
                sx={{ mb: 1 }}
              >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Upcoming
                </Typography>

                {/* <TextField
                  select
                  size="small"
                  label="Range"
                  value={range}
                  onChange={(e) => setRange(Number(e.target.value))}
                  sx={{ minWidth: isSm ? '100%' : 180 }}
                >
                  {FILTERS.map((f) => (
                    <MenuItem key={f.days} value={f.days}>
                      {f.label}
                    </MenuItem>
                  ))}
                </TextField>
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
                /> */}
              </Stack>

              {upcoming.length === 0 && (
                <Typography variant={isSm ? 'subtitle2' : 'body1'} color="text.secondary">
                  No events in the next {range} days.
                </Typography>
              )}

              {upcoming.map(({ date, ev }) => (
                <Typography
                  key={`${ev._id}-${+date}`}
                  variant={isSm ? 'subtitle2' : 'body1'}
                  sx={{ textAlign: 'left' }}
                >
                  <IconButton
                    size={isSm ? 'small' : 'medium'}
                    aria-label="view"
                    color="info"
                    onClick={() =>
                      navigate(`/event/${ev._id}`, { state: { ...ev, from: location.pathname } })
                    }
                  >
                    <PageviewIcon fontSize="small" />
                  </IconButton>
                  {dayjs(date).format('ddd, D MMM')} – {ev.event_name}
                </Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

// import { Grid, Typography, IconButton, Paper, Container } from '@mui/material';
// import PageviewIcon from '@mui/icons-material/Pageview';
// import dayjs from '@/utils/dayjsConfig';
// import { useNavigate } from 'react-router-dom';
// import { useEvents } from '@/queries/useEvents';
// import { usePlants } from '@/queries/usePlants';
// import { useCategories } from '@/queries/useCategories';
// import { expandOccurrences } from '@/utils/recurrence';
// import AlmanacSidebar from '@/components/AlmanacSidebar';
// import AlmanacHeader from '@/components/AlmanacHeader';
// import AnimatedPage from '@/components/AnimatedPage';

// export default function DayView() {
//   const { data: events = [] } = useEvents();
//   const { data: plants = [] } = usePlants();
//   const { data: categories = [] } = useCategories();
//   const navigate = useNavigate();
//   const today = dayjs();

//   const occs = events
//     .flatMap((ev) => expandOccurrences(ev, { year: today.year() }))
//     .filter((o) => dayjs(o.date).isSame(today, 'day'))
//     .sort((a, b) => +a.date - +b.date);

//   return (
//     <AnimatedPage>
//       {' '}
//       <AlmanacHeader title="Almanac" />
//       <Container component="main" maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
//         <Grid container spacing={2} sx={{ mt: 4 }}>
//           <Grid item xs={12} md={3}>
//             <AlmanacSidebar
//               events={events}
//               plants={plants}
//               categories={categories}
//               onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
//             />
//           </Grid>

//           <Grid item xs={12} md={9}>
//             <Paper elevation={1} sx={{ p: 2 }}>
//               {occs.length === 0 && (
//                 <Typography variant="body2" color="text.secondary">
//                   No events today.
//                 </Typography>
//               )}
//               {occs.map(({ date, ev }) => (
//                 <Typography key={`${ev._id}-${+date}`} variant="body1" sx={{ textAlign: 'left' }}>
//                   <IconButton
//                     size="small"
//                     aria-label="view"
//                     color="info"
//                     onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
//                   >
//                     <PageviewIcon fontSize="small" />
//                   </IconButton>
//                   {ev.event_name} – {dayjs(date).format('HH:mm') || 'All day'}
//                 </Typography>
//               ))}
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </AnimatedPage>
//   );
// }
