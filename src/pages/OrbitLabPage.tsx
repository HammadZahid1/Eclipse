import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Panel } from '@/components/ui/Panel';
import { DataRow } from '@/components/ui/DataRow';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationToolbar } from '@/components/simulation/SimulationToolbar';
import { SpeedControls } from '@/components/simulation/SpeedControls';
import { BodyEditor } from '@/components/simulation/BodyEditor';
import { PresetSelector } from '@/components/simulation/PresetSelector';
import { StepControls } from '@/components/simulation/StepControls';
import { OrbitLabScene } from '@/components/scenes/orbit/OrbitLabScene';
import { OrbitEngine, type OrbitEngineSnapshot } from '@/sim/orbit/engine';
import { circularOrbitVelocity, totalEnergy, totalMomentum } from '@/sim/orbit/analysis';
import { MAX_BODIES, type OrbitalBody } from '@/sim/orbit/types';
import { ORBIT_PRESETS, findPreset, type SimulationPreset } from '@/sim/presets';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSimulationShortcuts } from '@/hooks/useSimulationShortcuts';
import { useSettingsStore } from '@/state/settingsStore';
import type { SimulationSpeed } from '@/lib/constants';

const INITIAL_PRESET = ORBIT_PRESETS[0];
const STEP_SIZE = 0.25;
const SNAPSHOT_INTERVAL = 0.5;
const HISTORY_LIMIT = 80;

