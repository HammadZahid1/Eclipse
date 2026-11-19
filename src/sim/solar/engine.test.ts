import { describe, expect, it } from 'vitest';
import { PLANETS } from './data';
import { SolarOrbitEngine, orbitalPeriod, type OrbitalBodyState } from './engine';
import { orbitalPhase, planetPosition, planetRotation } from './orbital';

const terra = PLANETS.find((planet) => planet.id === 'terra')!;

describe('solar orbital engine', () => {
  it('advances orbital phase linearly with simulation time', () => {
    expect(orbitalPhase(terra, 10) - orbitalPhase(terra, 0)).toBeCloseTo(terra.orbitalSpeed * 10);
  });

  it('keeps planets at their configured orbital radius', () => {
    for (const time of [0, 3, 12.5]) {
      const [x, , z] = planetPosition(terra, time);
      expect(Math.sqrt(x * x + z * z)).toBeCloseTo(terra.orbitRadius, 5);
    }
  });

  it('computes surface rotation from simulation time', () => {
    expect(planetRotation(terra, 0)).toBe(0);
    expect(planetRotation(terra, 4)).toBeCloseTo(terra.rotationSpeed * 4);
  });

  it('samples deterministic body states', () => {
    const engine = new SolarOrbitEngine(PLANETS);
    const first: Record<string, OrbitalBodyState> = {};
    const second: Record<string, OrbitalBodyState> = {};
    engine.sampleInto(7.5, first);
    engine.sampleInto(7.5, second);
    expect(first).toEqual(second);
    expect(Object.keys(first)).toHaveLength(PLANETS.length);
  });

  it('reports a finite orbital period for moving planets', () => {
    expect(orbitalPeriod(terra)).toBeGreaterThan(0);
    expect(orbitalPeriod({ ...terra, orbitalSpeed: 0 })).toBe(Number.POSITIVE_INFINITY);
  });
});
