import type { GalaxyType } from '@/types/simulation';
import { clamp } from '@/lib/math';

export interface GalaxyParameters {
  type: GalaxyType;
  starCount: number;
  arms: number;
  radius: number;
  spread: number;
  rotation: number;
  randomness: number;
  particleSize: number;
  seed: string;
  paletteId: string;
}

export interface GalaxyData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  count: number;
}

export const GALAXY_LIMITS = {
  starCount: { min: 1000, max: 60000, step: 1000 },
  arms: { min: 1, max: 8, step: 1 },
  radius: { min: 3, max: 18, step: 0.5 },
  spread: { min: 0.05, max: 1, step: 0.05 },
  rotation: { min: 0.05, max: 2, step: 0.05 },
  randomness: { min: 0, max: 1, step: 0.05 },
  particleSize: { min: 0.4, max: 3, step: 0.1 },
} as const;

export const DEFAULT_GALAXY_PARAMETERS: GalaxyParameters = {
  type: 'spiral',
  starCount: 24000,
  arms: 4,
  radius: 10,
  spread: 0.35,
  rotation: 0.75,
  randomness: 0.35,
  particleSize: 1.2,
  seed: 'eclipse-001',
  paletteId: 'nebula',
};

export function clampGalaxyParameters(parameters: GalaxyParameters): GalaxyParameters {
  const limits = GALAXY_LIMITS;
  const bound = (value: number, key: keyof typeof limits) =>
    clamp(value, limits[key].min, limits[key].max);
  return {
    ...parameters,
    starCount: Math.round(bound(parameters.starCount, 'starCount')),
    arms: Math.round(bound(parameters.arms, 'arms')),
    radius: bound(parameters.radius, 'radius'),
    spread: bound(parameters.spread, 'spread'),
    rotation: bound(parameters.rotation, 'rotation'),
    randomness: bound(parameters.randomness, 'randomness'),
    particleSize: bound(parameters.particleSize, 'particleSize'),
    seed: parameters.seed.slice(0, 40),
  };
}
