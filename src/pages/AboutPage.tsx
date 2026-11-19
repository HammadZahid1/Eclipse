import { PageHeader } from '@/components/layout/PageHeader';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-5 py-12 sm:px-8">
      <PageHeader
        eyebrow="About / The project"
        title="A laboratory, not an oracle."
        description="ECLIPSE is a frontend-only experiment in interactive astronomical visualization."
      />
      <div className="space-y-5 text-sm leading-7 text-muted">
        <p>
          Every environment in ECLIPSE is generated locally in your browser using mathematical
          models and procedural distributions. No simulation data is fetched from external services.
        </p>
        <p>
          The models are intentionally simplified. They are designed to make motion, scale and
          structure explorable — not to produce scientifically exact predictions. Simulation values
          are expressed in abstract units unless explicitly stated otherwise.
        </p>
      </div>
    </div>
  );
}
