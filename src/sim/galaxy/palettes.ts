export interface GalaxyPalette {
  id: string;
  name: string;
  colors: readonly string[];
}

export const GALAXY_PALETTES: readonly GalaxyPalette[] = [
  { id: 'nebula', name: 'Nebula', colors: ['#ffffff', '#9b82ff', '#5299ff', '#51e4f2'] },
  { id: 'ember', name: 'Ember', colors: ['#fff3d6', '#ffb077', '#ff6b52', '#8e3b62'] },
  { id: 'glacier', name: 'Glacier', colors: ['#ffffff', '#d8ecff', '#8bb8e8', '#5c78b8'] },
  { id: 'orchid', name: 'Orchid', colors: ['#fff0ff', '#e2a8ff', '#9b82ff', '#4d3d9e'] },
];

export function getGalaxyPalette(id: string): GalaxyPalette {
  return GALAXY_PALETTES.find((palette) => palette.id === id) ?? GALAXY_PALETTES[0];
}
