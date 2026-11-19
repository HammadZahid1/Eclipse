import { gaussian } from '@/lib/random';

export type ParticleDistribution = 'sphere-shell' | 'sphere-volume' | 'disc' | 'box';

export interface DistributionOptions {
  count: number;
  seed: () => number;
  radius?: number;
  spread?: number;
}

export interface ParticleField {
  positions: Float32Array;
  phases: Float32Array;
}

/** Fills typed arrays with a spatially distributed particle field. */
export function createParticleField({
  count,
  seed,
  radius = 40,
  spread = 0.5,
  distribution,
}: DistributionOptions & { distribution: ParticleDistribution }): ParticleField {
  const safeCount = Math.max(0, Math.floor(Math.min(count, 60000)));
  const positions = new Float32Array(safeCount * 3);
  const phases = new Float32Array(safeCount);

  for (let i = 0; i < safeCount; i += 1) {
    let x = 0;
    let y = 0;
    let z = 0;

    switch (distribution) {
      case 'sphere-shell': {
        const r = radius * (0.6 + seed() * 0.4);
        const theta = seed() * Math.PI * 2;
        const phi = Math.acos(2 * seed() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.cos(phi);
        z = r * Math.sin(phi) * Math.sin(theta);
        break;
      }
      case 'sphere-volume': {
        const r = radius * Math.cbrt(seed());
        const theta = seed() * Math.PI * 2;
        const phi = Math.acos(2 * seed() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.cos(phi);
        z = r * Math.sin(phi) * Math.sin(theta);
        break;
      }
      case 'disc': {
        const theta = seed() * Math.PI * 2;
        const r = radius * Math.sqrt(seed());
        x = Math.cos(theta) * r;
        z = Math.sin(theta) * r;
        y = gaussian(seed) * spread * radius * 0.08;
        break;
      }
      case 'box': {
        x = (seed() - 0.5) * radius * 2;
        y = (seed() - 0.5) * radius * 2 * spread;
        z = (seed() - 0.5) * radius * 2;
        break;
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    phases[i] = seed() * Math.PI * 2;
  }

  return { positions, phases };
}
