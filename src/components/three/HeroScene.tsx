import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '@/state/settingsStore';
import { StarField } from '@/components/particles/StarField';
import { RenderCanvas } from './RenderCanvas';

function HeroPlanet() {
  const planet = useRef<THREE.Mesh>(null);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.45, 5);
    const positions = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const displacement =
        Math.sin(x * 3.1 + y * 1.7) * 0.035 +
        Math.cos(z * 4.3 - y * 2.2) * 0.025 +
        Math.sin((x + z) * 7.4) * 0.012;
      const scale = 1 + displacement;
      positions.setXYZ(i, x * scale, y * scale, z * scale);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (planet.current && !reducedMotion) planet.current.rotation.y += delta * 0.06;
  });

  return (
    <group position={[1.35, -0.25, 0]}>
      <mesh ref={planet} geometry={geometry} castShadow>
        <meshStandardMaterial color="#1b2b50" roughness={0.82} metalness={0.16} flatShading />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[1.45, 48, 48]} />
        <meshBasicMaterial color="#5299ff" transparent opacity={0.075} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh scale={1.09}>
        <sphereGeometry args={[1.45, 48, 48]} />
        <meshBasicMaterial color="#51e4f2" transparent opacity={0.025} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GlowBody() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
      ref.current.scale.setScalar(pulse);
    }
  });
  return (
    <group position={[-3.6, 1.5, -2.4]} ref={ref}>
      <pointLight color="#51e4f2" intensity={45} distance={22} decay={2} />
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial color="#d8fbff" />
      </mesh>
      {[0.48, 0.72, 1.05].map((radius, index) => (
        <mesh key={radius}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={index === 2 ? '#5299ff' : '#51e4f2'}
            transparent
            opacity={0.12 / (index + 1)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitPath() {
  return (
    <group rotation={[-0.32, 0.25, 0.1]}>
      <mesh>
        <ringGeometry args={[4.5, 4.515, 160]} />
        <meshBasicMaterial color="#5299ff" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0.7, 0.4]}>
        <ringGeometry args={[6.1, 6.12, 160]} />
        <meshBasicMaterial color="#9b82ff" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CameraDrift() {
  useFrame((state) => {
    const reducedMotion = useSettingsStore.getState().reducedMotion;
    if (reducedMotion) return;
    const t = state.clock.elapsedTime * 0.08;
    state.camera.position.x = Math.sin(t) * 0.32;
    state.camera.position.y = 1.35 + Math.cos(t * 0.8) * 0.14;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight position={[4, 5, 5]} intensity={2.1} color="#c9dcff" />
      <pointLight position={[-5, -3, 2]} intensity={18} color="#9b82ff" distance={25} />
      <StarField count={1100} seed="eclipse-hero-stars" />
      <OrbitPath />
      <HeroPlanet />
      <GlowBody />
      <CameraDrift />
    </>
  );
}

export function HeroScene() {
  return (
    <RenderCanvas camera={{ position: [0, 1.4, 7.5], fov: 45 }}>
      <Scene />
    </RenderCanvas>
  );
}
