import { Tabs, Tab, Box } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function CalendarView() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // Determine active tab by URL
  const isYear =
    pathname === '/almanac' || pathname.endsWith('/almanac') || pathname.includes('/almanac/year'); // in case you ever add that route

  const value = isYear ? 'year' : pathname.includes('/almanac/day') ? 'day' : 'month';

  const handleChange = (_e, v) => {
    if (v === 'year') nav('/almanac'); // index route = Year grid
    else nav(`/almanac/${v}`); // /almanac/month or /almanac/day
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab value="day" label="Day" />
        <Tab value="month" label="Month" />
        <Tab value="year" label="Year" />
      </Tabs>
      <Outlet />
    </Box>
  );
}
