import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

const steps = [
  {
    number: '01',
    title: 'Sign in with GitHub',
    description:
      'Authenticate securely using your GitHub account. No password, no setup.',
  },
  {
    number: '02',
    title: 'Create projects',
    description:
      'Organize variables by project and environment (dev, staging, prod).',
  },
  {
    number: '03',
    title: 'Add variables',
    description:
      'Paste your .env content or add variables one by one. Search and edit anytime.',
  },
  {
    number: '04',
    title: 'Export & recover',
    description:
      'Copy individual values or export full .env files when setting up new machines.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative">
      {/* Section header */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="pb-6 pt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            From setup to recovery in four steps
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Simple workflow designed for developers who need quick access to
            their configs.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="rail-bounded border-t border-dashed border-border">
        <div className="grid sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`group px-6 py-8 transition-colors hover:bg-muted/20 relative
                ${i % 2 !== 0 ? 'sm:border-l sm:border-dashed sm:border-border' : ''}
                ${i >= 2 ? 'sm:border-t sm:border-dashed sm:border-border' : ''}
                ${i >= 1 ? 'max-sm:border-t max-sm:border-dashed max-sm:border-border' : ''}
              `}
            >
              {/* Step number */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-muted-foreground/20 tabular-nums">
                  {step.number}
                </span>
                {i < steps.length - 1 && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    className="hidden sm:block ml-auto text-muted-foreground/40"
                  />
                )}
              </div>

              <h3 className="text-[15px] font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
