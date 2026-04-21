const faqs = [
  {
    q: 'How is my data protected?',
    a: 'All variables are encrypted at rest using AES-256-GCM with PBKDF2 key derivation (100,000 iterations, unique salt per value). Authentication uses GitHub OAuth, and all traffic runs over HTTPS.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents of any .env file into the editor and it will parse each KEY=VALUE pair automatically. Comments and blank lines are handled gracefully.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open any project and click Export. You get a standard .env file. You can also copy individual values or the entire file to clipboard.',
  },
  {
    q: 'Is ENV Store free?',
    a: 'Yes — completely free and open source. No plans, paywalls, or premium tiers.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Currently each account manages its own projects. To share, export a .env file and send it through a secure channel. Team collaboration is on the roadmap.',
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">FAQ</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Frequently asked questions
      </h2>

      <div className="mt-10 divide-y border-t">
        {faqs.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-semibold select-none">
              {item.q}
              <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-5 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
