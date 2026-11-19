import type { PlanetConfig } from './data';
import { orbitalPhase, planetRotation } from './orbital';

export interface OrbitalBodyState {
  x: number;
  y: number;
  z: number;
  phase: number;
  rotation: number;
}

/** Samples all planetary states for a given simulation time. */
export class SolarOrbitEngine {
  constructor(private readonly planets: readonly PlanetConfig[]) {}

  /** Writes into a reusable record to avoid allocations in the render loop. */
  sampleInto(time: number, target: Record<string, OrbitalBodyState>): void {
    for (const planet of this.planets) {
      const phase = orbitalPhase(planet, time);
      const inclination = planet.inclination ?? 0;
      const state = target[planet.id] ?? { x: 0, y: 0, z: 0, phase: 0, rotation: 0 };
      state.x = Math.cos(phase) * planet.orbitRadius;
      state.y = Math.sin(phase * 0.6) * inclination * planet.orbitRadius;
      state.z = Math.sin(phase) * planet.orbitRadius;
      state.phase = phase;
      state.rotation = planetRotation(planet, time);
      target[planet.id] = state;
    }
  }
}

/** Orbital period in simulation time units for a circular model. */
export function orbitalPeriod(planet: PlanetConfig): number {
  return planet.orbitalSpeed === 0 ? Number.POSITIVE_INFINITY : (Math.PI * 2) / Math.abs(planet.orbitalSpeed);
}
