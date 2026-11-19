interface ThemeOption {
  id: string;
  name: string;
  colors: readonly string[];
}

interface ThemeSelectorProps {
  label: string;
  themes: readonly ThemeOption[];
  value: string;
  onChange: (id: string) => void;
}

export function ThemeSelector({ label, themes, value, onChange }: ThemeSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="ecl-label mb-2">{label}</legend>
      <div className="grid grid-cols-2 gap-1.5">
        {themes.map((theme) => {
          const selected = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(theme.id)}
              className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-[11px] transition-colors ${
                selected
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-white/8 bg-white/3 text-muted hover:text-ink'
              }`}
            >
              <span className="flex h-4 w-4 shrink-0 overflow-hidden rounded-full">
                {theme.colors.map((color) => (
                  <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="truncate">{theme.name}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
