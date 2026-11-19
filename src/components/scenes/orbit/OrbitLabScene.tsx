import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StarField } from '@/components/particles/StarField';
import { RenderCanvas } from '@/components/three/RenderCanvas';
import type { OrbitEngine } from '@/sim/orbit/engine';
import { integrateSystem } from '@/sim/orbit/integration';
import type { OrbitalBody } from '@/sim/orbit/types';

interface OrbitLabSceneProps {
  engine: OrbitEngine;
  version: number;
  running: boolean;
  speed: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function BodyMesh({
  body,
  selected,
  onSelect,
  register,
}: {
  body: OrbitalBody;
  selected: boolean;
  onSelect: (id: string) => void;
  register: (id: string, node: THREE.Mesh | null) => void;
}) {
  return (
    <group>
      <mesh
        ref={(node) => register(body.id, node)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[body.radius, 32, 32]} />
        <meshStandardMaterial
          color={body.color}
          emissive={body.color}
          emissiveIntensity={selected ? 0.5 : 0.18}
          roughness={0.6}
        />
      </mesh>
      {selected && (
        <mesh>
          <sphereGeometry args={[body.radius * 1.3, 20, 20]} />
          <meshBasicMaterial color="#51e4f2" wireframe transparent opacity={0.35} depthWrite={false} />
        </mesh>
      )}
      <Html
        position={[0, body.radius + 0.35, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="whitespace-nowrap rounded border border-white/10 bg-void/70 px-2 py-1 text-[10px] text-muted backdrop-blur-sm">
          {body.name.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

function SceneContents({ engine, version, running, speed, selectedId, onSelect }: OrbitLabSceneProps) {
  const meshes = useRef<Record<string, THREE.Mesh | null>>({});

  useFrame((_, delta) => {
    if (running) integrateSystem(engine, delta, speed);
    for (const body of engine.bodies) {
      const mesh = meshes.current[body.id];
      if (mesh) mesh.position.set(...body.position);
    }
  });

  return (
    <>
      <StarField count={600} seed="orbit-lab" radius={100} rotationSpeed={0.001} />
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 8, 6]} intensity={60} distance={40} />
      {engine.bodies.map((body) => (
        <BodyMesh
          key={`${body.id}-${version}`}
          body={body}
          selected={selectedId === body.id}
          onSelect={onSelect}
          register={(id, node) => {
            meshes.current[id] = node;
          }}
        />
      ))}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={80}
        maxPolarAngle={Math.PI * 0.95}
      />
    </>
  );
}

export function OrbitLabScene(props: OrbitLabSceneProps) {
  return (
    <RenderCanvas
      camera={{ position: [0, 10, 18], fov: 48, far: 400 }}
      onPointerMissed={() => props.onSelect(null)}
    >
      <SceneContents {...props} />
    </RenderCanvas>
  );
}
