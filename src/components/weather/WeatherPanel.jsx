// src/components/weather/WeatherPanel.jsx
import { useEffect, useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import usePreferredCoords from '@/hooks/usePreferredCoords';
import { iconForWmo } from '@/utils/weatherIcons';

const WMO_LABEL = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Showers',
  81: 'Heavy showers',
  82: 'Violent showers',
  95: 'Thunderstorm',
  96: 'Thunder + hail',
  99: 'Thunder + heavy hail',
};
const labelFor = (c) => WMO_LABEL[Number(c)] || `Code ${c}`;
const hms = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const ymd = (t) =>
  new Date(t).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

export default function WeatherPanel() {
  const { coords, ready, error: coordErr } = usePreferredCoords();
  const [tab, setTab] = useState(0); // 0 Today, 1 Hourly, 2 Next 7, 3 Next 15
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const days = 15; // keep it simple (Open-Meteo max 16 daily)
  const url = useMemo(() => {
    if (!coords) return null;
    const base = 'https://api.open-meteo.com/v1/forecast';
    const qs = new URLSearchParams({
      latitude: String(coords.lat),
      longitude: String(coords.lon),
      timezone: 'auto',
      timeformat: 'iso8601',
      current: 'temperature_2m,weather_code',
      hourly: 'temperature_2m,precipitation,weather_code',
      daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code',
      forecast_days: String(Math.min(days, 16)),
    }).toString();
    return `${base}?${qs}`;
  }, [coords]);

  useEffect(() => {
    let on = true;
    async function run() {
      if (!url) return;
      setLoading(true);
      setErr('');
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (on) setData(j);
      } catch (e) {
        if (on) setErr(e?.message || 'Weather load failed');
      } finally {
        if (on) setLoading(false);
      }
    }
    run();
    return () => {
      on = false;
    };
  }, [url]);

  if (!ready) return <LinearProgress />;
  if (coordErr)
    return <Alert severity="info">Set your location in Profile to see local weather.</Alert>;
  if (!coords) return <Alert severity="info">Location not available.</Alert>;

  const current = data?.current;
  const hourly = data?.hourly;
  const daily = data?.daily;

  const todayIdx = useMemo(() => {
    const list = daily?.time || [];
    const today = new Date().toISOString().slice(0, 10);
    const idx = list.findIndex((d) => d.startsWith(today));
    return idx >= 0 ? idx : 0;
  }, [daily?.time]);

  const sunrise = daily?.sunrise?.[todayIdx];
  const sunset = daily?.sunset?.[todayIdx];
  const tMax = daily?.temperature_2m_max?.[todayIdx];
  const tMin = daily?.temperature_2m_min?.[todayIdx];
  const todayWc = daily?.weather_code?.[todayIdx];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">
            Weather · {['Today', 'Hourly', 'Next 7', `Next ${Math.min(days, 15)}`][tab]}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {coords.lat.toFixed(3)}, {coords.lon.toFixed(3)}
          </Typography>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Today" />
          <Tab label="Hourly" />
          <Tab label="Next 7" />
          <Tab label={`Next ${Math.min(days, 15)}`} />
        </Tabs>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}

        {/* TODAY */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="baseline">
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {Number.isFinite(current?.temperature_2m)
                  ? Math.round(current.temperature_2m)
                  : '—'}
                °C
              </Typography>
              <Typography variant="h5">{iconForWmo(current?.weather_code)}</Typography>
              <Typography variant="body1">{labelFor(current?.weather_code)}</Typography>
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Box>
                <Typography variant="subtitle2">Today</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {Number.isFinite(tMax) ? Math.round(tMax) : '—'}° /{' '}
                  {Number.isFinite(tMin) ? Math.round(tMin) : '—'}°
                </Typography>
                <Typography variant="body2">
                  {iconForWmo(todayWc)} {labelFor(todayWc)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Sun</Typography>
                <Typography variant="body2">Sunrise: {sunrise ? hms(sunrise) : '—'}</Typography>
                <Typography variant="body2">Sunset: {sunset ? hms(sunset) : '—'}</Typography>
              </Box>
            </Stack>
          </Stack>
        )}

        {/* HOURLY (next 24) */}
        {tab === 1 && (
          <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
            {(() => {
              const times = hourly?.time || [];
              const temps = hourly?.temperature_2m || [];
              const wcs = hourly?.weather_code || [];
              const start = Math.max(
                times.findIndex((t) => new Date(t).getTime() >= Date.now()),
                0,
              );
              return times.slice(start, start + 24).map((t, i) => {
                const k = start + i;
                return (
                  <Box
                    key={t}
                    sx={{
                      minWidth: 86,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      px: 1,
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {hms(t)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {Number.isFinite(temps?.[k]) ? Math.round(temps[k]) : '—'}°
                    </Typography>
                    <Typography variant="caption">
                      {iconForWmo(wcs?.[k])} {labelFor(wcs?.[k])}
                    </Typography>
                  </Box>
                );
              });
            })()}
          </Stack>
        )}

        {/* NEXT 7 */}
        {tab === 2 && (
          <Stack spacing={1.25}>
            {(() => {
              const daysA = daily?.time ?? [];
              const max = daily?.temperature_2m_max ?? [];
              const min = daily?.temperature_2m_min ?? [];
              const code = daily?.weather_code ?? [];
              return daysA.slice(0, 7).map((d, i) => (
                <Stack
                  key={d}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ borderBottom: '1px dashed', borderColor: 'divider', pb: 1 }}
                >
                  <Typography>{ymd(d)}</Typography>
                  <Typography sx={{ minWidth: 140, textAlign: 'center' }}>
                    {iconForWmo(code?.[i])} {labelFor(code?.[i])}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {Number.isFinite(max?.[i]) ? Math.round(max[i]) : '—'}° /{' '}
                    {Number.isFinite(min?.[i]) ? Math.round(min[i]) : '—'}°
                  </Typography>
                </Stack>
              ));
            })()}
          </Stack>
        )}

        {/* NEXT 15 */}
        {tab === 3 && (
          <Stack spacing={1.25}>
            {(() => {
              const limit = Math.min(days, 15);
              const daysA = daily?.time ?? [];
              const max = daily?.temperature_2m_max ?? [];
              const min = daily?.temperature_2m_min ?? [];
              const code = daily?.weather_code ?? [];
              return daysA.slice(0, limit).map((d, i) => (
                <Stack
                  key={d}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ borderBottom: '1px dashed', borderColor: 'divider', pb: 1 }}
                >
                  <Typography>{ymd(d)}</Typography>
                  <Typography sx={{ minWidth: 140, textAlign: 'center' }}>
                    {iconForWmo(code?.[i])} {labelFor(code?.[i])}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {Number.isFinite(max?.[i]) ? Math.round(max[i]) : '—'}° /{' '}
                    {Number.isFinite(min?.[i]) ? Math.round(min[i]) : '—'}°
                  </Typography>
                </Stack>
              ));
            })()}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
