import { Gauge } from 'lucide-react';
import { SIMULATION_SPEEDS, type SimulationSpeed } from '@/lib/constants';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

interface SpeedControlsProps {
  speed: SimulationSpeed;
  onChange: (speed: SimulationSpeed) => void;
}

export function SpeedControls({ speed, onChange }: SpeedControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="ecl-label flex items-center gap-2">
          <Gauge size={13} className="text-cyan" /> Simulation rate
        </span>
        <span className="ecl-value text-xs text-cyan">{speed}x</span>
      </div>
      <SegmentedControl
        label="Speed multiplier"
        value={speed}
        onChange={onChange}
        options={SIMULATION_SPEEDS.map((value) => ({ value, label: `${value}x` }))}
        columns={3}
      />
      <p className="text-[11px] leading-relaxed text-muted/80">
        The multiplier scales fixed simulation steps, so motion stays consistent across frame rates.
      </p>
    </div>
  );
}
