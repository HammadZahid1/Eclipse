import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '@/sim/solar/data';
import { SolarOrbitEngine, type OrbitalBodyState } from '@/sim/solar/engine';
import type { SimulationClock } from '@/sim/time';
import { StarField } from '@/components/particles/StarField';
import { RenderCanvas } from '@/components/three/RenderCanvas';
import { Star } from './Star';
import { Planet } from './Planet';
import { OrbitPath } from './OrbitPath';
import { CameraRig } from './CameraRig';

interface SolarSystemSceneProps {
  clock: SimulationClock;
  advance: (delta: number, onStep: (step: number, time: number) => void) => void;
  resetToken: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showOrbits: boolean;
  showLabels: boolean;
  focusId: string | null;
  onClearSelection: () => void;
}

function SceneContents({
  clock,
  advance,
  resetToken,
  selectedId,
  onSelect,
  showOrbits,
  showLabels,
  focusId,
}: SolarSystemSceneProps) {
  const planetGroups = useRef<Record<string, THREE.Group | null>>({});
  const states = useRef<Record<string, OrbitalBodyState>>({});
  const engine = useMemo(() => new SolarOrbitEngine(PLANETS), []);

  useFrame((_, delta) => {
    advance(delta, (_, time) => {
      engine.sampleInto(time, states.current);
      PLANETS.forEach((planet) => {
        const group = planetGroups.current[planet.id];
        const state = states.current[planet.id];
        if (!group || !state) return;
        group.position.set(state.x, state.y, state.z);
      });
    });
  });

  return (
    <>
      <CameraRig focusId={focusId} resetToken={resetToken} states={states} />
      <StarField count={900} seed="solar-system" radius={110} rotationSpeed={0.002} />
      <ambientLight intensity={0.22} />
      <Star />
      {PLANETS.map((planet) => (
        <OrbitPath
          key={`orbit-${planet.id}`}
          planet={planet}
          selected={selectedId === planet.id}
          visible={showOrbits}
        />
      ))}
      {PLANETS.map((planet) => (
        <Planet
          key={`${planet.id}-${resetToken}`}
          planet={planet}
          clock={clock}
          selected={selectedId === planet.id}
          onSelect={onSelect}
          showLabel={showLabels}
          groupRef={(node) => {
            planetGroups.current[planet.id] = node;
          }}
        />
      ))}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={2}
        maxDistance={60}
        maxPolarAngle={Math.PI * 0.92}
      />
    </>
  );
}

export function SolarSystemScene(props: SolarSystemSceneProps) {
  return (
    <RenderCanvas
      camera={{ position: [0, 11, 19], fov: 48, far: 400 }}
      onPointerMissed={props.onClearSelection}
    >
      <SceneContents {...props} />
    </RenderCanvas>
  );
}
