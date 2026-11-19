import { describe, expect, it } from 'vitest';
import { FIXED_TIMESTEP, SimulationClock } from './time';

describe('SimulationClock', () => {
  it('advances with a fixed timestep', () => {
    const clock = new SimulationClock();
    const steps: number[] = [];
    clock.advance(1 / 30, 1, (step) => steps.push(step));
    expect(steps).toHaveLength(2);
    expect(steps[0]).toBeCloseTo(FIXED_TIMESTEP);
  });

  it('applies the speed multiplier to simulation time', () => {
    const fast = new SimulationClock();
    const normal = new SimulationClock();
    fast.advance(0.02, 2, () => {});
    normal.advance(0.02, 1, () => {});
    expect(fast.time).toBeCloseTo(normal.time * 2);
  });

  it('caps substeps after a long frame gap', () => {
    const clock = new SimulationClock();
    let steps = 0;
    clock.advance(10, 10, () => {
      steps += 1;
    });
    expect(steps).toBeLessThanOrEqual(5);
  });

  it('resets elapsed time completely', () => {
    const clock = new SimulationClock();
    clock.advance(1, 1, () => {});
    clock.reset();
    expect(clock.time).toBe(0);
    const steps: number[] = [];
    clock.advance(1 / 60, 1, (step) => steps.push(step));
    expect(steps).toHaveLength(1);
  });

  it('ignores invalid deltas and non-positive speeds', () => {
    const clock = new SimulationClock();
    expect(clock.advance(-1, 1, () => {})).toBe(0);
    expect(clock.advance(1, 0, () => {})).toBe(0);
    expect(clock.time).toBe(0);
  });
});
