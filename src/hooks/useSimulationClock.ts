import { useCallback, useRef, useState } from 'react';
import { SimulationClock } from '@/sim/time';

interface ClockOptions {
  speed: number;
  running: boolean;
  /** How often the displayed time updates, in seconds. */
  displayInterval?: number;
}

/**
 * Bridges the renderer-agnostic SimulationClock to React.
 * Call `advance(delta)` from the scene's animation loop.
 */
export function useSimulationClock({ speed, running, displayInterval = 0.2 }: ClockOptions) {
  const clockRef = useRef(new SimulationClock());
  const lastDisplayRef = useRef(0);
  const [displayTime, setDisplayTime] = useState(0);

  const advance = useCallback(
    (delta: number, onStep: (step: number, time: number) => void) => {
      if (!running) return;
      clockRef.current.advance(delta, speed, onStep);
      if (clockRef.current.time - lastDisplayRef.current >= displayInterval) {
        lastDisplayRef.current = clockRef.current.time;
        setDisplayTime(clockRef.current.time);
      }
    },
    [displayInterval, running, speed],
  );

  const reset = useCallback(() => {
    clockRef.current.reset();
    lastDisplayRef.current = 0;
    setDisplayTime(0);
  }, []);

  return { advance, reset, displayTime, timeRef: clockRef };
}
