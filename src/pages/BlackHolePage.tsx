import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { SpeedControls } from '@/components/simulation/SpeedControls';
import { BlackHoleScene } from '@/components/scenes/blackhole/BlackHoleScene';
import type { BlackHoleView } from '@/components/scenes/blackhole/CameraRig';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RangeControl } from '@/components/ui/RangeControl';
import { ThemeSelector } from '@/components/simulation/ThemeSelector';
import { PresetSelector } from '@/components/simulation/PresetSelector';
import {
  BLACK_HOLE_THEMES,
  DEFAULT_BLACK_HOLE_SETTINGS,
  clampBlackHoleSettings,
  getBlackHoleTheme,
  type BlackHoleSettings,
} from '@/sim/blackhole/config';
import { BLACK_HOLE_PRESETS, type SimulationPreset } from '@/sim/presets';
import { useSimulationClock } from '@/hooks/useSimulationClock';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSettingsStore } from '@/state/settingsStore';
import type { SimulationSpeed } from '@/lib/constants';

export default function BlackHolePage() {
  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(defaultSpeed);
  const [showOrbits, setShowOrbits] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [view, setView] = useState<BlackHoleView>('overview');
  const [settings, setSettings] = useState<BlackHoleSettings>(DEFAULT_BLACK_HOLE_SETTINGS);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const { advance, reset, displayTime, timeRef } = useSimulationClock({ running, speed });
  const fullscreen = useFullscreen();
  const theme = getBlackHoleTheme(settings.themeId);

  const updateSettings = (patch: Partial<BlackHoleSettings>) => {
    setActivePresetId(null);
    setSettings((current) => clampBlackHoleSettings({ ...current, ...patch }));
  };

  const applyPreset = (preset: SimulationPreset<BlackHoleSettings>) => {
    setSettings(preset.create());
    setActivePresetId(preset.id);
    setResetToken((token) => token + 1);
    setRunning(true);
  };

  const handleReset = () => {
    reset();
    setSettings(DEFAULT_BLACK_HOLE_SETTINGS);
    setActivePresetId(null);
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
            view={view}
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
          <Panel title="Presets, playback & camera" eyebrow="Controls">
            <PresetSelector
              label="Disk preset"
              presets={BLACK_HOLE_PRESETS}
              activeId={activePresetId}
              onApply={applyPreset}
            />
            <div className="my-5 border-t border-white/8" />
            <SpeedControls speed={speed} onChange={setSpeed} />
            <div className="my-5 border-t border-white/8" />
            <RangeControl
              label="Disk intensity"
              value={settings.intensity}
              min={0.2}
              max={2}
              step={0.05}
              format={(value) => `${value.toFixed(2)}x`}
              onChange={(intensity) => updateSettings({ intensity })}
            />
            <div className="my-5" />
            <RangeControl
              label="Particle density"
              value={settings.particleDensity}
              min={0.25}
              max={2}
              step={0.05}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={(particleDensity) => updateSettings({ particleDensity })}
              hint="Regenerates the disk with more or fewer particles."
            />
            <div className="my-5" />
            <RangeControl
              label="Disk rotation"
              value={settings.rotationSpeed}
              min={0}
              max={2}
              step={0.05}
              format={(value) => `${value.toFixed(2)} rad/t`}
              onChange={(rotationSpeed) => updateSettings({ rotationSpeed })}
            />
            <div className="my-5 border-t border-white/8" />
            <ThemeSelector
              label="Color theme"
              themes={BLACK_HOLE_THEMES.map((item) => ({
                id: item.id,
                name: item.name,
                colors: [item.inner, item.middle, item.outer],
              }))}
              value={settings.themeId}
              onChange={(themeId) => updateSettings({ themeId })}
            />
            <div className="my-5 border-t border-white/8" />
            <SegmentedControl
              label="Camera preset"
              value={view}
              onChange={setView}
              options={[
                { value: 'overview', label: 'Overview' },
                { value: 'edge', label: 'Edge-on' },
                { value: 'top', label: 'Top-down' },
              ]}
            />
          </Panel>
        }
      />
    </div>
  );
}
