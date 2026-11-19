import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CircleDot, Orbit, Sparkles } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import { HeroScene } from '@/components/three/HeroScene';

const modules = [
  { to: ROUTES.solarSystem, label: 'Solar System', icon: CircleDot, detail: 'Planetary motion' },
  { to: ROUTES.blackHole, label: 'Black Hole Lab', icon: Sparkles, detail: 'Accretion visualization' },
  { to: ROUTES.galaxy, label: 'Galaxy Generator', icon: Orbit, detail: 'Procedural structures' },
];

export default function HomePage() {
  return (
    <div className="relative">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-void to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] flex-col justify-between px-5 py-14 sm:px-8 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p className="ecl-label mb-6 text-electric">Interactive space laboratory / 04 modules</p>
            <h1 className="text-5xl font-light leading-[1.02] tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
              Explore the universe.
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              An interactive space laboratory built to explore celestial motion, orbital systems,
              and cosmic structures.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.solarSystem}
                className="group inline-flex h-12 items-center gap-3 rounded-lg border border-electric/40 bg-electric/15 px-6 text-sm font-medium text-ink transition-all hover:border-electric/70 hover:bg-electric/25"
              >
                Enter Simulation <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={ROUTES.explore}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-6 text-sm text-muted transition-colors hover:text-ink"
              >
                Explore the Lab <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3"
          >
            {[
              { value: '04', label: 'Simulation modules' },
              { value: '100%', label: 'Local browser processing' },
              { value: '∞', label: 'Generated structures' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="ecl-value text-xl text-ink">{stat.value}</p>
                <p className="ecl-label mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
          <span className="ecl-label [writing-mode:vertical-rl]">Live procedural scene</span>
          <span className="h-16 w-px bg-gradient-to-b from-cyan/60 to-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <p className="ecl-label mb-3 text-electric">Continue exploring</p>
            <h2 className="text-2xl font-light text-ink sm:text-3xl">Choose an environment</h2>
          </div>
          <Link to={ROUTES.explore} className="ecl-label flex items-center gap-1.5 hover:text-cyan">
            All modules <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.to}
                to={module.to}
                className="group ecl-panel rounded-xl p-6 transition-colors hover:border-cyan/30"
              >
                <div className="mb-8 flex items-center justify-between">
                  <Icon size={22} strokeWidth={1.2} className="text-electric/80" />
                  <span className="ecl-label">0{index + 1}</span>
                </div>
                <h3 className="text-base text-ink">{module.label}</h3>
                <p className="mt-1 text-xs text-muted">{module.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
