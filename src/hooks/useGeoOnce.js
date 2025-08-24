import { useEffect, useState } from 'react';

export default function useGeoOnce({ enableHighAccuracy = false, timeout = 6000 } = {}) {
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [error, setError] = useState(null); // 'denied' | 'unavailable' | 'timeout' | string
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('unavailable');
      setReady(true);
      return;
    }
    let didSettle = false;

    const ok = (pos) => {
      if (didSettle) return;
      didSettle = true;
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      setReady(true);
    };
    const fail = (err) => {
      if (didSettle) return;
      didSettle = true;
      setError(err?.code === 1 ? 'denied' : err?.code === 3 ? 'timeout' : 'unavailable');
      setReady(true);
    };

    navigator.geolocation.getCurrentPosition(ok, fail, { enableHighAccuracy, timeout });

    return () => {
      didSettle = true;
    };
  }, [enableHighAccuracy, timeout]);

  return { coords, error, ready };
}
