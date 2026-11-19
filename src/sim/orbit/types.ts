import { clamp } from '@/lib/math';

export type MutableVec3 = [number, number, number];

export interface OrbitalBody {
  id: string;
  name: string;
  mass: number;
  radius: number;
  position: MutableVec3;
  velocity: MutableVec3;
  color: string;
}

export const GRAVITATIONAL_CONSTANT = 1;
export const SOFTENING = 0.35;
export const MAX_BODIES = 12;

export const BODY_LIMITS = {
  mass: { min: 0.1, max: 1000, step: 0.5 },
  radius: { min: 0.12, max: 2.5, step: 0.05 },
  velocity: { min: -12, max: 12, step: 0.05 },
  position: { min: -30, max: 30, step: 0.1 },
} as const;

export function clampBody(body: OrbitalBody): OrbitalBody {
  const bound = (value: number, key: keyof typeof BODY_LIMITS) =>
    clamp(value, BODY_LIMITS[key].min, BODY_LIMITS[key].max);
  return {
    ...body,
    mass: bound(body.mass, 'mass'),
    radius: bound(body.radius, 'radius'),
    position: body.position.map((value) => bound(value, 'position')) as MutableVec3,
    velocity: body.velocity.map((value) => bound(value, 'velocity')) as MutableVec3,
  };
}
