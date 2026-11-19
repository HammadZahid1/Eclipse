import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitEngine } from '@/sim/orbit/engine';

const TRAIL_LENGTH = 240;
const SAMPLE_INTERVAL = 0.035;

function Trail({ engine, id, color }: { engine: OrbitEngine; id: string; color: string }) {
  const points = useMemo(() => new Float32Array(TRAIL_LENGTH * 3), []);
  const history = useRef({ count: 0, lastSample: -Infinity });

  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(points, 3).setUsage(THREE.DynamicDrawUsage));
    result.setDrawRange(0, 0);
    return result;
  }, [points]);

  const line = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, depthWrite: false });
    const object = new THREE.Line(geometry, material);
    object.frustumCulled = false;
    return object;
  }, [color, geometry]);

  useEffect(() => {
    history.current = { count: 0, lastSample: -Infinity };
    geometry.setDrawRange(0, 0);
  }, [geometry, id]);

  useEffect(
    () => () => {
      geometry.dispose();
      (line.material as THREE.Material).dispose();
    },
    [geometry, line],
  );

  useFrame(() => {
    const body = engine.bodies.find((item) => item.id === id);
    if (!body || engine.time - history.current.lastSample < SAMPLE_INTERVAL) return;
    history.current.lastSample = engine.time;

    if (history.current.count === TRAIL_LENGTH) {
      points.copyWithin(0, 3);
      history.current.count -= 1;
    }
    const index = history.current.count * 3;
    points[index] = body.position[0];
    points[index + 1] = body.position[1];
    points[index + 2] = body.position[2];
    history.current.count += 1;

    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    geometry.setDrawRange(0, history.current.count);
  });

  return <primitive object={line} />;
}

/** Per-body trajectory history, stored in reusable typed arrays. */
export function Trajectories({
  engine,
  version,
  visible,
}: {
  engine: OrbitEngine;
  version: number;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <group>
      {engine.bodies.map((body) => (
        <Trail key={`${body.id}-${version}`} engine={engine} id={body.id} color={body.color} />
      ))}
    </group>
  );
}
