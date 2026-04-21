const faqs = [
  {
    q: 'How does ENV Store work?',
    a: 'Sign in with your GitHub account, then create a project for each application. Add your environment variables as KEY=VALUE pairs — either manually, or by uploading an existing .env file. When you need to set up a new environment, export the whole project as a .env file or copy individual values with one click.',
  },
  {
    q: 'How is my data protected?',
    a: 'All environment variables are encrypted at rest using AES-256-GCM. Key derivation uses PBKDF2 with 100,000 iterations and a unique salt per entry. Data is also transmitted over HTTPS/TLS at all times.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents of any .env file directly into the editor and ENV Store will automatically parse each KEY=VALUE pair. Comments and blank lines are handled gracefully.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open any project from the dashboard and click Export. You get a standard .env file with all your variables. You can also copy individual values or the entire file to clipboard.',
  },
  {
    q: 'Is ENV Store free to use?',
    a: 'Yes — completely free and open source. No plans, paywalls, or premium tiers.',
  },
  {
    q: 'What encryption does ENV Store use?',
    a: 'AES-256-GCM with PBKDF2-SHA256 key derivation (100,000 iterations, random salt per encryption). GCM mode provides authenticated encryption — it detects any tampering with stored ciphertext.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Currently each account manages its own projects. To share variables with teammates, export a .env file and send it through a secure channel. Team collaboration is on the roadmap.',
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-20">
      <p className="text-xs font-medium text-muted-foreground">FAQ</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Frequently asked questions
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Common questions about ENV Store and how it works.
      </p>

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
