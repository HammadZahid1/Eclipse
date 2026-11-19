import { useMemo } from 'react';
import * as THREE from 'three';
import type { PlanetConfig } from '@/sim/solar/data';

interface OrbitPathProps {
  planet: PlanetConfig;
  selected?: boolean;
  visible?: boolean;
}

/** Thin, subtle orbital guide generated from the planet's simulation radius. */
export function OrbitPath({ planet, selected = false, visible = true }: OrbitPathProps) {
  const geometry = useMemo(() => {
    const segments = 160;
    const points: number[] = [];
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        Math.cos(angle) * planet.orbitRadius,
        Math.sin(angle * 0.6) * (planet.inclination ?? 0) * planet.orbitRadius,
        Math.sin(angle) * planet.orbitRadius,
      );
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return result;
  }, [planet.inclination, planet.orbitRadius]);

  if (!visible) return null;

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        color={selected ? '#51e4f2' : '#5299ff'}
        transparent
        opacity={selected ? 0.65 : 0.16}
        depthWrite={false}
      />
    </lineLoop>
  );
}
