import { Activity, Clock3 } from 'lucide-react';

interface SimulationStatusBarProps {
  running: boolean;
  time: number;
  speed: number;
  detail?: string;
}

export function SimulationStatusBar({ running, time, speed, detail }: SimulationStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/8 px-4 py-2.5 text-[10px] text-muted">
      <span className="flex items-center gap-2">
        <Activity size={12} className={running ? 'text-cyan' : 'text-muted'} />
        <span className="ecl-label">{running ? 'Simulation active' : 'Simulation paused'}</span>
      </span>
      <span className="flex items-center gap-2">
        <Clock3 size={12} />
        <span className="ecl-value">t = {time.toFixed(2)}</span>
      </span>
      <span className="ecl-label">Rate {speed}x</span>
      {detail && <span className="ecl-label ml-auto truncate">{detail}</span>}
      <span className="ecl-label ml-auto hidden sm:inline">Abstract simulation units</span>
    </div>
  );
}
