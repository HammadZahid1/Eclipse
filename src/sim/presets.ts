import { clampBlackHoleSettings, type BlackHoleSettings } from './blackhole/config';
import { circularOrbitVelocity } from './orbit/analysis';
import { clampBody, type OrbitalBody } from './orbit/types';
import { clampGalaxyParameters, type GalaxyParameters } from './galaxy/types';

export interface SimulationPreset<T> {
  id: string;
  name: string;
  description: string;
  create: () => T;
}

function orbitBody(
  id: string,
  name: string,
  mass: number,
  radius: number,
  position: [number, number, number],
  velocity: [number, number, number],
  color: string,
): OrbitalBody {
  return clampBody({ id, name, mass, radius, position, velocity, color });
}

export const ORBIT_PRESETS: readonly SimulationPreset<OrbitalBody[]>[] = [
  {
    id: 'two-body',
    name: 'Two-body',
    description: 'One heavy primary with a near-circular orbiter.',
    create: () => {
      const radius = 7;
      return [
        orbitBody('primary', 'Primary', 240, 0.75, [0, 0, 0], [0, 0, 0], '#ffd8a8'),
        orbitBody('orbiter', 'Orbiter', 1, 0.24, [radius, 0, 0], [0, 0, circularOrbitVelocity(240, radius)], '#5299ff'),
      ];
    },
  },
  {
    id: 'binary',
    name: 'Binary stars',
    description: 'Two equal stars orbiting their shared center.',
    create: () => {
      const speed = Math.sqrt(120 / 16);
      return [
        orbitBody('star-a', 'Star A', 120, 0.6, [-4, 0, 0], [0, 0, -speed], '#ffd8a8'),
        orbitBody('star-b', 'Star B', 120, 0.6, [4, 0, 0], [0, 0, speed], '#9b82ff'),
      ];
    },
  },
  {
    id: 'three-body',
    name: 'Three-body',
    description: 'A symmetric triangle with a sensitive, drifting balance.',
    create: () => {
      const speed = Math.sqrt(100 / 14);
      return [
        orbitBody('body-a', 'Alpha', 100, 0.5, [8, 0, 0], [0, 0, speed], '#51e4f2'),
        orbitBody('body-b', 'Beta', 100, 0.5, [-4, 0, 6.93], [-speed * 0.866, 0, -speed * 0.5], '#ff9c52'),
        orbitBody('body-c', 'Gamma', 100, 0.5, [-4, 0, -6.93], [speed * 0.866, 0, -speed * 0.5], '#9b82ff'),
      ];
    },
  },
  {
    id: 'cluster',
    name: 'Mini cluster',
    description: 'Five lighter bodies sharing one dominant gravitational well.',
    create: () => {
      const colors = ['#51e4f2', '#9b82ff', '#ffb36b', '#ff7a92', '#a7e8a0'];
      const bodies: OrbitalBody[] = [orbitBody('core', 'Core', 320, 0.9, [0, 0, 0], [0, 0, 0], '#ffd8a8')];
      for (let index = 0; index < 5; index += 1) {
        const angle = (index / 5) * Math.PI * 2;
        const radius = 5 + (index % 2) * 3;
        const speed = circularOrbitVelocity(320, radius);
        bodies.push(
          orbitBody(
            `satellite-${index + 1}`,
            `Satellite ${index + 1}`,
            1.5 + index,
            0.22,
            [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
            [-Math.sin(angle) * speed, 0, Math.cos(angle) * speed],
            colors[index],
          ),
        );
      }
      return bodies;
    },
  },
];

export const GALAXY_PRESETS: readonly SimulationPreset<GalaxyParameters>[] = [
  {
    id: 'grand-design',
    name: 'Grand design',
    description: 'Four broad, bright spiral arms.',
    create: () =>
      clampGalaxyParameters({
        type: 'spiral',
        starCount: 40000,
        arms: 4,
        radius: 12,
        spread: 0.3,
        rotation: 0.85,
        randomness: 0.28,
        particleSize: 1.2,
        seed: 'preset-grand-design',
        paletteId: 'nebula',
      }),
  },
  {
    id: 'elliptical',
    name: 'Elliptical',
    description: 'A soft, wide cloud with little structure.',
    create: () =>
      clampGalaxyParameters({
        type: 'elliptical',
        starCount: 30000,
        arms: 2,
        radius: 9,
        spread: 0.75,
        rotation: 0.3,
        randomness: 0.6,
        particleSize: 1.1,
        seed: 'preset-elliptical',
        paletteId: 'ember',
      }),
  },
  {
    id: 'ring',
    name: 'Ring',
    description: 'A hollow, rotating band of stars.',
    create: () =>
      clampGalaxyParameters({
        type: 'ring',
        starCount: 22000,
        arms: 3,
        radius: 14,
        spread: 0.18,
        rotation: 0.7,
        randomness: 0.22,
        particleSize: 1.4,
        seed: 'preset-ring',
        paletteId: 'glacier',
      }),
  },
  {
    id: 'irregular',
    name: 'Irregular',
    description: 'A clumpy, asymmetric distribution.',
    create: () =>
      clampGalaxyParameters({
        type: 'irregular',
        starCount: 26000,
        arms: 2,
        radius: 11,
        spread: 0.6,
        rotation: 0.4,
        randomness: 0.85,
        particleSize: 1,
        seed: 'preset-irregular',
        paletteId: 'orchid',
      }),
  },
];

export const BLACK_HOLE_PRESETS: readonly SimulationPreset<BlackHoleSettings>[] = [
  {
    id: 'quiet',
    name: 'Quiet disk',
    description: 'Dim, slow and sparse.',
    create: () => clampBlackHoleSettings({ intensity: 0.6, rotationSpeed: 0.2, particleDensity: 0.7, themeId: 'ion' }),
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'The balanced default view.',
    create: () => clampBlackHoleSettings({ intensity: 1, rotationSpeed: 0.45, particleDensity: 1, themeId: 'ion' }),
  },
  {
    id: 'inferno',
    name: 'Inferno',
    description: 'Dense, fast and intensely bright.',
    create: () => clampBlackHoleSettings({ intensity: 1.7, rotationSpeed: 0.9, particleDensity: 1.5, themeId: 'ember' }),
  },
  {
    id: 'violet-jet',
    name: 'Violet jet',
    description: 'Rapid rotation with a cool inner glow.',
    create: () => clampBlackHoleSettings({ intensity: 1.3, rotationSpeed: 1.25, particleDensity: 1.1, themeId: 'violet' }),
  },
];

/** Finds a preset by id, falling back to the first entry in the catalog. */
export function findPreset<T>(presets: readonly SimulationPreset<T>[], id: string | null): SimulationPreset<T> {
  return presets.find((preset) => preset.id === id) ?? presets[0];
}
