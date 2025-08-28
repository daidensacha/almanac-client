// src/hooks/useWeatherNow.js
import * as React from 'react';

export default function useWeatherNow(coords) {
  const [state, setState] = React.useState({
    tempC: null,
    code: null,
    sunrise: null, // today
    sunset: null, // today
    sunriseNext: null, // tomorrow
    sunsetNext: null, // tomorrow
    loading: false,
    error: null,
  });

  React.useEffect(() => {
    let on = true;
    if (!coords?.lat || !coords?.lon) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    const p = new URLSearchParams({
      latitude: String(coords.lat),
      longitude: String(coords.lon),
      timezone: 'auto',
      timeformat: 'iso8601',
      current: 'temperature_2m,weather_code',
      daily: 'sunrise,sunset',
      // ensure at least 2 days are returned
      forecast_days: '2',
    });

    (async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${p.toString()}`);
        const j = await res.json();
        if (!on) return;
        setState({
          tempC: j?.current?.temperature_2m ?? null,
          code: j?.current?.weather_code ?? null,
          sunrise: j?.daily?.sunrise?.[0] ?? null,
          sunset: j?.daily?.sunset?.[0] ?? null,
          sunriseNext: j?.daily?.sunrise?.[1] ?? null,
          sunsetNext: j?.daily?.sunset?.[1] ?? null,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (on)
          setState({
            tempC: null,
            code: null,
            sunrise: null,
            sunset: null,
            sunriseNext: null,
            sunsetNext: null,
            loading: false,
            error: e?.message || 'error',
          });
      }
    })();

    return () => {
      on = false;
    };
  }, [coords?.lat, coords?.lon]);

  return state;
}
