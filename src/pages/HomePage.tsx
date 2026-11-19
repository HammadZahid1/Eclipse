import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/app/routes';

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center gap-8 px-5 py-16 sm:px-8">
      <p className="ecl-label text-electric">ECLIPSE / Simulation laboratory</p>
      <h1 className="max-w-4xl text-5xl font-light leading-[1.05] tracking-tight text-ink sm:text-7xl">
        Explore the universe.
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-muted">
        An interactive space laboratory built to explore celestial motion, orbital systems, and
        cosmic structures.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={ROUTES.solarSystem}
          className="inline-flex h-12 items-center gap-3 rounded-lg border border-electric/40 bg-electric/15 px-6 text-sm text-ink transition-colors hover:bg-electric/25"
        >
          Enter Simulation <ArrowUpRight size={16} />
        </Link>
        <Link
          to={ROUTES.explore}
          className="inline-flex h-12 items-center rounded-lg border border-white/10 px-6 text-sm text-muted transition-colors hover:text-ink"
        >
          Explore the Lab
        </Link>
      </div>
    </section>
  );
}
