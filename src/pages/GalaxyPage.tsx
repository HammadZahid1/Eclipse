import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { RangeControl } from '@/components/ui/RangeControl';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { GalaxyScene } from '@/components/scenes/galaxy/GalaxyScene';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSettingsStore } from '@/state/settingsStore';
import { generateGalaxy } from '@/sim/galaxy/generator';
import { getGalaxyPalette } from '@/sim/galaxy/palettes';
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
            <RangeControl
              label="Star count"
              value={parameters.starCount}
              min={GALAXY_LIMITS.starCount.min}
              max={GALAXY_LIMITS.starCount.max}
              step={GALAXY_LIMITS.starCount.step}
              format={(value) => value.toLocaleString()}
              onChange={(starCount) => updateParameters({ starCount })}
            />
          </Panel>
        }
      />
    </div>
  );
}
