/** Fixed-timestep simulation clock shared by every interactive module. */

export const FIXED_TIMESTEP = 1 / 60;
export const MAX_SUB_STEPS = 5;

export type StepCallback = (step: number, time: number) => void;

export class SimulationClock {
  time = 0;
  private accumulator = 0;

  constructor(
    private readonly stepSize = FIXED_TIMESTEP,
    private readonly maxSubSteps = MAX_SUB_STEPS,
  ) {}

  /** Advances the clock and invokes the callback once per fixed simulation step. */
  advance(deltaSeconds: number, speed: number, onStep: StepCallback): number {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0 || speed <= 0) return 0;
    // Clamp long frame gaps (tab switches) so the simulation cannot spiral.
    this.accumulator += Math.min(deltaSeconds, 0.1) * speed;
    let steps = 0;
    while (this.accumulator >= this.stepSize && steps < this.maxSubSteps) {
      this.accumulator -= this.stepSize;
      this.time += this.stepSize;
      onStep(this.stepSize, this.time);
      steps += 1;
    }
    if (steps === this.maxSubSteps) this.accumulator = 0;
    return steps;
  }

  reset(): void {
    this.time = 0;
    this.accumulator = 0;
  }
}
