import { describe, it, expect } from 'vitest';
import climateZoneData from '../src/data/climate-zone';

describe('climateZoneData colors', () => {
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  it('all color fields should be valid hex', () => {
    for (const zone of climateZoneData) {
      if (zone.color) {
        expect(zone.color).toMatch(hexPattern);
      }
      if (zone.backgroundColor) {
        expect(zone.backgroundColor).toMatch(hexPattern);
      }
    }
  });
});
