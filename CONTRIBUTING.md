# Contributing to ECLIPSE

Thanks for helping improve ECLIPSE. This project is intentionally small, local, and frontend-only.

## 1. Ground rules

- **No backend, database, auth, API keys, telemetry, or external simulation services.**
- Do not fetch astronomical data at runtime.
- Simulations must remain local, procedural, and labeled as simplified.
- Prefer pure functions in `src/sim/` over logic embedded in React components.
- Do not persist simulation state; only UI preferences may use local storage.

## 2. Setup

```bash
git clone https://github.com/HammadZahid1/Eclipse.git
cd Eclipse
npm install
npm run dev
```

Local git line-ending settings used by this repository:

```bash
git config core.autocrlf false
git config core.safecrlf false
```

## 3. Validation workflow

Run the full check before committing:

```bash
npm run check
```

This runs:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

For faster iteration, run individual commands. A change is not ready to commit until all four pass.

## 4. Commit and push workflow

Each milestone should be implemented, reviewed, validated, staged, committed, and pushed individually:

```bash
git status --short
git add -A
git commit -m "feat: short imperative description"
git push
git status --short --branch
```

Do not rewrite history, force push, or create empty commits.

### Commit message style

- `feat:` — new user-facing capability
- `fix:` — defect correction
- `perf:` — performance improvement
- `test:` — test coverage
- `docs:` — documentation only
- `refactor:` — structural change without behavior change
- `chore:` — tooling or maintenance

Example: `feat: add deterministic galaxy presets`.

## 5. Code style

- TypeScript with strict settings; avoid `any`.
- Use the `@/` alias for imports.
- Keep simulation math in `src/sim/`.
- Keep reusable controls in `src/components/simulation/` or `src/components/ui/`.
- Use typed arrays for particle and trail data.
- Avoid allocating objects inside render loops.
- Respect reduced-motion preferences through `useMotionPreference`.
- Add labels and accessible names to interactive controls.

## 6. Tests

Tests live beside the code as `*.test.ts` and run with Vitest in a Node environment.

Add tests for:

- new pure math or generator functions,
- input validation and clamping,
- determinism (same seed/parameters → same output),
- bounded values and array lengths,
- state snapshots and stepping.

Scene components are not unit-tested directly; test the pure modules they depend on.

## 7. Adding a preset

1. Add a typed entry to the appropriate catalog in `src/sim/presets.ts`.
2. Make `create()` return a fresh, clamped configuration.
3. Add it to `PresetSelector` through the existing catalog prop.
4. Add validation to `src/sim/presets.test.ts`.
5. Run `npm run check`.

## 8. Adding a simulation module

1. Add pure logic under `src/sim/<module>/` with tests.
2. Add a scene under `src/components/scenes/<module>/`.
3. Compose the shared `SimulationLayout`, `SimulationToolbar`, and panels in a page.
4. Add the route to `src/app/routes.ts` and the lazy route in `AppRouter`.
5. Update navigation, README, ARCHITECTURE.md, and SIMULATION.md.
6. Keep all output local and clearly labeled as simplified.

## 9. Pull request checklist

- [ ] `npm run check` passes.
- [ ] No backend, network simulation, or external data dependency was added.
- [ ] New simulation behavior has pure-logic tests.
- [ ] UI changes remain responsive and keyboard accessible.
- [ ] Reduced-motion behavior still works.
- [ ] Documentation was updated where behavior changed.
- [ ] Simulation values are described as abstract/simplified.

ECLIPSE is a visualization laboratory, not a scientific instrument. Please preserve that boundary.
