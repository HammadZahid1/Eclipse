import { useReducedMotion } from './useReducedMotion';
import { useSettingsStore } from '@/state/settingsStore';

/**
 * True when animation should be minimized, whether requested in ECLIPSE
 * settings or inherited from the operating system.
 */
export function useMotionPreference(): boolean {
  const manualPreference = useSettingsStore((state) => state.reducedMotion);
  const systemPreference = useReducedMotion();
  return manualPreference || systemPreference;
}
