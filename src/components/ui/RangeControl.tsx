import { useId } from 'react';

interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  hint?: string;
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  format,
  onChange,
  hint,
}: RangeControlProps) {
  const id = useId();
  const display = format ? format(value) : `${value}${unit}`;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="ecl-label">
          {label}
        </label>
        <span className="ecl-value text-xs text-cyan">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        className="ecl-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={display}
      />
      {hint && <p className="text-[11px] leading-relaxed text-muted/80">{hint}</p>}
    </div>
  );
}
