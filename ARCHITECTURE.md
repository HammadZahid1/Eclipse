# ECLIPSE architecture

This document describes how the frontend is organized and how data moves through the application.

## 1. System boundary

ECLIPSE is a single-page React application built with Vite. It has **no runtime backend**. The production output is static HTML, CSS, and JavaScript.

```text
Browser
  ├─ React UI (controls, panels, navigation)
  ├─ Zustand UI-preference store
  └─ React Three Fiber scenes
        └─ Three.js buffers + GPU shaders

No network simulation requests · No API keys · No database
```

## 2. Directory layout

| Directory | Responsibility |
| --- | --- |
| `src/app/` | Route constants and the router. Pages are loaded with `React.lazy`. |
| `src/pages/` | Route-level screens that compose shared simulation layouts. |
| `src/components/layout/` | App shell, navigation, page headers, settings panel, loading state. |
| `src/components/scenes/` | Module-specific R3F scenes: solar, black hole, galaxy, orbit. |
| `src/components/particles/` | Reusable buffer-based particle fields and the ambient star field. |
| `src/components/simulation/` | Shared toolbar, status bar, layout, controls, presets and overlays. |
| `src/components/three/` | Shared `RenderCanvas` and the cinematic hero scene. |
| `src/sim/` | Pure, framework-independent simulation logic. |
| `src/hooks/` | Clock, fullscreen, keyboard shortcuts, media and motion queries. |
| `src/state/` | Persisted **UI-only** preferences. |
| `src/lib/` | Math helpers, seeded PRNG, product constants. |

## 3. Layering

```text
pages / UI components
        │ props, callbacks
        ▼
scene components (R3F)
        │ read/write simulation objects
        ▼
sim/ modules (pure logic)
        │
        ▼
typed arrays + math
```

Simulation modules never import React components. UI components never mutate scene internals except through explicit engine or clock interfaces.

## 4. Rendering pipeline

1. `AppRouter` lazily loads the requested page.
2. A page composes `SimulationLayout` with a scene, toolbar, info panel, and controls panel.
3. `RenderCanvas` creates the shared WebGL canvas with quality-based DPR and reduced-motion-aware frame scheduling.
4. Scene components render geometry and particle systems.
5. Particle systems write positions, colors, and phases into `Float32Array` buffers once, then animate with uniforms or group transforms.

### Particle strategy

- One `THREE.Points` object per field, never one React component per particle.
- `BufferGeometry` attributes use typed arrays and dynamic draw usage when updated.
- Galaxy positions and colors are regenerated only when parameters or seed change.
- Orbit trails use a fixed-size ring-style buffer copied with `copyWithin`, avoiding per-frame allocation.
- Counts are clamped; `particleDensity` and render quality scale visual counts without changing simulation logic.

## 5. Time and integration

`src/sim/time.ts` provides a fixed-step `SimulationClock`. Rendering delta time is scaled by the selected speed and accumulated into deterministic steps.

`integrateSystem` in `src/sim/orbit/integration.ts` adds a second safety layer:

- frame gaps are clamped,
- substeps are bounded,
- energy drift is reported for diagnostics,
- extreme speeds cannot produce unbounded per-frame work.

Orbit Lab additionally captures lightweight snapshots so single-step controls can move backward without reversing the integrator.

## 6. State management

| State | Location | Persisted? |
| --- | --- | --- |
| Route | React Router | No |
| Simulation running/speed/selection | React state in each page | No |
| Clock and engine internals | Refs held by pages/scenes | No |
| Galaxy parameters | React state in `GalaxyPage` | No |
| UI preferences | Zustand store | Yes, local storage only |

Persisted keys are limited to render quality, particle density, default speed, label visibility, animation, and reduced motion. The application works without local storage.

## 7. Presets

`src/sim/presets.ts` is a typed catalog of deterministic starting configurations for Orbit Lab, Galaxy Generator, and Black Hole Lab. Each preset exposes `create()`, returning a fresh object so applying a preset cannot share mutable state with a prior run.

`PresetSelector` is the shared UI. Manual edits clear the active preset marker.

## 8. Performance decisions

- Route-level code splitting via `React.lazy` and `Suspense`.
- Manual Rollup chunks isolate `three` core, the R3F/Drei ecosystem, and remaining vendors.
- `chunkSizeWarningLimit` is set to 750 kB because Three.js core is intentionally isolated (~704 kB minified, ~181 kB gzipped).
- Fixed buffers and shader uniforms avoid React re-renders in animation loops.
- `frameloop="demand"` is used when a paused scene is combined with a reduced-motion preference.
- Simulation radius, particle counts, and substeps are explicitly bounded.

## 9. Performance decisions — validation

Run `npm run build` to see per-route chunks. Route code is typically under 15 kB each; the largest assets are the deliberately isolated Three.js vendor chunks.

## 10. Accessibility

- Skip link to `#main-content`.
- Labeled buttons with `aria-pressed` for toggles.
- `aria-expanded` / `aria-controls` on the mobile controls drawer.
- `role="status"` for playback state and route loading.
- Reduced motion from both settings and OS preference.
- Keyboard shortcuts that ignore typing targets.
- Responsive layout with a scene-first mobile view and collapsible controls.

## 11. Testing strategy

Vitest runs in a Node environment and targets pure logic in `src/**/*.test.ts`:

- math and seeded randomness,
- particle distributions,
- solar orbital helpers and engine,
- black hole config and disk generation,
- galaxy seed and structure generation,
- gravity, analysis, integration, engine snapshots,
- presets and input validation.

Scene components are intentionally excluded from unit tests; their behavior is validated through the pure modules they render.

## 12. Constraints for future work

- Do not add a backend, data service, auth, telemetry, or external simulation API.
- Do not fetch astronomical datasets at runtime.
- Keep simulation logic pure and deterministic where practical.
- Keep all values labeled as simplified simulation units.
- Validate with `npm run check` before committing.
