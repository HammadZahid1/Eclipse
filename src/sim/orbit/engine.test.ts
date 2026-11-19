import { describe, expect, it } from 'vitest';
import { OrbitEngine } from './engine';
import type { OrbitalBody } from './types';

const central: OrbitalBody = {
  id: 'star',
  name: 'Star',
  mass: 200,
  radius: 0.8,
  position: [0, 0, 0],
  velocity: [0, 0, 0],
  color: '#ffffff',
};

const satellite: OrbitalBody = {
  id: 'planet',
  name: 'Planet',
  mass: 1,
  radius: 0.25,
  position: [6, 0, 0],
  velocity: [0, 0, 5.7],
  color: '#5299ff',
};

describe('OrbitEngine', () => {
  it('advances simulation time with finite steps', () => {
    const engine = new OrbitEngine([central, satellite]);
    engine.step(0.01);
    expect(engine.time).toBeCloseTo(0.01);
    engine.step(-1);
    expect(engine.time).toBeCloseTo(0.01);
  });

  it('keeps a two-body orbit bounded', () => {
    const engine = new OrbitEngine([central, satellite]);
    for (let i = 0; i < 2000; i += 1) engine.step(0.01);
    const planet = engine.bodies.find((body) => body.id === 'planet')!;
    const distance = Math.hypot(...planet.position);
    expect(distance).toBeGreaterThan(2);
    expect(distance).toBeLessThan(12);
  });

  it('supports adding, updating and removing bodies', () => {
    const engine = new OrbitEngine([central]);
    expect(engine.add(satellite)).toBe(true);
    expect(engine.bodies).toHaveLength(2);
    engine.update('planet', { mass: 5 });
    expect(engine.bodies[1].mass).toBe(5);
    engine.remove('planet');
    expect(engine.bodies).toHaveLength(1);
  });

  it('resets bodies and elapsed time', () => {
    const engine = new OrbitEngine([central, satellite]);
    engine.step(1);
    engine.reset([central]);
    expect(engine.time).toBe(0);
    expect(engine.bodies).toHaveLength(1);
  });

  it('clamps body parameters to safe bounds', () => {
    const engine = new OrbitEngine([{ ...central, mass: 1e9, radius: -3 }]);
    expect(engine.bodies[0].mass).toBe(1000);
    expect(engine.bodies[0].radius).toBe(0.12);
  });
});
