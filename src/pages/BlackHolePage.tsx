import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { SpeedControls } from '@/components/simulation/SpeedControls';
import { BlackHoleScene } from '@/components/scenes/blackhole/BlackHoleScene';
import { useSimulationClock } from '@/hooks/useSimulationClock';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSettingsStore } from '@/state/settingsStore';
import {
  DEFAULT_BLACK_HOLE_SETTINGS,
  getBlackHoleTheme,
  type BlackHoleSettings,
} from '@/sim/blackhole/config';
import type { SimulationSpeed } from '@/lib/constants';

export default function BlackHolePage() {
  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(defaultSpeed);
  const [showOrbits, setShowOrbits] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [settings, setSettings] = useState<BlackHoleSettings>(DEFAULT_BLACK_HOLE_SETTINGS);
  const { advance, reset, displayTime, timeRef } = useSimulationClock({ running, speed });
  const fullscreen = useFullscreen();
  const theme = getBlackHoleTheme(settings.themeId);

  const handleReset = () => {
    reset();
    setSettings(DEFAULT_BLACK_HOLE_SETTINGS);
    setResetToken((token) => token + 1);
    setRunning(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-8">
        <PageHeader
          eyebrow="Module 02 / Visual simulation"
          title="Black Hole Lab"
          description="A visual, physics-inspired black hole environment. Shape a procedural accretion disk and observe how its parameters change the scene."
        />
      </div>
      <SimulationLayout
        className="min-h-0 flex-1"
        scene={
          <BlackHoleScene
            clock={timeRef.current}
            advance={advance}
            settings={settings}
            resetToken={resetToken}
          />
        }
        status={{ running, time: displayTime, speed, detail: 'Visual model — not general relativity' }}
        onResume={() => setRunning(true)}
        toolbar={
          <SimulationToolbar
            running={running}
            speed={speed}
            showOrbits={showOrbits}
            showLabels={showLabels}
            fullscreenSupported={fullscreen.supported}
            onToggleRunning={() => setRunning((value) => !value)}
            onReset={handleReset}
            onResetCamera={() => setResetToken((token) => token + 1)}
            onSpeedChange={setSpeed}
            onToggleOrbits={() => setShowOrbits((value) => !value)}
            onToggleLabels={() => setShowLabels((value) => !value)}
            onFullscreen={fullscreen.toggle}
          />
        }
        infoPanel={
          <Panel title="Visualization" eyebrow="Live simulation">
            <dl>
              <DataRow label="Model" value="Procedural disk" mono={false} />
              <DataRow label="Color theme" value={theme.name} mono={false} />
              <DataRow label="Disk intensity" value={settings.intensity.toFixed(2)} />
              <DataRow label="Rotation rate" value={settings.rotationSpeed.toFixed(2)} />
              <DataRow label="Particle density" value={`${Math.round(settings.particleDensity * 100)}%`} />
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              This is a visual analogy. It does not solve the equations of general relativity.
            </p>
          </Panel>
        }
        controlsPanel={
          <Panel title="Playback" eyebrow="Controls">
            <SpeedControls speed={speed} onChange={setSpeed} />
          </Panel>
        }
      />
    </div>
  );
}
