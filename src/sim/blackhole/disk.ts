import { gaussian } from '@/lib/random';

export interface AccretionDiskData {
  radii: Float32Array;
  heights: Float32Array;
  phases: Float32Array;
  speeds: Float32Array;
  sizes: Float32Array;
  mixes: Float32Array;
}

export interface DiskOptions {
  count: number;
  random: () => number;
  innerRadius?: number;
  outerRadius?: number;
  thickness?: number;
}

/** Procedural disk samples with a Keplerian-inspired radial speed falloff. */
export function generateAccretionDisk({
  count,
  random,
  innerRadius = 1.45,
  outerRadius = 5.2,
  thickness = 0.16,
}: DiskOptions): AccretionDiskData {
  const safeCount = Math.max(0, Math.min(Math.floor(count), 30000));
  const radii = new Float32Array(safeCount);
  const heights = new Float32Array(safeCount);
  const phases = new Float32Array(safeCount);
  const speeds = new Float32Array(safeCount);
  const sizes = new Float32Array(safeCount);
  const mixes = new Float32Array(safeCount);

  for (let i = 0; i < safeCount; i += 1) {
    // Bias particles toward the inner disk, where the visual density is higher.
    const distribution = Math.pow(random(), 1.7);
    const radius = innerRadius + distribution * (outerRadius - innerRadius);
    radii[i] = radius;
    heights[i] = gaussian(random) * thickness * (0.4 + distribution * 0.8);
    phases[i] = random() * Math.PI * 2;
    speeds[i] = 1.35 / Math.pow(radius, 1.3);
    sizes[i] = 0.7 + random() * 1.5;
    mixes[i] = distribution;
  }

  return { radii, heights, phases, speeds, sizes, mixes };
}
