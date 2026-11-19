import { useMemo, useState } from 'react';
import { Dices } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { RangeControl } from '@/components/ui/RangeControl';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ThemeSelector } from '@/components/simulation/ThemeSelector';
import type { GalaxyType } from '@/types/simulation';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { GalaxyScene } from '@/components/scenes/galaxy/GalaxyScene';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSettingsStore } from '@/state/settingsStore';
import { generateGalaxy } from '@/sim/galaxy/generator';
import { GALAXY_PALETTES, getGalaxyPalette } from '@/sim/galaxy/palettes';
import { createSeed, normalizeSeed } from '@/sim/galaxy/seed';
import {
  DEFAULT_GALAXY_PARAMETERS,
  GALAXY_LIMITS,
  clampGalaxyParameters,
  type GalaxyParameters,
} from '@/sim/galaxy/types';
import type { SimulationSpeed } from '@/lib/constants';

export default function GalaxyPage() {
  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(defaultSpeed);
  const [parameters, setParameters] = useState<GalaxyParameters>(DEFAULT_GALAXY_PARAMETERS);
  const [resetToken, setResetToken] = useState(0);
  const fullscreen = useFullscreen();
  const galaxy = useMemo(() => generateGalaxy(parameters), [parameters]);
  const palette = getGalaxyPalette(parameters.paletteId);

  const updateParameters = (patch: Partial<GalaxyParameters>) => {
    setParameters((current) => clampGalaxyParameters({ ...current, ...patch }));
  };

  const handleReset = () => {
    setParameters(DEFAULT_GALAXY_PARAMETERS);
    setResetToken((token) => token + 1);
    setSpeed(defaultSpeed);
    setRunning(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-8">
        <PageHeader
          eyebrow="Module 03 / Procedural generation"
          title="Galaxy Generator"
          description="Generate distinct galaxy structures from mathematical distributions and a deterministic seed. Every star is created locally."
        />
      </div>
      <SimulationLayout
        className="min-h-0 flex-1"
        key={resetToken}
        scene={<GalaxyScene data={galaxy} rotating={running} speed={speed} />}
        status={{ running, time: parameters.starCount, speed, detail: `Seed ${parameters.seed}` }}
        onResume={() => setRunning(true)}
        toolbar={
          <SimulationToolbar
            running={running}
            speed={speed}
            showOrbits={false}
            showLabels={false}
            fullscreenSupported={fullscreen.supported}
            onToggleRunning={() => setRunning((value) => !value)}
            onReset={handleReset}
            onResetCamera={() => setResetToken((token) => token + 1)}
            onSpeedChange={setSpeed}
            onToggleOrbits={() => {}}
            onToggleLabels={() => {}}
            onFullscreen={fullscreen.toggle}
          />
        }
        infoPanel={
          <Panel title="Generated structure" eyebrow="Procedural galaxy">
            <dl>
              <DataRow label="Type" value={parameters.type} />
              <DataRow label="Stars" value={galaxy.count.toLocaleString()} />
              <DataRow label="Seed" value={parameters.seed} mono />
              <DataRow label="Arms" value={parameters.arms} />
              <DataRow label="Radius" value={`${parameters.radius} u`} />
              <DataRow label="Palette" value={palette.name} mono={false} />
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              Generated from a seeded pseudo-random distribution. The same settings always produce the same structure.
            </p>
          </Panel>
        }
        controlsPanel={
          <Panel title="Generation" eyebrow="Parameters">
            <SegmentedControl
              label="Galaxy type"
              value={parameters.type}
              onChange={(type) => updateParameters({ type: type as GalaxyType })}
              options={[
                { value: 'spiral', label: 'Spiral' },
                { value: 'elliptical', label: 'Elliptical' },
                { value: 'ring', label: 'Ring' },
                { value: 'irregular', label: 'Irregular' },
              ]}
              columns={2}
            />
            <div className="my-5" />
            <div className="space-y-2">
              <label htmlFor="galaxy-seed" className="ecl-label">
                Seed
              </label>
              <div className="flex gap-2">
                <input
                  id="galaxy-seed"
                  type="text"
                  value={parameters.seed}
                  maxLength={40}
                  onChange={(event) => updateParameters({ seed: normalizeSeed(event.target.value) })}
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 ecl-value text-xs text-ink outline-none focus:border-cyan/50"
                />
                <button
                  type="button"
                  aria-label="Generate a new random seed"
                  title="Generate a new random seed"
                  onClick={() => updateParameters({ seed: createSeed() })}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
                >
                  <Dices size={15} />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-muted/80">
                Identical seeds and parameters always reproduce the same structure.
              </p>
            </div>
            <div className="my-5 border-t border-white/8" />
            <div className="space-y-5">
              <RangeControl
                label="Star count"
                value={parameters.starCount}
                min={GALAXY_LIMITS.starCount.min}
                max={GALAXY_LIMITS.starCount.max}
                step={GALAXY_LIMITS.starCount.step}
                format={(value) => value.toLocaleString()}
                onChange={(starCount) => updateParameters({ starCount })}
              />
              <RangeControl
                label="Arms"
                value={parameters.arms}
                min={GALAXY_LIMITS.arms.min}
                max={GALAXY_LIMITS.arms.max}
                step={GALAXY_LIMITS.arms.step}
                onChange={(arms) => updateParameters({ arms })}
              />
              <RangeControl
                label="Galaxy radius"
                value={parameters.radius}
                min={GALAXY_LIMITS.radius.min}
                max={GALAXY_LIMITS.radius.max}
                step={GALAXY_LIMITS.radius.step}
                format={(value) => `${value} u`}
                onChange={(radius) => updateParameters({ radius })}
              />
              <RangeControl
                label="Spread"
                value={parameters.spread}
                min={GALAXY_LIMITS.spread.min}
                max={GALAXY_LIMITS.spread.max}
                step={GALAXY_LIMITS.spread.step}
                format={(value) => value.toFixed(2)}
                onChange={(spread) => updateParameters({ spread })}
              />
              <RangeControl
                label="Rotation"
                value={parameters.rotation}
                min={GALAXY_LIMITS.rotation.min}
                max={GALAXY_LIMITS.rotation.max}
                step={GALAXY_LIMITS.rotation.step}
                format={(value) => value.toFixed(2)}
                onChange={(rotation) => updateParameters({ rotation })}
              />
              <RangeControl
                label="Randomness"
                value={parameters.randomness}
                min={GALAXY_LIMITS.randomness.min}
                max={GALAXY_LIMITS.randomness.max}
                step={GALAXY_LIMITS.randomness.step}
                format={(value) => value.toFixed(2)}
                onChange={(randomness) => updateParameters({ randomness })}
              />
              <RangeControl
                label="Particle size"
                value={parameters.particleSize}
                min={GALAXY_LIMITS.particleSize.min}
                max={GALAXY_LIMITS.particleSize.max}
                step={GALAXY_LIMITS.particleSize.step}
                format={(value) => value.toFixed(1)}
                onChange={(particleSize) => updateParameters({ particleSize })}
              />
              <ThemeSelector
                label="Color palette"
                themes={GALAXY_PALETTES.map((item) => ({
                  id: item.id,
                  name: item.name,
                  colors: item.colors,
                }))}
                value={parameters.paletteId}
                onChange={(paletteId) => updateParameters({ paletteId })}
              />
            </div>
          </Panel>
        }
      />
    </div>
  );
}
