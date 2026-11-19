import type { ReactNode } from 'react';

interface DataRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

export function DataRow({ label, value, mono = true }: DataRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/6 py-2 last:border-b-0">
      <dt className="ecl-label">{label}</dt>
      <dd className={`text-right text-xs text-ink ${mono ? 'ecl-value' : ''}`}>{value}</dd>
    </div>
  );
}
