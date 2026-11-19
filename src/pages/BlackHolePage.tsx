import { PageHeader } from '@/components/layout/PageHeader';
import { ModulePlaceholder } from '@/components/layout/ModulePlaceholder';

export default function BlackHolePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Module 02 / Visual simulation"
        title="Black Hole Lab"
        description="A visual, physics-inspired black hole environment with a procedural accretion disk."
      />
      <ModulePlaceholder name="Black hole scene" detail="The accretion disk visualization is being assembled." />
    </div>
  );
}
