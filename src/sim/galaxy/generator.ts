import { createRandom, gaussian } from '@/lib/random';
import { getGalaxyPalette } from './palettes';
import { clampGalaxyParameters, type GalaxyData, type GalaxyParameters } from './types';

/** Generates a galaxy entirely in memory from deterministic parameters. */
export function generateGalaxy(input: GalaxyParameters): GalaxyData {
  const params = clampGalaxyParameters(input);
  const random = createRandom(params.seed);
  const palette = getGalaxyPalette(params.paletteId).colors.map((color) => color);
  const count = params.starCount;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colorObjects = palette.map((color) => {
    const value = color.replace('#', '');
    return [
      parseInt(value.slice(0, 2), 16) / 255,
      parseInt(value.slice(2, 4), 16) / 255,
      parseInt(value.slice(4, 6), 16) / 255,
    ] as const;
  });

  for (let i = 0; i < count; i += 1) {
    const radiusSample = Math.pow(random(), 0.62);
    const radius = radiusSample * params.radius;
    const arm = i % params.arms;
    const armAngle = (arm / params.arms) * Math.PI * 2;
    const spin = radius * params.rotation * 0.55;
    const scatter = (random() - 0.5) * params.spread * (0.4 + radiusSample) * (1 + params.randomness * 2);
    const angle = armAngle + spin + scatter;

    const wobble = gaussian(random) * params.spread * 0.18 * params.radius * params.randomness;
    positions[i * 3] = Math.cos(angle) * radius + wobble * 0.3;
    positions[i * 3 + 1] = gaussian(random) * params.radius * 0.035 * params.spread;
    positions[i * 3 + 2] = Math.sin(angle) * radius + wobble * 0.3;

    const color = colorObjects[Math.min(colorObjects.length - 1, Math.floor(random() * colorObjects.length))];
    const brightness = 0.65 + random() * 0.35;
    colors[i * 3] = color[0] * brightness;
    colors[i * 3 + 1] = color[1] * brightness;
    colors[i * 3 + 2] = color[2] * brightness;
    sizes[i] = params.particleSize * (0.55 + random() * 0.9);
  }

  return { positions, colors, sizes, count };
}
