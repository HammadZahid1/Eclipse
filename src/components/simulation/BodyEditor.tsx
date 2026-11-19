import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RangeControl } from '@/components/ui/RangeControl';
import { BODY_LIMITS, MAX_BODIES, type OrbitalBody } from '@/sim/orbit/types';
import type { OrbitEngine } from '@/sim/orbit/engine';

interface BodyEditorProps {
  engine: OrbitEngine;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onChange: () => void;
}

function VectorInput({
  label,
  values,
  axis,
  onChange,
}: {
  label: string;
  values: readonly [number, number, number];
  axis: 'position' | 'velocity';
  onChange: (axis: 'position' | 'velocity', index: number, value: number) => void;
}) {
  const indices = [0, 1, 2] as const;
  return (
    <fieldset>
      <legend className="ecl-label mb-2">{label}</legend>
      <div className="grid grid-cols-3 gap-1.5">
        {indices.map((index) => (
          <label key={index} className="relative block">
            <span className="absolute left-2 top-1.5 text-[9px] text-muted">{'XYZ'[index]}</span>
            <input
              type="number"
              aria-label={`${label} ${'XYZ'[index]}`}
              value={Number(values[index].toFixed(2))}
              min={BODY_LIMITS[axis].min}
              max={BODY_LIMITS[axis].max}
              step={BODY_LIMITS[axis].step}
              onChange={(event) => onChange(axis, index, Number(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-2 pb-1.5 pt-5 ecl-value text-[11px] text-ink outline-none focus:border-cyan/50"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function BodyEditor({ engine, selectedId, onSelect, onAdd, onChange }: BodyEditorProps) {
  const selected = engine.bodies.find((body) => body.id === selectedId) ?? null;

  const changeVector = (axis: 'position' | 'velocity', index: number, value: number) => {
    if (!selected || !Number.isFinite(value)) return;
    const next = [...selected[axis]] as OrbitalBody['position'];
    next[index] = value;
    engine.update(selected.id, { [axis]: next });
    onChange();
  };

  return (
    <div className="space-y-5">
      <fieldset className="space-y-1.5">
        <legend className="ecl-label mb-2">Bodies ({engine.bodies.length}/{MAX_BODIES})</legend>
        <div className="flex flex-wrap gap-1.5">
          {engine.bodies.map((body) => (
            <button
              key={body.id}
              type="button"
              aria-pressed={selectedId === body.id}
              onClick={() => onSelect(body.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-colors ${
                selectedId === body.id
                  ? 'border-cyan/50 bg-cyan/10 text-cyan'
                  : 'border-white/8 bg-white/3 text-muted hover:text-ink'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: body.color }} />
              {body.name}
            </button>
          ))}
        </div>
      </fieldset>

      {selected && (
        <div className="space-y-5 border-t border-white/8 pt-5">
          <div className="flex gap-2">
            <label className="min-w-0 flex-1">
              <span className="ecl-label mb-2 block">Name</span>
              <input
                type="text"
                value={selected.name}
                maxLength={18}
                onChange={(event) => {
                  engine.update(selected.id, { name: event.target.value });
                  onChange();
                }}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-ink outline-none focus:border-cyan/50"
              />
            </label>
            <label title="Body color">
              <span className="ecl-label mb-2 block">Color</span>
              <input
                type="color"
                aria-label="Body color"
                value={selected.color}
                onChange={(event) => {
                  engine.update(selected.id, { color: event.target.value });
                  onChange();
                }}
                className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
              />
            </label>
          </div>

          <RangeControl
            label="Mass"
            value={selected.mass}
            min={BODY_LIMITS.mass.min}
            max={BODY_LIMITS.mass.max}
            step={BODY_LIMITS.mass.step}
            format={(value) => value.toFixed(1)}
            onChange={(mass) => {
              engine.update(selected.id, { mass });
              onChange();
            }}
          />
          <RangeControl
            label="Simulation radius"
            value={selected.radius}
            min={BODY_LIMITS.radius.min}
            max={BODY_LIMITS.radius.max}
            step={BODY_LIMITS.radius.step}
            format={(value) => value.toFixed(2)}
            onChange={(radius) => {
              engine.update(selected.id, { radius });
              onChange();
            }}
          />
          <VectorInput label="Position" values={selected.position} axis="position" onChange={changeVector} />
          <VectorInput label="Velocity" values={selected.velocity} axis="velocity" onChange={changeVector} />

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            className="w-full"
            onClick={() => {
              engine.remove(selected.id);
              onChange();
            }}
          >
            Remove body
          </Button>
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={<Plus size={14} />}
        className="w-full"
        disabled={engine.bodies.length >= MAX_BODIES}
        onClick={onAdd}
      >
        Add body
      </Button>
    </div>
  );
}
