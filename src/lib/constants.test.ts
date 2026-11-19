import { describe, expect, it } from 'vitest';
import { SIMULATION_SPEEDS } from './constants';

describe('simulation constants', () => {
  it('offers an ordered set of positive speed multipliers', () => {
    expect(SIMULATION_SPEEDS.length).toBeGreaterThan(0);
    SIMULATION_SPEEDS.forEach((speed, index) => {
      expect(speed).toBeGreaterThan(0);
      if (index > 0) expect(speed).toBeGreaterThan(SIMULATION_SPEEDS[index - 1]);
    });
  });
});
