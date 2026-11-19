import { describe, expect, it } from 'vitest';
import {
  BLACK_HOLE_THEMES,
  DEFAULT_BLACK_HOLE_SETTINGS,
  clampBlackHoleSettings,
  getBlackHoleTheme,
} from './config';

describe('black hole configuration', () => {
  it('provides distinct color themes', () => {
    expect(BLACK_HOLE_THEMES.length).toBeGreaterThanOrEqual(3);
    expect(new Set(BLACK_HOLE_THEMES.map((theme) => theme.id)).size).toBe(BLACK_HOLE_THEMES.length);
  });

  it('falls back to a valid theme for unknown ids', () => {
    expect(getBlackHoleTheme('missing').id).toBe(BLACK_HOLE_THEMES[0].id);
  });

  it('clamps all numeric controls to safe bounds', () => {
    const result = clampBlackHoleSettings({
      ...DEFAULT_BLACK_HOLE_SETTINGS,
      intensity: 99,
      rotationSpeed: -5,
      particleDensity: 0,
      themeId: 'missing',
    });
    expect(result.intensity).toBe(2);
    expect(result.rotationSpeed).toBe(0);
    expect(result.particleDensity).toBe(0.25);
    expect(result.themeId).toBe(BLACK_HOLE_THEMES[0].id);
  });
});
