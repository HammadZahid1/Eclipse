# ECLIPSE

> Explore the universe. Understand the motion.

ECLIPSE is a premium, frontend-only interactive space simulation laboratory. It runs entirely in the browser: no backend, database, external API, API key, authentication, or third-party simulation service is involved.

> **Note:** Every model in ECLIPSE is simplified and visually driven. It is an exploratory tool, not a scientifically exact representation of the universe.

## What is included

| Module | Route | What you can do |
| --- | --- | --- |
| Home | `/` | Explore the cinematic 3D hero and project introduction |
| Explore | `/explore` | Browse the four simulation modules |
| Solar System | `/solar-system` | Inspect simplified planets, orbital paths and simulated time |
| Black Hole Lab | `/black-hole` | Shape a procedural accretion disk, jets and camera views |
| Galaxy Generator | `/galaxy` | Generate deterministic galaxies from seeds and parameters |
| Orbit Lab | `/orbit-lab` | Edit bodies and observe softened Newtonian N-body motion |
| About | `/about` | Read the project philosophy and modeling disclaimer |

## Core principles

- **Local by design.** All geometry, particles, and motion are generated in the browser.
- **Procedural, not fetched.** No simulation data comes from a network service.
- **Abstract units.** Time, distance, mass, and speed are simplified simulation values, not astronomical measurements.
- **Deterministic where it matters.** Galaxy generation and presets reproduce the same result from the same inputs.
- **Accessible and responsive.** Keyboard shortcuts, reduced-motion support, a mobile control drawer, and labeled controls are included.
- **Frontend only.** There is deliberately no server-side component.

## Quick start

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173>.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Typecheck and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run test` | Run simulation logic unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run check` | Run typecheck, lint, tests, and a production build |

Current validation status: **16 test files, 73 tests passing**, typecheck passing, lint passing, and production build passing without warnings.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Pause or resume the simulation |
| `R` | Reset the active simulation |
| `1`–`6` | Set simulation speed |
| `,` / `.` | Step backward or forward in Orbit Lab |
| `F` | Toggle fullscreen for the active simulation scene |
| `Esc` | Exit fullscreen (browser controlled) |

Shortcuts are ignored while typing in form fields.

## Settings and persistence

The settings panel controls render quality, particle density, default simulation speed, label visibility, interface animation, and reduced motion. These are **UI preferences only** and are stored locally with Zustand persist. Simulation state is never saved or restored automatically.

Reduced motion respects both the ECLIPSE setting and the operating system's `prefers-reduced-motion` preference.

## Architecture at a glance

```text
src/
  app/          routes and lazy-loaded router
  components/   layout, 3D scenes, particle systems, simulation UI
  hooks/        clock, fullscreen, shortcuts, media/motion preferences
  lib/          math, seeded randomness, constants
  pages/        route-level screens
  sim/          pure simulation logic (solar, black hole, galaxy, orbit)
  state/        persisted UI preferences
```

3D rendering uses React Three Fiber and Three.js with GPU-side particle shaders and reusable typed-array buffers. Routes are lazy-loaded, and Three.js is isolated into dedicated vendor chunks for faster initial loads.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — code organization and rendering pipeline
- [SIMULATION.md](./SIMULATION.md) — model formulas, parameters, and limitations
- [CONTRIBUTING.md](./CONTRIBUTING.md) — development and commit workflow

ECLIPSE is an educational visualization experiment. It does not provide ephemerides, relativistic predictions, or astronomical measurements.
