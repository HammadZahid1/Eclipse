interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
}

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="ecl-label mb-2">{label}</legend>
      <div
        className="grid gap-1 rounded-lg border border-white/8 bg-black/25 p-1"
        style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                selected
                  ? 'bg-cyan/12 text-cyan shadow-[inset_0_0_0_1px_rgba(81,228,242,0.25)]'
                  : 'text-muted hover:bg-white/5 hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
