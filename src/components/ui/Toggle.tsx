import { useId } from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-xs text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[11px] text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
          checked ? 'border-cyan/50 bg-cyan/25' : 'border-white/10 bg-white/5'
        }`}
      >
        <span
          className={`absolute top-[3px] h-3 w-3 rounded-full transition-all ${
            checked ? 'left-[19px] bg-cyan shadow-[0_0_8px_rgba(81,228,242,0.7)]' : 'left-[3px] bg-muted'
          }`}
        />
      </button>
    </div>
  );
}
