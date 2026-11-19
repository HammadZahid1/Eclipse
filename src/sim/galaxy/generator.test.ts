import { describe, expect, it } from 'vitest';
import { DEFAULT_GALAXY_PARAMETERS, clampGalaxyParameters } from './types';
import { generateGalaxy } from './generator';

describe('galaxy generator', () => {
  it('produces identical structure for identical seed and parameters', () => {
    const a = generateGalaxy(DEFAULT_GALAXY_PARAMETERS);
    const b = generateGalaxy(DEFAULT_GALAXY_PARAMETERS);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
    expect(Array.from(a.colors)).toEqual(Array.from(b.colors));
  });

  it('produces different structures for different seeds', () => {
    const a = generateGalaxy(DEFAULT_GALAXY_PARAMETERS);
    const b = generateGalaxy({ ...DEFAULT_GALAXY_PARAMETERS, seed: 'another-seed' });
    expect(a.positions[0]).not.toBe(b.positions[0]);
  });

  it('generates a flattened ellipsoid for elliptical galaxies', () => {
    const params = { ...DEFAULT_GALAXY_PARAMETERS, type: 'elliptical' as const, starCount: 4000, randomness: 0 };
    const elliptical = generateGalaxy(params);
    const spiral = generateGalaxy({ ...params, type: 'spiral' });
    expect(Array.from(elliptical.positions)).not.toEqual(Array.from(spiral.positions));

    let maxY = 0;
    let maxX = 0;
    for (let i = 0; i < elliptical.count; i += 1) {
      maxY = Math.max(maxY, Math.abs(elliptical.positions[i * 3 + 1]));
      maxX = Math.max(maxX, Math.abs(elliptical.positions[i * 3]));
    }
    expect(maxY).toBeLessThan(maxX);
  });

  it('respects the requested star count and clamps excessive values', () => {
    expect(generateGalaxy(DEFAULT_GALAXY_PARAMETERS).count).toBe(DEFAULT_GALAXY_PARAMETERS.starCount);
    const clamped = clampGalaxyParameters({ ...DEFAULT_GALAXY_PARAMETERS, starCount: 999999 });
    expect(clamped.starCount).toBe(60000);
  });

  it('keeps generated particles within a bounded volume', () => {
    const galaxy = generateGalaxy({ ...DEFAULT_GALAXY_PARAMETERS, starCount: 3000, spread: 0.2, randomness: 0.1 });
    for (let i = 0; i < galaxy.count; i += 1) {
      expect(Math.abs(galaxy.positions[i * 3])).toBeLessThan(galaxy.count > 0 ? 30 : 0);
      expect(Math.abs(galaxy.positions[i * 3 + 2])).toBeLessThan(30);
    }
  });
});
