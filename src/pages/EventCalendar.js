import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AnimatedPage from '../components/AnimatedPage';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import MomentUtils from '@date-io/moment';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2022, 7, 31),
    end: new Date(2022, 7, 31),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2022, 8, 7),
    end: new Date(2022, 8, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2022, 8, 13, 0, 0, 0),
    end: new Date(2022, 8, 20, 0, 0, 0),
  },
  {
    id: 3,
    title: 'DTS ENDS',
    start: new Date(2022, 8, 6, 0, 0, 0),
    end: new Date(2022, 8, 13, 0, 0, 0),
  },
];

const EventCalendar = () => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: null,
    end: null,
  });
  const [allEvents, setAllEvents] = useState(events);

  const handleAddEvent = event => {
    setAllEvents([...allEvents, newEvent]);
  };

  return (
    <AnimatedPage>
      <Container component='main'>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <h1>Calendar</h1>
          <h2> Add new event</h2>
          <Grid container sx={{ display: 'flex', justifyContent: 'center' }} spacing={2}>
            {/* Start Calendar */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <input
                type='text'
                placeholder='Add Title'
                style={{ width: '200px', marginRight: '10px', marginTop: '5px' }}
                value={newEvent.title}
                onChange={e =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <DatePicker
                placeholderText='Start Date'
                style={{ marginRight: '10px' }}
                selected={newEvent.start}
                onChange={start => setNewEvent({ ...newEvent, start })}
              />
              <DatePicker
                placeholderText='End Date'
                selected={newEvent.end}
                onChange={end => setNewEvent({ ...newEvent, end })}
              />
              <button style={{ marginTop: '5px', width: '80px' }} onClick={handleAddEvent}>
                Add Event
              </button>
            </Box>

            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor='start'
              endAccessor='end'
              style={{ height: 500, width: '100%', margin: '50px' }}
            />
            {/* End Calendar */}
          </Grid>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EventCalendar;
