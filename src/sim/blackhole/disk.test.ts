import { describe, expect, it } from 'vitest';
import { createRandom } from '@/lib/random';
import { generateAccretionDisk } from './disk';

describe('accretion disk generator', () => {
  it('is deterministic for a fixed seed', () => {
    const a = generateAccretionDisk({ count: 100, random: createRandom('disk') });
    const b = generateAccretionDisk({ count: 100, random: createRandom('disk') });
    expect(Array.from(a.radii)).toEqual(Array.from(b.radii));
    expect(Array.from(a.phases)).toEqual(Array.from(b.phases));
  });

  it('keeps particles within configured radii', () => {
    const disk = generateAccretionDisk({ count: 200, random: createRandom(2), innerRadius: 2, outerRadius: 6 });
    expect(disk.radii.every((radius) => radius >= 2 && radius <= 6)).toBe(true);
  });

  it('makes inner particles orbit faster than outer particles', () => {
    const disk = generateAccretionDisk({ count: 500, random: createRandom(3) });
    let innerSpeed = 0;
    let outerSpeed = Number.POSITIVE_INFINITY;
    for (let i = 0; i < disk.radii.length; i += 1) {
      if (disk.radii[i] < 2) innerSpeed = Math.max(innerSpeed, disk.speeds[i]);
      if (disk.radii[i] > 4.5) outerSpeed = Math.min(outerSpeed, disk.speeds[i]);
    }
    expect(innerSpeed).toBeGreaterThan(outerSpeed);
  });

  it('enforces a particle cap', () => {
    const disk = generateAccretionDisk({ count: 1_000_000, random: createRandom(4) });
    expect(disk.radii.length).toBe(30000);
  });
});
