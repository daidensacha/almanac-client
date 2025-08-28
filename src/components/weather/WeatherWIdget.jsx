// src/hooks/useWeatherOpenMeteo.js
import * as React from 'react';

export default function useWeatherOpenMeteo(coords) {
  const [state, setState] = React.useState({
    tempC: null,
    code: null,
    sunrise: null,
    sunset: null,
    loading: false,
    error: null,
  });

  const url = React.useMemo(() => {
    if (!coords?.lat || !coords?.lon) return null;
    const p = new URLSearchParams({
      latitude: String(coords.lat),
      longitude: String(coords.lon),
      timezone: 'auto',
      timeformat: 'iso8601',
      current: 'temperature_2m,weather_code',
      daily: 'sunrise,sunset',
    });
    return `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
  }, [coords?.lat, coords?.lon]);

  React.useEffect(() => {
    let abort = false;
    if (!url) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (abort) return;
        setState({
          tempC: data?.current?.temperature_2m ?? null,
          code: data?.current?.weather_code ?? null,
          sunrise: data?.daily?.sunrise?.[0] ?? null,
          sunset: data?.daily?.sunset?.[0] ?? null,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (!abort)
          setState({
            tempC: null,
            code: null,
            sunrise: null,
            sunset: null,
            loading: false,
            error: e?.message || 'error',
          });
      }
    })();
    return () => {
      abort = true;
    };
  }, [url]);

  return state; // { tempC, code, sunrise, sunset, loading, error }
}
