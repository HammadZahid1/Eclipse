import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { SIMULATION_SPEEDS } from '@/lib/constants';
import { useSettingsStore, type RenderQuality } from '@/state/settingsStore';
import { Button } from '@/components/ui/Button';
import { RangeControl } from '@/components/ui/RangeControl';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const settings = useSettingsStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Application settings"
            className="ecl-panel ecl-scrollbar fixed right-0 top-0 z-50 h-full w-full max-w-sm space-y-7 overflow-y-auto p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="ecl-label mb-1">Preferences</p>
                <h2 className="text-lg text-ink">Settings</h2>
              </div>
              <Button variant="ghost" size="sm" icon={<X size={16} />} aria-label="Close settings" onClick={onClose} />
            </div>

            <SegmentedControl
              label="Render quality"
              value={settings.renderQuality}
              onChange={(value) => settings.setRenderQuality(value as RenderQuality)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />

            <RangeControl
              label="Particle density"
              value={settings.particleDensity}
              min={0.35}
              max={1.5}
              step={0.05}
              format={(value) => `${Math.round(value * 100)}%`}
              onChange={settings.setParticleDensity}
              hint="Scales procedural particle counts. Simulation logic is unaffected."
            />

            <SegmentedControl
              label="Default simulation speed"
              value={settings.defaultSpeed}
              onChange={settings.setDefaultSpeed}
              options={SIMULATION_SPEEDS.map((speed) => ({ value: speed, label: `${speed}x` }))}
              columns={3}
            />

            <div className="space-y-4 border-t border-white/8 pt-6">
              <Toggle label="Planet labels" checked={settings.showLabels} onChange={settings.setShowLabels} />
              <Toggle
                label="Interface animation"
                checked={settings.animationsEnabled}
                onChange={settings.setAnimationsEnabled}
              />
              <Toggle
                label="Reduced motion"
                checked={settings.reducedMotion}
                onChange={settings.setReducedMotion}
                description="Minimizes camera drift and scene animation."
              />
            </div>

            <Button
              variant="secondary"
              icon={<RotateCcw size={14} />}
              onClick={settings.resetSettings}
              className="w-full"
            >
              Reset settings
            </Button>
            <p className="text-[11px] leading-relaxed text-muted/70">
              Only interface preferences are saved locally. Simulation state always starts fresh.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
