import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StepControlsProps {
  stepSize: number;
  canStepBack: boolean;
  onStep: (direction: -1 | 1) => void;
}

/** Fixed-size stepping for precise inspection of an N-body simulation. */
export function StepControls({ stepSize, canStepBack, onStep }: StepControlsProps) {
  const label = `${stepSize} simulation units`;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="ecl-label">Time stepping</span>
        <span className="ecl-value text-[10px] text-muted">, / .</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="secondary"
          icon={<ChevronLeft size={14} />}
          aria-label={`Step back ${label}`}
          disabled={!canStepBack}
          onClick={() => onStep(-1)}
        >
          Back
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={<ChevronRight size={14} />}
          aria-label={`Step forward ${label}`}
          onClick={() => onStep(1)}
        >
          Forward
        </Button>
      </div>
      <p className="text-[11px] leading-relaxed text-muted/80">
        Stepping pauses playback and advances a fixed number of simulation units. Back returns to the last captured state.
      </p>
    </div>
  );
}
