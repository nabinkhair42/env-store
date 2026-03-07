const faqs = [
  {
    q: 'How does ENV Store work?',
    a: 'Sign in with your GitHub account, then create a project for each application. Add your environment variables as KEY=VALUE pairs — either manually, or by uploading an existing .env file. When you need to set up a new environment, export the whole project as a .env file or copy individual values with one click.',
  },
  {
    q: 'How is my data protected?',
    a: 'All environment variables are encrypted at rest using AES-256-GCM — the same standard trusted by banks and governments. Key derivation uses PBKDF2 with 100,000 iterations and a unique salt per entry, making brute-force attacks computationally infeasible. Data is also transmitted over HTTPS/TLS at all times.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents of any .env file directly into the editor and ENV Store will automatically parse each KEY=VALUE pair. Comments and blank lines are handled gracefully, so you can paste real .env files without cleanup.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open any project from the dashboard and click Export. You get a standard .env file with all your variables, ready to drop into any project. You can also copy individual values or the entire file to clipboard without downloading.',
  },
  {
    q: 'Is ENV Store free to use?',
    a: 'Yes — completely free and open source. There are no plans, paywalls, or premium tiers. You can also self-host it by cloning the GitHub repository and following the setup guide.',
  },
  {
    q: 'Can I self-host ENV Store?',
    a: 'Absolutely. ENV Store is open source (MIT licensed). Clone the repository, set up a MongoDB database, configure GitHub OAuth, add your ENCRYPTION_SECRET, and deploy anywhere — Vercel, Railway, a VPS, or locally. The README has a full setup guide.',
  },
  {
    q: 'What encryption does ENV Store use?',
    a: 'AES-256-GCM with PBKDF2-SHA256 key derivation (100,000 iterations, random salt per encryption). GCM mode provides authenticated encryption — it detects any tampering with stored ciphertext before decryption, adding an extra layer of integrity protection.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Currently each account manages its own projects. To share variables with teammates, export a .env file and send it through a secure channel. Team collaboration and shared projects are on the roadmap.',
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
      <div className="relative rail-bounded border-t border-dashed border-border">
        <div className="grid sm:grid-cols-2">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`group px-6 py-8 transition-colors hover:bg-muted/20
                ${i % 2 !== 0 ? 'sm:border-l sm:border-dashed sm:border-border' : ''}
                ${i >= 2 ? 'sm:border-t sm:border-dashed sm:border-border' : ''}
                ${i >= 1 ? 'max-sm:border-t max-sm:border-dashed max-sm:border-border' : ''}
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
