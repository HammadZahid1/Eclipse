import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSettingsStore } from '@/state/settingsStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RenderCanvasProps {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  className?: string;
  /** Pauses the render loop when the simulation is stopped. */
  paused?: boolean;
}

const dprByQuality = {
  low: 1,
  medium: [1, 1.5] as [number, number],
  high: [1, 2] as [number, number],
};

/** Shared WebGL canvas configuration for every ECLIPSE scene. */
export function RenderCanvas({
  children,
  camera = { position: [0, 1.5, 7], fov: 45, near: 0.1, far: 400 },
  className = '',
  paused = false,
}: RenderCanvasProps) {
  const renderQuality = useSettingsStore((state) => state.renderQuality);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion) || useReducedMotion();

  return (
    <Canvas
      className={className}
      dpr={dprByQuality[renderQuality]}
      frameloop={paused && reducedMotion ? 'demand' : 'always'}
      camera={camera}
      gl={{ antialias: renderQuality !== 'low', powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => gl.setClearColor('#03040A', 1)}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
