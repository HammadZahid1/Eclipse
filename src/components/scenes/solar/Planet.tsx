import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRandom } from '@/lib/random';
import { planetRotation } from '@/sim/solar/orbital';
import type { PlanetConfig } from '@/sim/solar/data';
import type { SimulationClock } from '@/sim/time';

/** Builds a small procedural surface texture; no external image assets. */
function usePlanetTexture(planet: PlanetConfig) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return null;
    const random = createRandom(`surface-${planet.id}`);
    const base = new THREE.Color(planet.color);
    context.fillStyle = `#${base.getHexString()}`;
    context.fillRect(0, 0, 256, 128);

    const banded = planet.orbitRadius > 7;
    const blotches = banded ? 26 : 42;
    for (let i = 0; i < blotches; i += 1) {
      const shade = 0.65 + random() * 0.7;
      const color = base.clone().multiplyScalar(shade);
      context.fillStyle = `rgba(${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)},${banded ? 0.5 : 0.32})`;
      const width = banded ? 256 : 12 + random() * 40;
      const height = banded ? 2 + random() * 6 : 8 + random() * 22;
      context.beginPath();
      context.ellipse(random() * 256, random() * 128, width / 2, height / 2, 0, 0, Math.PI * 2);
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }, [planet.color, planet.id, planet.orbitRadius]);
}

interface PlanetProps {
  planet: PlanetConfig;
  clock: SimulationClock;
  groupRef: (node: THREE.Group | null) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function Planet({ planet, clock, groupRef, selected = false, onSelect }: PlanetProps) {
  const surface = useRef<THREE.Mesh>(null);
  const texture = usePlanetTexture(planet);

  useFrame(() => {
    if (surface.current) surface.current.rotation.y = planetRotation(planet, clock.time);
  });

  return (
    <group ref={groupRef}>
      <group
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(planet.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh ref={surface}>
          <sphereGeometry args={[planet.radius, 40, 40]} />
          <meshStandardMaterial
            color={texture ? '#ffffff' : planet.color}
            map={texture}
            roughness={0.88}
            metalness={0.05}
          />
        </mesh>

        {planet.atmosphere && (
          <mesh scale={1.07}>
            <sphereGeometry args={[planet.radius, 32, 32]} />
            <meshBasicMaterial
              color={planet.atmosphere.color}
              transparent
              opacity={planet.atmosphere.intensity}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {planet.ring && (
          <mesh rotation={[-Math.PI / 2 + planet.ring.tilt, 0, 0]}>
            <ringGeometry args={[planet.radius * planet.ring.innerRadius, planet.radius * planet.ring.outerRadius, 96]} />
            <meshBasicMaterial
              color={planet.ring.color}
              transparent
              opacity={planet.ring.opacity}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {selected && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.22, 24, 24]} />
          <meshBasicMaterial color="#51e4f2" wireframe transparent opacity={0.22} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
