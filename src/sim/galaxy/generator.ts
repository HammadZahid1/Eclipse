import { createRandom, gaussian } from '@/lib/random';
import { getGalaxyPalette } from './palettes';
import { clampGalaxyParameters, type GalaxyData, type GalaxyParameters } from './types';

type Random = () => number;

interface StarWriter {
  (index: number, x: number, y: number, z: number, colorIndex: number, brightness: number, sizeScale: number): void;
}

function sampleSphereDirection(random: Random): [number, number, number] {
  const theta = random() * Math.PI * 2;
  const y = random() * 2 - 1;
  const ring = Math.sqrt(1 - y * y);
  return [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
}

function generateSpiral(params: GalaxyParameters, random: Random, write: StarWriter): void {
  for (let i = 0; i < params.starCount; i += 1) {
    const radiusSample = Math.pow(random(), 0.62);
    const radius = radiusSample * params.radius;
    const arm = i % params.arms;
    const armAngle = (arm / params.arms) * Math.PI * 2;
    const spin = radius * params.rotation * 0.55;
    const scatter = (random() - 0.5) * params.spread * (0.4 + radiusSample) * (1 + params.randomness * 2);
    const angle = armAngle + spin + scatter;
    const wobble = gaussian(random) * params.spread * 0.18 * params.radius * params.randomness;
    write(
      i,
      Math.cos(angle) * radius + wobble * 0.3,
      gaussian(random) * params.radius * 0.035 * params.spread,
      Math.sin(angle) * radius + wobble * 0.3,
      Math.floor(random() * 4),
      0.65 + random() * 0.35,
      0.55 + random() * 0.9,
    );
  }
}

function generateElliptical(params: GalaxyParameters, random: Random, write: StarWriter): void {
  const flattenY = 0.55 + params.spread * 0.3;
  const flattenZ = 0.75;
  for (let i = 0; i < params.starCount; i += 1) {
    const radius = Math.pow(random(), 0.75) * params.radius;
    const [dx, dy, dz] = sampleSphereDirection(random);
    const noise = 1 + gaussian(random) * params.randomness * 0.12;
    const colorIndex = Math.min(3, Math.floor((radius / params.radius) * 3 + random() * 0.8));
    write(
      i,
      dx * radius * noise,
      dy * radius * flattenY * noise,
      dz * radius * flattenZ * noise,
      colorIndex,
      0.6 + random() * 0.4,
      0.5 + random() * 0.85,
    );
  }
}

function generateRing(params: GalaxyParameters, random: Random, write: StarWriter): void {
  for (let i = 0; i < params.starCount; i += 1) {
    const isSpoke = random() < 0.12 + params.randomness * 0.1;
    const spokeAngle = (i % params.arms) * ((Math.PI * 2) / params.arms);
    const radius = isSpoke
      ? params.radius * (0.2 + random() * 0.72)
      : params.radius * (0.68 + random() * 0.32);
    const angle = (isSpoke ? spokeAngle : random() * Math.PI * 2) +
      (random() - 0.5) * params.spread * 0.4;
    write(
      i,
      Math.cos(angle) * radius,
      gaussian(random) * params.radius * 0.02 * (0.5 + params.spread),
      Math.sin(angle) * radius,
      isSpoke ? 3 : Math.min(3, Math.floor(random() * 3)),
      0.6 + random() * 0.4,
      0.5 + random() * 0.9,
    );
  }
}

/** Generates a galaxy entirely in memory from deterministic parameters. */
export function generateGalaxy(input: GalaxyParameters): GalaxyData {
  const params = clampGalaxyParameters(input);
  const random = createRandom(params.seed);
  const palette = getGalaxyPalette(params.paletteId).colors;
  const count = params.starCount;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const rgb = palette.map((color) => {
    const value = color.replace('#', '');
    return [
      parseInt(value.slice(0, 2), 16) / 255,
      parseInt(value.slice(2, 4), 16) / 255,
      parseInt(value.slice(4, 6), 16) / 255,
    ] as const;
  });

  const write: StarWriter = (index, x, y, z, colorIndex, brightness, sizeScale) => {
    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;
    const color = rgb[Math.min(rgb.length - 1, Math.max(0, colorIndex))];
    colors[index * 3] = color[0] * brightness;
    colors[index * 3 + 1] = color[1] * brightness;
    colors[index * 3 + 2] = color[2] * brightness;
    sizes[index] = params.particleSize * sizeScale;
  };

  if (params.type === 'elliptical') generateElliptical(params, random, write);
  else if (params.type === 'ring') generateRing(params, random, write);
  else generateSpiral(params, random, write);

  return { positions, colors, sizes, count };
}
