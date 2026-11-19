import { PageHeader } from '@/components/layout/PageHeader';
import { ModulePlaceholder } from '@/components/layout/ModulePlaceholder';

export default function GalaxyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Module 03 / Procedural generation"
        title="Galaxy Generator"
        description="Generate distinct galaxy structures from mathematical distributions and a deterministic seed."
      />
      <ModulePlaceholder name="Galaxy field" detail="The procedural generator is being assembled." />
    </div>
  );
}
