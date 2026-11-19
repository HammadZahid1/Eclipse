import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SIMULATION_SPEEDS, type SimulationSpeed } from '@/lib/constants';

export type RenderQuality = 'low' | 'medium' | 'high';

export interface SettingsState {
  renderQuality: RenderQuality;
  particleDensity: number;
  defaultSpeed: SimulationSpeed;
  showLabels: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  setRenderQuality: (value: RenderQuality) => void;
  setParticleDensity: (value: number) => void;
  setDefaultSpeed: (value: SimulationSpeed) => void;
  setShowLabels: (value: boolean) => void;
  setAnimationsEnabled: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  resetSettings: () => void;
}

const defaults = {
  renderQuality: 'medium' as RenderQuality,
  particleDensity: 1,
  defaultSpeed: 1 as SimulationSpeed,
  showLabels: true,
  animationsEnabled: true,
  reducedMotion: false,
};

const clampDensity = (value: number) => Math.min(1.5, Math.max(0.35, value));

/**
 * Non-sensitive UI preferences only. Simulation state is intentionally never
 * persisted — the application works without local storage.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      setRenderQuality: (renderQuality) => set({ renderQuality }),
      setParticleDensity: (value) => set({ particleDensity: clampDensity(value) }),
      setDefaultSpeed: (defaultSpeed) =>
        set({ defaultSpeed: SIMULATION_SPEEDS.includes(defaultSpeed) ? defaultSpeed : 1 }),
      setShowLabels: (showLabels) => set({ showLabels }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      resetSettings: () => set(defaults),
    }),
    {
      name: 'eclipse.ui.preferences',
      version: 1,
      partialize: (state) => ({
        renderQuality: state.renderQuality,
        particleDensity: state.particleDensity,
        defaultSpeed: state.defaultSpeed,
        showLabels: state.showLabels,
        animationsEnabled: state.animationsEnabled,
        reducedMotion: state.reducedMotion,
      }),
    },
  ),
);
