// src/components/AlmanacSidebar.jsx
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Divider, IconButton } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import dayjs from '@/utils/dayjsConfig';
import { nextOccurrence, daysUntil } from '@/utils/recurrence';

export default function AlmanacSidebar({
  events = [],
  plants = [],
  categories = [],
  onOpen,
  showRepeatingOnly = false, // NEW
}) {
  const navigate = useNavigate();
  const today = dayjs();

  const isRepeating = (ev) =>
    !!ev?.repeat_yearly ||
    (Number(ev?.repeat_frequency) > 0 && ['Day', 'Week', 'Month'].includes(ev?.repeat_cycle));

  const eventsFiltered = showRepeatingOnly ? events.filter(isRepeating) : events;

  const coming = eventsFiltered
    .map((ev) => {
      const n = nextOccurrence(ev, today);
      return n ? { ev, date: n.date, days: daysUntil(n.date, today) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, backgroundColor: 'grey.800', color: 'grey.300', borderRadius: 1.5 }}
    >
      <Typography variant="h6" sx={{ color: 'primary.light' }} gutterBottom>
        {today.format('ddd Do MMMM YYYY')}
      </Typography>

      {/* Counts reflect the filtered events */}
      <Typography variant="h7" display="block" gutterBottom>
        Events ({eventsFiltered.length} total)
      </Typography>
      <Typography variant="h7" display="block" gutterBottom>
        Plants ({plants.length} total)
      </Typography>
      <Typography variant="h7" display="block" gutterBottom>
        Categories ({categories.length} total)
      </Typography>

      <Divider sx={{ backgroundColor: 'secondary.contrastText', my: 2 }} />

      <Typography variant="h6" sx={{ color: 'primary.light' }} gutterBottom>
        Coming Events
      </Typography>

      {coming.length === 0 && (
        <Typography
          variant="body2"
          sx={{
            opacity: 0.7,
            lineHeight: 1.8,
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
          }}
        >
          No upcoming events
        </Typography>
      )}

      {coming.map(({ ev, date, days }) => (
        <Typography
          key={`${ev._id}-${+date}`}
          variant="body1"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
          }}
        >
          <span style={{ opacity: 0.8 }}>{dayjs(date).format('D MMM')} - </span>
          {days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'}`} to {ev.event_name}
          <IconButton
            size="small"
            aria-label="view"
            color="info"
            onClick={() => onOpen?.(ev)}
            sx={{ ml: 0.5 }}
          >
            <PageviewIcon />
          </IconButton>
        </Typography>
      ))}
    </Paper>
  );
}

// import { useNavigate } from 'react-router-dom';
// import { Paper, Typography, Divider } from '@mui/material';
// import dayjs from '@/utils/dayjsConfig';
// import { expandOccurrences, nextOccurrence, daysUntil } from '@/utils/recurrence';
// import IconButton from '@mui/material/IconButton';
// import PageviewIcon from '@mui/icons-material/Pageview';

// export default function AlmanacSidebar({ events = [], plants = [], categories = [], onOpen }) {
//   const navigate = useNavigate();
//   const today = dayjs();

//   const coming = events
//     .map((ev) => {
//       const n = nextOccurrence(ev, today);
//       return n ? { ev, date: n.date, days: daysUntil(n.date, today) } : null;
//     })
//     .filter(Boolean)
//     .sort((a, b) => a.days - b.days)
//     .slice(0, 8);

//   return (
//     <Paper
//       elevation={3}
//       sx={{ p: 2, backgroundColor: 'grey.800', color: 'grey.300', borderRadius: 1.5 }}
//     >
//       <Typography variant="h5" sx={{ color: 'primary.light' }} gutterBottom>
//         {today.format('ddd Do MMMM YYYY')}
//       </Typography>

//       <Typography variant="h6" gutterBottom>
//         Events ({events.length} total)
//       </Typography>
//       <Typography variant="h6" gutterBottom>
//         Plants ({plants.length} total)
//       </Typography>
//       <Typography variant="h6" gutterBottom>
//         Categories ({categories.length} total)
//       </Typography>

//       <Divider sx={{ backgroundColor: 'secondary.contrastText', my: 2 }} />

//       <Typography variant="h5" sx={{ color: 'primary.light' }} gutterBottom>
//         Coming Events
//       </Typography>

//       {coming.length === 0 && (
//         <Typography variant="body2" sx={{ opacity: 0.7 }}>
//           No upcoming events
//         </Typography>
//       )}

//       {coming.map(({ ev, date, days }) => (
//         <Typography key={`${ev._id}-${+date}`} variant="body1">
//           <span style={{ opacity: 0.8 }}> {dayjs(date).format('D MMM')} - </span>
//           {days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'}`} to {ev.event_name}
//           <IconButton
//             size="small"
//             component="button"
//             aria-label="view"
//             color="info"
//             onClick={() => onOpen?.(ev)}
//           >
//             <PageviewIcon />
//           </IconButton>
//         </Typography>
//       ))}
//     </Paper>
//   );
// }
