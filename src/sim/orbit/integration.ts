import { totalEnergy } from './analysis';
import type { OrbitEngine } from './engine';

export interface IntegrationResult {
  steps: number;
  simulatedTime: number;
  energyDrift: number;
}

/**
 * Advances an N-body engine with bounded fixed substeps.
 * Long frame gaps are clamped to prevent numerical blow-ups.
 */
export function integrateSystem(
  engine: OrbitEngine,
  deltaSeconds: number,
  speed: number,
  stepSize = 1 / 120,
  maxSubSteps = 10,
): IntegrationResult {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0 || speed <= 0 || stepSize <= 0) {
    return { steps: 0, simulatedTime: 0, energyDrift: 0 };
  }

  const energyBefore = totalEnergy(engine.bodies, engine.gravitationalConstant, engine.softening);
  let accumulator = Math.min(deltaSeconds, 0.1) * speed;
  let steps = 0;
  while (accumulator >= stepSize && steps < maxSubSteps) {
    engine.step(stepSize);
    accumulator -= stepSize;
    steps += 1;
  }

  const energyAfter = totalEnergy(engine.bodies, engine.gravitationalConstant, engine.softening);
  return {
    steps,
    simulatedTime: steps * stepSize,
    energyDrift: energyBefore === 0 ? 0 : Math.abs((energyAfter - energyBefore) / energyBefore),
  };
}
