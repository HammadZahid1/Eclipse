import { PageHeader } from '@/components/layout/PageHeader';
import { ModulePlaceholder } from '@/components/layout/ModulePlaceholder';

export default function OrbitLabPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Module 04 / Orbital mechanics"
        title="Orbit Lab"
        description="A simplified Newtonian playground with configurable bodies, trajectories and presets."
      />
      <ModulePlaceholder name="Orbital field" detail="The numerical simulation engine is being assembled." />
    </div>
  );
}
