// src/hooks/useProfile.js
import { useMemo } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export function useProfile() {
  const { user } = useAuthContext();

  // fallback to localStorage once if context not ready
  const profile = useMemo(() => {
    if (user) return user;
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, [user]);

  const showLocation = !!profile?.show_location;
  const lat = toNum(profile?.latitude);
  const lon = toNum(profile?.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0;

  // ✅ only true if toggle is ON *and* coords exist
  const hasGeo = showLocation && hasCoords;

  return { profile, showLocation, lat, lon, hasGeo };
}
