import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRandom } from '@/lib/random';
import { generateAccretionDisk } from '@/sim/blackhole/disk';
import { getBlackHoleTheme, type BlackHoleSettings } from '@/sim/blackhole/config';
import type { SimulationClock } from '@/sim/time';

const vertexShader = /* glsl */ `
  attribute float aRadius;
  attribute float aHeight;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aMix;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uRotation;
  uniform float uIntensity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float angle = aPhase + uTime * aSpeed * uRotation;
    vec3 animated = vec3(cos(angle) * aRadius, aHeight, sin(angle) * aRadius);
    vec4 mvPosition = modelViewMatrix * vec4(animated, 1.0);
    gl_PointSize = aSize * uIntensity * (150.0 / max(-mvPosition.z, 0.1));
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    vAlpha = mix(1.0, 0.35, aMix) * uIntensity;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(vColor, soft * min(vAlpha, 1.0));
  }
`;

interface AccretionDiskProps {
  clock: SimulationClock;
  settings: BlackHoleSettings;
  seed: string;
}

export function AccretionDisk({ clock, settings, seed }: AccretionDiskProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const theme = getBlackHoleTheme(settings.themeId);
  const count = Math.round(14000 * settings.particleDensity);

  const geometry = useMemo(() => {
    const random = createRandom(seed);
    const data = generateAccretionDisk({ count, random });
    const inner = new THREE.Color(theme.inner);
    const middle = new THREE.Color(theme.middle);
    const outer = new THREE.Color(theme.outer);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const mix = data.mixes[i];
      const color = mix < 0.5
        ? inner.clone().lerp(middle, mix * 2)
        : middle.clone().lerp(outer, (mix - 0.5) * 2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    result.setAttribute('aRadius', new THREE.BufferAttribute(data.radii, 1));
    result.setAttribute('aHeight', new THREE.BufferAttribute(data.heights, 1));
    result.setAttribute('aPhase', new THREE.BufferAttribute(data.phases, 1));
    result.setAttribute('aSpeed', new THREE.BufferAttribute(data.speeds, 1));
    result.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    result.setAttribute('aMix', new THREE.BufferAttribute(data.mixes, 1));
    result.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    return result;
  }, [count, seed, theme.inner, theme.middle, theme.outer]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRotation: { value: settings.rotationSpeed },
      uIntensity: { value: settings.intensity },
    }),
    [],
  );

  useFrame(() => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.time;
    material.current.uniforms.uRotation.value = settings.rotationSpeed;
    material.current.uniforms.uIntensity.value = settings.intensity;
  });

  return (
    <points geometry={geometry} frustumCulled={false} rotation={[-Math.PI / 2 + 0.16, 0, 0]}>
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
