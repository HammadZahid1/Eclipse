import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PausedOverlayProps {
  visible: boolean;
  onResume: () => void;
}

export function PausedOverlay({ visible, onResume }: PausedOverlayProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-void/45 backdrop-blur-[1px]">
      <div className="pointer-events-auto flex flex-col items-center gap-4 text-center">
        <p className="ecl-label text-cyan">Simulation paused</p>
        <Button variant="primary" icon={<Play size={14} />} onClick={onResume}>
          Resume simulation
        </Button>
        <p className="ecl-label text-muted/60">Press space to continue</p>
      </div>
    </div>
  );
}
