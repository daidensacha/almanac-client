import * as React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Stack,
  Skeleton,
  Paper,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : '—');
const ago = (ts) => {
  if (!ts) return '—';
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

export default function HealthDashboard({
  status = {}, // { Auth: { ok, status, json, ms }, ... }
  refreshing = false,
  lastChecked = Date.now(),
  onRefresh,
  refreshSeconds = 10,
}) {
  const rows = Object.entries(status);
  const upCount = rows.filter(([, v]) => v?.ok).length;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 6 }}>
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5">🩺 Health Dashboard</Typography>
              <Chip
                size="small"
                variant="outlined"
                icon={<AccessTimeIcon />}
                label={`Auto-refresh: ${refreshSeconds}s`}
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
              <Chip
                size="small"
                color={rows.length && upCount === rows.length ? 'success' : 'warning'}
                label={`${upCount}/${rows.length || 0} healthy`}
              />
            </Stack>
          }
          action={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title={`Last checked: ${fmt(lastChecked)}`}>
                <Chip
                  size="small"
                  variant="outlined"
                  icon={<AccessTimeIcon />}
                  label={ago(lastChecked)}
                />
              </Tooltip>
              <Tooltip title="Refresh now">
                <span>
                  <IconButton onClick={onRefresh} disabled={refreshing}>
                    <RefreshIcon
                      sx={{
                        animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>HTTP</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Latency</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refreshing && rows.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton width={160} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={90} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={60} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={180} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography>No services checked yet.</Typography>
                        <Typography variant="body2">
                          Click refresh to run a health check.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(([name, svc]) => {
                    const ok = !!svc?.ok;
                    const color = ok ? 'success' : 'error';
                    const Icon = ok ? CheckCircleOutlineIcon : ErrorOutlineIcon;
                    const code = svc?.status ?? '—';
                    const ms = typeof svc?.ms === 'number' ? `${svc.ms} ms` : '—';
                    const ts = svc?.json?.timestamp || null;

                    return (
                      <TableRow key={name} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={color}
                            variant="filled"
                            icon={<Icon />}
                            label={ok ? 'Up' : 'Down'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: 'ui-monospace,Menlo,monospace' }}
                          >
                            {code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{ms}</Typography>
                        </TableCell>
                        <TableCell>
                          {ts ? (
                            <Tooltip title={fmt(ts)}>
                              <Typography variant="body2">{fmt(ts)}</Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2">—</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <Box sx={{ px: 3, py: 2, color: 'text.secondary' }}>
          <Typography variant="caption">
            Healthy services are green; failures or timeouts show red.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
