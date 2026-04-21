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
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">How it works</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        From setup to recovery in four steps
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Simple workflow designed for developers who need quick access to their
        configs.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {steps.map((step, i) => (
          <div key={i} className="space-y-2">
            <span className="text-2xl font-bold text-muted-foreground/30 tabular-nums">
              {step.number}
            </span>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
