import type { ReactNode, RefObject } from 'react';
import { SimulationStatusBar } from './SimulationStatusBar';
import { PausedOverlay } from './PausedOverlay';

interface SimulationLayoutProps {
  scene: ReactNode;
  toolbar: ReactNode;
  infoPanel: ReactNode;
  controlsPanel: ReactNode;
  status: { running: boolean; time: number; speed: number; detail?: string };
  onResume?: () => void;
  /** Node placed into fullscreen by the simulation toolbar. */
  sceneRef?: RefObject<HTMLElement | null>;
  className?: string;
}

/** Shared structure for all four simulation modules. */
export function SimulationLayout({
  scene,
  toolbar,
  infoPanel,
  controlsPanel,
  status,
  onResume,
  sceneRef,
  className = '',
}: SimulationLayoutProps) {
  return (
    <div className={`flex flex-col gap-3 px-3 pb-3 sm:px-4 sm:pb-4 ${className}`}>
      <div className="flex min-h-[420px] flex-1 flex-col gap-3 lg:flex-row">
        <section
          ref={sceneRef}
          className="ecl-fullscreen-target relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-white/8 bg-void lg:min-h-0"
        >
          <div className="absolute inset-0">{scene}</div>
          <PausedOverlay visible={!status.running} onResume={onResume ?? (() => {})} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_45%,rgba(3,4,10,0.55))]" />
          <div className="pointer-events-auto absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)]">{toolbar}</div>
        </section>
        <aside className="ecl-scrollbar flex max-h-[460px] w-full flex-col gap-3 overflow-y-auto lg:max-h-none lg:w-[320px] xl:w-[350px]">
          {infoPanel}
          {controlsPanel}
        </aside>
      </div>
      <div className="rounded-xl border border-white/8 bg-abyss/70">
        <SimulationStatusBar {...status} />
      </div>
    </div>
  );
}
