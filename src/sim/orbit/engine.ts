import { computeAccelerations } from './gravity';
import {
  GRAVITATIONAL_CONSTANT,
  MAX_BODIES,
  SOFTENING,
  clampBody,
  type MutableVec3,
  type OrbitalBody,
} from './types';

/** Serializable state used for bounded stepping and undo. */
export interface OrbitEngineSnapshot {
  time: number;
  bodies: OrbitalBody[];
}

/** Stateful N-body simulation using Velocity Verlet integration. */
export class OrbitEngine {
  bodies: OrbitalBody[];
  time = 0;
  readonly gravitationalConstant: number;
  readonly softening: number;
  private accelerations: MutableVec3[];

  constructor(bodies: readonly OrbitalBody[] = [], g = GRAVITATIONAL_CONSTANT, softening = SOFTENING) {
    this.bodies = bodies.map((body) => clampBody(body));
    this.gravitationalConstant = g;
    this.softening = softening;
    this.accelerations = computeAccelerations(this.bodies, g, softening);
  }

  step(delta: number): void {
    if (!Number.isFinite(delta) || delta <= 0) return;
    const halfDeltaSquared = 0.5 * delta * delta;
    const halfDelta = 0.5 * delta;
    const oldAccelerations = this.accelerations;

    for (let i = 0; i < this.bodies.length; i += 1) {
      const body = this.bodies[i];
      const acceleration = oldAccelerations[i];
      body.position[0] += body.velocity[0] * delta + acceleration[0] * halfDeltaSquared;
      body.position[1] += body.velocity[1] * delta + acceleration[1] * halfDeltaSquared;
      body.position[2] += body.velocity[2] * delta + acceleration[2] * halfDeltaSquared;
    }

    const newAccelerations = computeAccelerations(this.bodies, this.gravitationalConstant, this.softening);
    for (let i = 0; i < this.bodies.length; i += 1) {
      const body = this.bodies[i];
      const before = oldAccelerations[i];
      const after = newAccelerations[i];
      body.velocity[0] += (before[0] + after[0]) * halfDelta;
      body.velocity[1] += (before[1] + after[1]) * halfDelta;
      body.velocity[2] += (before[2] + after[2]) * halfDelta;
    }

    this.accelerations = newAccelerations;
    this.time += delta;
  }

  add(body: OrbitalBody): boolean {
    if (this.bodies.length >= MAX_BODIES) return false;
    this.bodies.push(clampBody(body));
    this.refreshAccelerations();
    return true;
  }

  remove(id: string): void {
    this.bodies = this.bodies.filter((body) => body.id !== id);
    this.refreshAccelerations();
  }

  update(id: string, patch: Partial<OrbitalBody>): void {
    const index = this.bodies.findIndex((body) => body.id === id);
    if (index < 0) return;
    this.bodies[index] = clampBody({ ...this.bodies[index], ...patch, id });
    this.refreshAccelerations();
  }

  reset(bodies: readonly OrbitalBody[]): void {
    this.bodies = bodies.map((body) => clampBody(body));
    this.time = 0;
    this.refreshAccelerations();
  }

  /** Returns an isolated copy of the current state. */
  capture(): OrbitEngineSnapshot {
    return {
      time: this.time,
      bodies: this.bodies.map((body) =>
        clampBody({
          ...body,
          position: [...body.position] as MutableVec3,
          velocity: [...body.velocity] as MutableVec3,
        }),
      ),
    };
  }

  /** Replaces the current state with a previously captured snapshot. */
  restore(snapshot: OrbitEngineSnapshot): void {
    this.time = snapshot.time;
    this.bodies = snapshot.bodies.map((body) =>
      clampBody({
        ...body,
        position: [...body.position] as MutableVec3,
        velocity: [...body.velocity] as MutableVec3,
      }),
    );
    this.refreshAccelerations();
  }

  private refreshAccelerations(): void {
    this.accelerations = computeAccelerations(this.bodies, this.gravitationalConstant, this.softening);
  }
}
