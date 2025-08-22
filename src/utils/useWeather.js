import { useEffect, useMemo, useState } from 'react';

export function useWeather({ lat, lon, enabled = true }) {
  const key = import.meta.env.VITE_WEATHER_KEY; // put in .env(.development/.production)
  const canFetch = enabled && key && Number.isFinite(lat) && Number.isFinite(lon);

  const [data, setData] = useState(null); // { temp, desc, icon, city }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const url = useMemo(() => {
    if (!canFetch) return null;
    const base = 'https://api.openweathermap.org/data/2.5/weather';
    const q = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      units: 'metric',
      appid: key,
    }).toString();
    return `${base}?${q}`;
  }, [lat, lon, key, canFetch]);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json?.weather || !json?.main) {
          throw new Error('Malformed weather response');
        }
        const payload = {
          temp: Math.round(json.main.temp),
          desc: json.weather[0]?.main ?? '',
          icon: json.weather[0]?.icon ?? '', // e.g. "01d"
          city: json.name ?? '',
        };
        setData(payload);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error, ready: !!data && !loading };
}
