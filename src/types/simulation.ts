/** Shared, renderer-agnostic simulation types. */

export type Vec3 = readonly [number, number, number];

export interface SimulationStatus {
  /** Whether the simulation clock is advancing. */
  running: boolean;
  /** Multiplier applied to the fixed simulation timestep. */
  speed: number;
  /** Elapsed simulation time in abstract simulation units. */
  time: number;
}

export interface SimulationResetAction {
  reset: () => void;
}

export type GalaxyType = 'spiral' | 'elliptical' | 'ring' | 'irregular';

export interface ColorStop {
  position: number;
  color: string;
}
