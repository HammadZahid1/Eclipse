import { PageHeader } from '@/components/layout/PageHeader';
import { ModulePlaceholder } from '@/components/layout/ModulePlaceholder';

export default function SolarSystemPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <PageHeader
        eyebrow="Module 01 / Orbital visualization"
        title="Solar System"
        description="A configurable, simplified planetary system. Select a world to inspect its simulated parameters."
      />
      <ModulePlaceholder name="Solar system scene" detail="The interactive planetary scene is being assembled." />
    </div>
  );
}
