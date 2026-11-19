import { describe, expect, it } from 'vitest';
import { createRandom } from '@/lib/random';
import { createParticleField } from './distributions';

describe('particle distributions', () => {
  it('is deterministic for the same seed', () => {
    const a = createParticleField({ count: 32, seed: createRandom('seed'), radius: 10, distribution: 'disc' });
    const b = createParticleField({ count: 32, seed: createRandom('seed'), radius: 10, distribution: 'disc' });
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
  });

  it('produces visibly different structures', () => {
    const disc = createParticleField({ count: 200, seed: createRandom(1), radius: 10, distribution: 'disc' });
    const box = createParticleField({ count: 200, seed: createRandom(1), radius: 10, distribution: 'box' });
    const discHeight = Math.max(...Array.from({ length: 200 }, (_, i) => Math.abs(disc.positions[i * 3 + 1])));
    const boxHeight = Math.max(...Array.from({ length: 200 }, (_, i) => Math.abs(box.positions[i * 3 + 1])));
    expect(discHeight).toBeLessThan(boxHeight);
  });

  it('enforces a hard particle limit', () => {
    const field = createParticleField({ count: 1_000_000, seed: createRandom(2), distribution: 'sphere-shell' });
    expect(field.positions.length / 3).toBe(60000);
  });

  it('never emits non-finite coordinates', () => {
    const field = createParticleField({ count: 100, seed: createRandom(3), distribution: 'sphere-volume' });
    expect(field.positions.every(Number.isFinite)).toBe(true);
  });
});
