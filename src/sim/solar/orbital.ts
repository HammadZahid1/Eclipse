import { wrapAngle } from '@/lib/math';
import type { PlanetConfig } from './data';

export type Position3 = [number, number, number];

/** Current orbital phase of a planet at a given simulation time. */
export function orbitalPhase(planet: PlanetConfig, time: number): number {
  return planet.initialAngle + planet.orbitalSpeed * time;
}

/** Position on the simplified, near-circular orbital path. */
export function planetPosition(planet: PlanetConfig, time: number): Position3 {
  const angle = orbitalPhase(planet, time);
  const inclination = planet.inclination ?? 0;
  return [
    Math.cos(angle) * planet.orbitRadius,
    Math.sin(angle * 0.6) * inclination * planet.orbitRadius,
    Math.sin(angle) * planet.orbitRadius,
  ];
}

/** Instantaneous rotation angle of a planet's surface. */
export function planetRotation(planet: PlanetConfig, time: number): number {
  // Wrapping keeps float precision stable during long-running simulations.
  return wrapAngle(planet.rotationSpeed * time);
}
