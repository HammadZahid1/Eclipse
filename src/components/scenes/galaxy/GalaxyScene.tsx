import { OrbitControls } from '@react-three/drei';
import { RenderCanvas } from '@/components/three/RenderCanvas';
import { StarField } from '@/components/particles/StarField';
import type { GalaxyData } from '@/sim/galaxy/types';
import { GalaxyPoints } from './GalaxyPoints';

interface GalaxySceneProps {
  data: GalaxyData;
  rotating: boolean;
  speed: number;
}

function SceneContents({ data, rotating, speed }: GalaxySceneProps) {
  return (
    <>
      <StarField count={400} seed="galaxy-backdrop" radius={130} rotationSpeed={0.001} />
      <GalaxyPoints data={data} rotating={rotating} speed={speed} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={4}
        maxDistance={80}
        maxPolarAngle={Math.PI * 0.95}
      />
    </>
  );
}

export function GalaxyScene(props: GalaxySceneProps) {
  return (
    <RenderCanvas camera={{ position: [0, 9, 20], fov: 48, far: 500 }}>
      <SceneContents {...props} />
    </RenderCanvas>
  );
}
