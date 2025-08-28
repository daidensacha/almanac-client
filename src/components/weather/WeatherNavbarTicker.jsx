// WeatherNavbarTicker.jsx
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import useAppLocation from '@/hooks/useAppLocation';
import useWeatherNow from '@/hooks/useWeatherNow';
import { iconForWmo } from '@/utils/weatherIcons';

const hms = (dt) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function WeatherNavbarTicker({ compact = false }) {
  const { coords, ready } = useAppLocation(); // saved → IP fallback
  const wx = useWeatherNow(ready ? coords : null);
  const icon = iconForWmo(wx.code);

  const nowTs = Date.now();
  const sunriseTs = wx.sunrise ? Date.parse(wx.sunrise) : null;
  const sunsetTs = wx.sunset ? Date.parse(wx.sunset) : null;

  // After sunrise (daytime) → show Sunset; after sunset (night) → show next Sunrise
  const showSunset = sunriseTs && sunsetTs && nowTs >= sunriseTs && nowTs < sunsetTs;
  const singleLabel = showSunset
    ? sunsetTs
      ? `Sunset: ${hms(sunsetTs)}`
      : ''
    : sunriseTs
    ? `Sunrise: ${hms(sunriseTs)}`
    : '';

  let text = '—';
  if (wx.tempC != null) {
    text = compact
      ? `${Math.round(wx.tempC)}°C  ${singleLabel}`
      : `${Math.round(wx.tempC)}°C  ${
          sunriseTs && sunsetTs ? `Sunrise: ${hms(sunriseTs)}  Sunset: ${hms(sunsetTs)}` : ''
        }`;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      <Box component="span" aria-label="weather" sx={{ fontSize: 18, lineHeight: 1 }}>
        {icon}
      </Box>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.9,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
        title={text}
      >
        {text}
      </Typography>
    </Box>
  );
}

// // src/components/WeatherNavbarTicker.jsx
// import * as React from 'react';
// import { Box, Typography } from '@mui/material';
// import useAppLocation from '@/hooks/useAppLocation';
// import useWeatherNow from '@/hooks/useWeatherNow';
// import { iconForWmo } from '@/utils/weatherIcons';

// const hms = (dt) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// export default function WeatherNavbarTicker() {
//   const { coords, ready } = useAppLocation(); // saved → IP, no browser geo
//   const wx = useWeatherNow(ready ? coords : null);
//   const icon = iconForWmo(wx.code);

//   return (
//     <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
//       <Box component="span" aria-label="weather" sx={{ fontSize: 18, lineHeight: 1 }}>
//         {icon}
//       </Box>
//       <Typography variant="body2" sx={{ opacity: 0.9 }}>
//         {wx.tempC != null ? `${Math.round(wx.tempC)}°C` : '—'}
//         {wx.sunrise && wx.sunset ? `  Sunrise: ${hms(wx.sunrise)}  Sunset: ${hms(wx.sunset)}` : ''}
//       </Typography>
//     </Box>
//   );
// }

// -----------------------------------------------
// import { useEffect, useMemo, useState } from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { useAuthContext } from '@/contexts/AuthContext';
// import useGeoOnce from '@/hooks/useGeoOnce';
// import { iconForWmo } from '@/utils/weatherIcons';

// function hms(dt) {
//   return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// export default function WeatherNavbarTicker() {
//   const { user } = useAuthContext();
//   const { coords: geo, error: geoErr, ready: geoReady } = useGeoOnce({ timeout: 5000 });

//   // 1) pick coords: user profile → browser geo → null
//   const coords = useMemo(() => {
//     const lat = Number(user?.latitude);
//     const lon = Number(user?.longitude);
//     if (user?.show_location && Number.isFinite(lat) && Number.isFinite(lon)) {
//       return { lat, lon, source: 'profile' };
//     }
//     if (geoReady && geo?.lat && geo?.lon) return { ...geo, source: 'browser' };
//     return null;
//   }, [user?.show_location, user?.latitude, user?.longitude, geo, geoReady]);

//   const [state, setState] = useState({
//     tempC: null,
//     code: null,
//     sunrise: null,
//     sunset: null,
//   });

//   const url = useMemo(() => {
//     if (!coords) return null;
//     const p = new URLSearchParams({
//       latitude: String(coords.lat),
//       longitude: String(coords.lon),
//       timezone: 'auto',
//       timeformat: 'iso8601',
//       current: 'temperature_2m,weather_code',
//       daily: 'sunrise,sunset',
//     });
//     return `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
//   }, [coords]);

//   useEffect(() => {
//     let abort = false;
//     (async () => {
//       if (!url) return;
//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         if (abort) return;
//         const tempC = data?.current?.temperature_2m ?? null;
//         const code = data?.current?.weather_code ?? null;
//         const sunrise = data?.daily?.sunrise?.[0] ?? null;
//         const sunset = data?.daily?.sunset?.[0] ?? null;
//         setState({ tempC, code, sunrise, sunset });
//       } catch {
//         if (!abort) setState({ tempC: null, code: null, sunrise: null, sunset: null });
//       }
//     })();
//     return () => {
//       abort = true;
//     };
//   }, [url]);

//   const icon = iconForWmo(state.code); // returns an emoji string like "☀️"

//   return (
//     <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
//       {/* render emoji as text, not an element tag */}
//       <Box component="span" aria-label="weather" sx={{ fontSize: 18, lineHeight: 1 }}>
//         {icon}
//       </Box>
//       <Typography variant="body2" sx={{ opacity: 0.9 }}>
//         {state.tempC != null ? `${Math.round(state.tempC)}°C` : '—'}
//         {state.sunrise && state.sunset
//           ? `  Sunrise: ${hms(state.sunrise)}  Sunset: ${hms(state.sunset)}`
//           : ''}
//       </Typography>
//     </Box>
//   );
// }
