// src/hooks/usePreferredCoords.js
import { useEffect, useMemo, useState } from 'react';
import api from '@/utils/axiosClient';
import { useAuthContext } from '@/contexts/AuthContext';

export default function usePreferredCoords() {
  const { user } = useAuthContext();
  const saved = useMemo(() => {
    const lat = Number(user?.latitude);
    const lon = Number(user?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  }, [user?.latitude, user?.longitude]);

  const [coords, setCoords] = useState(saved);
  const [ready, setReady] = useState(!!saved);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if user has saved coords, use them immediately
    if (saved) {
      setCoords(saved);
      setReady(true);
      setError(null);
      return;
    }
    let on = true;

    async function fetchIpCoords() {
      try {
        // Your backend should return: { latitude: number, longitude: number }
        const { data } = await api.get('/ip');
        const lat = Number(data?.latitude);
        const lon = Number(data?.longitude);
        if (on && Number.isFinite(lat) && Number.isFinite(lon)) {
          setCoords({ lat, lon });
          setError(null);
        } else if (on) {
          setError('IP lookup failed');
        }
      } catch (e) {
        if (on) setError(e?.message || 'IP lookup failed');
      } finally {
        if (on) setReady(true);
      }
    }

    fetchIpCoords();
    return () => {
      on = false;
    };
  }, [saved]);

  return { coords, ready, error };
}
