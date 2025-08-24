// src/queries/useOpenMeteo.js
import { useQuery } from '@tanstack/react-query';

export function useOpenMeteo({ lat, lon }) {
  const can = Number.isFinite(lat) && Number.isFinite(lon);
  return useQuery({
    enabled: can,
    queryKey: ['open-meteo', lat, lon],
    queryFn: async () => {
      const base = 'https://api.open-meteo.com/v1/forecast';
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        timezone: 'auto',
        timeformat: 'iso8601',
        current: 'temperature_2m,weather_code',
        hourly: 'temperature_2m,precipitation,weather_code',
        daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code',
      }).toString();
      const res = await fetch(`${base}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    staleTime: 10 * 60_000,
  });
}
