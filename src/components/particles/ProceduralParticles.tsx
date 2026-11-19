import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRandom } from '@/lib/random';
import { createParticleField, type ParticleDistribution } from '@/sim/particles/distributions';

const vertexShader = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vAlpha = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (260.0 / max(-mvPosition.z, 0.1));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.1, 0.5, d);
    gl_FragColor = vec4(vColor, soft * vAlpha * uOpacity);
  }
`;

interface ProceduralParticlesProps {
  count: number;
  seed: string | number;
  distribution: ParticleDistribution;
  colors: readonly string[];
  size?: number;
  radius?: number;
  spread?: number;
  opacity?: number;
  rotationSpeed?: number;
  drifting?: boolean;
  /** Freezes shader-time animation while keeping the particle field visible. */
  animate?: boolean;
}

/** Buffer-based particle field with GPU-side twinkle and group-level rotation. */
export function ProceduralParticles({
  count,
  seed,
  distribution,
  colors,
  size = 1.2,
  radius = 40,
  spread = 0.5,
  opacity = 0.85,
  rotationSpeed = 0.01,
  drifting = true,
  animate = true,
}: ProceduralParticlesProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const random = createRandom(seed);
    const { positions, phases } = createParticleField({ count, seed: random, distribution, radius, spread });
    const palette = colors.map((color) => new THREE.Color(color));
    const colorArray = new Float32Array(positions.length);
    for (let i = 0; i < phases.length; i += 1) {
      const color = palette[Math.floor(random() * palette.length)] ?? new THREE.Color('#ffffff');
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    result.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return result;
  }, [colors, count, distribution, radius, seed, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uOpacity: { value: opacity },
    }),
    [opacity, size],
  );

  useFrame((state, delta) => {
    if (material.current && animate) material.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current && drifting) group.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
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
