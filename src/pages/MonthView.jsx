// src/pages/MonthView.jsx
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Grid,
  Paper,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from '@/utils/dayjsConfig';
import { getMonthGridDays, ymd } from '@/utils/calendar';
import { occurrencesByDay } from '@/utils/recurrenceGroup';
import AlmanacHeader from '@/components/AlmanacHeader';
import AlmanacSidebar from '@/components/AlmanacSidebar';
import { useEvents } from '@/queries/useEvents';
import { usePlants } from '@/queries/usePlants';
import { useCategories } from '@/queries/useCategories';

export default function MonthView() {
  const { data: events = [] } = useEvents();
  const { data: plants = [] } = usePlants();
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isTight = useMediaQuery('(max-width:1100px)');

  // Visible month/year
  const [ref, setRef] = React.useState(() => dayjs());
  const gridDays = getMonthGridDays(ref);

  // Filters (lightweight & optional)
  const [plantId, setPlantId] = React.useState('');
  const [catId, setCatId] = React.useState('');

  const [showRepeatingOnly, setShowRepeatingOnly] = React.useState(false);

  const goToDay = (d) =>
    navigate(`/almanac/day?d=${ymd(d)}`, { state: { from: location.pathname } });

  const isRepeating = (ev) =>
    !!ev?.repeat_yearly ||
    (Number(ev?.repeat_frequency) > 0 && ['Day', 'Week', 'Month'].includes(ev?.repeat_cycle));

  const filtered = React.useMemo(() => {
    let base = events;
    if (showRepeatingOnly) base = base.filter(isRepeating);
    if (plantId) {
      base = base.filter((ev) => String(ev?.plant?._id || ev?.plant_id) === String(plantId));
    }
    if (catId) {
      base = base.filter((ev) => String(ev?.category?._id || ev?.category_id) === String(catId));
    }
    return base;
  }, [events, showRepeatingOnly, plantId, catId]);

  const groups = React.useMemo(() => occurrencesByDay(filtered, ref.year()), [filtered, ref]);

  const monthLabel = ref.format('MMMM YYYY');
  const inThisMonth = (d) => d.month() === ref.month();
  const isToday = (d) => d.isSame(dayjs(), 'day');

  const months = dayjs.months();
  const years = React.useMemo(
    () => Array.from({ length: 11 }, (_, i) => dayjs().year() - 5 + i),
    [],
  );

  // Helper to produce days just for the visible month (mobile agenda)
  const monthDays = React.useMemo(() => {
    const start = ref.startOf('month');
    const end = ref.endOf('month');
    const arr = [];
    let d = start.clone();
    while (d.isSameOrBefore(end, 'day')) {
      arr.push(d);
      d = d.add(1, 'day');
    }
    return arr;
  }, [ref]);

  // Event line renderer
  const EventLine = ({ ev, date, dense = false }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          gap: 0.5,
        }}
      >
        <IconButton
          size={dense ? 'small' : 'medium'}
          color="info"
          aria-label="view"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/event/${ev._id}`, { state: { ...ev, from: location.pathname } });
          }}
          sx={{ p: dense ? 0.25 : 0.5 }}
        >
          <PageviewIcon fontSize={dense ? 'inherit' : 'small'} />
        </IconButton>
        <Typography
          variant={dense ? 'caption' : 'body2'}
          noWrap
          title={ev.event_name}
          sx={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}
        >
          {ev.event_name}
        </Typography>
        {ev.repeat_yearly && <Chip size="small" label="yr" variant="outlined" sx={{ ml: 0.5 }} />}
      </Box>
    );
  };

  return (
    <AnimatedPage>
      <AlmanacHeader title={`Almanac ${ref.format('YYYY')}`} />

      <Container component="main" maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <AlmanacSidebar
              events={events}
              plants={plants}
              categories={categories}
              onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
              showRepeatingOnly={showRepeatingOnly}
            />
          </Grid>

          {/* Calendar / Right column */}
          <Grid item xs={12} lg={9}>
            {/* CONTROLS */}
            <Paper elevation={1} sx={{ p: 1.5, mb: 1.5 }}>
              <Stack
                direction={isTight ? 'column' : 'row'}
                spacing={1}
                alignItems={isTight ? 'stretch' : 'center'}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size={isSm ? 'small' : 'medium'}
                    aria-label="Previous month"
                    onClick={() => setRef((d) => d.subtract(1, 'month'))}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h6">{monthLabel}</Typography>
                  <IconButton
                    size={isSm ? 'small' : 'medium'}
                    aria-label="Next month"
                    onClick={() => setRef((d) => d.add(1, 'month'))}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                  <Button size={isSm ? 'small' : 'medium'} onClick={() => setRef(dayjs())}>
                    Today
                  </Button>
                </Stack>

                <Stack
                  direction={isTight ? 'column' : 'row'}
                  spacing={1}
                  alignItems={isTight ? 'stretch' : 'center'}
                  sx={{ ml: 'auto' }}
                >
                  <TextField
                    select
                    size="small"
                    label="Month"
                    value={ref.month()}
                    onChange={(e) => setRef((d) => d.month(Number(e.target.value)))}
                    sx={{ minWidth: 140 }}
                  >
                    {months.map((m, idx) => (
                      <MenuItem key={m} value={idx}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Year"
                    value={ref.year()}
                    onChange={(e) => setRef((d) => d.year(Number(e.target.value)))}
                    sx={{ minWidth: 110 }}
                  >
                    {years.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Plant"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {plants.map((p) => (
                      <MenuItem key={p._id} value={String(p._id)}>
                        {p.common_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Category"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={String(c._id)}>
                        {c.category_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={showRepeatingOnly}
                        onChange={(e) => setShowRepeatingOnly(e.target.checked)}
                      />
                    }
                    label="Repeating only"
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* MOBILE: agenda list  ||  DESKTOP/TABLET: 7×6 grid */}
            {isSm ? (
              // --------- MOBILE agenda ---------
              <Paper elevation={1} sx={{ p: 1 }}>
                <Stack spacing={0.5}>
                  {monthDays.map((d) => {
                    const key = ymd(d);
                    const dayEvents = groups.get(key) || [];
                    return (
                      <Box
                        key={key}
                        sx={{
                          py: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: dayEvents.length ? 0.5 : 0 }}>
                          {d.format('ddd D MMM')}
                        </Typography>

                        {dayEvents.length > 0 && (
                          <Stack spacing={0.25}>
                            {dayEvents.map(({ date, ev }) => (
                              <EventLine key={`${ev._id}-${+date}`} ev={ev} date={date} dense />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            ) : (
              // --------- DESKTOP/TABLET grid ---------
              <>
                {/* Weekday headers */}
                <Grid container columns={7} sx={{ mb: 1 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                    <Grid key={w} item xs={1}>
                      <Typography variant="caption" sx={{ opacity: 0.7, pl: 1 }}>
                        {w}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* 7×6 cells */}
                <Grid container columns={7} spacing={1}>
                  {gridDays.map((d) => {
                    const key = ymd(d);
                    const dayEvents = groups.get(key) || [];
                    const visible = dayEvents.slice(0, 3);
                    const overflow = dayEvents.length - visible.length;

                    return (
                      <Grid key={key} item xs={1}>
                        <Paper
                          elevation={1}
                          onClick={() => goToDay(d)}
                          sx={{
                            p: 1,
                            minHeight: { xs: 76, sm: 110, md: 120 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            border: isToday(d) ? 1 : 0,
                            borderColor: 'info.main',
                            bgcolor: inThisMonth(d) ? 'background.paper' : 'action.hover',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, opacity: inThisMonth(d) ? 1 : 0.6 }}
                            >
                              {d.format('D')}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'grid', gap: 0.5, overflow: 'hidden' }}>
                            {visible.map(({ date, ev }) => (
                              <EventLine
                                key={`${ev._id}-${+date}`}
                                ev={ev}
                                date={date}
                                dense={true}
                              />
                            ))}
                            {overflow > 0 && (
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                +{overflow} more
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}

// import * as React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AnimatedPage from '@/components/AnimatedPage';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme, Stack } from '@mui/material';
// import {
//   Grid,
//   Paper,
//   TextField,
//   MenuItem,
//   Typography,
//   IconButton,
//   Container,
//   Box,
//   Button,
//   ButtonGroup,
// } from '@mui/material';
// import PageviewIcon from '@mui/icons-material/Pageview';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import dayjs from '@/utils/dayjsConfig';
// import { getMonthGridDays, ymd } from '@/utils/calendar';
// import { occurrencesByDay } from '@/utils/recurrenceGroup';
// import AlmanacHeader from '@/components/AlmanacHeader';
// import AlmanacSidebar from '@/components/AlmanacSidebar';
// import { useEvents, keys as eventKeys } from '@/queries/useEvents';
// import { usePlants } from '@/queries/usePlants';
// import { useCategories, keys as categoryKeys } from '@/queries/useCategories';
// // ...other imports

// export default function MonthView() {
//   const { data: events = [] } = useEvents();
//   const { data: plants = [] } = usePlants();
//   const { data: categories = [] } = useCategories();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const theme = useTheme();
//   const isSm = useMediaQuery(theme.breakpoints.down('sm'));

//   // NEW: track the visible month
//   const [ref, setRef] = React.useState(() => dayjs()); // today initially
//   const gridDays = getMonthGridDays(ref);
//   // const groups = occurrencesByDay(events, ref.year());
//   // compute once
//   const refStart = ref.startOf('month');
//   const refEnd = ref.endOf('month');
//   const groups = React.useMemo(() => occurrencesByDay(events, ref.year()), [events, ref]);

//   const monthLabel = ref.format('MMMM YYYY');
//   const inThisMonth = (d) => d.month() === ref.month();
//   const isToday = (d) => d.isSame(dayjs(), 'day');

//   // month/year sources
//   const months = dayjs.months(); // requires localeData plugin
//   const years = React.useMemo(
//     () => Array.from({ length: 11 }, (_, i) => dayjs().year() - 5 + i),
//     [],
//   );

//   // helper to iterate each day this month
//   const daysOfMonth = React.useMemo(() => {
//     const arr = [];
//     let d = refStart.clone();
//     while (d.isBefore(refEnd) || d.isSame(refEnd, 'day')) {
//       arr.push(d);
//       d = d.add(1, 'day');
//     }
//     return arr;
//   }, [refStart, refEnd]);

//   return (
//     <AnimatedPage>
//       {/* <AlmanacHeader title={`Almanac – ${monthLabel}`} /> */}
//       <AlmanacHeader title={`Almanac ${ref.format('YYYY')}`} />
//       <Container component="main" maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
//         <Grid container spacing={2} sx={{ mt: 4 }}>
//           {/* Sidebar */}
//           <Grid item xs={12} lg={3}>
//             <AlmanacSidebar
//               events={events}
//               plants={plants}
//               categories={categories}
//               onOpen={(ev) => navigate(`/event/${ev._id}`, { state: ev })}
//             />
//           </Grid>

//           {/* Calendar / Right column */}
//           <Grid item xs={12} lg={9}>
//             {/* CONTROLS */}
//             <Stack
//               direction={isSm ? 'column' : 'row'}
//               spacing={1}
//               alignItems={isSm ? 'stretch' : 'center'}
//               sx={{ mb: 1 }}
//             >
//               <IconButton
//                 size={isSm ? 'small' : 'medium'}
//                 aria-label="Previous month"
//                 onClick={() => setRef((d) => d.subtract(1, 'month'))}
//               >
//                 <ArrowBackIosNewIcon fontSize="small" />
//               </IconButton>

//               <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
//                 {ref.format('MMMM YYYY')}
//               </Typography>

//               <IconButton
//                 size={isSm ? 'small' : 'medium'}
//                 aria-label="Next month"
//                 onClick={() => setRef((d) => d.add(1, 'month'))}
//               >
//                 <ArrowForwardIosIcon fontSize="small" />
//               </IconButton>

//               <Button size={isSm ? 'small' : 'medium'} onClick={() => setRef(dayjs())}>
//                 Today
//               </Button>

//               <TextField
//                 select
//                 size="small"
//                 label="Month"
//                 value={ref.month()}
//                 onChange={(e) => setRef((d) => d.month(Number(e.target.value)))}
//                 sx={{ minWidth: 140 }}
//               >
//                 {months.map((m, idx) => (
//                   <MenuItem key={m} value={idx}>
//                     {m}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 select
//                 size="small"
//                 label="Year"
//                 value={ref.year()}
//                 onChange={(e) => setRef((d) => d.year(Number(e.target.value)))}
//                 sx={{ minWidth: 110 }}
//               >
//                 {years.map((y) => (
//                   <MenuItem key={y} value={y}>
//                     {y}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Stack>

//             {/* MOBILE: agenda list  ||  DESKTOP/TABLET: 7×6 grid */}
//             {isSm ? (
//               // --------- MOBILE: stacked agenda (date line, then events below) ---------
//               <Paper elevation={1} sx={{ p: 1 }}>
//                 <Stack spacing={0.5}>
//                   {daysOfMonth.map((d) => {
//                     const key = ymd(d);
//                     const dayEvents = groups.get(key) || [];
//                     return (
//                       <Box
//                         key={key}
//                         sx={{
//                           py: 1,
//                           borderBottom: '1px solid',
//                           borderColor: 'divider',
//                         }}
//                       >
//                         {/* Date line */}
//                         <Typography variant="subtitle2" sx={{ mb: dayEvents.length ? 0.5 : 0 }}>
//                           {d.format('ddd D MMM')}
//                         </Typography>

//                         {/* Events listed under date (if any) */}
//                         {dayEvents.length > 0 && (
//                           <Stack spacing={0.25}>
//                             {dayEvents.map(({ date, ev }) => (
//                               <Box
//                                 key={`${ev._id}-${+date}`}
//                                 sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
//                               >
//                                 <IconButton
//                                   size="small"
//                                   aria-label="view"
//                                   color="info"
//                                   onClick={() => navigate(`/event/${ev._id}`, { state: ev })}
//                                   sx={{ p: 0.25 }}
//                                 >
//                                   <PageviewIcon fontSize="small" />
//                                 </IconButton>
//                                 <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
//                                   {ev.event_name}
//                                 </Typography>
//                               </Box>
//                             ))}
//                           </Stack>
//                         )}
//                       </Box>
//                     );
//                   })}
//                 </Stack>
//               </Paper>
//             ) : (
//               // … your existing desktop grid

//               // --------- DESKTOP/TABLET (weekday headers + 7×6 grid) ---------
//               <>
//                 {/* Weekday headers */}
//                 <Grid container columns={7} sx={{ mb: 1 }}>
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
//                     <Grid key={w} item xs={1}>
//                       <Typography variant="caption" sx={{ opacity: 0.7, pl: 1 }}>
//                         {w}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Grid>

//                 {/* 7×6 cells */}
//                 <Grid container columns={7} spacing={1}>
//                   {gridDays.map((d) => {
//                     const key = ymd(d);
//                     const dayEvents = groups.get(key) || [];
//                     return (
//                       <Grid key={key} item xs={1}>
//                         <Paper
//                           elevation={1}
//                           sx={{
//                             p: 1,
//                             minHeight: { xs: 76, sm: 110, md: 120 },
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: 0.5,
//                             border: isToday(d) ? 1 : 0,
//                             borderColor: 'info.main',
//                             bgcolor: inThisMonth(d) ? 'background.paper' : 'action.hover',
//                             overflow: 'hidden',
//                           }}
//                         >
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                             <Typography
//                               variant="caption"
//                               sx={{ fontWeight: 600, opacity: inThisMonth(d) ? 1 : 0.6 }}
//                             >
//                               {d.format('D')}
//                             </Typography>
//                           </Box>

//                           <Box sx={{ display: 'grid', gap: 0.5, overflow: 'hidden' }}>
//                             {dayEvents.slice(0, 3).map(({ date, ev }) => (
//                               <Box
//                                 key={`${ev._id}-${+date}`}
//                                 sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}
//                               >
//                                 <IconButton
//                                   size="small"
//                                   color="info"
//                                   aria-label="view"
//                                   onClick={() =>
//                                     navigate(`/event/${ev._id}`, {
//                                       state: { ...ev, from: location.pathname },
//                                     })
//                                   }
//                                   sx={{ mr: 0.5 }}
//                                 >
//                                   <PageviewIcon fontSize="inherit" />
//                                 </IconButton>
//                                 <Typography
//                                   variant="caption"
//                                   noWrap
//                                   title={ev.event_name}
//                                   sx={{ flex: 1, minWidth: 0 }}
//                                 >
//                                   {ev.event_name}
//                                 </Typography>
//                               </Box>
//                             ))}
//                             {dayEvents.length > 3 && (
//                               <Typography variant="caption" sx={{ opacity: 0.7 }}>
//                                 +{dayEvents.length - 3} more
//                               </Typography>
//                             )}
//                           </Box>
//                         </Paper>
//                       </Grid>
//                     );
//                   })}
//                 </Grid>
//               </>
//             )}
//           </Grid>
//           {/* HARRY TO HERE ??? */}
//         </Grid>
//       </Container>
//     </AnimatedPage>
//   );
// }
