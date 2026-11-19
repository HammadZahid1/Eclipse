import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  active?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-electric/15 text-ink border-electric/40 hover:bg-electric/25 hover:border-electric/70',
  secondary: 'bg-white/4 text-muted border-white/10 hover:bg-white/8 hover:text-ink',
  ghost: 'bg-transparent text-muted border-transparent hover:bg-white/6 hover:text-ink',
  danger: 'bg-rose-500/10 text-rose-200 border-rose-400/25 hover:bg-rose-500/20',
};

const sizes = {
  sm: 'h-8 px-3 text-[11px] gap-1.5',
  md: 'h-10 px-4 text-xs gap-2',
  lg: 'h-12 px-6 text-sm gap-2.5',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  active = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active || undefined}
      className={`inline-flex items-center justify-center rounded-lg border font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${active ? '!border-cyan/60 !bg-cyan/12 !text-cyan' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
