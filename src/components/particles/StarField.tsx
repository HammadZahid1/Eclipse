import { useSettingsStore } from '@/state/settingsStore';
import { ProceduralParticles } from './ProceduralParticles';

interface StarFieldProps {
  count?: number;
  seed?: string | number;
  radius?: number;
  rotationSpeed?: number;
}

/** Ambient star backdrop, scaled by the user's particle-density preference. */
export function StarField({
  count = 1400,
  seed = 'eclipse-starfield',
  radius = 90,
  rotationSpeed = 0.003,
}: StarFieldProps) {
  const density = useSettingsStore((state) => state.particleDensity);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  return (
    <ProceduralParticles
      count={Math.round(count * density)}
      seed={seed}
      distribution="sphere-shell"
      colors={['#ffffff', '#cfe2ff', '#5299ff', '#9b82ff']}
      size={1.5}
      radius={radius}
      opacity={0.75}
      rotationSpeed={rotationSpeed}
      drifting={!reducedMotion}
    />
  );
}
