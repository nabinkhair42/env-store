const faqs = [
  {
    q: 'How does ENV Store work?',
    a: 'Sign in with GitHub, create projects for each application, add your environment variables as KEY=VALUE pairs, and export or copy them whenever you need to set up a new environment.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your data is encrypted and stored securely. We recommend treating stored values as secrets, rotating keys if exposed, and using separate projects per environment (dev, staging, production).',
  },
  {
    q: 'Can I self-host ENV Store?',
    a: 'Absolutely. ENV Store is open source. Check the GitHub repository for detailed setup instructions and deployment guides.',
  },
  {
    q: 'Is ENV Store free to use?',
    a: 'Yes, the hosted version is completely free. For teams and enterprises, we may introduce premium features in the future.',
  },
  {
    q: 'Do I need to install a CLI?',
    a: "No. ENV Store is a web application - just open it in your browser. There's no command-line tool to install or configure.",
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Currently, each account manages its own projects. Team sharing features are planned for future releases.',
  },
];

export default function FAQ() {
  return (
    <section className="relative">
      {/* Dot pattern background */}
      <div className="dot-pattern absolute inset-0" aria-hidden="true" />

      {/* Section header */}
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="pb-6 pt-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Common questions about ENV Store and how it works.
          </p>
        </div>
      </div>

      {/* FAQ grid */}
      <div className="relative rail-bounded border-t border-dashed border-border pb-20">
        <div className="grid sm:grid-cols-2">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`group px-6 py-8 transition-colors hover:bg-muted/20
                ${i % 2 !== 0 ? 'sm:border-l sm:border-dashed sm:border-border' : ''}
                ${i >= 2 ? 'sm:border-t sm:border-dashed sm:border-border' : ''}
                ${i >= 1 ? 'max-sm:border-t max-sm:border-dashed max-sm:border-border' : ''}
                ${i >= 4 ? 'sm:border-b sm:border-dashed sm:border-border' : ''}
                ${i === 5 ? 'max-sm:border-b max-sm:border-dashed max-sm:border-border' : ''}
              `}
            >
              <h3 className="text-[15px] font-semibold tracking-tight">
                {item.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
