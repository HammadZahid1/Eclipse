import type { SimulationPreset } from '@/sim/presets';

interface PresetSelectorProps<T> {
  label: string;
  presets: readonly SimulationPreset<T>[];
  activeId?: string | null;
  onApply: (preset: SimulationPreset<T>) => void;
}

/** Shared control for applying a named, deterministic starting configuration. */
export function PresetSelector<T>({ label, presets, activeId, onApply }: PresetSelectorProps<T>) {
  return (
    <fieldset>
      <legend className="ecl-label mb-2">{label}</legend>
      <div className="grid grid-cols-2 gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={activeId === preset.id}
            title={preset.description}
            onClick={() => onApply(preset)}
            className={`rounded-lg border px-2.5 py-2 text-left text-[11px] transition-colors ${
              activeId === preset.id
                ? 'border-cyan/50 bg-cyan/10 text-cyan'
                : 'border-white/8 bg-white/3 text-muted hover:border-cyan/30 hover:text-ink'
            }`}
          >
            <span className="block font-medium">{preset.name}</span>
            <span className="mt-0.5 block text-[10px] leading-snug text-muted/70">{preset.description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
