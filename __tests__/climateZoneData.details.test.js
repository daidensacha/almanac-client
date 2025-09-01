import { describe, it, expect } from 'vitest';
import climateZoneData from '../src/data/climate-zone';

describe('climateZoneData details (optional) sanity', () => {
  it('details shape (when present) is coherent', () => {
    climateZoneData.forEach((z, idx) => {
      if (!z.details) return;

      const d = z.details;
      expect(typeof d).toBe('object');

      // display
      if (d.display) {
        expect(typeof d.display.label, `#${idx} details.display.label`).toBe('string');
        expect(d.display.label.length).toBeGreaterThan(0);
        if (d.display.emoji) {
          expect(typeof d.display.emoji, `#${idx} details.display.emoji`).toBe('string');
        }
      }

      // growing_season
      if (d.growing_season) {
        expect(typeof d.growing_season).toBe('object');
        // at least one of these should exist
        expect(
          !!(d.growing_season.typical || d.growing_season.early || d.growing_season.late),
          `#${idx} details.growing_season should have at least one window`,
        ).toBe(true);
      }

      // frost
      if (d.frost) {
        expect(typeof d.frost.risk, `#${idx} details.frost.risk`).toBe('string');
        if (d.frost.typical_last_spring) expect(typeof d.frost.typical_last_spring).toBe('string');
        if (d.frost.typical_first_autumn)
          expect(typeof d.frost.typical_first_autumn).toBe('string');
      }

      // heat
      if (d.heat) {
        expect(typeof d.heat.summer_max, `#${idx} details.heat.summer_max`).toBe('string');
        if (d.heat.stress_threshold) expect(typeof d.heat.stress_threshold).toBe('string');
      }

      // rainfall
      if (d.rainfall) {
        expect(typeof d.rainfall.pattern, `#${idx} details.rainfall.pattern`).toBe('string');
      }

      // irrigation (optional)
      if (d.irrigation) {
        expect(typeof d.irrigation).toBe('object');
      }

      // wind (optional)
      if (d.wind) {
        expect(typeof d.wind).toBe('object');
      }

      // soil
      if (d.soil) {
        expect(typeof d.soil.common, `#${idx} details.soil.common`).toBe('string');
        if (d.soil.pH) expect(typeof d.soil.pH).toBe('string');
      }

      // pests_disease (optional)
      if (d.pests_disease) {
        expect(typeof d.pests_disease).toBe('object');
      }

      // scheduling_anchors (optional)
      if (d.scheduling_anchors) {
        expect(Array.isArray(d.scheduling_anchors), `#${idx} details.scheduling_anchors`).toBe(
          true,
        );
        d.scheduling_anchors.forEach((a, ai) => {
          expect(typeof a.key, `#${idx} anchor[${ai}].key`).toBe('string');
          expect(typeof a.label, `#${idx} anchor[${ai}].label`).toBe('string');
          expect(typeof a.when, `#${idx} anchor[${ai}].when`).toBe('string');
        });
      }

      // planting_guides
      if (d.planting_guides) {
        expect(typeof d.planting_guides).toBe('object');
        ['vegetables', 'herbs', 'fruit'].forEach((bucket) => {
          if (!d.planting_guides[bucket]) return;
          expect(
            Array.isArray(d.planting_guides[bucket]),
            `#${idx} planting_guides.${bucket}`,
          ).toBe(true);
          d.planting_guides[bucket].forEach((p, pi) => {
            expect(typeof p.name, `#${idx} ${bucket}[${pi}].name`).toBe('string');
            expect(typeof p.window, `#${idx} ${bucket}[${pi}].window`).toBe('string');
            if (p.notes) expect(typeof p.notes, `#${idx} ${bucket}[${pi}].notes`).toBe('string');
          });
        });
      }
    });
  });
});
