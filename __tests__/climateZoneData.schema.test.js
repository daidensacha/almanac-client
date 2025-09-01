import { describe, it, expect } from 'vitest';
import climateZoneData from '../src/data/climate-zone';

const requiredTopLevel = [
  'subZone',
  'group',
  'precipitationType',
  'shortDescription',
  'longDescription',
  'color',
  'backgroundColor',
];

describe('climateZoneData schema', () => {
  it('every item has required top-level fields (as strings)', () => {
    climateZoneData.forEach((z, idx) => {
      requiredTopLevel.forEach((k) => {
        expect(z, `item #${idx} missing ${k}`).toHaveProperty(k);
        expect(typeof z[k], `item #${idx} ${k} must be a string`).toBe('string');
        expect(String(z[k]).length, `item #${idx} ${k} should not be empty`).toBeGreaterThan(0);
      });
      // subZone looks like 2–3 letters (case-insensitive), occasionally with lowercase suffix
      expect(z.subZone).toMatch(/^[A-Za-z]{2,3}$/);
    });
  });

  it('colors are valid hex', () => {
    const hex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    climateZoneData.forEach((z, idx) => {
      expect(z.color, `item #${idx} color`).toMatch(hex);
      expect(z.backgroundColor, `item #${idx} backgroundColor`).toMatch(hex);
    });
  });
});
