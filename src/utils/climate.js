// src/utils/climate.js
import climateZoneData from '@/data/climate-zone';

// Build a lookup map once (O(1) lookups)
const ZONE_MAP = new Map(climateZoneData.map((z) => [z.subZone, z]));

/** Given a Koppen–Geiger code (e.g. "Cfb"), return UI-friendly info */
export function enrichZone(code) {
  if (!code) return { koppen_geiger_zone: '', zone_description: '' };

  const z = ZONE_MAP.get(code);
  return {
    koppen_geiger_zone: code,
    zone_description: z?.longDescription || z?.shortDescription || '',
    // Optional extras if you want them in UI:
    group: z?.group ?? '',
    precipitationType: z?.precipitationType ?? '',
    heatLevel: z?.heatLevel ?? '',
    // and even styling if you like:
    color: z?.color ?? '',
    backgroundColor: z?.backgroundColor ?? '',
  };
}
