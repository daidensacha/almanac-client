// src/hooks/useAppLocation.js
import * as React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import api from '@/utils/axiosClient';

const isFiniteNum = (n) => Number.isFinite(Number(n));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Priority:
 * 1) Auth + saved coords (profile)
 * 2) IP-based fallback (/api/ip) — no permission prompt
 */
export default function useAppLocation() {
  const { user } = useAuthContext();

  // 1) saved profile coords (highest priority)
  const saved =
    user?.latitude != null &&
    user?.longitude != null &&
    isFiniteNum(user.latitude) &&
    isFiniteNum(user.longitude)
      ? {
          lat: clamp(Number(user.latitude), -90, 90),
          lon: clamp(Number(user.longitude), -180, 180),
          source: 'profile',
          isAuth: !!user,
          hasSaved: true,
          city: user?.city ?? null,
        }
      : null;

  // 2) IP fallback — cached per session
  const [ip, setIp] = React.useState(null);
  const [ipReady, setIpReady] = React.useState(false);

  React.useEffect(() => {
    if (saved) {
      // If we have saved coords, we don’t need IP
      setIpReady(true);
      return;
    }
    let on = true;

    const cached = sessionStorage.getItem('ipCoords');
    if (cached) {
      try {
        const v = JSON.parse(cached);
        if (isFiniteNum(v?.lat) && isFiniteNum(v?.lon)) {
          setIp({ ...v, source: 'ip', isAuth: !!user, hasSaved: false });
          setIpReady(true);
          return;
        }
      } catch {}
    }

    (async () => {
      try {
        const { data } = await api.get('/ip'); // implement on server
        const lat = Number(data?.latitude ?? data?.lat);
        const lon = Number(data?.longitude ?? data?.lon);
        const city = data?.city ?? null;
        if (on && isFiniteNum(lat) && isFiniteNum(lon)) {
          const val = { lat, lon, city };
          setIp({ ...val, source: 'ip', isAuth: !!user, hasSaved: false });
          sessionStorage.setItem('ipCoords', JSON.stringify(val));
        }
      } finally {
        if (on) setIpReady(true);
      }
    })();

    return () => {
      on = false;
    };
  }, [saved, user]);

  const winner = saved || (ipReady ? ip : null);
  const ready = !!winner;

  return {
    coords: winner ? { lat: winner.lat, lon: winner.lon } : null,
    meta: winner, // {source,isAuth,hasSaved,city,...}
    ready,
  };
}
