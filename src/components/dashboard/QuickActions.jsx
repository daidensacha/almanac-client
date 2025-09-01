import { Button, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const nav = useNavigate();
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
          <Button variant="contained" onClick={() => nav('/event/add')}>
            Add Event
          </Button>
          <Button variant="outlined" onClick={() => nav('/plant/add')}>
            Add Plant
          </Button>
          <Button variant="outlined" onClick={() => nav('/almanac')}>
            Open Calendar
          </Button>
          <Button variant="outlined" onClick={() => nav('/events')}>
            Search & Filter
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
