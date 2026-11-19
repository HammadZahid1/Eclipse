import { Camera, Eye, EyeOff, Maximize2, Pause, Play, RotateCcw, Tags } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SIMULATION_SPEEDS, type SimulationSpeed } from '@/lib/constants';

interface SimulationToolbarProps {
  running: boolean;
  speed: SimulationSpeed;
  showOrbits: boolean;
  showLabels: boolean;
  fullscreenSupported?: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onResetCamera: () => void;
  onSpeedChange: (speed: SimulationSpeed) => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onFullscreen?: () => void;
}

export function SimulationToolbar({
  running,
  speed,
  showOrbits,
  showLabels,
  fullscreenSupported,
  onToggleRunning,
  onReset,
  onResetCamera,
  onSpeedChange,
  onToggleOrbits,
  onToggleLabels,
  onFullscreen,
}: SimulationToolbarProps) {
  const speedIndex = SIMULATION_SPEEDS.indexOf(speed);
  const cycleSpeed = () =>
    onSpeedChange(SIMULATION_SPEEDS[(speedIndex + 1) % SIMULATION_SPEEDS.length]);

  return (
    <div className="ecl-panel flex flex-wrap items-center gap-1 rounded-xl p-1.5 shadow-xl">
      <Button
        size="sm"
        variant={running ? 'secondary' : 'primary'}
        icon={running ? <Pause size={14} /> : <Play size={14} />}
        aria-label={running ? 'Pause simulation' : 'Resume simulation'}
        onClick={onToggleRunning}
      >
        <span className="hidden sm:inline">{running ? 'Pause' : 'Play'}</span>
      </Button>
      <Button size="sm" variant="ghost" icon={<RotateCcw size={14} />} aria-label="Reset simulation" onClick={onReset} />
      <Button size="sm" variant="ghost" icon={<Camera size={14} />} aria-label="Reset camera" onClick={onResetCamera} />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <Button
        size="sm"
        variant="ghost"
        icon={showOrbits ? <Eye size={14} /> : <EyeOff size={14} />}
        aria-label={showOrbits ? 'Hide orbital paths' : 'Show orbital paths'}
        aria-pressed={showOrbits}
        onClick={onToggleOrbits}
      />
      <Button
        size="sm"
        variant="ghost"
        icon={<Tags size={14} />}
        aria-label={showLabels ? 'Hide labels' : 'Show labels'}
        aria-pressed={showLabels}
        onClick={onToggleLabels}
      />
      <span className="mx-1 h-5 w-px bg-white/10" />
      <Button
        size="sm"
        variant="ghost"
        className="ecl-value min-w-12"
        aria-label={`Simulation speed ${speed}x. Click to change.`}
        onClick={cycleSpeed}
      >
        {speed}x
      </Button>
      {fullscreenSupported && onFullscreen && (
        <Button size="sm" variant="ghost" icon={<Maximize2 size={14} />} aria-label="Toggle fullscreen" onClick={onFullscreen} />
      )}
    </div>
  );
}
