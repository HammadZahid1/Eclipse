import type { HTMLAttributes, ReactNode } from 'react';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, eyebrow, actions, children, className = '', ...props }: PanelProps) {
  return (
    <div
      className={`ecl-panel rounded-2xl shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)] ${className}`}
      {...props}
    >
      {(title || eyebrow || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="ecl-label mb-1.5">{eyebrow}</p>}
            {title && <h2 className="truncate text-sm font-medium tracking-wide text-ink">{title}</h2>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
