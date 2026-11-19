import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type BlackHoleView = 'overview' | 'edge' | 'top';

const VIEW_POSITIONS: Record<BlackHoleView, THREE.Vector3> = {
  overview: new THREE.Vector3(0, 4.2, 10),
  edge: new THREE.Vector3(0, 0.8, 11.5),
  top: new THREE.Vector3(0, 11, 0.01),
};

interface OrbitControlsLike {
  target: THREE.Vector3;
  update: () => void;
}

export function CameraRig({ view, resetToken }: { view: BlackHoleView; resetToken: number }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsLike | null;
  const animatingUntil = useRef(0);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    animatingUntil.current = performance.now() + 1400;
    desired.copy(VIEW_POSITIONS[view]);
  }, [desired, view]);

  useEffect(() => {
    camera.position.copy(VIEW_POSITIONS[view]);
    controls?.target.set(0, 0, 0);
    controls?.update();
  }, [camera, controls, resetToken, view]);

  useFrame((_, delta) => {
    if (performance.now() > animatingUntil.current) return;
    camera.position.lerp(desired, 1 - Math.exp(-delta * 3));
    if (controls) {
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 1 - Math.exp(-delta * 3));
      controls.update();
    } else {
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}
