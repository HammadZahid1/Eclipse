import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRandom } from '@/lib/random';
import type { SimulationClock } from '@/sim/time';
import { getBlackHoleTheme, type BlackHoleSettings } from '@/sim/blackhole/config';

const vertexShader = /* glsl */ `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aRadius;
  attribute float aPhase;
  uniform float uTime;
  uniform float uLength;
  uniform float uIntensity;
  varying float vAlpha;
  varying vec3 vColor;
  uniform vec3 uColor;

  void main() {
    float travel = mod(aOffset + uTime * aSpeed, 1.0);
    float side = aPhase < 3.14159 ? 1.0 : -1.0;
    float y = travel * uLength * side;
    float spread = aRadius * (0.25 + travel * 1.6);
    vec3 animated = vec3(cos(aPhase) * spread, y, sin(aPhase) * spread);
    vec4 mvPosition = modelViewMatrix * vec4(animated, 1.0);
    gl_PointSize = (1.6 + travel * 2.4) * (120.0 / max(-mvPosition.z, 0.1));
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = (1.0 - travel) * 0.55 * uIntensity;
    vColor = uColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, (1.0 - smoothstep(0.0, 0.5, d)) * vAlpha);
  }
`;

/** Small, purely decorative jets used to frame the visual simulation. */
export function PolarJets({ clock, settings }: { clock: SimulationClock; settings: BlackHoleSettings }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const theme = getBlackHoleTheme(settings.themeId);
  const count = Math.round(1200 * settings.particleDensity);

  const geometry = useMemo(() => {
    const random = createRandom('polar-jets');
    const offsets = new Float32Array(count);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      offsets[i] = random();
      speeds[i] = 0.08 + random() * 0.12;
      radii[i] = 0.05 + random() * 0.28;
      phases[i] = random() * Math.PI * 2;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    result.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    result.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    result.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    result.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return result;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLength: { value: 7 },
      uIntensity: { value: settings.intensity },
      uColor: { value: new THREE.Color(theme.inner) },
    }),
    [],
  );

  useFrame(() => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.time;
    material.current.uniforms.uIntensity.value = settings.intensity * 0.8;
    material.current.uniforms.uColor.value.set(theme.inner);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
