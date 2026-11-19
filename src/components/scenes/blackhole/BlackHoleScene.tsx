import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RenderCanvas } from '@/components/three/RenderCanvas';
import { StarField } from '@/components/particles/StarField';
import { getBlackHoleTheme, type BlackHoleSettings } from '@/sim/blackhole/config';
import type { SimulationClock } from '@/sim/time';
import { AccretionDisk } from './AccretionDisk';
import { PolarJets } from './PolarJets';
import { CameraRig, type BlackHoleView } from './CameraRig';

interface BlackHoleSceneProps {
  clock: SimulationClock;
  advance: (delta: number, onStep: (step: number, time: number) => void) => void;
  settings: BlackHoleSettings;
  resetToken: number;
  view: BlackHoleView;
}

function EventHorizon({ glow }: { glow: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.045, 16, 128]} />
        <meshBasicMaterial color={glow} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={1.35}>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SceneContents({ advance, settings, clock, resetToken, view }: BlackHoleSceneProps) {
  const theme = getBlackHoleTheme(settings.themeId);
  useFrame((_, delta) => advance(delta, () => {}));

  return (
    <>
      <CameraRig view={view} resetToken={resetToken} />
      <StarField count={700} seed="black-hole" radius={100} rotationSpeed={0.0015} />
      <ambientLight intensity={0.08} />
      <EventHorizon glow={theme.glow} />
      <AccretionDisk clock={clock} settings={settings} seed={`disk-${resetToken}`} />
      <PolarJets clock={clock} settings={settings} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.95}
      />
    </>
  );
}

export function BlackHoleScene(props: BlackHoleSceneProps) {
  return (
    <RenderCanvas camera={{ position: [0, 4.2, 10], fov: 50 }}>
      <SceneContents {...props} />
    </RenderCanvas>
  );
}
