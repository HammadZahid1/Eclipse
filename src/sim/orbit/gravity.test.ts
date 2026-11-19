import { describe, expect, it } from 'vitest';
import { computeAccelerations } from './gravity';
import type { OrbitalBody } from './types';

function body(id: string, mass: number, position: [number, number, number]): OrbitalBody {
  return { id, name: id, mass, radius: 0.3, position, velocity: [0, 0, 0], color: '#ffffff' };
}

describe('computeAccelerations', () => {
  it('returns zero acceleration for an isolated body', () => {
    expect(computeAccelerations([body('solo', 10, [0, 0, 0])], 1, 0.35)).toEqual([[0, 0, 0]]);
  });

  it('obeys equal and opposite forces for a pair', () => {
    const a = body('a', 2, [0, 0, 0]);
    const b = body('b', 5, [4, 0, 0]);
    const [accelA, accelB] = computeAccelerations([a, b], 1, 0.35);
    expect(accelA[0]).toBeGreaterThan(0);
    expect(accelB[0]).toBeLessThan(0);
    expect(a.mass * accelA[0]).toBeCloseTo(-b.mass * accelB[0], 10);
    expect(accelA[1]).toBe(0);
    expect(accelA[2]).toBe(0);
  });

  it('reduces acceleration near overlap as softening increases', () => {
    const a = body('a', 10, [0, 0, 0]);
    const b = body('b', 10, [0.1, 0, 0]);
    const hard = computeAccelerations([a, b], 1, 0)[0][0];
    const soft = computeAccelerations([a, b], 1, 2)[0][0];
    expect(Number.isFinite(hard)).toBe(true);
    expect(soft).toBeGreaterThan(0);
    expect(soft).toBeLessThan(hard);
  });

  it('scales linearly with the gravitational constant', () => {
    const a = body('a', 3, [0, 0, 0]);
    const b = body('b', 4, [5, 1, 2]);
    const base = computeAccelerations([a, b], 1, 0.35)[0];
    const doubled = computeAccelerations([a, b], 2, 0.35)[0];
    expect(doubled[0]).toBeCloseTo(base[0] * 2, 10);
    expect(doubled[1]).toBeCloseTo(base[1] * 2, 10);
    expect(doubled[2]).toBeCloseTo(base[2] * 2, 10);
  });
});
