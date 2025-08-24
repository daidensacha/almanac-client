import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import api from '@/utils/axiosClient';

function useHealth() {
  return useQuery({
    queryKey: ['admin:health'],
    queryFn: async () => {
      const { data } = await api.get('/health'); // public
      return data;
    },
    refetchOnWindowFocus: false,
  });
}

function useAdminPing() {
  return useQuery({
    queryKey: ['admin:ping'],
    queryFn: async () => {
      const { data } = await api.get('/admin/ping'); // protected
      return data;
    },
    refetchOnWindowFocus: false,
  });
}

export default function Overview() {
  const health = useHealth();
  const ping = useAdminPing();

  const counts = health.data?.counts || { users: 0, plants: 0, categories: 0, events: 0 };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {Object.entries(counts).map(([key, val]) => (
          <Grid key={key} item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="overline">{key.toUpperCase()}</Typography>
                <Typography variant="h4">{val}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Server Health
          </Typography>
          <Typography variant="body2">ok: {String(health.data?.ok)}</Typography>
          <Typography variant="body2">db: {health.data?.db}</Typography>
          <Typography variant="body2">uptime: {health.data?.uptime}</Typography>
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => health.refetch()} disabled={health.isFetching}>
              {health.isFetching ? 'Refreshing…' : 'Refresh Health'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Admin Auth Check
          </Typography>
          <Typography variant="body2">ok: {String(ping.data?.ok)}</Typography>
          <Typography variant="body2">
            user: {ping.data?.user?.id} ({ping.data?.user?.role})
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => ping.refetch()} disabled={ping.isFetching}>
              {ping.isFetching ? 'Refreshing…' : 'Refresh Ping'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
