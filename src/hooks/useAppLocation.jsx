// src/hooks/useAppLocation.js
import * as React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import api from '@/utils/axiosClient';

const isFiniteNum = (n) => Number.isFinite(Number(n));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Priority:
 * 1) Saved user coords (if logged in)
 * 2) IP-based lookup (silent, no prompt)
 * Never use fake/default coords.
 */
export default function useAppLocation() {
  const { user } = useAuthContext();

  const wantsProfile =
    !!user && (user.locationPreference === 'profile' || user.show_location === true);

  const hasSaved =
    wantsProfile &&
    Number.isFinite(Number(user?.latitude)) &&
    Number.isFinite(Number(user?.longitude));

  const saved = hasSaved
    ? {
        lat: Math.max(-90, Math.min(90, Number(user.latitude))),
        lon: Math.max(-180, Math.min(180, Number(user.longitude))),
        source: 'profile',
        isAuth: true,
        hasSaved: true,
        city: user?.city ?? null,
      }
    : null;

  // 2) IP fallback — cached per session
  const [ip, setIp] = React.useState(null);
  const [ipReady, setIpReady] = React.useState(false);
  const [error, setError] = React.useState(null);

  // 🔁 When user logs out, immediately switch to IP (use cached if available)
  const prevUserRef = React.useRef(user);
  React.useEffect(() => {
    const prev = prevUserRef.current;
    if (prev && !user) {
      try {
        const cached = sessionStorage.getItem('ipCoords');
        if (cached) {
          const v = JSON.parse(cached);
          if (isFiniteNum(v?.lat) && isFiniteNum(v?.lon)) {
            setIp({ ...v, source: 'ip', isAuth: false, hasSaved: false });
            setIpReady(true);
          } else {
            setIp(null);
            setIpReady(false);
          }
        } else {
          setIp(null);
          setIpReady(false);
        }
      } catch {
        setIp(null);
        setIpReady(false);
      }
    }
    prevUserRef.current = user;
  }, [user]);

  React.useEffect(() => {
    // If we have saved profile coords, don't resolve IP now.
    if (saved) {
      setIpReady(false);
      setError(null);
      return;
    }

    let on = true;

    // Try cached per-session coords first
    const cached = sessionStorage.getItem('ipCoords');
    if (cached) {
      try {
        const v = JSON.parse(cached);
        if (isFiniteNum(v?.lat) && isFiniteNum(v?.lon)) {
          setIp({ ...v, source: 'ip', isAuth: !!user, hasSaved: false });
          setIpReady(true);
          setError(null);
          return;
        }
      } catch {
        // ignore cache parse errors
      }
    }

    // Otherwise do a live IP lookup (silent)
    (async () => {
      try {
        // IMPORTANT: hit the Vite-proxied route so mobile works in dev
        const { data } = await api.get('/ip'); // your backend should provide this
        console.log('[useAppLocation] /ip response', data);
        const lat = Number(data?.lat ?? data?.latitude);
        const lon = Number(data?.lon ?? data?.longitude);
        const city = data?.city ?? null;

        if (on && isFiniteNum(lat) && isFiniteNum(lon)) {
          const val = { lat, lon, city };
          setIp({ ...val, source: 'ip', isAuth: !!user, hasSaved: false });
          sessionStorage.setItem('ipCoords', JSON.stringify(val));
          setError(null);
        } else if (on) {
          setIp(null);
          setError('ip_invalid');
        }
      } catch (e) {
        if (on) {
          setIp(null);
          setError('ip_unavailable'); // 404 or network
        }
      } finally {
        if (on) setIpReady(true);
      }
    })();

    return () => {
      on = false;
    };
  }, [saved, user]);

  // Winner = saved OR (IP if ready) OR null
  const winner = saved || (ipReady ? ip : null);
  // const ready = !!saved || ipReady;
  const ready = Boolean(winner);

  return {
    coords: winner ? { lat: winner.lat, lon: winner.lon } : null, // may be null
    meta: winner || {
      source: saved ? 'profile' : 'none',
      isAuth: !!user,
      hasSaved: !!saved,
      city: null,
      error,
    },
    ready, // true when we've determined either saved or IP result
    error, // 'ip_unavailable' | 'ip_invalid' | null
  };
}
