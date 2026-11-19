import { clamp } from '@/lib/math';

export interface BlackHoleTheme {
  id: string;
  name: string;
  inner: string;
  middle: string;
  outer: string;
  glow: string;
}

export const BLACK_HOLE_THEMES: readonly BlackHoleTheme[] = [
  { id: 'ion', name: 'Ion Blue', inner: '#d8fbff', middle: '#51e4f2', outer: '#5299ff', glow: '#51e4f2' },
  { id: 'ember', name: 'Ember', inner: '#fff0c9', middle: '#ff9c52', outer: '#b83b2e', glow: '#ff9c52' },
  { id: 'violet', name: 'Violet', inner: '#f2e8ff', middle: '#9b82ff', outer: '#4b3ea8', glow: '#9b82ff' },
  { id: 'ice', name: 'Ice', inner: '#ffffff', middle: '#b7d8ff', outer: '#6f8cc4', glow: '#b7d8ff' },
];

export interface BlackHoleSettings {
  intensity: number;
  rotationSpeed: number;
  particleDensity: number;
  themeId: string;
}

export const DEFAULT_BLACK_HOLE_SETTINGS: BlackHoleSettings = {
  intensity: 1,
  rotationSpeed: 0.45,
  particleDensity: 1,
  themeId: 'ion',
};

export function getBlackHoleTheme(id: string): BlackHoleTheme {
  return BLACK_HOLE_THEMES.find((theme) => theme.id === id) ?? BLACK_HOLE_THEMES[0];
}

export function clampBlackHoleSettings(settings: BlackHoleSettings): BlackHoleSettings {
  return {
    intensity: clamp(settings.intensity, 0.2, 2),
    rotationSpeed: clamp(settings.rotationSpeed, 0, 2),
    particleDensity: clamp(settings.particleDensity, 0.25, 2),
    themeId: getBlackHoleTheme(settings.themeId).id,
  };
}
