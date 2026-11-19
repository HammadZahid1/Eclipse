import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANETS } from '@/sim/solar/data';
import type { OrbitalBodyState } from '@/sim/solar/engine';

interface CameraRigProps {
  focusId: string | null;
  resetToken: number;
  states: React.RefObject<Record<string, OrbitalBodyState>>;
}

const DEFAULT_POSITION = new THREE.Vector3(0, 11, 19);

interface OrbitControlsLike {
  target: THREE.Vector3;
  update: () => void;
}

/** Smoothly focuses the camera on a selected body and restores the overview. */
export function CameraRig({ focusId, resetToken, states }: CameraRigProps) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsLike | null;
  const returnUntil = useRef(0);
  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const tempDesired = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!focusId) returnUntil.current = performance.now() + 1600;
  }, [focusId]);

  useEffect(() => {
    camera.position.copy(DEFAULT_POSITION);
    controls?.target.set(0, 0, 0);
    controls?.update();
  }, [camera, controls, resetToken]);

  useFrame((_, delta) => {
    const smoothing = 1 - Math.exp(-delta * 2.6);
    const focusedPlanet = PLANETS.find((planet) => planet.id === focusId);

    if (focusedPlanet) {
      const body = states.current[focusId!];
      if (!body) return;
      tempTarget.set(body.x, body.y, body.z);
      const distance = Math.max(focusedPlanet.radius * 5.5, 2.2);
      tempDesired.set(
        tempTarget.x + distance,
        tempTarget.y + distance * 0.45,
        tempTarget.z + distance,
      );
    } else if (performance.now() < returnUntil.current) {
      tempTarget.set(0, 0, 0);
      tempDesired.copy(DEFAULT_POSITION);
    } else {
      return;
    }

    camera.position.lerp(tempDesired, smoothing);
    if (controls) {
      controls.target.lerp(tempTarget, smoothing);
      controls.update();
    } else {
      camera.lookAt(tempTarget);
    }
  });

  return null;
}
