import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import api from '@/utils/axiosClient';

const FRONT_BASE = import.meta.env.BASE_URL;
const API_BASE = import.meta.env.VITE_API;

function useHealth() {
  return useQuery({
    queryKey: ['dev:health'],
    queryFn: async () => (await api.get('/health')).data,
    refetchOnWindowFocus: false,
  });
}

function useAdminPing() {
  return useQuery({
    queryKey: ['dev:ping'],
    queryFn: async () => (await api.get('/admin/ping')).data,
    refetchOnWindowFocus: false,
  });
}

export default function Dev() {
  const health = useHealth();
  const ping = useAdminPing();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dev Tools
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">Client Environment</Typography>
          <Typography variant="body2">VITE_API: {String(API_BASE)}</Typography>
          <Typography variant="body2">BASE_URL: {String(FRONT_BASE)}</Typography>
          <Typography variant="body2">Axios baseURL: {String(api.defaults.baseURL)}</Typography>
          <Typography variant="body2">
            Has Bearer: {String(!!api.defaults.headers.common?.Authorization)}
          </Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1">/health</Typography>
            <Typography variant="body2">ok: {String(health.data?.ok)}</Typography>
            <Typography variant="body2">db: {health.data?.db}</Typography>
            <Typography variant="body2">uptime: {health.data?.uptime}</Typography>
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() => health.refetch()}
              disabled={health.isFetching}
            >
              {health.isFetching ? 'Refreshing…' : 'Refresh'}
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1">/admin/ping</Typography>
            <Typography variant="body2">ok: {String(ping.data?.ok)}</Typography>
            <Typography variant="body2">
              user: {ping.data?.user?.id} ({ping.data?.user?.role})
            </Typography>
            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() => ping.refetch()}
              disabled={ping.isFetching}
            >
              {ping.isFetching ? 'Refreshing…' : 'Refresh'}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
