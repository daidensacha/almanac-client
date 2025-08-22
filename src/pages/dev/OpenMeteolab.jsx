// src/pages/OpenMeteoLab.jsx
import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import AnimatedPage from '@/components/AnimatedPage';
import { useProfile } from '@/hooks/useProfile';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const wmo = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Fog', emoji: '🌫️' },
  48: { label: 'Depositing rime fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Drizzle', emoji: '🌦️' },
  55: { label: 'Heavy drizzle', emoji: '🌧️' },
  61: { label: 'Light rain', emoji: '🌧️' },
  63: { label: 'Rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  71: { label: 'Light snow', emoji: '🌨️' },
  73: { label: 'Snow', emoji: '🌨️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  80: { label: 'Rain showers', emoji: '🌦️' },
  81: { label: 'Heavy showers', emoji: '🌧️' },
  82: { label: 'Violent showers', emoji: '🌧️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunder + hail', emoji: '⛈️' },
  99: { label: 'Thunder + heavy hail', emoji: '⛈️' },
};

function labelFor(code) {
  const c = Number(code);
  return wmo[c] ?? { label: `Code ${c}`, emoji: '🌡️' };
}

function hms(dt) {
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function ymd(dt) {
  return new Date(dt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

// Find today index within daily arrays
function pickTodayIndex(daily) {
  if (!daily?.time?.length) return 0;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const i = daily.time.findIndex((d) => d.startsWith(today));
  return i >= 0 ? i : 0;
}

export default function OpenMeteoLab() {
  const { profile, lat: profLat, lon: profLon, hasGeo } = useProfile();

  const [showJson, setShowJson] = useState(false);

  const [lat, setLat] = useState(() => (Number.isFinite(profLat) ? profLat : ''));
  const [lon, setLon] = useState(() => (Number.isFinite(profLon) ? profLon : ''));
  const [data, setData] = useState(null); // raw open-meteo response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canFetch = useMemo(() => {
    const la = Number(lat);
    const lo = Number(lon);
    return Number.isFinite(la) && Number.isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180;
  }, [lat, lon]);

  const url = useMemo(() => {
    if (!canFetch) return null;
    const la = Number(lat);
    const lo = Number(lon);
    const base = 'https://api.open-meteo.com/v1/forecast';
    const params = new URLSearchParams({
      latitude: String(la),
      longitude: String(lo),
      timezone: 'auto',
      timeformat: 'iso8601',
      current: 'temperature_2m,weather_code',
      hourly: 'temperature_2m,precipitation,weather_code',
      daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code',
    }).toString();
    return `${base}?${params}`;
  }, [lat, lon, canFetch]);

  const fetchNow = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e?.message || 'Failed to fetch weather');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // auto-fetch on first load when profile coords are present
  useEffect(() => {
    if (hasGeo && Number.isFinite(profLat) && Number.isFinite(profLon)) {
      setLat(profLat);
      setLon(profLon);
    }
  }, [hasGeo, profLat, profLon]);

  useEffect(() => {
    if (canFetch) fetchNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Derived bits
  const current = data?.current;
  const daily = data?.daily;
  const hourly = data?.hourly;
  const iToday = pickTodayIndex(daily);

  const sunriseISO = daily?.sunrise?.[iToday] ?? null;
  const sunsetISO = daily?.sunset?.[iToday] ?? null;
  const tMax = daily?.temperature_2m_max?.[iToday];
  const tMin = daily?.temperature_2m_min?.[iToday];

  const currentLabel = labelFor(current?.weather_code);
  const todayLabel = labelFor(daily?.weather_code?.[iToday]);

  // For dev JSON toggle
  const trimmed = { current, hourly, daily };

  // Helper: slice arrays safely
  const trunc = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : arr);

  // Build truncated views (first 3 daily entries, first 6 hourly entries)
  const prettyDaily = daily
    ? Object.fromEntries(Object.entries(daily).map(([k, v]) => [k, trunc(v, 3)]))
    : null;

  const prettyHourly = hourly
    ? Object.fromEntries(Object.entries(hourly).map(([k, v]) => [k, trunc(v, 6)]))
    : null;

  // Final pretty JSON payload
  const prettyData = { current, daily: prettyDaily, hourly: prettyHourly };

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Open-Meteo Lab
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
          Quick dev view for Open-Meteo data: current, today, hourly and daily. Use profile coords
          or enter custom values and fetch.
        </Typography>
        <Card sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h5">Open-Meteo Lab</Typography>
            <FormControlLabel
              control={
                <Switch checked={showJson} onChange={(e) => setShowJson(e.target.checked)} />
              }
              label="JSON view"
            />
          </Stack>

          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                size="small"
                label="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                sx={{ width: { xs: '100%', sm: 220 } }}
              />
              <TextField
                size="small"
                label="Longitude"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                sx={{ width: { xs: '100%', sm: 220 } }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (Number.isFinite(profLat) && Number.isFinite(profLon)) {
                    setLat(profLat);
                    setLon(profLon);
                  }
                }}
              >
                Use profile coords
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={fetchNow} variant="contained" disabled={!canFetch || loading}>
                {loading ? 'Fetching…' : 'Fetch'}
              </Button>
            </Stack>
            {!canFetch && (
              <Typography variant="caption" color="warning.main">
                Enter valid latitude (±90) & longitude (±180) to enable fetch.
              </Typography>
            )}
          </CardContent>
        </Card>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {/* start json block */}
        {showJson ? (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Raw Open-Meteo JSON (truncated: first 3 daily / first 6 hourly )
              </Typography>
              <pre
                style={{
                  background: '#111',
                  color: '#9fe',
                  padding: 12,
                  borderRadius: 6,
                  overflowX: 'auto',
                  maxHeight: '70vh',
                }}
              >
                {JSON.stringify(prettyData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* your pretty UI goes here */}

            {data && (
              <Grid container spacing={2}>
                {/* Current snapshot */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Current
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {Number.isFinite(current?.temperature_2m)
                          ? Math.round(current.temperature_2m)
                          : '—'}
                        °C
                      </Typography>
                      <Typography sx={{ mt: 0.5 }}>
                        {currentLabel.emoji} {currentLabel.label}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        As of {current?.time ? hms(current.time) : '—'} (
                        {current?.time ? ymd(current.time) : '—'})
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Today (sunrise/sunset + hi/lo) */}
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Today
                      </Typography>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        divider={<Divider flexItem orientation="vertical" />}
                      >
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {Number.isFinite(tMax) ? Math.round(tMax) : '—'}° /{' '}
                            {Number.isFinite(tMin) ? Math.round(tMin) : '—'}°
                          </Typography>
                          <Typography sx={{ mt: 0.5 }}>
                            {todayLabel.emoji} {todayLabel.label}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography>Sunrise: {sunriseISO ? hms(sunriseISO) : '—'}</Typography>
                          <Typography>Sunset: {sunsetISO ? hms(sunsetISO) : '—'}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Hourly teaser (next ~8) */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Hourly (next 8)
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                        {(() => {
                          const t = data?.hourly?.time || [];
                          const tt = data?.hourly?.temperature_2m || [];
                          const wc = data?.hourly?.weather_code || [];
                          const start = Math.max(
                            t.findIndex((x) => new Date(x).getTime() >= Date.now()),
                            0,
                          );
                          const slice = t.slice(start, start + 8);
                          return slice.map((time, idx) => {
                            const k = start + idx;
                            const code = wc?.[k];
                            const lab = labelFor(code);
                            const temp = tt?.[k];
                            return (
                              <Box
                                key={time}
                                sx={{
                                  minWidth: 86,
                                  px: 1,
                                  py: 1,
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  textAlign: 'center',
                                }}
                              >
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                  {hms(time)}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {Number.isFinite(temp) ? Math.round(temp) : '—'}°
                                </Typography>
                                <Typography variant="caption">
                                  {lab.emoji} {lab.label}
                                </Typography>
                              </Box>
                            );
                          });
                        })()}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Daily next 5 */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Daily (next 5)
                      </Typography>
                      <Stack spacing={1.25}>
                        {(() => {
                          const days = daily?.time ?? [];
                          const max = daily?.temperature_2m_max ?? [];
                          const min = daily?.temperature_2m_min ?? [];
                          const codes = daily?.weather_code ?? [];
                          return days.slice(0, 5).map((d, idx) => {
                            const lab = labelFor(codes?.[idx]);
                            return (
                              <Stack
                                key={d}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ borderBottom: '1px dashed', borderColor: 'divider', pb: 1 }}
                              >
                                <Typography>{ymd(d)}</Typography>
                                <Typography sx={{ minWidth: 140, textAlign: 'center' }}>
                                  {lab.emoji} {lab.label}
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {Number.isFinite(max?.[idx]) ? Math.round(max[idx]) : '—'}° /{' '}
                                  {Number.isFinite(min?.[idx]) ? Math.round(min[idx]) : '—'}°
                                </Typography>
                              </Stack>
                            );
                          });
                        })()}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {!data && !loading && !error && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography>Enter coordinates (or use your profile) and hit Fetch.</Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>
    </AnimatedPage>
  );
}
