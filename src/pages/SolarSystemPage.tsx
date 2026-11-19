import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { SolarSystemScene } from '@/components/scenes/solar/SolarSystemScene';
import { useSimulationClock } from '@/hooks/useSimulationClock';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSettingsStore } from '@/state/settingsStore';
import { PLANETS, SOLAR_SYSTEM_BOUNDS } from '@/sim/solar/data';
import type { SimulationSpeed } from '@/lib/constants';

export default function SolarSystemPage() {
  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(defaultSpeed);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { advance, reset, displayTime, timeRef } = useSimulationClock({ running, speed });
  const fullscreen = useFullscreen();

  const handleReset = () => {
    reset();
    setResetToken((token) => token + 1);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-8">
        <PageHeader
          eyebrow="Module 01 / Orbital visualization"
          title="Solar System"
          description="A configurable, simplified planetary system. Drag to orbit the camera, scroll to zoom, and select a world to inspect its simulated parameters."
        />
      </div>
      <SimulationLayout
        className="min-h-0 flex-1"
        scene={
          <SolarSystemScene
            clock={timeRef.current}
            advance={advance}
            resetToken={resetToken}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showOrbits={showOrbits}
          />
        }
        status={{ running, time: displayTime, speed, detail: `${PLANETS.length} simulated bodies` }}
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
          <Panel title="System overview" eyebrow="Live simulation">
            <dl>
              <DataRow label="Bodies" value={PLANETS.length + 1} />
              <DataRow label="Planets" value={PLANETS.length} />
              <DataRow label="Orbit range" value={`${SOLAR_SYSTEM_BOUNDS.min} – ${SOLAR_SYSTEM_BOUNDS.max} u`} />
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              Distances and rates are abstract simulation units chosen for legibility.
            </p>
          </Panel>
        }
        controlsPanel={
          <Panel title="Navigation" eyebrow="Controls">
            <ul className="space-y-2 text-xs leading-relaxed text-muted">
              <li>Drag — orbit the camera</li>
              <li>Scroll / pinch — zoom</li>
              <li>Right-drag — pan</li>
              <li>Toolbar — playback, speed and views</li>
            </ul>
          </Panel>
        }
      />
    </div>
  );
}
