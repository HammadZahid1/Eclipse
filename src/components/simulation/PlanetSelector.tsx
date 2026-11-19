import { PLANETS } from '@/sim/solar/data';

interface PlanetSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PlanetSelector({ selectedId, onSelect }: PlanetSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="ecl-label mb-2">Select a body</legend>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onSelect('')}
          aria-pressed={selectedId === null}
          className={`rounded-lg border px-2 py-2 text-left text-[11px] transition-colors ${
            selectedId === null
              ? 'border-cyan/50 bg-cyan/10 text-cyan'
              : 'border-white/8 bg-white/3 text-muted hover:text-ink'
          }`}
        >
          System view
        </button>
        {PLANETS.map((planet) => {
          const selected = selectedId === planet.id;
          return (
            <button
              key={planet.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(planet.id)}
              className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-[11px] transition-colors ${
                selected
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-white/8 bg-white/3 text-muted hover:text-ink'
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: planet.color, boxShadow: `0 0 8px ${planet.color}80` }}
              />
              <span className="truncate">{planet.name}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
