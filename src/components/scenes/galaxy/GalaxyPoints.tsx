import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GalaxyData } from '@/sim/galaxy/types';

const vertexShader = /* glsl */ `
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (180.0 / max(-mvPosition.z, 0.1));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(vColor, soft * 0.85);
  }
`;

interface GalaxyPointsProps {
  data: GalaxyData;
  rotating: boolean;
  speed: number;
}

export function GalaxyPoints({ data, rotating, speed }: GalaxyPointsProps) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    result.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    result.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    return result;
  }, [data]);

  useFrame((_, delta) => {
    if (group.current && rotating) group.current.rotation.y += delta * speed * 0.06;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </group>
  );
}
