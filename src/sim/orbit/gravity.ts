import type { MutableVec3, OrbitalBody } from './types';

/** Pairwise softened Newtonian acceleration for every body. */
export function computeAccelerations(
  bodies: readonly OrbitalBody[],
  gravitationalConstant: number,
  softening: number,
): MutableVec3[] {
  const accelerations: MutableVec3[] = bodies.map(() => [0, 0, 0]);
  const softened = softening * softening;

  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      const dx = b.position[0] - a.position[0];
      const dy = b.position[1] - a.position[1];
      const dz = b.position[2] - a.position[2];
      const distanceSquared = dx * dx + dy * dy + dz * dz + softened;
      const inverseCube = 1 / (distanceSquared * Math.sqrt(distanceSquared));
      const factor = gravitationalConstant * inverseCube;

      accelerations[i][0] += factor * b.mass * dx;
      accelerations[i][1] += factor * b.mass * dy;
      accelerations[i][2] += factor * b.mass * dz;
      accelerations[j][0] -= factor * a.mass * dx;
      accelerations[j][1] -= factor * a.mass * dy;
      accelerations[j][2] -= factor * a.mass * dz;
    }
  }

  return accelerations;
}
