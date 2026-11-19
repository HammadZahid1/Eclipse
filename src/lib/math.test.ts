import { describe, expect, it } from 'vitest';
import { clamp, lerp, magnitude, roundTo, wrapAngle } from './math';

describe('math helpers', () => {
  it('clamps values to inclusive bounds', () => {
    expect(clamp(-4, 0, 10)).toBe(0);
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('interpolates linearly', () => {
    expect(lerp(10, 20, 0.25)).toBe(12.5);
  });

  it('wraps angles to [-PI, PI]', () => {
    expect(wrapAngle(0)).toBe(0);
    expect(wrapAngle(Math.PI * 2)).toBeCloseTo(0);
    expect(Math.abs(wrapAngle(Math.PI * 3))).toBeCloseTo(Math.PI);
  });

  it('computes vector magnitude and rounds values', () => {
    expect(magnitude([3, 4, 0])).toBe(5);
    expect(roundTo(1.23456, 2)).toBe(1.23);
  });
});
