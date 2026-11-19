import { describe, expect, it } from 'vitest';
import { createRandom, hashSeed } from '@/lib/random';
import { createSeed, normalizeSeed, seedToNumber } from './seed';
import { generateGalaxy } from './generator';
import { DEFAULT_GALAXY_PARAMETERS } from './types';

describe('deterministic seed system', () => {
  it('hashes strings consistently', () => {
    expect(hashSeed('eclipse')).toBe(hashSeed('eclipse'));
    expect(hashSeed('eclipse')).not.toBe(hashSeed('different'));
  });

  it('creates repeatable random sequences', () => {
    const a = createRandom(1234);
    const b = createRandom(1234);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('normalizes empty and oversized seeds', () => {
    expect(normalizeSeed('   ')).toBe('eclipse');
    expect(normalizeSeed('x'.repeat(100))).toHaveLength(40);
  });

  it('creates readable seeds with a stable format', () => {
    expect(createSeed()).toMatch(/^ECL-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
  });

  it('reproduces the same galaxy from the same seed number', () => {
    const params = { ...DEFAULT_GALAXY_PARAMETERS, starCount: 2000 };
    const a = generateGalaxy({ ...params, seed: String(seedToNumber('galaxy')) });
    const b = generateGalaxy({ ...params, seed: String(seedToNumber('galaxy')) });
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
  });
});
