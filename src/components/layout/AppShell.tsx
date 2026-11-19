import type { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-void text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to main content
      </a>
      <div className="pointer-events-none fixed inset-0 ecl-grid-overlay opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(82,153,255,0.10),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-5 py-4 text-[10px] text-muted/70 sm:px-8">
          <span>ECLIPSE — simplified simulation models, not astronomical measurements.</span>
          <span className="ecl-label">Local browser simulation</span>
        </footer>
      </div>
    </div>
  );
}
