// src/hooks/usePreferredLocation.js
import * as React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function usePreferredLocation() {
  const { user } = useAuthContext();
  const [loc, setLoc] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qLat = params.get('lat'),
      qLon = params.get('lon'),
      qCity = params.get('city');
    if (qLat && qLon) {
      setLoc({ lat: +qLat, lon: +qLon, city: qCity || null });
      return;
    }
    if (user?.location?.lat && user?.location?.lon) {
      setLoc({ lat: user.location.lat, lon: user.location.lon, city: user.location.city || null });
      return;
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: null }),
        () => {},
        { timeout: 4000, maximumAge: 600000 },
      );
    }
  }, [user]);

  return loc;
}