export default function OrbitLabPage() {
  const defaultSpeed = useSettingsStore((state) => state.defaultSpeed);
  const engineRef = useRef<OrbitEngine | null>(null);
  if (!engineRef.current) engineRef.current = new OrbitEngine(INITIAL_PRESET.create());
  const engine = engineRef.current;
  const historyRef = useRef<OrbitEngineSnapshot[]>([]);
  const lastRecordedTimeRef = useRef(0);
  if (historyRef.current.length === 0) historyRef.current.push(engine.capture());

  const [version, setVersion] = useState(0);
  const [activePresetId, setActivePresetId] = useState<string | null>(INITIAL_PRESET.id);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_PRESET.create()[1]?.id ?? null);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<SimulationSpeed>(defaultSpeed);
  const [showTrails, setShowTrails] = useState(true);
  const [displayTime, setDisplayTime] = useState(0);
  const sceneRef = useRef<HTMLElement>(null);
  const fullscreen = useFullscreen(sceneRef);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDisplayTime(engine.time);
      if (engine.time - lastRecordedTimeRef.current >= SNAPSHOT_INTERVAL) {
        historyRef.current.push(engine.capture());
        if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
        lastRecordedTimeRef.current = engine.time;
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [engine]);

  const selected = engine.bodies.find((body) => body.id === selectedId) ?? null;
  const energy = totalEnergy(engine.bodies, engine.gravitationalConstant, engine.softening);
  const momentum = totalMomentum(engine.bodies);
  const momentumMagnitude = Math.hypot(...momentum);

  const resetHistory = () => {
    historyRef.current = [engine.capture()];
    lastRecordedTimeRef.current = engine.time;
  };

  const handleReset = () => {
    const bodies = findPreset(ORBIT_PRESETS, activePresetId).create();
    engine.reset(bodies);
    resetHistory();
    setSelectedId(bodies[1]?.id ?? bodies[0]?.id ?? null);
    setVersion((value) => value + 1);
    setDisplayTime(0);
    setRunning(true);
  };

  const applyPreset = (preset: SimulationPreset<OrbitalBody[]>) => {
    const bodies = preset.create();
    engine.reset(bodies);
    resetHistory();
    setActivePresetId(preset.id);
    setSelectedId(bodies[1]?.id ?? bodies[0]?.id ?? null);
    setVersion((value) => value + 1);
    setDisplayTime(0);
    setRunning(true);
  };

  const addBody = () => {
    const index = engine.bodies.length;
    const angle = (index / MAX_BODIES) * Math.PI * 2;
    const radius = 4 + (index % 3) * 3;
    const colors = ['#51e4f2', '#9b82ff', '#ffb36b', '#ff7a92', '#a7e8a0'];
    const body: OrbitalBody = {
      id: `body-${Date.now()}`,
      name: `Body ${index + 1}`,
      mass: 2,
      radius: 0.28,
      position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
      velocity: [-Math.sin(angle) * circularOrbitVelocity(240, radius), 0, Math.cos(angle) * circularOrbitVelocity(240, radius)],
      color: colors[index % colors.length],
    };
    if (engine.add(body)) {
      setActivePresetId(null);
      setSelectedId(body.id);
      setVersion((value) => value + 1);
    }
  };

  const step = (direction: -1 | 1) => {
    setRunning(false);
    if (direction === 1) {
      historyRef.current.push(engine.capture());
      if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
      engine.step(STEP_SIZE);
      lastRecordedTimeRef.current = engine.time;
    } else {
      const snapshot = historyRef.current.pop();
      if (!snapshot) return;
      engine.restore(snapshot);
      lastRecordedTimeRef.current = engine.time;
      setVersion((value) => value + 1);
    }
    setDisplayTime(engine.time);
  };

  useSimulationShortcuts({
    onToggleRunning: () => setRunning((value) => !value),
    onReset: handleReset,
    onSpeedChange: setSpeed,
    onStep: step,
    onFullscreen: fullscreen.toggle,
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-8">
        <PageHeader
          eyebrow="Module 04 / Orbital mechanics"
          title="Orbit Lab"
          description="Experiment with a simplified Newtonian system. Configure bodies, edit their initial conditions, and observe the resulting trajectories."
        />
      </div>
      <SimulationLayout
        className="min-h-0 flex-1"
        sceneRef={sceneRef}
        scene={
          <OrbitLabScene
            engine={engine}
            version={version}
            running={running}
            speed={speed}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showTrails={showTrails}
          />
        }
        status={{ running, time: displayTime, speed, detail: `${engine.bodies.length} bodies · simplified gravity` }}
        onResume={() => setRunning(true)}
        toolbar={
          <SimulationToolbar
            running={running}
            speed={speed}
            showOrbits={showTrails}
            showLabels
            fullscreenSupported={fullscreen.supported}
            isFullscreen={fullscreen.isFullscreen}
            onToggleRunning={() => setRunning((value) => !value)}
            onReset={handleReset}
            onResetCamera={() => setVersion((value) => value + 1)}
            onSpeedChange={setSpeed}
            onToggleOrbits={() => setShowTrails((value) => !value)}
            onToggleLabels={() => {}}
            onFullscreen={fullscreen.toggle}
          />
        }
        infoPanel={
          <Panel title={selected ? selected.name : 'System overview'} eyebrow="Live simulation">
            <dl>
              <DataRow label="Bodies" value={engine.bodies.length} />
              <DataRow label="Simulation time" value={displayTime.toFixed(2)} />
              {selected && (
                <>
                  <DataRow label="Mass" value={selected.mass.toFixed(1)} />
                  <DataRow label="Radius" value={selected.radius.toFixed(2)} />
                  <DataRow label="Position" value={selected.position.map((v) => v.toFixed(1)).join(', ')} />
                  <DataRow label="Velocity" value={selected.velocity.map((v) => v.toFixed(1)).join(', ')} />
                </>
              )}
              <DataRow label="Total energy" value={energy.toFixed(1)} />
              <DataRow label="Net momentum" value={momentumMagnitude.toFixed(2)} />
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              Softened Newtonian gravity with Velocity Verlet integration. Not a complete physical model.
            </p>
          </Panel>
        }
        controlsPanel={
          <Panel title="Presets & bodies" eyebrow="Configuration">
            <PresetSelector
              label="Starting configuration"
              presets={ORBIT_PRESETS}
              activeId={activePresetId}
              onApply={applyPreset}
            />
            <div className="my-5 border-t border-white/8" />
            <SpeedControls speed={speed} onChange={setSpeed} />
            <div className="my-5 border-t border-white/8" />
            <StepControls
              stepSize={STEP_SIZE}
              canStepBack={historyRef.current.length > 0}
              onStep={step}
            />
            <div className="my-5 border-t border-white/8" />
            <BodyEditor
              engine={engine}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAdd={addBody}
              onChange={() => {
                setActivePresetId(null);
                setVersion((value) => value + 1);
              }}
            />
          </Panel>
        }
      />
    </div>
  );
}
