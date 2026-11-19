/** Configuration for the simplified solar system simulation. */
export interface RingConfig {
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
  tilt: number;
}

export interface AtmosphereConfig {
  color: string;
  intensity: number;
}

export interface PlanetConfig {
  id: string;
  name: string;
  radius: number;
  orbitRadius: number;
  orbitalSpeed: number;
  rotationSpeed: number;
  color: string;
  initialAngle: number;
  inclination?: number;
  axialTilt?: number;
  ring?: RingConfig;
  atmosphere?: AtmosphereConfig;
  description: string;
}

export interface StarConfig {
  name: string;
  radius: number;
  color: string;
  glowColor: string;
  description: string;
}

export const SOLAR_STAR: StarConfig = {
  name: 'Helios',
  radius: 1.05,
  color: '#ffd8a8',
  glowColor: '#5299ff',
  description: 'The central star of this simplified system. Its parameters are simulation units, not solar measurements.',
};

/**
 * Simplified, fictionalized planets. Orbital radii and rates are chosen for a
 * readable visualization and are deliberately not astronomical measurements.
 */
export const PLANETS: readonly PlanetConfig[] = [
  {
    id: 'cinder',
    name: 'Cinder',
    radius: 0.16,
    orbitRadius: 2.1,
    orbitalSpeed: 0.82,
    rotationSpeed: 0.18,
    color: '#b8a191',
    initialAngle: 0.4,
    axialTilt: 0.05,
    description: 'A small, fast inner world with a barren surface.',
  },
  {
    id: 'vesper',
    name: 'Vesper',
    radius: 0.24,
    orbitRadius: 3.1,
    orbitalSpeed: 0.6,
    rotationSpeed: 0.24,
    color: '#d8b58a',
    initialAngle: 2.1,
    axialTilt: 0.12,
    atmosphere: { color: '#ffcf9b', intensity: 0.12 },
    description: 'A warm world wrapped in a thin simulated haze.',
  },
  {
    id: 'terra',
    name: 'Terra',
    radius: 0.27,
    orbitRadius: 4.3,
    orbitalSpeed: 0.45,
    rotationSpeed: 0.62,
    color: '#4b8fd6',
    initialAngle: 4.0,
    axialTilt: 0.41,
    atmosphere: { color: '#51e4f2', intensity: 0.2 },
    description: 'A temperate blue world used as the system reference point.',
  },
  {
    id: 'rubeus',
    name: 'Rubeus',
    radius: 0.21,
    orbitRadius: 5.6,
    orbitalSpeed: 0.34,
    rotationSpeed: 0.5,
    color: '#b85d4a',
    initialAngle: 1.2,
    axialTilt: 0.44,
    description: 'A dusty red planet with a slow, steady orbit.',
  },
  {
    id: 'magnus',
    name: 'Magnus',
    radius: 0.58,
    orbitRadius: 7.8,
    orbitalSpeed: 0.22,
    rotationSpeed: 1.1,
    color: '#d1a878',
    initialAngle: 5.4,
    axialTilt: 0.09,
    atmosphere: { color: '#f4c997', intensity: 0.1 },
    description: 'A large gas giant dominating the outer system.',
  },
  {
    id: 'annulus',
    name: 'Annulus',
    radius: 0.45,
    orbitRadius: 10.2,
    orbitalSpeed: 0.16,
    rotationSpeed: 0.9,
    color: '#c9b48f',
    initialAngle: 3.0,
    inclination: 0.12,
    axialTilt: 0.55,
    ring: { innerRadius: 0.65, outerRadius: 1.1, color: '#cbd5e8', opacity: 0.35, tilt: 0.35 },
    description: 'A ringed giant with a gently inclined orbit.',
  },
  {
    id: 'glacies',
    name: 'Glacies',
    radius: 0.33,
    orbitRadius: 12.9,
    orbitalSpeed: 0.11,
    rotationSpeed: -0.35,
    color: '#8fd4e8',
    initialAngle: 0.9,
    axialTilt: 1.7,
    atmosphere: { color: '#9b82ff', intensity: 0.14 },
    description: 'An ice giant with a retrograde simulated rotation.',
  },
];

export const SOLAR_SYSTEM_BOUNDS = { min: 1.4, max: 16 } as const;
