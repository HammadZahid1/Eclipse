import { magnitude } from '@/lib/math';
import type { MutableVec3, OrbitalBody } from './types';

/** Softened gravitational force vector acting on one body from another. */
export function gravitationalForce(
  target: OrbitalBody,
  source: OrbitalBody,
  gravitationalConstant: number,
  softening: number,
): MutableVec3 {
  const dx = source.position[0] - target.position[0];
  const dy = source.position[1] - target.position[1];
  const dz = source.position[2] - target.position[2];
  const distanceSquared = dx * dx + dy * dy + dz * dz + softening * softening;
  const factor = (gravitationalConstant * target.mass * source.mass) /
    (distanceSquared * Math.sqrt(distanceSquared));
  return [factor * dx, factor * dy, factor * dz];
}

/** Speed required for an ideal circular orbit around a much heavier body. */
export function circularOrbitVelocity(centralMass: number, radius: number, gravitationalConstant = 1): number {
  if (radius <= 0 || centralMass <= 0) return 0;
  return Math.sqrt((gravitationalConstant * centralMass) / radius);
}

export function totalMomentum(bodies: readonly OrbitalBody[]): MutableVec3 {
  const momentum: MutableVec3 = [0, 0, 0];
  for (const body of bodies) {
    momentum[0] += body.mass * body.velocity[0];
    momentum[1] += body.mass * body.velocity[1];
    momentum[2] += body.mass * body.velocity[2];
  }
  return momentum;
}

/** Approximate total energy: kinetic plus softened pairwise potential. */
export function totalEnergy(
  bodies: readonly OrbitalBody[],
  gravitationalConstant: number,
  softening: number,
): number {
  let energy = 0;
  for (const body of bodies) {
    const speedSquared = body.velocity[0] ** 2 + body.velocity[1] ** 2 + body.velocity[2] ** 2;
    energy += 0.5 * body.mass * speedSquared;
  }
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      const distance = Math.hypot(
        b.position[0] - a.position[0],
        b.position[1] - a.position[1],
        b.position[2] - a.position[2],
      );
      energy -= (gravitationalConstant * a.mass * b.mass) / Math.sqrt(distance * distance + softening * softening);
    }
  }
  return energy;
}

export function distance(a: OrbitalBody, b: OrbitalBody): number {
  return magnitude([
    b.position[0] - a.position[0],
    b.position[1] - a.position[1],
    b.position[2] - a.position[2],
  ]);
}
