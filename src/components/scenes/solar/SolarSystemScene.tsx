import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '@/sim/solar/data';
import { planetPosition } from '@/sim/solar/orbital';
import type { SimulationClock } from '@/sim/time';
import { StarField } from '@/components/particles/StarField';
import { RenderCanvas } from '@/components/three/RenderCanvas';
import { Star } from './Star';
import { Planet } from './Planet';
import { OrbitPath } from './OrbitPath';

interface SolarSystemSceneProps {
  clock: SimulationClock;
  advance: (delta: number, onStep: (step: number, time: number) => void) => void;
  resetToken: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showOrbits: boolean;
}

function SceneContents({
  clock,
  advance,
  resetToken,
  selectedId,
  onSelect,
  showOrbits,
}: SolarSystemSceneProps) {
  const planetGroups = useRef<Record<string, THREE.Group | null>>({});

  useFrame((_, delta) => {
    advance(delta, (_, time) => {
      PLANETS.forEach((planet) => {
        const group = planetGroups.current[planet.id];
        if (!group) return;
        const [x, y, z] = planetPosition(planet, time);
        group.position.set(x, y, z);
      });
    });
  });

  return (
    <>
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
    <RenderCanvas camera={{ position: [0, 11, 19], fov: 48, far: 400 }}>
      <SceneContents {...props} />
    </RenderCanvas>
  );
}
