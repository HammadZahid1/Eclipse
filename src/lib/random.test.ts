import { describe, expect, it } from 'vitest';
import { createRandom, gaussian, hashSeed } from './random';

describe('random utilities', () => {
  it('hashes string seeds deterministically into unsigned integers', () => {
    expect(hashSeed('eclipse')).toBe(hashSeed('eclipse'));
    expect(hashSeed('eclipse')).not.toBe(hashSeed('eclipses'));
    expect(Number.isInteger(hashSeed('eclipse'))).toBe(true);
    expect(hashSeed('eclipse')).toBeGreaterThanOrEqual(0);
    expect(hashSeed('eclipse')).toBeLessThanOrEqual(0xffffffff);
  });

  it('reproduces a sequence for identical seeds', () => {
    const first = createRandom('galaxy-01');
    const second = createRandom('galaxy-01');
    const third = createRandom('galaxy-02');
    const sample = (random: () => number) => Array.from({ length: 12 }, () => random());
    expect(sample(first)).toEqual(sample(second));
    expect(sample(createRandom('galaxy-01'))).not.toEqual(sample(third));
  });

  it('stays within the unit interval', () => {
    const random = createRandom(12345);
    for (let i = 0; i < 1000; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('produces finite approximately centered gaussian samples', () => {
    const random = createRandom('gaussian');
    const samples = Array.from({ length: 2000 }, () => gaussian(random));
    const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
    expect(samples.every(Number.isFinite)).toBe(true);
    expect(Math.abs(mean)).toBeLessThan(0.1);
  });
});
