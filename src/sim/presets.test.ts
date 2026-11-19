import { describe, expect, it } from 'vitest';
import { BLACK_HOLE_PRESETS, GALAXY_PRESETS, ORBIT_PRESETS } from './presets';
import { clampBlackHoleSettings } from './blackhole/config';
import { clampGalaxyParameters } from './galaxy/types';
import { BODY_LIMITS } from './orbit/types';

describe('simulation presets', () => {
  it('uses unique ids in every catalog', () => {
    for (const catalog of [ORBIT_PRESETS, GALAXY_PRESETS, BLACK_HOLE_PRESETS]) {
      const ids = catalog.map((preset) => preset.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('creates fresh, valid orbital configurations', () => {
    for (const preset of ORBIT_PRESETS) {
      const first = preset.create();
      const second = preset.create();
      expect(first.length).toBeGreaterThanOrEqual(2);
      expect(first.length).toBeLessThanOrEqual(12);
      expect(new Set(first.map((body) => body.id)).size).toBe(first.length);
      expect(first).toEqual(second);
      expect(first).not.toBe(second);

      for (const body of first) {
        expect(body.mass).toBeGreaterThanOrEqual(BODY_LIMITS.mass.min);
        expect(body.mass).toBeLessThanOrEqual(BODY_LIMITS.mass.max);
        expect(body.radius).toBeGreaterThanOrEqual(BODY_LIMITS.radius.min);
        expect(body.radius).toBeLessThanOrEqual(BODY_LIMITS.radius.max);
        for (const axis of ['position', 'velocity'] as const) {
          for (const value of body[axis]) {
            expect(value).toBeGreaterThanOrEqual(BODY_LIMITS[axis].min);
            expect(value).toBeLessThanOrEqual(BODY_LIMITS[axis].max);
          }
        }
      }
    }
  });

  it('creates galaxy parameters that already pass validation', () => {
    for (const preset of GALAXY_PRESETS) {
      const parameters = preset.create();
      expect(parameters).toEqual(clampGalaxyParameters(parameters));
      expect(preset.create()).not.toBe(parameters);
    }
  });

  it('creates black hole settings that already pass validation', () => {
    for (const preset of BLACK_HOLE_PRESETS) {
      const settings = preset.create();
      expect(settings).toEqual(clampBlackHoleSettings(settings));
      expect(preset.create()).not.toBe(settings);
    }
  });
});
