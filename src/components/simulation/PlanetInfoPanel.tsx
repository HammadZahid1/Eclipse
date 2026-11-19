import { Crosshair, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DataRow } from '@/components/ui/DataRow';
import { Panel } from '@/components/ui/Panel';
import { orbitalPeriod } from '@/sim/solar/engine';
import { orbitalPhase } from '@/sim/solar/orbital';
import type { PlanetConfig } from '@/sim/solar/data';

interface PlanetInfoPanelProps {
  planet: PlanetConfig;
  time: number;
  focused: boolean;
  onFocus: () => void;
  onClear: () => void;
}

export function PlanetInfoPanel({ planet, time, focused, onFocus, onClear }: PlanetInfoPanelProps) {
  return (
    <Panel
      eyebrow="Selected body / simulation data"
      title={planet.name}
      actions={
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: planet.color, boxShadow: `0 0 10px ${planet.color}` }}
        />
      }
    >
      <p className="mb-4 text-xs leading-relaxed text-muted">{planet.description}</p>
      <dl>
        <DataRow label="Orbital distance" value={`${planet.orbitRadius.toFixed(2)} u`} />
        <DataRow label="Orbital rate" value={`${planet.orbitalSpeed.toFixed(2)} rad/t`} />
        <DataRow label="Orbital period" value={`${orbitalPeriod(planet).toFixed(1)} t`} />
        <DataRow label="Current phase" value={`${orbitalPhase(planet, time).toFixed(2)} rad`} />
        <DataRow label="Rotation rate" value={`${planet.rotationSpeed.toFixed(2)} rad/t`} />
        <DataRow label="Axial tilt" value={`${((planet.axialTilt ?? 0) * 180 / Math.PI).toFixed(1)}°`} />
        <DataRow label="Radius" value={`${planet.radius.toFixed(2)} u`} />
        <DataRow label="Ring" value={planet.ring ? 'Present' : 'None'} mono={false} />
        <DataRow label="Atmosphere" value={planet.atmosphere ? 'Simulated' : 'None'} mono={false} />
      </dl>
      <div className="mt-5 flex gap-2">
        <Button
          size="sm"
          variant={focused ? 'primary' : 'secondary'}
          icon={<Crosshair size={14} />}
          onClick={onFocus}
          className="flex-1"
        >
          {focused ? 'Focused' : 'Focus camera'}
        </Button>
        <Button size="sm" variant="ghost" icon={<Home size={14} />} aria-label="Return to system view" onClick={onClear} />
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-muted/60">
        u = abstract simulation units; t = simulation time. These values do not represent measurements.
      </p>
    </Panel>
  );
}
