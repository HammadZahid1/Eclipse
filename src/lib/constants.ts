/** Core product constants shared across simulation modules. */
export const PRODUCT_NAME = 'ECLIPSE';

/** Simulation time is expressed in abstract simulation units, not SI seconds. */
export const SIMULATION_TIME_UNIT = 'simulation units';

export const SIMULATION_SPEEDS = [0.25, 0.5, 1, 2, 5, 10] as const;

export type SimulationSpeed = (typeof SIMULATION_SPEEDS)[number];
