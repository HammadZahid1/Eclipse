import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '@/sim/solar/data';
import { planetPosition } from '@/sim/solar/orbital';
import { StarField } from '@/components/particles/StarField';
import { RenderCanvas } from '@/components/three/RenderCanvas';

interface SolarSystemSceneProps {
  advance: (delta: number, onStep: (step: number, time: number) => void) => void;
  resetToken: number;
}

function SceneContents({ advance, resetToken }: SolarSystemSceneProps) {
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
      <pointLight position={[0, 0, 0]} intensity={90} distance={45} decay={2} color="#ffd8b0" />
      <mesh>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshBasicMaterial color="#ffd8a8" />
      </mesh>
      {PLANETS.map((planet) => (
        <group
          key={`${planet.id}-${resetToken}`}
          ref={(node) => {
            planetGroups.current[planet.id] = node;
          }}
        >
          <mesh>
            <sphereGeometry args={[planet.radius, 32, 32]} />
            <meshStandardMaterial color={planet.color} roughness={0.85} metalness={0.08} />
          </mesh>
        </group>
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
