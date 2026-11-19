# Simulation models

ECLIPSE uses simplified mathematical models for interactive exploration. Values are expressed in **abstract simulation units** unless explicitly stated otherwise. Nothing here should be used as an astronomical measurement or prediction.

## 1. Shared time model

`SimulationClock` advances only while a simulation is running. Rendering frame time is converted into fixed simulation steps, scaled by the selected multiplier:

```text
0.25x · 0.5x · 1x · 2x · 5x · 10x
```

Fixed stepping keeps motion consistent across frame rates. Orbit Lab caps frame gaps and the number of substeps to prevent numerical blow-ups after a tab has been inactive.

## 2. Solar System

### Model

Each planet follows a prescribed near-circular path:

```text
phase(t) = initialAngle + orbitalSpeed × t
x(t)     = cos(phase) × orbitRadius
z(t)     = sin(phase) × orbitRadius
y(t)     = sin(phase × 0.6) × inclination × orbitRadius
```

Rotation is `rotationSpeed × t`, wrapped into `[-π, π]` to maintain float precision during long runs.

### Controls

- Pause/resume, reset, speed multiplier.
- Show or hide orbit paths and labels.
- Select a planet in the scene or from the list.
- Focus a planet and return to the overview camera.
- Fullscreen the simulation scene.

### Limitations

This is a kinematic visualization, not an N-body ephemeris. Planet masses do not perturb each other, orbits do not precess, and periods/distances are chosen for legibility rather than astronomical accuracy.

## 3. Black Hole Lab

### Model

The black hole is a **visual analogy**, not a general-relativity solver. A procedural accretion disk is generated from seeded radial and angular distributions. Each particle carries offset, speed, radius, and phase attributes; a shader animates motion and opacity with a shared time uniform. Decorative polar jets use the same approach.

### Controls

- Disk intensity, particle density, and rotation rate.
- Four color themes.
- Camera presets: overview, edge-on, top-down.
- Pause/resume, reset, speed, and fullscreen.
- Four presets: quiet disk, classic, inferno, violet jet.

### Limitations

There is no spacetime curvature, gravitational lensing, relativistic Doppler shift, horizon physics, or mass-based timescale. The event horizon is a black sphere with a glow ring.

## 4. Galaxy Generator

### Model

A seeded pseudo-random generator drives several procedural distributions:

- **Spiral** — logarithmic-style arms with angular spread.
- **Elliptical** — wide, softened cloud with weak structure.
- **Ring** — hollow radial band.
- **Irregular** — clumped, asymmetric scatter.

Seed strings are hashed to 32-bit integers, then expanded with Mulberry32. Positions, sizes, and palette colors are written directly into typed arrays for GPU rendering.

### Determinism

The same `seed` and parameter set always produces the same arrays. The shuffle/regenerate action derives a new seed from the previous one, making a run reproducible by recording its seed.

### Controls

- Galaxy type, star count, arms, radius, spread, rotation, randomness, and particle size.
- Editable seed with randomize and derive-and-regenerate actions.
- Four color palettes.
- Four presets: grand design, elliptical, ring, irregular.

### Limitations

This is structure generation, not galaxy formation physics. There are no stars evolving, no dark-matter halo model, no gas dynamics, and no distance calibration.

## 5. Orbit Lab

### Model

Orbit Lab uses pairwise softened Newtonian gravity:

```text
aᵢ = Σ G × mⱼ × (rⱼ - rᵢ) / (|rⱼ - rᵢ|² + ε²)^(3/2)
```

Acceleration is integrated with Velocity Verlet:

```text
r(t + Δt) = r(t) + v(t)Δt + ½a(t)Δt²
v(t + Δt) = v(t) + ½[a(t) + a(t + Δt)]Δt
```

Softening `ε` prevents singularities when bodies overlap. The displayed total energy and net momentum are approximate diagnostics for the softened system.

### Controls

- Add, remove, rename, recolor, and edit up to 12 bodies.
- Edit mass, radius, position, and velocity.
- Four starting presets: two-body, binary stars, three-body, mini cluster.
- Fixed-size forward/backward stepping with captured snapshots.
- Keyboard stepping with `,` and `.`.
- Path trails, selection, speed control, reset, and fullscreen.

### Limitations

This is a softened Newtonian toy model. It does not include collisions, tides, spin, relativity, drag, or close-encounter handling. Chaotic configurations can diverge quickly from small edits.

## 6. Presets and reproducibility

All presets live in `src/sim/presets.ts` and return fresh objects. Galaxy and black hole presets are plain deterministic configurations. Orbit presets construct bodies with bounded values and circular-orbit estimates where applicable.

Applying a preset resets the relevant simulation. Making a manual edit clears the active preset marker because the state no longer matches the named configuration.

## 7. Units and terminology

| Term | Meaning in ECLIPSE |
| --- | --- |
| Unit `u` | Arbitrary simulation distance |
| `t` | Abstract simulation time |
| Speed multiplier | Scaling factor applied to fixed simulation steps |
| Mass | Relative simulation mass used by the gravity equation |
| Softening | Numerical floor that prevents infinite force at zero distance |
| Star count | Number of generated GPU particles, not a physical census |

## 8. Scientific disclaimer

ECLIPSE is designed to make motion, scale, and structure explorable. It is not a scientific instrument, ephemeris, or substitute for physical simulation software. All models are intentionally simplified and should be described as such in any derivative work.
