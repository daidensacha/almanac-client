import { useQuery } from '@tanstack/react-query';
import WeatherPanel from '@/components/weather/WeatherPanel';

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from '@mui/material';
import api from '@/utils/axiosClient';

function useList(path, key) {
  return useQuery({
    queryKey: ['lab', key],
    queryFn: async () => {
      const { data } = await api.get(path);
      console.log('[Lab]', key, data);
      // Normalize common shapes
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.allEvents)) return data.allEvents;
      if (Array.isArray(data?.allPlants)) return data.allPlants;
      if (Array.isArray(data?.allCategories)) return data.allCategories;
      if (Array.isArray(data?.categories)) return data.categories;
      return data?.results || data?.rows || [];
    },
    refetchOnWindowFocus: false,
  });
}

function Panel({ title, hook, primary, secondary }) {
  const q = hook;
  const rows = q.data || [];
  return (
    <Card sx={{ flex: 1, minWidth: 280 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {title} ({rows.length})
        </Typography>
        <List dense>
          {rows.slice(0, 8).map((r, idx) => (
            <ListItem key={r._id || r.id || idx}>
              <ListItemText primary={primary(r)} secondary={secondary?.(r)} />
            </ListItem>
          ))}
          {rows.length === 0 && <Typography variant="body2">No data</Typography>}
        </List>
        <Button size="small" onClick={() => q.refetch()} disabled={q.isFetching}>
          {q.isFetching ? 'Refreshing…' : 'Refresh'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Lab() {
  const plants = useList('/plants', 'plants');
  const categories = useList('/categories', 'categories');
  const events = useList('/events', 'events');
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lab
      </Typography>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Panel
          title="Plants"
          hook={plants}
          primary={(r) => r.common_name || r.botanical_name || '(unnamed)'}
          secondary={(r) => r.created_at || r.updated_at}
        />
        <Panel
          title="Categories"
          hook={categories}
          primary={(r) => r.category || r.name || r.title || '(untitled)'}
          secondary={(r) => r.description || r.slug}
        />
        <Panel
          title="Events"
          hook={events}
          primary={(r) => r.event_name || r.description || '(no name)'}
          secondary={(r) => (r.occurs_at ? new Date(r.occurs_at).toLocaleString() : '')}
        />
      </Stack>
      <Box sx={{ mt: 2 }}>
        <WeatherPanel /> {/* AuthContext → IP fallback; NO manual coords */}
      </Box>
    </Box>
  );
}
