import { Box } from 'lucide-react';

export function ModulePlaceholder({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-abyss/40 text-center">
      <Box size={26} strokeWidth={1.2} className="text-electric/70" />
      <div>
        <p className="ecl-label text-ink">{name}</p>
        <p className="mt-2 max-w-sm text-sm text-muted">{detail}</p>
      </div>
    </div>
  );
}
