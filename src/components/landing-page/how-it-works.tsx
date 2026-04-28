const steps = [
  {
    number: '01',
    title: 'Sign in with GitHub',
    description:
      'One-click authentication with your GitHub account. No passwords, no setup.',
  },
  {
    number: '02',
    title: 'Create a project',
    description:
      'Each project gets development, staging, and production environments automatically.',
  },
  {
    number: '03',
    title: 'Add your variables',
    description:
      'Paste .env content, drag and drop files, or add variables one by one. Everything is encrypted instantly.',
  },
  {
    number: '04',
    title: 'Share & export',
    description:
      'Invite your team, assign roles, and export .env files per environment anytime.',
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="text-xs font-medium text-muted-foreground">How it works</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        From setup to collaboration in four steps
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A simple workflow for teams that need reliable access to their configs.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-12">
            <span className="absolute left-0 top-0 text-3xl font-bold text-muted-foreground/20 tabular-nums">
              {step.number}
            </span>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
