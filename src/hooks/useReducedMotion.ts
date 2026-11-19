import { useMediaQuery } from './useMediaQuery';

/** True when the user has requested reduced animation in their OS settings. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
