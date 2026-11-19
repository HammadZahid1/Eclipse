import { describe, expect, it } from 'vitest';
import {
  circularOrbitVelocity,
  distance,
  gravitationalForce,
  totalEnergy,
  totalMomentum,
} from './analysis';
import { OrbitEngine } from './engine';
import type { OrbitalBody } from './types';

const star: OrbitalBody = {
  id: 's', name: 'Star', mass: 100, radius: 0.8,
  position: [0, 0, 0], velocity: [0, 0, 0], color: '#fff',
};
const planet: OrbitalBody = {
  id: 'p', name: 'Planet', mass: 1, radius: 0.2,
  position: [5, 0, 0], velocity: [0, 0, 4], color: '#5299ff',
};

describe('gravitational analysis', () => {
  it('falls off with the square of distance', () => {
    const near = gravitationalForce(planet, star, 1, 0);
    const farBody = { ...planet, position: [10, 0, 0] as [number, number, number] };
    const far = gravitationalForce(farBody, star, 1, 0);
    expect(Math.abs(near[0])).toBeCloseTo(Math.abs(far[0]) * 4, 5);
  });

  it('computes circular orbit velocity', () => {
    expect(circularOrbitVelocity(100, 5)).toBeCloseTo(Math.sqrt(20));
    expect(circularOrbitVelocity(0, 5)).toBe(0);
  });

  it('computes distance between bodies', () => {
    expect(distance(star, planet)).toBe(5);
  });

  it('reports momentum and energy', () => {
    expect(totalMomentum([star, planet])[2]).toBe(4);
    expect(totalEnergy([star, planet], 1, 0)).toBeLessThan(0);
  });

  it('approximately conserves momentum during integration', () => {
    const engine = new OrbitEngine([star, planet]);
    const initial = totalMomentum(engine.bodies);
    for (let i = 0; i < 500; i += 1) engine.step(0.01);
    const final = totalMomentum(engine.bodies);
    expect(final[0]).toBeCloseTo(initial[0], 5);
    expect(final[2]).toBeCloseTo(initial[2], 5);
  });
});
