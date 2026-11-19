import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '@/state/settingsStore';
import { SOLAR_STAR } from '@/sim/solar/data';

const surfaceVertex = /* glsl */ `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const surfaceFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vPosition;

  void main() {
    vec3 p = normalize(vPosition);
    float turbulence =
      sin(p.x * 7.0 + uTime * 0.8) * sin(p.y * 6.0 - uTime * 0.5) +
      sin(p.z * 9.0 + uTime * 0.35) * 0.5;
    float value = clamp(0.62 + turbulence * 0.22, 0.0, 1.0);
    vec3 hot = mix(uColor, vec3(1.0, 0.98, 0.86), value);
    gl_FragColor = vec4(hot, 1.0);
  }
`;

/** Creates a soft radial glow texture locally — no external image assets. */
function useGlowTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255,246,220,0.95)');
      gradient.addColorStop(0.18, 'rgba(255,190,110,0.55)');
      gradient.addColorStop(0.5, 'rgba(82,153,255,0.16)');
      gradient.addColorStop(1, 'rgba(82,153,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

export function Star() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const corona = useRef<THREE.Group>(null);
  const glowTexture = useGlowTexture();
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(SOLAR_STAR.color) },
    }),
    [],
  );

  useFrame((state) => {
    if (material.current && !reducedMotion) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (corona.current && !reducedMotion) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.018;
      corona.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <pointLight intensity={95} distance={48} decay={2} color="#ffd6a8" />
      <mesh>
        <sphereGeometry args={[SOLAR_STAR.radius, 64, 64]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={surfaceVertex}
          fragmentShader={surfaceFragment}
        />
      </mesh>
      <group ref={corona}>
        <sprite scale={[SOLAR_STAR.radius * 7, SOLAR_STAR.radius * 7, 1]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
        <mesh scale={1.08}>
          <sphereGeometry args={[SOLAR_STAR.radius, 32, 32]} />
          <meshBasicMaterial
            color="#ffbf6b"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
