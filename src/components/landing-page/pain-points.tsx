const scenarios = [
  {
    label: '01',
    title: 'Wiped your laptop.',
    body: 'Stripe key, gone. Postgres URL, gone. An evening of recovery — if you can find them all.',
  },
  {
    label: '02',
    title: 'Onboarded a teammate.',
    body: 'A Slack DM with the .env attached. Now it lives in their cloud backups forever.',
  },
  {
    label: '03',
    title: 'Rotated an API key.',
    body: 'Staging picked it up. Production didn’t. You’re debugging it at 11pm on a Friday.',
  },
];

export default function PainPoints() {
  return (
    <section className="relative border-t border-border/60">
      <div className="mx-auto w-full max-w-[1024px] px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          The problem
        </p>
        <h2 className="mt-3 max-w-[640px] text-2xl font-medium tracking-[-0.015em] text-balance sm:text-[32px] sm:leading-[1.15]">
          A <span className="font-mono">.env</span> file is one accident away
          from being a long evening.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border/60 sm:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="relative bg-background p-6 sm:p-7"
            >
              <span className="font-mono text-xs text-muted-foreground/60">
                {s.label}
              </span>
              <h3 className="mt-4 text-[17px] font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
