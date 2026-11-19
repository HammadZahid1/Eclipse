import { describe, expect, it } from 'vitest';
import { orbitalPhase, planetPosition, planetRotation } from './orbital';
import type { PlanetConfig } from './data';

const planet: PlanetConfig = {
  id: 'test',
  name: 'Test',
  radius: 0.3,
  orbitRadius: 8,
  orbitalSpeed: 0.25,
  rotationSpeed: 4,
  color: '#ffffff',
  initialAngle: 0.5,
  description: 'Test planet',
};

describe('simplified solar orbital helpers', () => {
  it('advances orbital phase linearly with time', () => {
    expect(orbitalPhase(planet, 0)).toBe(0.5);
    expect(orbitalPhase(planet, 4)).toBeCloseTo(1.5, 10);
  });

  it('places a zero-inclination planet on a fixed-radius circle', () => {
    for (const time of [0, 1, 7, 25]) {
      const [, y, z] = planetPosition(planet, time);
      const x = planetPosition(planet, time)[0];
      expect(Math.abs(y)).toBe(0);
      expect(Math.hypot(x, z)).toBeCloseTo(8, 6);
    }
  });

  it('applies inclination only to the vertical component', () => {
    const tilted = { ...planet, inclination: 0.2 };
    const [x, y, z] = planetPosition(tilted, 0);
    expect(x).toBeCloseTo(Math.cos(0.5) * 8, 10);
    expect(z).toBeCloseTo(Math.sin(0.5) * 8, 10);
    expect(Math.abs(y)).toBeGreaterThan(0);
    expect(Math.abs(y)).toBeLessThan(8 * 0.2);
  });

  it('wraps long-running surface rotation into a stable interval', () => {
    const rotation = planetRotation(planet, 1e6);
    expect(rotation).toBeGreaterThanOrEqual(-Math.PI);
    expect(rotation).toBeLessThanOrEqual(Math.PI);
    expect(Number.isFinite(rotation)).toBe(true);
  });
});
