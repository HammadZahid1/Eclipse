import { describe, expect, it } from 'vitest';
import { OrbitEngine } from './engine';
import { integrateSystem } from './integration';
import type { OrbitalBody } from './types';

const bodies: OrbitalBody[] = [
  { id: 's', name: 'Star', mass: 200, radius: 0.8, position: [0, 0, 0], velocity: [0, 0, 0], color: '#fff' },
  { id: 'p', name: 'Planet', mass: 1, radius: 0.2, position: [6, 0, 0], velocity: [0, 0, 5.7], color: '#5299ff' },
];

describe('integration driver', () => {
  it('scales simulated time with speed', () => {
    const normal = new OrbitEngine(bodies);
    const fast = new OrbitEngine(bodies);
    integrateSystem(normal, 1 / 60, 1);
    integrateSystem(fast, 1 / 60, 2);
    expect(fast.time).toBeCloseTo(normal.time * 2);
  });

  it('caps substeps for long frame gaps', () => {
    const engine = new OrbitEngine(bodies);
    const result = integrateSystem(engine, 10, 10);
    expect(result.steps).toBeLessThanOrEqual(10);
  });

  it('reports small energy drift for a circular orbit', () => {
    const engine = new OrbitEngine(bodies);
    let drift = 0;
    for (let i = 0; i < 200; i += 1) {
      drift = Math.max(drift, integrateSystem(engine, 1 / 60, 1).energyDrift);
    }
    expect(drift).toBeLessThan(0.01);
  });

  it('ignores invalid input', () => {
    const engine = new OrbitEngine(bodies);
    expect(integrateSystem(engine, -1, 1).steps).toBe(0);
    expect(integrateSystem(engine, 1, 0).steps).toBe(0);
  });
});
