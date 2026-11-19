import { useEffect } from 'react';
import { SIMULATION_SPEEDS, type SimulationSpeed } from '@/lib/constants';

interface ShortcutHandlers {
  onToggleRunning: () => void;
  onReset: () => void;
  onSpeedChange: (speed: SimulationSpeed) => void;
}

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)
  );
};

/** Keyboard shortcuts for playback and simulation speed. */
export function useSimulationShortcuts({
  onToggleRunning,
  onReset,
  onSpeedChange,
}: ShortcutHandlers) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        onToggleRunning();
      } else if (event.key.toLowerCase() === 'r') {
        onReset();
      } else if (/^[1-6]$/.test(event.key)) {
        onSpeedChange(SIMULATION_SPEEDS[Number(event.key) - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onReset, onSpeedChange, onToggleRunning]);
}
