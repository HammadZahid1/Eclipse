import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/app/routes';
import { PageHeader } from '@/components/layout/PageHeader';

const modules = [
  { key: 'solarSystem', title: 'Solar System', detail: 'Inspect planets, orbits and simulation time.' },
  { key: 'blackHole', title: 'Black Hole Lab', detail: 'Shape a procedural accretion disk.' },
  { key: 'galaxy', title: 'Galaxy Generator', detail: 'Grow galaxies from deterministic seeds.' },
  { key: 'orbitLab', title: 'Orbit Lab', detail: 'Experiment with simplified gravitational motion.' },
] as const;

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-5 py-12 sm:px-8">
      <PageHeader
        eyebrow="Directory / 04 modules"
        title="Explore the lab"
        description="Each module is a self-contained simulation running entirely in your browser. Choose an environment to begin."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module, index) => (
          <Link
            key={module.key}
            to={ROUTES[module.key]}
            className="group ecl-panel flex items-center justify-between gap-4 rounded-xl p-6 transition-colors hover:border-cyan/30"
          >
            <div>
              <p className="ecl-label mb-2">0{index + 1} / Module</p>
              <h2 className="text-lg text-ink">{module.title}</h2>
              <p className="mt-2 text-sm text-muted">{module.detail}</p>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-muted transition-colors group-hover:text-cyan" />
          </Link>
        ))}
      </div>
    </div>
  );
}
