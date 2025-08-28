// src/components/WeatherFooterChip.jsx
import * as React from 'react';
import { Typography } from '@mui/material';
import usePreferredCoords from '@/hooks/usePreferredCoords';
import { useAuthContext } from '@/contexts/AuthContext';

export default function WeatherFooterChip() {
  const { user } = useAuthContext();
  const { coords, ready } = usePreferredCoords(); // { lat, lon } or null
  const [tempC, setTempC] = React.useState(null);

  React.useEffect(() => {
    let abort = false;
    if (!ready || !coords?.lat || !coords?.lon) return;

    const params = new URLSearchParams({
      latitude: String(coords.lat),
      longitude: String(coords.lon),
      timezone: 'auto',
      timeformat: 'iso8601',
      current: 'temperature_2m',
    });

    (async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (abort) return;
        const t = data?.current?.temperature_2m;
        setTempC(Number.isFinite(t) ? Math.round(t) : null);
      } catch {
        if (!abort) setTempC(null);
      }
    })();

    return () => {
      abort = true;
    };
  }, [ready, coords?.lat, coords?.lon]);

  if (!ready || !coords) return null;

  const city = user?.city || user?.location?.city || '';
  const text = `${city ? `${city} · ` : ''}${tempC != null ? `${tempC}°C` : '—'}`;

  return (
    <Typography variant="body2" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {text}
    </Typography>
  );
}
